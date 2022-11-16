+++
title = "IBM i Open Source Updates April 2021"
aliases = [ "2021/06/04/apr-oss-updates.html",]
slug = "2021-06-04-apr-oss-updates"

[taxonomies]
tags = [ "ibmi-oss-updates",]
+++

Well, I'm a month late, but let's not dawdle any further -- on to the updates!

<!-- more -->

## New Packages

### Node.js 16

Node.js 16 was released in April and we have had it since day 2 (missed day 1 by a few hours unfortunately, but gotta leave some room for improvement :wink:). If you want to know more about what's in Node.js 16, check out Bethany Griggs' writeup [here](https://medium.com/the-node-js-collection/node-js-16-available-now-7f5099a97e70).

Note that Node.js 16 will _become_ the next LTS version in October, but it's currently receiving active updates until then. Additionally, Node.js 16 is only available on IBM i 7.3 and up from our [7.3+ repo](https://public.dhe.ibm.com/software/ibmi/products/pase/rpms/ibm-7.3.repo). For now, you'll need to add this repo manually, but hopefully not in the future.

With the release of Node.js 16, this also marks the end of support for Node.js 10 and it will receive no more updates.

### GCC 10

GCC 10 is the first public version upgrade for GCC. While we originally started building our open source ecosystem with GCC 4.8 back in 2017, we upgraded to GCC 6.3 when we started packaging Node.js 8 as an rpm and we've been there ever since.

With GCC 10 for the first time we're building our own version of GCC on IBM i in PASE instead of using binaries built by the AIX team. This means we can more tailor our package to our platform and when issues arise, we can fix them. This is also the first time we've had to think about an upgrade path and integration, since many packages link to libgcc_s and libstdc++. We can't just rebuild the world with GCC 10 and call it a day since there are others building their own software (and even their own repositories of software) and they rely on our libraries being stable.

GCC 10 libraries will now upgrade the existing GCC 6 libraries and the compiler binaries, header files, and other files co-exist between the existing GCC 6 and new GCC 10 packages. There are still some rough edges with GCC 10, for instance Fortran support is not yet provided, so for the time being it's recommended to use GCC 6 unless you need GCC 10.

Like OpenBLAS and Node.js 16, we are only providing GCC 10 in our [7.3+ repo](https://public.dhe.ibm.com/software/ibmi/products/pase/rpms/ibm-7.3.repo).

### LibTIFF

[LibTIFF](http://www.simplesystems.org/libtiff/) is a library for reading image data in the "Tagged Image File Format". In March's update, I mentioned that we had built R linking with this package, but apparently we had never shipped it. That got fixed in April.

### ICU

[ICU](http://site.icu-project.org/) is a package which provides functions and utilities for doing Internationalization (i18n). This includes things like conversions between text encodings, collation, text formatting for numbers, dates, and currency amounts, etc.

This library is required by the PHP intl extension and can be used by various packages, including R.

### Cairo

[cairo](https://www.cairographics.org/) is a 2D graphics library.

### Pango

[Pango](http://www.pango.org) is a library for laying out and rendering text. It can make use of cairo or X11 libraries to generate glyphs from font data and also uses HarfBuzz for laying out complex text.

### tn5250

[tn5250](https://sourceforge.net/projects/tn5250/) is an ncurses-based 5250 client which runs in a Unix terminal. While it's been available on Linux and other platforms for some time, you can now run it on IBM i over SSH. This now means you don't have to switch away from your SSH terminal to access a 5250 terminal (say via IBM i Access Client Solutions) when you need such a thing. Of course, tn5250 is no replacement for ACS, but it may work well for what you need or in a pinch.

### freetds

[FreeTDS](https://www.freetds.org/) is a set of open source libraries which implement the Tabular Data Stream (TDS) protocol used by Microsoft SQL Server and Sybase DBMSes. This also provides an ODBC driver in the freetds-odbc package which can be used with node-odbc or pyODBC and PHP also provides a freetds extension.

## Package Updates

### unixODBC 2.3.9

While normally minor version bumps only contain bugfixes, `isql` and `iusql` in unixODBC 2.3.9 now support history. Just like in BASH, you can now scroll back through previous SQL queries from the same session or even previous sessions (stored in ~/.isql_history).

### GNU Coreutils

The GNU `uname -p` now matches the PASE version in returning "powerpc" instead of "unknown". This fixes a bug in CMake, which uses the output of `uname -p` for certain processing.

### GnuPG

GnuPG is now built with zlib and bzip2 compression support.

### Node.js 10, 12, 14

A patch was applied, which fixed a crash when a network interface name was longer than 10 characters, which is only possible when using VLANs. In addition, we now appropriately strip off the VLAN id to get the associated line description needed by QDCRLIND.

<https://github.com/libuv/libuv/issues/3062>

### R

R has been built with Pango and Cairo support. This should greatly improve the quality of the graphs and images it generates.

### Other Updates

- nodejs10 was updated to [10.24.1](https://nodejs.org/en/blog/release/v10.24.1/).
- nodejs12 was updated to [12.22.1](https://nodejs.org/en/blog/release/v12.22.1/).
- nodejs14 was updated to [14.16.1](https://nodejs.org/en/blog/release/v14.16.1/).

## Closing

Between GCC 10, Node.js 16, and R improvements there were lots of big changes in April. What was your favorite?
