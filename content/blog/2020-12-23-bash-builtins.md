+++
title = "getjobid, cl, and liblist — Oh, My!"
aliases = [ "2020/12/23/bash-builtins.html",]
slug = "2020-12-23-bash-builtins"

[taxonomies]
tags = [ "ibmi-oss-updates",]
+++

With the latest update to BASH, there are 3 new IBM i-specific BASH builtin
functions: `liblist`, `cl`, and `getjobid`. These builtins function nearly
identically to the `liblist`, `system`, and `getjobid` commands that exist in
PASE and/or QSH.

<!-- more -->

If these commands already exist, why add them to BASH? Let's explore:

```txt
$ /QOpenSys/usr/bin/getjobid
Process identifier 1575015 is 073984/QSECOFR/QP0ZSPWT
$ /QOpenSys/usr/bin/getjobid
Process identifier 1575016 is 073985/QSECOFR/QP0ZSPWT
$ /QOpenSys/usr/bin/getjobid
Process identifier 1575017 is 073986/QSECOFR/QP0ZSPWT
```

Every time I run getjobid, I'm getting the job id of the `getjobid` process, not
my shell's jobid. If I want to get my shell's job id, I have to remember to pass
the shell's pid (which is helpfully in the `$$` special variable)

```bash
/QOpenSys/usr/bin/getjobid $$
```

Kind of a pain, but once you figure it out it's not sooooo bad.

<!-- more -->

## CL to the Rescue?

Ok, so now let's say I am trying to run a PASE program which is running in to
problems while calling some ILE code. The ILE code is writing messages to the
job log, but the job log isn't being saved due to the log level of the job!
Let's use the `system` command to change the log level:

```bash
/QOpenSys/usr/bin/system "CHGJOB LOG(4 00 *SECLVL)"
```

If I run this, I will get no difference in behavior.

```txt
$ /QOpenSys/usr/bin/system 'dspjob' | grep -E -A3 'LOG$'
   Message logging:                                 LOG
     Level  . . . . . . . . . . . . . . . . . . :                4
     Severity . . . . . . . . . . . . . . . . . :                0
     Text . . . . . . . . . . . . . . . . . . . :                *NOLIST
```

What gives? Oh, duh! I forgot to add the `-i` flag to run in the current
process. Silly me. Wait, even after adding `-i`, it's still not working. _womp,
womp_

What is going on? Well, if you understand the Unix process model, this does
starts to makes sense: we executed the `system` command, causing BASH to start a
_new process_ in which the `system` command starts up (and if the `-i` flag is
not passed, `system` spawns _an additional job_), calls `CHGJOB`, and
immediately exits. It sort of looks like this:

```txt
bash
└── system -i ... -> CHGJOB

bash
└── system ...
    └── <spawned job> -> CHGJOB
```

In either case, this is quite pointless (even more so without `-i`), as it still
hasn't affected _our job_. Luckily, the `CHGJOB` command supports passing in a
job name, so we can use `getjobid` to retrieve it:

```bash
/QOpenSys/usr/bin/system "CHGJOB JOB($(/QOpenSys/usr/bin/getjobid -s $$)) LOG(4 00 *SECLVL)"
```

What a pain in the butt! Of course this only works because `CHGJOB` allows you
to specify a job name to affect. Other CL commands are not so lucky, like
`ADDLIBLE` or `CHGCURLIB` :disappointed:...

## Bash to the Rescue

Ok, so back to BASH. Because these new functions are _builtins_ and not
commands, they execute in BASH itself, ie. _the current job_. This means when we
run `getjobid` it gives you what you probably expected:

```txt
$ getjobid
Process identifier 1574877 is 073846/QSECOFR/QP0ZSPWT
$ getjobid
Process identifier 1574877 is 073846/QSECOFR/QP0ZSPWT
$ getjobid $$
Process identifier 1574877 is 073846/QSECOFR/QP0ZSPWT
```

In addition, we also have a `cl` function, which behaves almost the same as
`system`, except it defaults to running in the current job, so no `-i` is
needed. With that, we don't even need `getjobid` for the above example:

```bash
cl "CHGJOB LOG(4 00 *SECLVL)"
```

And of course with builtins, it's finally possible to implement a `liblist`
utility to change the library list of PASE jobs:

```txt
$ liblist -a kadler
CPC2196: Library KADLER added to library list. 
$ liblist -d kadler
CPC2197: Library KADLER removed from library list.
$ liblist -c kadler
CPC2198: Current library changed to KADLER.
$ liblist
QSYS        SYS  
QSYS2       SYS  
QHLPSYS     SYS  
QUSRSYS     SYS  
QSHELL      PRD  
KADLER      CUR  
QGPL        USR  
QTEMP       USR  
QDEVELOP    USR  
QBLDSYS     USR  
```

