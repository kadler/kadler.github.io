---
layout: single
title: Calling QSH utilities from PASE
date: 2018-05-29 10:43 -0500
desc: Using the program name argument for fun and for profit
categories: pase qsh
---
QSH provides a wonderful utility called `db2` which allows you to run SQL queries from within the QSH shell, but what if you're in a QP2TERM shell or using SSH - what then?

## QSH from PASE

Well, PASE provides a `qsh` utility which allows you to call programs within the QSH environment. Like most shells, QSH provides a `-c` option, which allows you to pass a string of commands to be executed instead of reading from `stdin`, so we can call `db2` like so:

```shell
-bash-4.3$ qsh -c "db2 'select 30 from sysibm.sysdummy1'"

00001      
-----------
         30

  1 RECORD(S) SELECTED.

```

Notice that we had to quote the commands twice. What happens if we need to use quotes inside our SQL?

```shell
-bash-4.3$ qsh -c "db2 \"select message_id, message_timestamp from table(qsys2.joblog_info('*')) x\""

MESSAGE_ID  MESSAGE_TIMESTAMP         
----------- --------------------------
CPC7301     2018-05-29-10.50.07.842411

  1 RECORD(S) SELECTED.

```

Since you can't escape inside a single-quoted string, we had to switch to using double quotes around the SQL statement and then had to escape those, since they're inside a double quoted string already. This is starting to get messy. Now what if we need to use delimited names?

```shell
-bash-4.3$ qsh -c "db2 \"select message_id, message_timestamp from table(\\\"QSYS2\\\".\\\"JOBLOG_INFO\\\"('*')) x\""

MESSAGE_ID  MESSAGE_TIMESTAMP         
----------- --------------------------
CPC7301     2018-05-29-10.52.08.632485

  1 RECORD(S) SELECTED.
```

Ugh! Now we had to double-escape the quoted strings! That's nearly vomit inducing!

## Symlink Trickery

One thing you may not have realized is that the PASE `qsh` utility has a few tricks up its sleeve. Try this:

```shell
-bash-4.3$ ln -s /QOpenSys/usr/bin/qsh /QOpenSys/usr/bin/db2
-bash-4.3$ db2 "select message_id, message_timestamp from table(\"QSYS2\".\"JOBLOG_INFO\"('*')) x"

MESSAGE_ID  MESSAGE_TIMESTAMP         
----------- --------------------------
CPD000D     2018-05-29-10.54.07.331486
CPC7301     2018-05-29-10.54.07.335762

  2 RECORD(S) SELECTED.

```

Now you can call db2 "directly" and everything just works! No messing with `qsh -c` and less escaping. But how does it work?

## Diving Under the Hood

The `qsh` PASE command is actually a shell script and it has special code to check what the first argument was. The first argument, being stored at index 0 is the name and path of the program which was run (in shell scripts, this is the `$0` variable). By creating a symlink to the same shell script called `db2`, when it gets called it will think it's the `db2` program instead of `qsh`. Thus, instead of calling `/usr/bin/qsh`, the script will call `/usr/bin/db2` instead! You can do this with any IBM i program you want, so long as there's a symlink in `/usr/bin` (just be aware that for RPG and CL programs, the parameters need to be padded out).

One thing to note is that when you call programs this way instead of using `qsh -c`, they will run in a multi-threaded job, which may give you issues. If that is a problem, you can always make a copy of the `qsh` script and remove the `-i` argument to `system` on the last line of the script, then symlink to your `qsh` copy instead. This will cause `system` to execute in a new job, just as `qsh -c` would have.

## Use it or Lose it

Just remember that the program name is an argument just like any other and you can take advantage of it in your own programs! In shell scripts you can use the special variable `$0`; in Python use `sys.argv[0]`; and in C/C++ it's in `argv[0]` (in PASE this gives you `/path/to/program`, while in ILE it gives you `LIBRARY/PROGRAM`).

Are there any situations you can think of where this would be useful?