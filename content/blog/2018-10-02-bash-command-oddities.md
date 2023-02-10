+++
title = "Bash Command Oddities"
aliases = [ "2018/10/02/bash-command-oddities.html",]
slug = "2018-10-02-bash-command-oddities"

[taxonomies]
tags = [ "bash",]
+++

Sometimes when using bash, you can run in to an oddity where it keeps running the "wrong" command. Let's explore.

<!-- more -->

## It was a dark and stormy night...

You want to install a Python package and you're using the new Python 3.6 installed via yum:

```txt
bash-4.4$ export PATH=/QOpenSys/pkgs/bin:$PATH
bash-4.4$ python3 --version
Python 3.6.6
```

When you install `xlsxwriter`, though it can't be found:

```txt
bash-4.4$ pip3 install xlsxwriter
Downloading/unpacking xlsxwriter
  Downloading XlsxWriter-1.1.1-py2.py3-none-any.whl (142kB): 142kB downloaded
Installing collected packages: xlsxwriter
Successfully installed xlsxwriter
Cleaning up...
bash-4.4$ python3
Python 3.6.6 (default, Jul  7 2018, 22:45:07) 
[GCC 6.3.0] on aix6
Type "help", "copyright", "credits" or "license" for more information.
>>> import xlsxwriter
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ModuleNotFoundError: No module named 'xlsxwriter'
```

Hmm... You investigate a bit and discover that `pip3` is the 5733-OPS version of pip!

```txt
bash-4.4$ pip3 --version
pip 1.5.6 from /QOpenSys/QIBM/ProdData/OPS/Python3.4/lib/python3.4/site-packages (python 3.4)
bash-4.4$ which pip3
/QOpenSys/usr/bin/pip3
```

You know what you need to do, install `pip3` with yum:

```txt
bash-4.4$ yum install -y python3-pip
Setting up Install Process
Resolving Dependencies
--> Running transaction check
---> Package python3-pip.noarch 0:9.0.1-2 will be installed
--> Finished Dependency Resolution

Dependencies Resolved

===============================================================================================================
 Package                     Arch                   Version                  Repository                   Size
===============================================================================================================
Installing:
 python3-pip                 noarch                 9.0.1-2                  ibm                 1.9 M

Transaction Summary
===============================================================================================================
Install       1 Package

Total size: 1.9 M
Installed size: 5.9 M
Downloading Packages:
Running Transaction Check
Running Transaction Test
Transaction Test Succeeded
Running Transaction
  Installing : python3-pip-9.0.1-2.noarch                                                                  1/1 

Installed:
  python3-pip.noarch 0:9.0.1-2                                                                                 

Complete!
```

## Crisis averted. Or was it?

But still, it's using the OPS version!

```txt
bash-4.4$ pip3 --version
pip 1.5.6 from /QOpenSys/QIBM/ProdData/OPS/Python3.4/lib/python3.4/site-packages (python 3.4)
```

**What the heck?**

This is because bash caches command name lookups. So when you first run a command, it looks up the name via the `$PATH` and then caches it away in a hash for later lookup later. If you install a different command with the same name in to a folder earlier on the path, it won't know and will continue to use the older version. It's deceiving because the `which` command will show the right output:

```txt
bash-4.4$ which pip3
/QOpenSys/pkgs/bin/pip3
```

This is because `which` is a separate command and not part of bash, so it doesn't know anything about bash's cache and _always_ uses the `$PATH` to find the binary.

Instead, we can use the `type` bash built-in to determine where it's coming from:

```txt
bash-4.4$ type pip3
pip3 is hashed (/QOpenSys/usr/bin/pip3)
```

Here, pip3 has already been found at `/QOpenSys/usr/bin/pip3` and is being cached there. To clear the cache, use `hash -r`:

```txt
bash-4.4$ hash -r
bash-4.4$ type pip3
pip3 is /QOpenSys/pkgs/bin/pip3
bash-4.4$ pip3 --version
pip 9.0.1 from /QOpenSys/pkgs/lib/python3.6/site-packages (python 3.6)
bash-4.4$ type pip3
pip3 is hashed (/QOpenSys/pkgs/bin/pip3)
```

After resetting the lookup cache, pip3 is no longer hashed and bash does a normal `$PATH` lookup. Only after actully running it, will it get hashed again.

## Why have I never seen this before?

Note that when you change the `$PATH` variable, bash is smart enough to invalidate its cache. This means it's pretty rare to hit this issue. In order to encounter it you'd have to:
1) run an unqualified command which already exists
2) have that command be found in a directory later on the `$PATH`
3) install a different version of that command in to a directory earlier on the `$PATH` than the previous command

## Got any more info?

Sure. The docs for the hash (and other built-ins) are [here](https://www.gnu.org/software/bash/manual/html_node/Bourne-Shell-Builtins.html).

## What about shells other than bash?

Good question! For `zsh`, the command is `rehash`. For other shells, I'm not sure.
