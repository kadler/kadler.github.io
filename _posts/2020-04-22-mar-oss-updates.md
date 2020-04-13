---
layout: single
title: IBM i Open Source Updates Mar 2020
layout: single
categories: ibmi-oss-updates
---

Alright folks, strap in because March was a busy month!

## New Packages

### tmux

[tmux](https://github.com/tmux/tmux/wiki) is a Terminal MUltipleXer. It allows you to create multiple sessions that are persistent - you can disconnect (or become disconnected, eg. wifi drops off) and then reconnect and everything will be as it was before. Within sessions you can have multiple windows which you can switch between and you can also have multiple panes within windows, showing multiple things on the screen at once.

Here's an example of a `tmux` session running that has 2 windows (window1 and window2, with window1 being visible) and 3 panes in window1:

<img src="{{site.baseurl}}/assets/images/tmux.png">

If you want to get started with `tmux`, here's some references:
- [https://github.com/tmux/tmux/wiki/Getting-Started](https://github.com/tmux/tmux/wiki/Getting-Started)
- [https://linuxize.com/post/getting-started-with-tmux/](https://linuxize.com/post/getting-started-with-tmux/)
- [https://tmuxcheatsheet.com/](https://tmuxcheatsheet.com/)

I want to thank Calvin Buckley for figuring out how to make this work on IBM i.

### python3-paramiko

[Paramiko](http://paramiko.org/) makes it easy to use SSH, SCP, and SFTP from within Python. Why is that important? Two reasons:

**1\. Easy remote access to XMLSERVICE**

Traditionally for remote XMLSERVICE access, the options were basically the XMLSERVICE FastCGI plugin to Apache or over ODBC, but both have issues:

- FastCGI requires creating an Apache instance (or glomming on to an existing one); adding security through authentication and SSL must be configured manually
- ODBC requires installing the ODBC driver on all your systems as well as configuring DSNs
- For IBM i Cloud instances both may require port-forwarding and other setup 

By-far the easiest way now to make remote XMLSERVICE calls (especially to IBM i instances in IBM Cloud) is through SSH and `xmlservice-cli` (part of `itoolkit-utils`). [python-itoolkit](https://python-itoolkit.readthedocs.io/en/latest/api.html#ssh-transport) has supported this since v1.6 and requires Paramiko. The upcoming node-itoolkit v1.0 will also support SSH.

**2\. Programatic access to remote SSH resources**

Many users use SSH/SFTP as part of their business procedures: pushing or pulling data to/from business partners, etc. Many times due to external requirements, users cannot use key-based authentication and must use passwords. It is difficult to automate SSH and SFTP using passwords so many users resort to things like [expect](/2020/04/15/feb-oss-updates.html#expect) or other tools. Paramiko allows you to control exactly how you want to connect and supports password authentication. You control how and where you get the password from: hard code it, read it from an [environment variable](https://docs.python.org/3/library/os.html#os.environ), read it from a database entry, whatever — since it's all Python, you can do whatever Python allows you to do.


Here's an example connecting to a system and running some commands through SSH as well as using SFTP:
```python
hostname = 'ibmi.example.com'
username = 'myuser'
password = 'mypassword'
with paramiko.SSHClient() as ssh:
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username,
                password=password)
    
    cmd = 'system "DLTF MYLIB/MYFILE"'
    stdin, stdout, stderr = ssh.exec_command(cmd)
    messages = stdout.readlines() + stderr.readlines()
    
    ok = False
    for line in messages:
        if line.startswith("CPC2191"):
            ok = True
            break
    
    ftp = ssh.open_sftp()

    # Get or put a local file directly
    ftp.put("""C:\myfile.txt""", "/home/kadler/myfile.txt")
    ftp.get("/home/kadler/myfile.txt",
            "/Users/kadler/myfile.txt")

    # Write a file programatically
    with ftp.file("/home/kadler/test-sftp", "w") as file:
        file.write("Hello from Paramiko!\n")
```

### chsh

We've had numerous ways to set your login shell over the years. In fact, Jesse Gorzinski went over a few in his "Be Like a Turtle!" [blog entry](https://ibmsystemsmag.com/Power-Systems/8/2017/be-like-a-turtle), but none are as easy to use as the new `chsh`:

```sh
yum install chsh

chsh -s /QOpenSys/pkgs/bin/bash
```

No SQL to look up or execute, just a simple command to change your shell (or any user's shell that you have `*USE` authority to).

### pigz

[pigz](https://zlib.net/pigz/) is a parallelized version of [gzip](http://gzip.org/). If can take advantage of multiple CPU cores to speed up compression over standard `gzip`.

This fulfills RFE [123949](http://www.ibm.com/developerworks/rfe/execute?use_case=viewRfe&CR_ID=123949).

### libuv

[libuv](https://github.com/libuv/libuv) is the asynchronous event and I/O library that underpins Node.js. Each Node.js release we've shipped going back to Node v0.x has included `libuv`. However, it was not made available as a separate library for other packages to use. We've found many other open source packages have wanted to make use of this library for their own needs, so we're now shipping a standalone version.

### help2man

[help2man](https://www.gnu.org/software/help2man/) is a package which generates ["man pages"](https://en.wikipedia.org/wiki/Man_page) from command help text (ie. `foo --help`). It is used by 3 packages we ship: `flex`, `libtool`, and `rpmdevtools`. Without this package being available anyone wishing to build these packages from the source rpm would be unable to do so.

### libevent

Like `libuv`, [libevent](https://libevent.org/) is an asynchronous event library. This package seems to have rather unstable compatibility support and regularly changes its ABI. We recommend users use `libuv` instead, since it has a strong compatibility guarantee and is supported by our team upstream (soon to be included in the CI!). While we would rather packages use `libuv` over `libevent`, we make it available for those packages that require it, such as `tmux`.

## Package Updates

- python3 was updated to [3.6.10](https://docs.python.org/3.6/whatsnew/changelog.html#python-3-6-10-final)
- cmake was updated to [3.16](https://cmake.org/cmake/help/v3.16/release/3.16.html)
- libutil was updated to [0.7.0](https://github.com/IBM/portlibfori/releases/tag/0.7.0)
- libarchive was updated to [3.3.3](https://github.com/libarchive/libarchive/wiki/ReleaseNotes#libarchive-333) and now supports zstd compression.
- activemq was updated to [5.15.12](https://activemq.apache.org/activemq-51512-release)

## Package Fixes

### less

`less` is now linked with ncurses instead of the PASE curses library. This means that it has access to the ncurses terminfo database. The terminfo database supplied by PASE (files under `/QOpenSys/usr/share/lib/terminfo/`) only supported two terminals: `xterm` and `aixterm`. If there was no terminal definition found for your terminal (identified by `$TERM`), `less` would give the following warning and not work correctly:

```
-bash-4.4$ less test
WARNING: terminal is not fully functional
test  (press RETURN)
```

Newer versions of Linux terminal emulators, Terminal.app in macOS, and WSL on Windows now use `xterm-256color` instead of `xterm` to indicate they support more than the original 16 ANSI colors. Additionally, `tmux` uses `screen` for compatibility with GNU screen. However, neither `screen` nor `xterm-256-color` are terminals that are supported by PASE out of the box, so packages using the PASE curses library will not be able to properly function under these terminals. Linking to ncurses fixes this problem and gives those packages additional features to boot!

### cmake

In addition to the version bump, `cmake` has been enhanced to set the proper `CMAKE_SYSTEM_PREFIX_PATH` for our IBM i Open Source environment. This means it will now by default search /QOpenSys/pkgs/lib for libraries and /QOpenSys/pkgs/include for header files. In addition, the `ccmake` binary is built with `ncurses`.

### tar

A few bugs were fixed in GNU tar that snuck in when we rebuilt for IBM i 7.2:

- Using `--newer` or `--after-date` would produce an error like so:

```
$ tar -cf test.tar --newer test mydir
tar: test: Cannot stat: A system call received a parameter that is not valid.
tar: Date sample file not found
Try 'tar --help' or 'tar --usage' for more information.
```

- Using `-C` would produce an error like so:

```
-bash-4.4$ tar -C /home/kadler -c -f test.tar /home/kadler/test
tar: /home/kadler: Cannot open: Invalid argument
tar: Error is not recoverable: exiting now
```

Both of these issues are now fixed with the latest version of tar-gnu.

## Closing

Aaaaaaannnnnnnnndddddd we're all caught up!

Of course, next week is still April, so I wouldn't have the April update then, so instead I'll cover all the non-RPM stuff my team's been up to.