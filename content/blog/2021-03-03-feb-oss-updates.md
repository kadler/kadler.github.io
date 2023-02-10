+++
title = "IBM i Open Source Updates February 2021"
aliases = [ "2021/03/03/feb-oss-updates.html",]
slug = "2021-03-03-feb-oss-updates"

[taxonomies]
tags = [ "ibmi-oss-updates",]
+++

New year, new rpm updates! In this post, we'll go over updates for both January and February.

<!-- more -->

## New Packages

No new packages.

## Package Updates

### util-linux

Previously, we only shipped the libuuid subset of this package, but now we have enabled various other utilities:

- cal

It's a known fact that date and time math is the most complicated math in the universe, especially in a pandemic. If you need a reminder and can't find a calendar anywhere, but have an SSH terminal available just type `cal` to bring up the current month's calendar:

```sh
     March 2021     
Su Mo Tu We Th Fr Sa
    1  2  3  4  5  6
 7  8  9 10 11 12 13
14 15 16 17 18 19 20
21 22 23 24 25 26 27
28 29 30 31
```

- rev

Ever do some ASCII/EBCDIC translations and it took the wrong turn at Albuqurque and came out backwards? Well, `rev` will reverse each line of text you feed it:

```sh
echo 'Paul is dead' | rev
daed si luaP
```

- uuidgen

If you need to generate a [Universally unique identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier), `uuidgen` can fit the bill, supporting all manner of UUIDs:

```sh
uuidgen --random
uuidgen --time
uuidgen --sha1 --namespace @dns --name "www.example.com"
uuidgen --sha1 --namespace @url --name "https://kadler.io"
```

- hexdump

Finally, my favorit addition: `hexdump`! How many times have you had bad ASCII/EBCDIC conversions or ASCII/UTF-8 differences or CRLF/LF line feed issues or a variety of other problems and just want to look at the raw data of a file? You could use the hex option in DSPF, but who wants to go to a green screen when you can use `hexdump` from your SSH terminal?

While `od -x` _does work_, `hexdump` has a variety of options to make the output nicer to view and use. My favorite is `hexdump -C` which shows the hex bytes on the left and the ASCII equivalent on the right.

```txt
hexdump -C test_rs.py 
00000000  69 6d 70 6f 72 74 20 73  71 6c 61 6c 63 68 65 6d  |import sqlalchem|
00000010  79 20 61 73 20 73 61 0a  0a 65 6e 67 69 6e 65 20  |y as sa..engine |
00000020  3d 20 73 61 2e 63 72 65  61 74 65 5f 65 6e 67 69  |= sa.create_engi|
00000030  6e 65 28 22 69 62 6d 69  3a 2f 2f 2a 43 55 52 52  |ne("ibmi://*CURR|
00000040  45 4e 54 40 6c 6f 63 61  6c 68 6f 73 74 22 29 0a  |ENT@localhost").|
00000050  0a 63 6e 78 6e 20 3d 20  65 6e 67 69 6e 65 2e 63  |.cnxn = engine.c|
00000060  6f 6e 6e 65 63 74 28 29  0a 6d 65 74 61 64 61 74  |onnect().metadat|
00000070  61 20 3d 20 73 61 2e 4d  65 74 61 44 61 74 61 28  |a = sa.MetaData(|
00000080  29 0a 74 61 62 6c 65 20  3d 20 73 61 2e 54 61 62  |).table = sa.Tab|
00000090  6c 65 28 27 44 45 4d 4f  54 42 4c 31 27 2c 20 6d  |le('DEMOTBL1', m|
000000a0  65 74 61 64 61 74 61 2c  20 61 75 74 6f 6c 6f 61  |etadata, autoloa|
000000b0  64 3d 54 72 75 65 2c 20  61 75 74 6f 6c 6f 61 64  |d=True, autoload|
000000c0  5f 77 69 74 68 3d 65 6e  67 69 6e 65 2c 20 73 63  |_with=engine, sc|
000000d0  68 65 6d 61 3d 27 50 59  44 45 4d 4f 31 27 29 0a  |hema='PYDEMO1').|
000000e0  0a 71 75 65 72 79 20 3d  20 73 61 2e 73 65 6c 65  |.query = sa.sele|
000000f0  63 74 28 5b 74 61 62 6c  65 5d 29 0a 0a 72 65 73  |ct([table])..res|
00000100  75 6c 74 20 3d 20 63 6e  78 6e 2e 65 78 65 63 75  |ult = cnxn.execu|
00000110  74 65 28 71 75 65 72 79  29 0a 72 65 73 75 6c 74  |te(query).result|
00000120  20 3d 20 72 65 73 75 6c  74 2e 66 65 74 63 68 61  | = result.fetcha|
00000130  6c 6c 28 29 0a 0a 23 20  70 72 69 6e 74 20 66 69  |ll()..# print fi|
00000140  72 73 74 20 65 6e 74 72  79 0a 70 72 69 6e 74 28  |rst entry.print(|
00000150  72 65 73 75 6c 74 5b 30  5d 29 0a 0a              |result[0])..|
0000015c
```

### bash

- The `liblist` builtin was updated to work properly when the job CCSID is 65535.
- The `-K` option to the `cl` builtin now works the same as `system` and the help text updated to note that it is only supported when `-s` is also specified.

### perl

The [Cwd](https://perldoc.perl.org/Cwd) module now works properly inside a chroot.

### ncursees

The ncurses6-config and ncursesw6-config scripts and associated man pages were moved to ncurses-devel.

### slang

slang is now built with ncurses and uses the ncurses terminfo database, allowing out of the box 256-color support and 24-bit color support when `COLORTERM=truecolor` environment variable is set.

Just look at this fancy beast!

{{ figure(src="/images/mc-24bit.png",
       position="center"
       caption_position="left",
       caption="Midnight Commander, in glorious 24-bit color",
       caption_style="font-weight: bold; font-style: italic;") }}

### nginx

NGINX was patched to understand IBM i special authorities a bit better. It no longer requires to be running as "root" (ie. QSECOFR) to use the user directive. Instead, any user with `*ALLOBJ` authority can do so.

In addition, the default port was changed to port 80 always instead of 8000 when not run as "root". Of course, these port usages are still subject to [IBM i TCP/IP Port Restrictions](https://www.ibm.com/support/pages/tcpip-port-restrictions).

### Other Updates

- nodejs10 was updated to [10.23.1](https://nodejs.org/en/blog/release/v10.23.1/).
- nodejs12 was updated to [12.20.1](https://nodejs.org/en/blog/release/v12.20.1/).
- nodejs14 was updated to [14.15.4](https://nodejs.org/en/blog/release/v14.15.4/).
- libuv was updated to [1.40.0](https://github.com/libuv/libuv/releases/tag/v1.40.0) and [1.41.0](https://github.com/libuv/libuv/releases/tag/v1.41.0)
- openssl was updated to [1.1.1i](https://www.openssl.org/news/openssl-1.1.1-notes.html)

## Closing

So far the updates have been pretty quiet, but there are some bigger updates coming. As always, be sure to check out next months update for more!
