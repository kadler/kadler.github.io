+++
title = "IBM i Open Source Updates March 2021"
aliases = [ "2021/04/07/mar-oss-updates.html",]
slug = "2021-04-07-mar-oss-updates"

[taxonomies]
tags = [ "ibmi-oss-updates",]
+++

Hold on to your hats, because this might be the **biggest** monthly update yet!

<!-- more -->

## New Packages

### Integer Set Library (ISL)

[ISL](http://isl.gforge.inria.fr/) is a math library used by GCC and needed to build GCC. This will likely be more useful in the future. :wink:

### GCC Package and gcc-aix

Our existing gcc-related packages have been updated to now use a _gcc6_ prefix. Thus `gcc‑aix`&nbsp;➔&nbsp;`gcc6‑aix`, `gcc‑cpp‑aix`&nbsp;➔&nbsp;`gcc6‑cpp‑aix`, etc. In addition, all the GCC binaries have a _-6_ suffix, eg. `gcc`&nbsp;➔&nbsp;`gcc‑6`, `g++`&nbsp;➔&nbsp;`g++‑6`, etc. This will be important when we deliver a new version of GCC so that both versions can be installed side-by-side. Through the magic of rpm tags, these renames should not cause any issues when upgrading through `yum`.

In addition, we have also shipped unversioned `gcc` packages, which always point to the "base" GCC package version. This is currently pointed at the existing GCC 6 packages mentioned above and is the default compiler used by our rpm builds. In the future, we may decide to change our base compiler and this allows an easy way to do that.

### brotli

Like zstd we shipped previously, [Brotli](https://github.com/google/brotli#introduction) is another modern compression algortithm, this time developed by Google. It is required to build Node.js. Up until now, we've static linked in the version shipped with the Node.js source, but we're experimenting with building some of these dependencies as shared libraries instead.

### c-ares

[c-ares](https://c-ares.haxx.se) is an asynchronous DNS resolver. Like Brotli, it is required to build Node.js and we're experimenting with building some of these dependencies as shared libraries instead.

### pixman

[pixman](http://pixman.org/) is a low-level pixel manipulation library. It is used by [cairo](https://www.cairographics.org/) and other higher-level graphics libraries.

### X.org X11 libraries

We are now shipping the open source [X.org](https://www.x.org/wiki/) X11 libraries developed by the freedesktop.org community. While the AIX-sourced versions of these libraries as shipped in PASE and the X.org versions do share a common lineage, they have diverged over time, with much of the current development focus coming from the X.org version to support Linux desktops. As such, many open source projects using X11 libraries expect to be run under X.org versions of the libaries. Not much changes at the moment, but this lays groundwork for the future.

## Package Updates

### R

The R build has been updated to build with both libtiff and the X.org X11 libraries now that they are available. There are some other optional dependencies that we are looking to build with in the future, but don't currently have approval to ship.

In addition, we have enabled `-pthread` flags by default, which should enable some packages to build out of the box, without having to set special flags.

Finally, R has been built against our new BLAS library indirector which I'll go in to more detail below.

### BLAS & related packages

Our BLAS infrastructure has gone through a massive overhaul. We currently ship the Netlib reference versions of the [BLAS](https://www.netlib.org/blas/) and [LAPACK](http://www.netlib.org/lapack/) scientific libraries used by ML workloads. While these libraries do work, these are generic, unoptimized versions. We'd like to offer alternative, _optimized_ versions of these BLAS libraries, but currently applications link directly to the Netlib libraries. To enable ease of switching BLAS implementations, we have built an indirection mechanism that provides 4 libraries:

- libblas-indirect.so.0
- libcblas-indirect.so.0
- liblapack-indirect.so.0
- liblapacke-indirect.so.0

These libraries can be switched between the various BLAS implementations using the `update-alternatives` mechanism, eg. `alternatives --config blas` and all our existing BLAS-using packages (`R`, `python3-numpy`, `python3-scipy`, `python3-scikit-learn`) have been rebuilt to use these indirection libraries.

Ok, so you can now switch between BLAS implementations, but what good is it if we only have a single implementation? Well, read on my friend!

### OpenBLAS

[OpenBLAS](http://www.openblas.net/) is an optimized version of GotoBLAS. It contains hand-optimized assembly versions of BLAS functions for various various architectures and operating systems. Most importantly for us, it has optimized instructions for POWER and builds on IBM i.

We currently ship version 0.3.10 with support for both POWER6 and POWER8 optimization levels. The code will detect at runtime which CPU you are running on and switch appropriately. Running various benchmarks we saw OpenBLAS running over 5x faster than Netlib BLAS on a POWER8 IBM i 7.3 machine.

While OpenBLAS supports some POWER9 and even some POWER10 optimizations, we are currently limited to POWER8 support at the moment, due to limitations in the assembler used in PASE. Because the IBM i 7.2 PASE version of `as` only supports up to POWER7 and the IBM i 7.3 version only supports up to POWER8, we have only enabled the POWER8 optimizations and had to build this RPM on IBM i 7.3 to do so.

This means this package is our first IBM i 7.3+ rpm and will also be our first RPM delivered through our new IBM i 7.3+ repo. If you want to enable it, you can download the repo file [here](https://public.dhe.ibm.com/software/ibmi/products/pase/rpms/ibm-7.3.repo) to `/QOpenSys/etc/yum/repos.d`. We're working on a more permanent and seamless solution for the future. In addition, a bunch of new packages we're working on will start showing up there (and only there). With IBM i 7.2 going out of support at the end of April, it's time to start leaving it behind.

### RPM

Various improvements for packagers:

- The brp-python-bytecompile script now uses the correct paths for IBM i, enabling automatic Python byte-compiling during RPM builds
- RPM scriptlets now use the default PASE `$PATH` with the addition of `/QOpenSys/pkgs/bin`.
- Various build-related files and utilities have moved from the rpm package to the rpm-build package
- The default compile flags (`%optflags`) are now set per-release to include the minimum POWER hardware level supported on that release (eg. 7.2: `-mcpu=power6`, 7.3: `-mcpu=power7 -maltivec -mvsx`, etc)

### bash

bash now looks for an inputrc file in `/QOpenSys/etc/inputrc` instead of `/etc/inputrc` (`~/.inputrc` is not affected)

### perl

libperl.a has been repackaged in to a standard svr4-style shared library libperl.so.5.24. In addition, various files have been split in to a `perl-devel` package.

### db2util

Updated to 1.0.11 to fix an issue with empty string output for NUMERIC and DECIMAL types.

### util-linux

This package has been updated to require the necessary version of libutil2.

### pkg-config

pkg-config has been patched to ignore Requires.private dependencies. These are only needed when static linking and since we provide no static libraries, disabling this allows us to avoid adding unnecessary rpm dependencies to many development packages.

### ansible

Ansible has been updated to no longer adjust the shebang line of various Python files it ships. This was causing issues when running IBM i as the Ansible control node and communicating with a non-IBM i remote node.

### Other Updates

- nodejs10 was updated to [10.24.0](https://nodejs.org/en/blog/release/v10.24.0/).
- nodejs12 was updated to [12.21.0](https://nodejs.org/en/blog/release/v12.21.0/).
- nodejs14 was updated to [14.16.0](https://nodejs.org/en/blog/release/v14.16.0/).
- libutil was updated to [0.10.0](https://github.com/IBM/portlibfori/releases/tag/0.10.0)
- ansible was updated to 2.9.10

## Closing

Last month I mentioned bigger changes were coming and while I certainly think we nailed it on that front, there's still more on the way. Stay tuned!
