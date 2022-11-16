+++
title = "IBM i Open Source Updates July 2020"
aliases = [ "2020/10/23/jul-oss-updates.html",]
slug = "2020-10-23-jul-oss-updates"

[taxonomies]
tags = [ "ibmi-oss-updates",]
+++

Been a while so let's get right to it.

<!-- more -->

## New Packages

### Node.js 14

While Node.js 14 was released back in April we managed to get legal approval in
July to ship it. Initially version 14.4, but later we updated it to 14.5 and
14.6.

Note that although Node 15 was just released a few days ago (as of this
writing), Node 14 has still not entered the LTS phase. I believe there should be
a new release shortly to mark it entering LTS.

For more information on what's new with Node.js 14, check out this great
[article](https://nodejs.medium.com/node-js-version-14-available-now-8170d384567e)
by Michael Dawson and Bethany Griggs.

### Ansible

[Ansible](https://www.ansible.com/) is an open source technology developed by
Red Hat for IT automation and orchestration. We now have the base packages
needed to integrate IBM i in to the Ansible stack.

Here's some resources if you'd like to know more about what Ansible is or how to
get started:
- [https://ibm.github.io/cloud-i-blog/archivers/2020_0602_automate_your_ibm_i_tasks_with_ansible](https://ibm.github.io/cloud-i-blog/archivers/2020_0602_automate_your_ibm_i_tasks_with_ansible)
- [https://www.ibm.com/support/pages/ansible-support-ibm-i](https://www.ibm.com/support/pages/ansible-support-ibm-i)
- [https://galaxy.ansible.com/ibm/power_ibmi](https://galaxy.ansible.com/ibm/power_ibmi)

### GNU man-db, groff, and GDBM

Have you ever been at the command line but just couldn't remember some command
line arguments to a program. Maybe you forgot whether the target or the link
name goes first on the `ln` command. Well fret no more, because we now have
man-db on IBM i!

I hear those eyes glazing over, so maybe I should explain further. GNU man-db
provides the `man` command and a system for caching man pages in a database
(thus the "db" part of "man-db"). The database it uses is the GNU variant of the
traditional UNIX "dbm": GDBM. This database is not a traditional database like
you might expect, but more a key-value store.

Anyway! man-db will find all those fancy man pages that we've been shipping and
wasting space on your filesystem with no way to view them. Until now that is,
since you can use the `man` command to view them, eg. `man ln`. This will load
up the man page, pipe it through `groff` (the GNU text layout tool) and display
it in your favorite pager, `less`:

```
LN(1)                             User Commands                             LN(1)

NAME
       ln - make links between files

SYNOPSIS
       ln [OPTION]... [-T] TARGET LINK_NAME   (1st form)
       ln [OPTION]... TARGET                  (2nd form)
       ln [OPTION]... TARGET... DIRECTORY     (3rd form)
       ln [OPTION]... -t DIRECTORY TARGET...  (4th form)

DESCRIPTION
       In  the 1st form, create a link to TARGET with the name LINK_NAME.  In the
       2nd form, create a link to TARGET in the current directory.   In  the  3rd
       and  4th  forms,  create  links  to each TARGET in DIRECTORY.  Create hard
       links by default, symbolic links with --symbolic.  By default, each desti‐
       nation  (name  of  new link) should not already exist.  When creating hard
       links, each TARGET must exist.  Symbolic links can hold arbitrary text; if
       later  resolved,  a relative link is interpreted in relation to its parent
       directory.
 Manual page ln(1) line 1 (press h for help or q to quit)
```

man-db can display an man page on the system and most of our rpms have man
pages, but we still don't have man pages for things provided by PASE itself.
Maybe some day...

### psycopg2

In [May]({% post_url 2020-06-22-may-oss-updates %}) we released PostgreSQL 12.
Now, with [psycopg2](https://www.psycopg.org/) you can easily connect to
postgres from Python.

### Python packages

To support Ansible, we've added Python 3 rpms of both [PyYaml](https://pyyaml.org/)
and [MarkupSafe](https://pypi.org/project/MarkupSafe/).

## Package Updates

### Python update-alternatives Integration

Both Python 2 and 3 are now supported in update-alternatives. This means that
like Node.js you can pick the default python version, ie. when you run `python`
which version do you get? The default is Python 3, but you can set it to Python
2 if you really want to. Just be warned, Python 2 is EOL as of 2020-01-01:
https://pythonclock.org/ and many projects are dropping support for Python 2 by
the end of 2020: https://python3statement.org/


As Node.js, to configure we use update-alternatives:
```
$ alternatives --config python   
There are 2 choices for the alternative python (providing /QOpenSys/pkgs/bin/python).

  Selection    Path                          Priority   Status
------------------------------------------------------------
* 0            /QOpenSys/pkgs/bin/python3.6   306       auto mode
  1            /QOpenSys/pkgs/bin/python2.7   207       manual mode
  2            /QOpenSys/pkgs/bin/python3.6   306       manual mode

Press <enter> to keep the current choice[*], or type selection number:
```

Hint: If you forget how to use update-alternatives, you can always check the man
page :wink:.

### Other Updates

- nodejs12 was updated to [12.18.2](https://nodejs.org/en/blog/release/v12.18.2/).

## Closing

Fairly exciting month with both Node.js 14, Ansible, man pages and usability
improvements for Python. 