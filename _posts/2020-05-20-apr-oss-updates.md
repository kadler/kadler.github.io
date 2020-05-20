---
layout: single
title: IBM i Open Source Updates Apr 2020
layout: single
categories: ibmi-oss-updates
---

April seemed very busy to me, but it ended up being rather mild in what we actually delivered. I suspect that means that my May update will be a rather large update. :wink:


_NOTE: I said last time I was going to update on the other things my team was working on, but April got very busy and then I went on vacation so I wasn't able to get to it. That post is still coming, but since we're over halfway through May, it seemed better to get the April updated out first._

## Package Updates

- freetype was updated to [2.10.1](https://sourceforge.net/projects/freetype/files/freetype2/2.10.1/)
- libuv was updated to [1.35](https://github.com/libuv/libuv/releases/tag/v1.35.0)

## Package Fixes

### Python 3

Python 3 was patched for [CVE-2019-18348](https://nvd.nist.gov/vuln/detail/CVE-2019-18348) and [CVE-2020-8492](https://nvd.nist.gov/vuln/detail/CVE-2020-8492).

### chsh

`chsh` was updated to handle a job with CCSID(65535). Previously, this would fail with

```
SQL Error: Character conversion between CCSID 1208 and CCSID 65535 not valid. (sqlstate=57017, sqlcode=-332)
Error: Unable to set shell
```

### GNU patch

GNU patch was patched to handle having no limit on the number of open files (`ulimit -n unlimited`). This would cause patch to try to allocate gigabytes of memory which would fail and cause patch to exit with

 ```
 /QOpenSys/pkgs/bin/patch: **** out of memory
 ```

### tmux

The `tmux` package was updated to require the correct version of libutil it needed. Previously, it was possible to install `tmux` with an older version of libutil and then `tmux` would fail to start with missing symbol loader errors.

### libiconv

This is more of a developer fix, but libiconv-devel package now puts the header files for libiconv directly in `/QOpenSys/pkgs/include` instead of `/QOpenSys/pkgs/include/libiconv`. This makes it easier to build packages against GNU libiconv instead of the PASE iconv library. Compatibility symlinks have been created in `/QOpenSys/pkgs/include/libiconv` for existing packages that expect them there.

## Closing

Well, that was April! Kinda boring, but you know what they say: "April showers, bring May flowers" :wink:.
