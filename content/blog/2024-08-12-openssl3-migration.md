+++
title = "Migrating IBM i RPMs to use OpenSSL 3"
slug = "2024-08-12-openssl3-migration"

[taxonomies]
tags = [ "ibmi-oss-updates"]
+++

Today, we're pushing out updates to various rpms to migrate from OpenSSL 1.1.1
to OpenSSL 3. As you may know, OpenSSL 1.1.1 is no longer supported by the
upstream OpenSSL project so we had to rebuild our packages to use OpenSSL 3.0,
the current Long Term Support (LTS) release.

<!-- more -->

While OpenSSL 1.1.1 and 3.0 are relatively API compatible, so most software
using OpenSSL needed little to no changes to make it build with OpenSSL 3.0
instead. However, in the process we ran in to some major issues which caused
this migration to take longer than one might otherwise expect. These issues
should now be resolved and we have a [documentation
page](https://ibmi-oss-docs.readthedocs.io/en/latest/yum/OPENSSL3_MIGRATION.html)
detailing the issues a bit. I'll be going in to more details below, if you want
to learn more.

Long story short: With the mitigations in place the transition _should_ be
pretty smooth. It's still recommended to update _all_ packages, so that you
don't end up with a mixture of OpenSSL 1.1.1 and 3.0 using packages, but our
mitigations should handle that should it occur.

## Issues Found

While rebuilding the rpms, I would install the built rpms in to a sandbox to
play around with them first before merging. After building curl against
OpenSSL, `yum` commands started to segfault:

```bash
$ yum install mc
https://public.dhe.ibm.com/software/ibmi/products/pase/rpms/repo-base-7.3/repodata/repomd.xml: [Errno 14] curl#35 - "OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to public.dhe.ibm.com:443 "
Trying other mirror.
Segmentation fault (core dumped)
```

The backtrace was rather interesting:

```text
#0  0x090000000c2e9cfc in ?? () from /QOpenSys/pkgs/lib/libcrypto.so.1.1(shr_64.o)
#1  0x090000000c387018 in ?? () from /QOpenSys/pkgs/lib/libcrypto.so.1.1(shr_64.o)
#2  0x090000000c387018 in ?? () from /QOpenSys/pkgs/lib/libcrypto.so.1.1(shr_64.o)
#3  0x090000000c8e62d4 in ?? () from /QOpenSys/pkgs/lib/libcrypto.so.3(shr_64.o)
...
#6  0x090000000c8bfcd8 in ?? () from /QOpenSys/pkgs/lib/libcrypto.so.3(shr_64.o)
#7  0x090000000c7ca654 in ?? () from /QOpenSys/pkgs/lib/libssl.so.3(shr_64.o)
...
#9  0x090000000c798ff0 in ?? () from /QOpenSys/pkgs/lib/libssl.so.3(shr_64.o)
#10 0x090000000c6d490c in ?? () from /QOpenSys/pkgs/lib/libcurl.so.4(shr_64.o)
...
#20 0x090000000c6ab204 in ?? () from /QOpenSys/pkgs/lib/libcurl.so.4(shr_64.o)
#21 0x090000000cddfc30 in ?? () from /QOpenSys/pkgs/lib/python2.7/site-packages/pycurl.so
#22 0x09000000076dd9c4 in PyEval_EvalFrameEx () from /QOpenSys/pkgs/lib/libpython2.7.so
```

The pycurl package calls in to Curl (libcurl.so.4), which ends up calling in to
OpenSSL 3 (libssl.so.3). OpenSSL is composed of two libraries: libssl which has
high-level SSL/TLS related functions and libcrypto, which has low-level
cryptographic algorithms. The OpenSSL 3 TLS code eventually calls in to
libcrypto.so.3, but at some point from there it calls in to libcrypto.so.1.1.
**This is bad**. OpenSSL 1.1.1 and 3.0 are not ABI compatible and they have
separate global state.

So we knew what was the problem, but now the million dollar question: why?

## Debugging

So the first question was why is OpenSSL 1.1.1 and OpenSSL 3.0 being loaded
together in the first place. This it turns out was easy to answer: when yum
starts it ends up loading both the built in
[ssl](https://docs.python.org/3/library/ssl.html) Python module and pycurl.
Because we hadn't rebuilt Python 2 with OpenSSL 3, it was still using 1.1.1 and
we ended up with both versions of OpenSSL loaded once pycurl was loaded.

So the next question was why is this causing a problem? On AIX (and PASE by
extension), unlike many other platforms, function references are resolved at
link time. We can see this by using the `dump` command with the `-Tv` flags to
show the symbols:

libcurl.so.4:

```text
[374]   0x00000000    undef      IMP     DS EXTref libssl.so.3(shr_64.o) SSL_new
```

_ssl.so:

```text
[206]   0x00000000    undef      IMP     DS EXTref libssl.so.1.1(shr_64.o) SSL_new
```

We can see that each library specifies that it wants to call the `SSL_new`
function, but libcurl.so.4 says it should be found in libssl.so.3 while _ssl.so
says to load it from libssl.so.1.1. So we _should_ be fine, right??? Well,
turns out it's not so simple.

## Debug Rabit Hole

We started by creating a simple example program which would load mock OpenSSL
1.1.1 and 3.0 libssl and libcrypto libraries. Once we had the example in place
and it was able to recreate the problem, we could do more diagnosis. We tried
the same examples on AIX directly and discovered that we weren't able to
recreate the problem there. We do use different default compile options in our
gcc compiler, so was it a PASE bug or a difference in compiler? To determine
this, we took the binaries from AIX and copied them in to PASE and the binaries
from PASE and copied them to AIX. With a bit of [LIBPATH magic](@/blog/2017-09-08-libpath.md)
we were able to get them running with their corresponding libgcc libraries and
discovered that the PASE binaries failed on AIX while the AIX binaries were
fine. 🤔

We played around with a variety of compiler and linker options trying to
determine what was different between our build and AIX. The main culprit was
the Runtime Linking flag `-brtl`. This flag causes a variety of changes to be
more compatible with Linux applications, where function references are resolved
at runtime instead of link time which is exactly what we were experiencing.
However this flag didn't seem to make any difference when building our mock
libraries. It turns out we were missing a critical piece of information:
whether the runtime linker is used or not is based on whether the _main program
binary_ has runtime linking enabled or not and how the libraries it loads were
built doesn't matter _at all_. So _of course_ the flag didn't make any
difference on the _libraries_, we needed to apply that to the example _binary_
instead. Indeed, this was our issue and linking the main program without
`-brtl` would allow OpenSSL 1.1.1 and 3.0 to coexist peacefully in the same
process without crashing!

## Runtime Linking Considered Harmful?

Ok, so we had our smoking gun: runtime linking was causing the crash. Any
program using runtime linking (ie. **all** of them in our RPM ecosystem) would
crash if they loaded both OpenSSL libraries at the same time. Now the question
is how do we deal with this problem?

Well, we don't really _need_ runtime linking. Pretty much all of the software
we build doesn't depend on this behavior, so why do we enable it automatically
unlike on AIX? Well, we use it because it makes packaging software for RPMs
easier to deal with vs the traditional AIX library packaging scheme. It allows
the linker to find libraries with the .so extension like on Linux and are
produced when using the `--with-aix-soname=svr4` configure flag from
[libtool](https://www.gnu.org/software/libtool/manual/html_node/LT_005fINIT.html).
Maybe one day I'll write a post explaining how all this works, but for now all
you need to know is that it makes it easier for us to build RPMs and that it
requires using libraries with a .so extension.

## In Search of a Solution

Now, the simplest solution to this problem is just don't have the problem in
the first place. If we upgraded everything to use OpenSSL 3.0 all at once, well
then there's no problem, right? Well, this solution is not ideal for a few
reasons:

- it causes a [flag day](https://en.wikipedia.org/wiki/Flag_day_(computing))
  and we can't control when and how users upgrade
- we don't have control over third-party applications, which may still be using
  OpenSSL 1.1.1
- some software we don't want to upgrade (eg. Python 2, which is EOL)

What we really wanted was a way to get the "please search for .so files"
behavior without the "enable runtime linking" linker behavior that comes with
`-brtl`. Unfortunately, after looking over the [linker docs](https://www.ibm.com/docs/en/aix/7.2?topic=l-ld-command)
 it didn't seem like there was anything, but as a hail mary I asked a new team
member if he knew anything. He had recently come over from AIX development and
still knew someone who worked on the linker code. After talking with his
contact, we learned that there is indeed a way to do this using an undocumented
🤫 command line option `-blibsuff:so`.

With this, we had our solution: rebuild any packages using OpenSSL (either
directly or _indirectly_ via dependencies) with `-blibsuff:so` instead of
`-brtl`. One final snag was that of the third pary software I could check, PHP
was using OpenSSL _and_ it turns out it actually _requires_ runtime linking
behavior in its default build configuration. If you are using the
[CP+ PHP](https://www.seidengroup.com/communityplus-php-for-ibm-i/) from Seiden
Group, they have a modified version of PHP which runs without runtime linking.

## Path Forward

So we've now rebuilt all software using OpenSSL without runtime linking
enabled, but we didn't rebuild everything. There's still a lot of software to
rebuild without `-brtl` and eventually we no longer want to be using it at all.
To this end, our recently released GCC 12 package has replaced `-brtl` with
`-blibsuff:so` in its default linker options. There's still more investigation
we need to do on how removing `-brtl` will affect libtool builds as well, but
if you are building and packaging PASE software you should building with the
`-bnortl` linker flag or using GCC 12 to ensure your software doesn't depend on
runtime linking behavior.
