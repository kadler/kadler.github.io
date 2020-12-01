---
layout: single
title: IBM i Open Source Updates October & November 2020
layout: single
categories: ibmi-oss-updates
---

October was a pretty slow month with mostly low-level improvements so I figured
I'd combine them with the November updates. November turned out to be a pretty
big, so here we go!

## New Packages

### PCRE2

[PCRE](http://www.pcre.org/) stands for Perl Compatible Regular Expressions, and
is a regular expression library. While we previously shipped PCRE1, that version
has been marked stable and is no longer developed. Instead, focus shifted to
PCRE2 and many packages will only work with that version.

### dos2unix

The [dos2unix](http://waterlan.home.xs4all.nl/dos2unix.html) project provides a
set of simple conversion utilities which convert newlines in files between
DOS/Windows (CRLF), Unix (LF), and Classic Mac OS (CR).

If you ever run in to problems transferring text files from a Windows system to
IBM i and trying to use it in PASE, a simple fix might be running it through
dos2unix:

```shell
dos2unix windows-file.txt
```

### Snappy

[Snappy](https://github.com/google/snappy) is a newer compression algorithm and
library from Google, which aims for very high speed with reasonable compression.
Unlike many other compression tools we've provide in the past such as gzip, xz,
zstd, bzip2, etc. snappy does not provide a command line tool — only a library.

### MongoDB C Driver

[mongoc](http://mongoc.org) is a MongoDB client library. This allows
applications and language packages to connect to MongoDB instances. While this
won't help you run MongoDB _on IBM i_, it will allow you to use MongoDB-based
applications connecting to MongoDB instances on other systems.

mongoc also provides libbson, which is a library for building, parsing, and
iterating [BSON](http://bsonspec.org/) documents.

Unfortunately, the current build is missing libmongocrypt, so it does not yet
support "Client-Side Field Level Encryption" but we are working on adding this
for the future.

### sshpass

[sshpass](https://sourceforge.net/projects/sshpass/) is a tool for performing
password authentication using keyboard-interactive in a non-interactive manner.
Ideally, you would use public key authentication with SSH keys or certificates
instead, but sometimes this is not available. Many users already use `expect` to
do similar things, but now there is another option.

### MariaDB 10.3

This is by far the biggest update of October and November!
[MariaDB](https://mariadb.org/) is an open source database based off of MySQL
from the original developers of MySQL. Zend has long shipped a version of
MySQL/MariaDB in the [ZendDBi](https://www.zend.com/downloads/zend-dbi) product,
but now it's easier than ever to get MariaDB running on your system! The rpm
version also has more modern defaults, such as using `utf8mb4` as the default
charset so you can store all the emoji you want :hugs: :rainbow: :rocket:!

One thing to note is that the rpm version we provide _does not_ include the Db2
storage engine. If that is something you need, please contact me directly and we
can discuss further.

## Package Updates

### autoconf / automake Dependency Fixes

The autoconf package now requires m4-gnu and automake now requires autoconf,
fixing some package dependencies.

### libutil 0.9

libutil has been updated to 0.9, which implements the GNU libc extension
functions `asprintf` and `vasprintf`. For more info see the [Linux man
page](https://linux.die.net/man/3/asprintf)

### SSL and zstd Support in Rsync

rsync has been updated to 3.2.3, which now supports SSL encrypted connections to
an rsync daemon as well as using zstd compression in addition to the existing
zlib compression.

### Wget built with PCRE2

Wget has been rebuilt with PCRE2 support. This allows you to use Perl-style
regexes with the `--accept-regex` and `--reject-regex` options.

### git built with PCRE2

git has been rebuilt with PCRE2 support. You can now specify `--perl-regexp` to
various git commands to use Perl-style regexes.

### rpm-build Dependency Fixes

The rpm-build package now requires the following packages:

- bash
- coreutils-gnu
- findutils
- grep-gnu
- patch-gnu
- sed-gnu
- gzip
- tar-gnu
- make-gnu

Various build scripts assume these packages are installed or assume they are
using GNU tools, which may behave differently than PASE tools.

In addition, it recommends the following packages:

- bzip2
- xz
- unzip

These packages are optional and only needed when builing packages whose source
archives are compressed using one of those packages. Currently, this
recommendation has no effect, since yum does not support "Recommends" rpm
dependencies.

### curl-devel Dependency Fixes

The libraries curl links with — so called "private libraries" — were removed
from the output of `curl-config --libs`. Packages which link to curl only need
to link to libcurl, not the libraries which curl itself links to. This could
cause linker errors when building against libcurl and libssh2-devel,
openssl-devel, and zlib-devel were not also installed.

### yum *ALLOBJ Check Fix

On some systems, yum would fail when attempting to check if the user has `*ALLOBJ` authority:

```text
File "/QOpenSys/pkgs/bin/yum", line 29, in <module>
    yummain.user_main(sys.argv[1:], exit_code=True)
  File "/QOpenSys/pkgs/share/yum-cli/yummain.py", line 288, in user_main
    errcode = main(args)
  File "/QOpenSys/pkgs/share/yum-cli/yummain.py", line 98, in main
    base.getOptionsConfig(args)
  File "/QOpenSys/pkgs/share/yum-cli/cli.py", line 230, in getOptionsConfig
    self.conf
  File "/QOpenSys/pkgs/lib/python2.7/site-packages/yum/__init__.py", line 897, in <lambda>
    conf = property(fget=lambda self: self._getConfig(),
  File "/QOpenSys/pkgs/lib/python2.7/site-packages/yum/__init__.py", line 357, in _getConfig
    self.conf.has_root_authority = misc.hasRootAuthority()
  File "/QOpenSys/pkgs/lib/python2.7/site-packages/yum/misc.py", line 103, in hasRootAuthority
    has_auth = _root_authority_cache[euid] = hasAllObjectAuthority()
  File "/QOpenSys/pkgs/lib/python2.7/site-packages/yum/misc.py", line 71, in hasAllObjectAuthority
    syscalls._RSLOBJ2(sysptr, ctypes.c_ushort(0x0201), b'QSYCUSRS', b'QSYS')
  File "/QOpenSys/pkgs/lib/python2.7/ctypes/__init__.py", line 379, in __getattr__
    func = self.__getitem__(name)
  File "/QOpenSys/pkgs/lib/python2.7/ctypes/__init__.py", line 384, in __getitem__
    func = self._FuncPtr((name_or_ordinal, self))
AttributeError
```

This has been fixed by loading the various ILE syscalls from libc.a instead of /unix.

### Other Updates

- nodejs12 was updated to [12.19.1](https://nodejs.org/en/blog/release/v12.19.1/).
- nodejs12 was updated to [14.15.1](https://nodejs.org/en/blog/release/v14.15.1/).
- python3 was updated to [3.6.12](https://www.python.org/downloads/release/python-3612/)
- libutil was updated to [0.9.0](https://github.com/IBM/portlibfori/releases/tag/0.9.0).
- freetype was updated to 2.10.4
- nano was updated to [5.3](https://www.nano-editor.org/news.php) and UTF-8
  support was enabled.

## Closing

We had some big splashy new packages, some incremental version bumps, bug fixes,
and some quality of life improvements. A solid update before the coming holiday
wind down.
