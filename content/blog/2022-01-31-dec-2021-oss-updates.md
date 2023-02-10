+++
title = "IBM i Open Source Updates December 2021"
aliases = [ "2022/01/31/dec-2021-oss-updates.html",]
slug = "2022-01-31-dec-2021-oss-updates"

[taxonomies]
tags = [ "ibmi-oss-updates",]
+++

Just because the last couple months were quiet doesn't mean that nothing's
going on. Case in point, the last month of 2021 saw a ton of updates, though
many of them had been in the works for a long time.

<!-- more -->

## Package Updates

### yum

Yum now requires the [ibmi-repos]({% link _posts/2021-12-07-ibmi-repos.md %})
package. This should hopefully mean a smooth transition to the new repos as
users update their installations.

If you have more questions please refer to the
[FAQ](https://ibmi-oss-docs.readthedocs.io/en/latest/yum/IBM_REPOS.html#faqs)
or reach out to me.

### OpenBLAS

OpenBLAS has been updated to
[0.3.19](https://github.com/xianyi/OpenBLAS/releases/tag/v0.3.19) which brings
optimized code paths for both POWER9 and Power10. In addition, OpenBLAS will
now determine the proper CPU optimizations and number of cores to use at
runtime automatically instead of having to set `OPENBLAS_CORETYPE` and
`OPENBLAS_NUM_THREADS`, respectively. Users can still set these values if they
want to override them.

*NOTE: This package is only available for IBM i 7.3 and newer.*

### Python 3.9 packages

Python 3.9 packages for Numpy, Pandas, and other ML packages are now available!
This has been a long-awaited update for many users, especially as Python 3.6 is now
no longer supported.

In addition, many packages have been updated (including some major version changes) and
new dependencies packaged. You'll definitely want to test your applications.

Full list of packages and versions:
- numpy 1.21.4
- pandas 1.3.4
- scipy 1.7.3
- scikit-learn 1.0.1
- beniget 0.4.1
- gast 0.5.3
- joblib 1.1.0
- ply 3.11
- pybind11 2.8.1
- pythran 0.10.0
- threadpoolctl 3.0.0

*NOTE: These packages are only available for IBM i 7.3 and newer.*

### CMake

CMake was updated to 3.16.9 and now builds svr4-style libraries when the
`VERSION` or `SOVERSION` property is set on a library target.  The soname will
reflect the `SOVERSION`, unless not specified in which case it uses `VERSION`,
and if that is not specified, it builds an un-versioned shared object.

eg.

```cmake
add_library(foo SHARED foo.c)
# Creates libfoo.so

add_library(bar SHARED bar.c)
set_target_properties(bar PROPERTIES SOVERSION 1)
# creates libbar.so -> libbar.so.1

add_library(baz SHARED baz.c)
set_target_properties(baz PROPERTIES VERSION 1.2.3)
# creates libbaz.so -> libbaz.so.1.2.3

add_library(bla SHARED bla.c)
set_target_properties(bix PROPERTIES VERSION 1.2.3 SOVERSION 1)
# creates libbla.so -> libbla.so.1
```

This brings CMake in line with libtool's `--with-aix-soname=svr4` option used
throughout our rpm ecosystem.

### gdb

GDB has been rebuilt to use NCURSES instead of the PASE curses libraries. This
fixes errors when using terminals other than "xterm" or "aixterm" (eg.
xterm-256color used by most modern Linux terminals).  It also now properly handles
UTF-8 locales when running in TUI mode.

### OpenJDK 11

The OpenJDK 11 Early Access rpm has been updated to handle the SVR4-style
libraries we use in our rpm ecosystem when using dynamic linking. This fixes
problems when loading libraries for FreeType, GLib, OpenSSL, CUPS, Fontconfig,
libzip, and more.

### libiconv

This package now provides a charset-alias sub-package shipping
/QOpenSys/pkgs/lib/charset.alias, which can be used as an rpm dependency for
other packages which depend on this file.

### TK

[TK](https://www.tcl.tk/) is now built with the open source X.org X11 libraries
instead of the PASE X11 libraries.

### p11-kit & ca-certificates

The system PKI trust directories (/QOpenSys/etc/pki/trust and
/QOpenSys/pkgs/share/pki/trust) changed ownership from the p11-kit package to
ca-certificates. Most users will not have the p11-kit package installed in
normal operation, which meant that these directories wouldn't be either. This
made it more difficult for users to figure out where to put their own CA
certificates (eg. for self-signed certificates). In addition, we've added a
README file at /QOpenSys/etc/pki/trust/anchors/README.
[Seiden Group](https://www.seidengroup.com/2021/04/26/how-to-validate-self-signed-ssl-tls-certificates-from-ibm-i/)
also has a great step-by-step article outlining the steps.

### ca-certificates-mozilla

Speaking of CA certificates, the system CA certificate trust store, based on
Mozilla's trust list, has been updated based on the NSS 3.60.

If you're interested in all the changes:
- [NSS 3.45 CA Changes](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/NSS/NSS_3.45_release_notes#certificate_authority_changes)
- [NSS 3.46 CA Changes](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/NSS/NSS_3.46_release_notes#certificate_authority_changes)
- [NSS 3.48 CA Changes](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/NSS/NSS_3.48_release_notes#certificate_authority_changes)
- [NSS 3.54 CA Changes](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/NSS/NSS_3.54_release_notes#certificate_authority_changes)
- [NSS 3.57 CA Changes](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/NSS/NSS_3.57_release_notes#certificate_authority_changes)
- [NSS 3.60 CA Changes](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/NSS/NSS_3.60_release_notes#certificate_authority_changes)

### Other Updates

- python3 was updated to [3.6.15](https://www.python.org/downloads/release/python-3615/)
- python39 was updated to [3.9.8](https://www.python.org/downloads/release/python-398/)
- service-commander was updated to 
  [0.7.0](https://github.com/ThePrez/ServiceCommander-IBMi/releases/tag/v0.7.0) and
  [0.7.2](https://github.com/ThePrez/ServiceCommander-IBMi/releases/tag/v0.7.2)
- libutil has been updated to [0.11.1](https://github.com/IBM/portlibfori/releases/tag/0.11.1)
- nss updated to 3.68.1
- nspr updated to 4.32

## Closing

Well, that's it for 2021. What a year!

We had some big new packages and versions:

- GCC 10
- OpenBLAS
- Node.js 16
- Python 3.9
- ibmi-repos
- FreeTDS

We also had quite a lot of smaller updates to packages like bash, curl,
db2util, nginx, R, etc. What was your favorite update this year?

Check back next week for the start of 2022 updates.
