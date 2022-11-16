+++
title = "IBM i Open Source Updates August & September 2020"
aliases = [ "2020/10/28/aug-oss-updates.html",]
slug = "2020-10-28-aug-oss-updates"

[taxonomies]
tags = [ "ibmi-oss-updates",]
+++

While August had some big hitters, September was very quiet so I decided to only
do one update.

<!-- more -->

## New Packages

### Ghostscript

[Ghostscript](https://www.ghostscript.com/) is a PostScript and PDF interpreter.
It is primarily used to generate PDFs from various input formats. Note that
Ghostscript is licensed under the [Affero GNU Public
Licence](https://www.gnu.org/licenses/agpl-3.0.html) (AGPL). This license
requires releasing any source code which integrates with Ghostscript even when
used in a Software as a Service model. [This](https://medium.com/swlh/understanding-the-agpl-the-most-misunderstood-license-86fd1fe91275) article has
a more thorough walkthrough of the implications.

This fulfills RFE [131308](http://www.ibm.com/developerworks/rfe/execute?use_case=viewRfe&CR_ID=131308).

### GNU Texinfo

[GNU Texinfo](https://www.gnu.org/software/texinfo/) is the official
documentation format of the GNU project. It's similar to man pages, but are
built to be a more comprehensive documentation.

For instance, `man bash` will tell you the command line options that `bash`
takes along with some information on how those options affect the behavior and
some info on BASH syntax and things while running `info bash` will provide
background on what a shell is, some history on BASH, how to write functions and
pipelines and other things.

## Package Updates

### Python bugfix for IBM i 7.4

Building C++ Python extensions on IBM i 7.4 (eg. matplotlib) would fail with
linker errors like `A symbol name may only be followed by an export attribute or
an address. The line is being ignored.` as seen in [this issue](https://bitbucket.org/ibmi/opensource/issues/129/yet-another-unable-to-install-matplotlib). This has been fixed.

### libsodium SIGILL fix

Certain libsodium functions were calling `mlock` and `madvise` which are not
supported by PASE and trigger SIGILL. These functions have been disabled from
the builds.

### Other Updates

- nodejs14 was updated to [14.11.0](https://nodejs.org/en/blog/release/v14.11.0/)
- nodejs12 was updated to [12.18.4](https://nodejs.org/en/blog/release/v12.18.4/)
- nodejs10 was updated to [10.22](https://nodejs.org/en/blog/release/v10.22.0/) and [10.22.1](https://nodejs.org/en/blog/release/v10.22.1/)
- sqlite3 was updated to [3.23.3](https://sqlite.org/changes.html#version_3_32_3) for [UPSERT](https://www.sqlite.org/draft/lang_UPSERT.html) support
- python3 was updated to [3.6.11](https://www.python.org/downloads/release/python-3611/)
- readline was updated to [8.0](https://tiswww.cwru.edu/php/chet/readline/CHANGES)

## Closing

I know a lot of people have been looking forward to Ghostscript for a long time.
What do you think? Looking forward to anything else?