And because we're using the the
[LIBRARY_LIST_INFO](https://www.ibm.com/support/knowledgecenter/en/ssw_ibm_i_74/rzajq/rzajqviewliblinfo.htm)
SQL service, we get the schema name for free so I figured why not add a `-s`
option?

```txt
$ liblist -a LONGSCHEM
CPC2196: Library LONGSCHEM added to library list.

$ liblist -s
QSYS        SYS  QSYS
QSYS2       SYS  QSYS2
QHLPSYS     SYS  QHLPSYS
QUSRSYS     SYS  QUSRSYS
QSHELL      PRD  QSHELL
KADLER      CUR  KADLER
LONGSCHEM   USR  longschemaname
QGPL        USR  QGPL
QTEMP       USR  QTEMP
QDEVELOP    USR  QDEVELOP
QBLDSYS     USR  QBLDSYS
```

Note that for compatibility with QSH liblist, the default output is kept the same.

Finally, ff that wasn't enough, if you ever forget what the command line
arguments do, we have much better help text than the PASE or QSH equivalents
:grin:

```txt
$ cl --help
cl: cl [-beEhiIkKnOpqsSv] COMMAND [ARG ...]
    Executes a CL command.
    
    Options:
      -i        Run COMMAND in the current job (default)
      -S        Run COMMAND in a spawned job
      -K        Keep all spool files generated by COMMAND and the job log
      -k        Keep all spool files generated by COMMAND
      -n        Do not include the message identifier when writing the messages to standard error
      -p        Only write the messages sent to the program's message queue by COMMAND to standard error
      -q        Do not write messages generated by COMMAND to standard error
      -s        Do not write spool files generated by COMMAND to standard output
      -v        Write the complete command string to standard output before executing it
    
      -b        Force binary mode for standard streams used by the CL command
      -e        Copy PASE for i environment variables to ILE before running COMMAND
      -I        Force CCSID conversion for standard input used by COMMAND
      -O        Force CCSID conversion for standard output used by COMMAND
      -E        Force CCSID conversion for standard error used by COMMAND
    
    Arguments:
      COMMAND   The CL command to run.
      ARG       One or more arguments to pass to the CL command
```

## Questions, Caveats, and More

### Checking for support

These builtins are available once you install bash 4.4-3. You can check if you
have the support and ensure you're using the builtin by using the `type`
builtin:

```txt
$ type liblist
liblist is a shell builtin
$ type cl
cl is a shell builtin
$ type getjobid
getjobid is a shell builtin
```

Note, the `which` command will give you different results, since `which` is an
external _command_ and not a BASH _builtin_:

```txt
$ which getjobid
/QOpenSys/usr/bin/getjobid
```

### How do I use them?

Just call them like you would any other command. It's likely you're already
using BASH builtins and didn't even know it! (Things like `echo`, `cd`, and even
more used in scripting are also BASH builtins.)

When BASH has a builtin, it takes precedence over any external command found on
the `$PATH`:

```txt
$ which getjobid
/QOpenSys/usr/bin/getjobid
$ type getjobid
getjobid is a shell builtin
```

### Why 'cl' and not 'system'?

While both `getjobid` and `liblist` match the names their PASE/QSH counterparts,
we decided not to do the same with `cl` — even though it has all the same
options. We did initially have it as `system`, but there was concern that too
many existing PASE scripts relied on `system` and depending on whether you ran a
script in `bash` vs `bsh`, `ksh`, etc you could get unexpected behavior.

You can always create a BASH alias for `system` if you like. Run the following
or add it to one of BASH's [startup
files](https://www.gnu.org/software/bash/manual/html_node/Bash-Startup-Files.html)
(eg. ~/.bashrc):

```bash
alias system=cl
```

In addition, because we didn't have to worry about full compatibility with
`system`, we could change the default behavior to running in the current job,
which is probably what you want most of the time anyway. :tada: This means no
`-i` is not needed (but supported for compatibility) and also a new
builtin-specific option `-S` has been added to force `cl` to spawn a new job.
This spawned job will run in a non-multithreaded job and without PASE loaded,
which can be useful for some commands.

### How do I run the non-builtin version?

Since builtins have higher precedence over external commands, changing your
`$PATH` will have no effect. You need to either fully qualify the command or
disable the shell builtin.

```bash
# Fully qualify getjobid
/QOpenSys/usr/bin/getjobid

# Disable getjobid builtin for the current session
enable -n getjobid
```
