+++
title = "IBM i Open Source Updates August 2021"
aliases = [ "2022/01/10/aug-2021-oss-updates.html",]
slug = "2022-01-10-aug-2021-oss-updates"

[taxonomies]
tags = [ "ibmi-oss-updates",]
+++

August is up, let's check it out.

<!-- more -->

## New Packages

### Ncdu

[Ncdu](https://dev.yorhel.nl/ncdu) stands for "NCurses Disk Usage" and is a curses-based equivalent to the standard `du` Unix command and [TUI](https://en.wikipedia.org/wiki/Text-based_user_interface) equivalent to tools like [WinDirStat](https://windirstat.net/) or [QDirStat](https://github.com/shundhammer/qdirstat).

![Ncdu screenshot](/assets/images/ncdu.png)

Not only can you visualize the hierarchical storage usage, but you can also clean up unneeded files directly from the tool.

As far as I know, this only works on files in the Root and QOpenSys filesystems.

### c-ares

[c-ares](https://c-ares.org) is an asychronous DNS resolver from the same authors as [curl](https://github.com/curl/curl).

## Package Updates

### libuv

Updated to 1.42.0, fixing a [vlan crash](https://github.com/libuv/libuv/issues/3062) issue.

### python-rpm-macros

A fix was added for the `%py_shebang_fix` macro which was causing erroneous error messages printed from yum:

```txt
error: Macro %if has illegal name (%define)
error: Macro %endif has empty body
```

### python39-psutil

psutil was previously packaged for Python 3.6 and now packaged for Python 3.9, along with being updated to version 5.8.0.

### Other Updates

- nodejs12 was updated to [12.22.4](https://nodejs.org/en/blog/release/v12.22.4/) and [12.22.5](https://nodejs.org/en/blog/release/v12.22.5/).
- nodejs14 was updated to [14.16.4](https://nodejs.org/en/blog/release/v14.16.4/) and [14.16.5](https://nodejs.org/en/blog/release/v14.16.1/).
- nodejs16 was updated to [16.6.0](https://nodejs.org/en/blog/release/v16.6.0/) and [16.6.2](https://nodejs.org/en/blog/release/v16.6.2/).
- python39-pynacl was updated to 1.4.0

## Closing

Come back Friday for September updates!