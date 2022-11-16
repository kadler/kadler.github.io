+++
title = "IBM i Open Source Updates June 2020"
aliases = [ "2020/07/15/jun-oss-updates.html",]
slug = "2020-07-15-jun-oss-updates"

[taxonomies]
tags = [ "ibmi-oss-updates",]
+++

Well, it's that time of the month again. Time to talk about all the OSS updates that's fit to print!

<!-- more -->

## New Packages

### OpenJ9 + OpenJDK Java 11

Definitely the biggest new package of June (possibly of the year) is the Early
Access release of Java 11 for IBM i via RPM. This is built using a combination
of the [OpenJ9](http://www.eclipse.org/openj9/) JVM and the
[OpenJDK](https://openjdk.java.net/) class libraries. OpenJ9 is the open source
version of the same J9 JVM that already ships on IBM i today. We now have a 100%
open source Java runtime running on IBM i (albeit in Early Access form).

There's a couple things to look out for in this new runtime:

1. Early Access  
   This is an Early Access version, which means that it's not production ready.
   While we have put it through its paces running various workloads in Jenkins,
   Apache Camel, ActiveMQ, and others, we have not completed comprehensive
   testing. It surely has bugs and you may experience crashes.

2. No more IBM class libraries  
   While OpenJ9 should largely be the same as the traditional IBM J9, the RPM
   Java uses a completely different set of Java class libraries. This should not
   matter for most code, but if you have Java code which has made use of IBM
   extensions or specific behavior, this will no longer work.

3. No ILE integration  
   This is a pure-PASE implementation and as such it has no integration with
   ILE. This means it can't integrate with RPG or Db2, it doesn't support ILE
   native methods, and it doesn't support passwordless JT400 logins as
   `*CURRENT`. It also does not work using the standard PASE or QSH `java`
   launcher commands, nor does it work with the `RUNJVA` CL command.

For more information on the Java 11 rpm, see our
[doc](https://bitbucket.org/ibmi/opensource/src/master/docs/java11/JAVA11_EARLY_ACCESS.md)

### GNU Privacy Guard

[GNU Privacy Guard](https://gnupg.org/), also referred to as GnuPG or GPG is an
open source implementation of the OpenPGP standard.

It uses public key cryptography to serve two main purposes:

1. Encryption  
   With gpg, you can encrypt data using a public key. Only the owner of the
   corresponding private key can decrypt it. Likewise, someone can encrypt
   something with your public key and only you can decrypt it.

2. Signing  
   Using your private key, you can create attach a signature to data. Anyone
   receiving this data and signature can validate that you were the one who
   signed using your public key.

What kind of data can `gpg` work with? Really, any data can be used,
though it's easiest to work with IFS files in the root (/) or QOpenSys
filesystems. `gpg` can also used with git to sign your commits. You can read
more about it in the [git docs](https://git-scm.com/book/en/v2/Git-Tools-Signing-Your-Work)
or from [GitHub's docs](https://help.github.com/en/github/authenticating-to-github/signing-commits).

NOTE: Make sure to read `/QOpenSys/pkgs/share/doc/gnupg2-2.2.19/README.IBMi` for
steps on how to correctly set the `GPG_TTY` environment variable. Without this,
gpg can't prompt you for the password correctly. This also means that gpg will
not work from QSH or QP2TERM if you use a password.

This fulfills RFE [119042](http://www.ibm.com/developerworks/rfe/execute?use_case=viewRfe&CR_ID=119042).

### p7zip

[p7zip](http://p7zip.sourceforge.net/) is a port of the command line version of
[7-Zip](http://www.7-zip.org) to Unix-like POSIX systems. If you need to decode 7-Zip
archives (those ending with .7z) on IBM i, now you can!

This fulfills RFE [123942](http://www.ibm.com/developerworks/rfe/execute?use_case=viewRfe&CR_ID=123942).

### zstd

[zstd](http://facebook.github.io/zstd) (or Zstandard) is a newer compression
library from Facebook. It is designed for real-time compression, so it trades
speed for compression ratio. That doesn't mean to say that it's compression is
poor, however! It has very good compression, outperforming zlib across the board
not only in compression ratio, but compression and decompression speed too!

### libssh2

[libssh2](https://www.libssh2.org/) is a library that implements the SSH2 client
protocol. We'll be talking more about this later.

### fontconfig

[fontconfig](https://www.freedesktop.org/wiki/Software/fontconfig/) is a library
for configuring fonts, of course :wink:. This along with
[freetype](https://www.freetype.org/) are used by open source software for font
configuration and text rendering.

Right now it's not actually used by anything, but watch this space.

### json-c

[json-c](https://github.com/json-c/json-c) is a JSON parser library written in C.

Like fontconfig, json-c isn't used by anything right now.

### DejaGnu

[DejaGnu](https://www.gnu.org/software/dejagnu/) is a testing framework written
by the GNU project. It's built upon [Tcl](http://tcl.tk/) and
[Expect](https://core.tcl-lang.org/expect/index).

### libuuid / util-linux

[util-linux](https://github.com/karelzak/util-linux) is a project that provides
a bunch of utilities for the Linux, though many work on other platforms
including PASE on IBM i. We had originally built the libuuid package from this
for fontconfig, but fontconfig removed that dependency. Since we had it built,
we decided to ship it anyway.

We may end up shipping other software from the util-linux collection. I'd
especially like to see [hexdump](https://linux.die.net/man/1/hexdump) :grin:.

## Package Updates

### Curl w/ SSH/SFTP support

Curl has been upgraded to 7.70.0 and was also built with the newly released
libssh2. This allows it to use ssh:// and sftp:// URLs.

### NCurses "wide" APIs

The ncurses package was updated to build the "wide" APIs and now provides the
libncursesw shared library. Some software prefers or requires the libncursesw
APIs.

### man page compression

RPM was updated to compress man pages automatically. This should save some disk
space at the cost of some extra build-time processing. Of course, since we don't
have a man page _viewer_ it would save even more space to just not ship them. I
wonder why we didn't do that? Hmm. :thinking:

### Readline minus -bexpfull

You should _never_, _ever_, _ever_ use `-bexpall` or `-bexpfull` when building
software in AIX or PASE. If you ever think you might need it, you should
re-evaluate your life and figure out where you went wrong. Sadly, I didn't know
any better — or at least I didn't have time to fix it properly — when I updated
readline to use `-bexpfull` to allow GDB to work.

I have now fixed Readline properly to not use `-bexpfull`. 

### Other Updates

- nodejs10 was updated to [10.21](https://nodejs.org/en/blog/release/v10.21.0/)
- nodejs12 was updated to [12.18](https://nodejs.org/en/blog/release/v12.18.0/).
- libutil was updated to [0.8.1](https://github.com/IBM/portlibfori/releases/tag/0.8.1)
  fixed a bug in backtrace() introduced in 0.8.0.

## Closing

Another big month. I wonder how much we can keep this up. I guess you'll just have to find out next month. :wink:
