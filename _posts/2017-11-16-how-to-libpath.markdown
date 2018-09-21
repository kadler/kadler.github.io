---
layout: single
title:  "Mucking with the Runtime Library Search Path on PASE"
date:   2017-11-17 12:13:14 -06:00
desc:   Find out how the search path gets created in an AIX/PASE binary
categories: libpath pase
---

In my last blog I showed how the `LIBPATH` gets used and also how the runtime search path in the binary gets used. `LIBPATH` is obviously set as an environment variable, but how does that runtime search path get generated? Let's explore!

```c
#include <stdio.h>

int main(int argc, char** argv)
{
  printf("Hello world!\n");
  return 0;
}
```

Above is a pretty standard "Hello World" program in C. Let's compile it and look at its search path

```bash
$ gcc -o hello hello.c

$ dump -H hello

hello:

                        ***Loader Section***
                      Loader Header Information
VERSION#         #SYMtableENT     #RELOCent        LENidSTR
0x00000001       0x0000000b       0x0000002b       0x000000d3       

#IMPfilID        OFFidSTR         LENstrTBL        OFFstrTBL
0x00000002       0x0000032c       0x00000039       0x000003ff       


                        ***Import File Strings***
INDEX  PATH                          BASE                MEMBER              
0      /QOpenSys/opt/freeware/bin/../lib/gcc/powerpc-ibm-aix7.1.0.0/4.8.3:/QOpenSys/opt/freeware/bin/../lib/gcc:/QOpenSys/opt/freeware/bin/../lib/gcc/powerpc-ibm-aix7.1.0.0/4.8.3/../../..:/usr/lib:/lib                                         
1                                    libc.a              shr.o
```

What the what? Where did all that junk come from?

The default behavior for the linker (`ld`) is to add whatever directories are passed to the linker to find libraries (via the `-L` argument) as well as the default search path (`/usr/lib:/lib`). We can see that GCC is automatically adding some of its own library directories to be searched whenever you tell it to compile a binary:

- /QOpenSys/opt/freeware/bin/../lib/gcc/powerpc-ibm-aix7.1.0.0/4.8.3
- /QOpenSys/opt/freeware/bin/../lib/gcc
- /QOpenSys/opt/freeware/bin/../lib/gcc/powerpc-ibm-aix7.1.0.0/4.8.3/../../..

If we canonicalize the relative paths, they then become:

- /QOpenSys/opt/freeware/lib/gcc/powerpc-ibm-aix7.1.0.0/4.8.3
- /QOpenSys/opt/freeware/lib/gcc
- /QOpenSys/opt/freeware/lib

## "It's a bypass! Gotta build bypasses!"
Let's bypass GCC and link the binary ourselves:

```bash
$ gcc -c -o hello.o hello.c

$ ld -o hello hello.o /QOpenSys/usr/lib/crt0.o -lc
```

We have to link in `crt0.o` as we define a `main()` function, but the default entry point for a program is `__start` on AIX, so there's a special glue module that does the necessary setup from the `__start` entry point to call `main()`. We also need to link with `libc`, to get access to `printf`. Let's look at the `dump` output now:

```bash
$ dump -H hello

hello:

                        ***Loader Section***
                      Loader Header Information
VERSION#         #SYMtableENT     #RELOCent        LENidSTR
0x00000001       0x00000008       0x00000010       0x0000001e       

#IMPfilID        OFFidSTR         LENstrTBL        OFFstrTBL
0x00000002       0x000001a0       0x00000039       0x000001be       


                        ***Import File Strings***
INDEX  PATH                          BASE                MEMBER              
0      /usr/lib:/lib                                                         
1                                    libc.a              shr.o
```

See now it has only added the default search path, since we did not pass any additional `-L` arguments to `ld`. Let's see what happens when we add a path:

```bash
$ ld -o hello hello.o /QOpenSys/usr/lib/crt0.o -lc -L/this/path/is/bad/and/you/should/feel/bad

$ dump -H hello

hello:

                        ***Loader Section***
                      Loader Header Information
VERSION#         #SYMtableENT     #RELOCent        LENidSTR
0x00000001       0x00000008       0x00000010       0x00000048       

#IMPfilID        OFFidSTR         LENstrTBL        OFFstrTBL
0x00000002       0x000001a0       0x00000039       0x000001e8       


                        ***Import File Strings***
INDEX  PATH                          BASE                MEMBER              
0      /this/path/is/bad/and/you/should/feel/bad:/usr/lib:/lib                                         
1                                    libc.a              shr.o
```

Boom! We added a path to the runtime search path. Sometimes you really don't want this, though. Let's say you're compiling a library and an application. The library is called `libfoo.a` and the binary is called `foo`. While building, you first build `libfoo.a` in to the current directory, then you go to build `foo`. Since `foo` needs to link to `libfoo`, you need to tell `ld` where to find it during build time. You might do something like this:

```bash
$ ld -o foo foo.o /QOpenSys/usr/lib/crt0.o -L. -lfoo -lc

$ dump -H foo

foo:

                        ***Loader Section***
                      Loader Header Information
VERSION#         #SYMtableENT     #RELOCent        LENidSTR
0x00000001       0x00000008       0x00000010       0x00000048       

#IMPfilID        OFFidSTR         LENstrTBL        OFFstrTBL
0x00000002       0x000001a0       0x00000039       0x000001e8       


                        ***Import File Strings***
INDEX  PATH                          BASE                MEMBER              
0      .:/usr/lib:/lib                                         
1                                    libc.a              shr.o
2                                    libfoo.a            shr.o
```

Now when you install the application, you copy `foo` in to `/usr/bin` and `libfoo.a` in to `/usr/lib`. You run your application and everything works great (since `libfoo.a` gets loaded from `/usr/lib/libfoo.a` via the runtime path). Now though, you're doing some more development and you run `foo` but it gives a load error about missing symbols. What gives? Well, the directory you're in happens to have an old `libfoo.a` and is found first via `./libfoo.a` due to '.' being on the runtime search path before `/usr/lib`! That's no good! Heck, that could even be a security issue if your application could be tricked in to loading a malicious library that the attacker tricks you in to uploading.

So lets say we don't want to include these paths in our finished binary? How do we get rid of them. Well, `ld` has an option `-bnolibpath` that takes care of that:

```bash
$ ld -o foo foo.o /QOpenSys/usr/lib/crt0.o -bnolibpath -L. -lfoo -lc

$ dump -H foo

foo:

                        ***Loader Section***
                      Loader Header Information
VERSION#         #SYMtableENT     #RELOCent        LENidSTR
0x00000001       0x00000008       0x00000010       0x00000048       

#IMPfilID        OFFidSTR         LENstrTBL        OFFstrTBL
0x00000002       0x000001a0       0x00000039       0x000001e8       


                        ***Import File Strings***
INDEX  PATH                          BASE                MEMBER              
0      /usr/lib:/lib                                           
1                                    libc.a              shr.o
2                                    libfoo.a            shr.o
```

One thing to know about the -bnolibpath option is that it isn't hard-coded to `/usr/lib:/lib`, but will use the value of the `LIBPATH` environment variable if it is set:

```bash
$ LIBPATH=/QOpenSys/usr/lib ld -o foo foo.o /QOpenSys/usr/lib/crt0.o -bnolibpath -L. -lfoo -lc

$ dump -H foo

foo:

                        ***Loader Section***
                      Loader Header Information
VERSION#         #SYMtableENT     #RELOCent        LENidSTR
0x00000001       0x00000008       0x00000010       0x00000048       

#IMPfilID        OFFidSTR         LENstrTBL        OFFstrTBL
0x00000002       0x000001a0       0x00000039       0x000001e8       


                        ***Import File Strings***
INDEX  PATH                          BASE                MEMBER              
0      /QOpenSys/usr/lib                                       
1                                    libc.a              shr.o
2                                    libfoo.a            shr.o
```

Or you can use the `-blibpath` option to explicitly set it:

```bash
$ ld -o foo foo.o /QOpenSys/usr/lib/crt0.o -L. -lfoo -lc -blibpath:/opt/mypath:/QOpenSys/usr/lib

$ dump -H foo

foo:

                        ***Loader Section***
                      Loader Header Information
VERSION#         #SYMtableENT     #RELOCent        LENidSTR
0x00000001       0x00000008       0x00000010       0x00000048       

#IMPfilID        OFFidSTR         LENstrTBL        OFFstrTBL
0x00000002       0x000001a0       0x00000039       0x000001e8       


                        ***Import File Strings***
INDEX  PATH                          BASE                MEMBER              
0      /opt/mypath:/QOpenSys/usr/lib                           
1                                    libc.a              shr.o
2                                    libfoo.a            shr.o
```

There's one other thing to know: you can also hard-code the path to a specific library so that it will not use the search path at all. You do this by passing the full path to the library as an input to `ld` instead of having `ld` find it via the `-l` option:

```bash
$ ld -o hello hello.o /QOpenSys/usr/lib/crt0.o /QOpenSys/usr/lib/libc.a

$ dump -H hello

hello:

                        ***Loader Section***
                      Loader Header Information
VERSION#         #SYMtableENT     #RELOCent        LENidSTR
0x00000001       0x00000008       0x00000010       0x00000048       

#IMPfilID        OFFidSTR         LENstrTBL        OFFstrTBL
0x00000002       0x000001a0       0x00000039       0x000001e8       


                        ***Import File Strings***
INDEX  PATH                          BASE                MEMBER              
0      /usr/lib:/lib                                                         
1      /QOpenSys/usr/lib             libc.a              shr.o
```

You can see above that the `PATH` field is set for index 2, so now `libc.a` will always be loaded from `/QOpenSys/usr/lib/libc.a` and will ignore the runtime search path as well as the `LIBPATH` environment variable. If that's not what you want, you can tell the linker to ignore qualified library paths given on the command line and always search for these at runtime with the `-bnoipath` option:


```bash
$ ld -o hello hello.o /QOpenSys/usr/lib/crt0.o -bnoipath /QOpenSys/usr/lib/libc.a

$ dump -H hello

hello:

                        ***Loader Section***
                      Loader Header Information
VERSION#         #SYMtableENT     #RELOCent        LENidSTR
0x00000001       0x00000008       0x00000010       0x00000048       

#IMPfilID        OFFidSTR         LENstrTBL        OFFstrTBL
0x00000002       0x000001a0       0x00000039       0x000001e8       


                        ***Import File Strings***
INDEX  PATH                          BASE                MEMBER              
0      /usr/lib:/lib                                                         
1                                    libc.a              shr.o
```

Ok, so we've learned about the `-bnolibpath`, `-blibpath`, and `-bnoipath` `ld` options, but most of the time we're not going to be calling `ld` directly, but instead we let our compiler handle calling the linker. How do we tell `gcc` to customize these options? Well, `gcc` has a way to pass linker flags to `ld` via the `-Wl,` option. Just prefix the linker option with `-Wl,` and pass it to `gcc`:

```bash
$ gcc -o hello hello.c -Wl,-bnolibpath

$ dump -H hello

hello:

                        ***Loader Section***
                      Loader Header Information
VERSION#         #SYMtableENT     #RELOCent        LENidSTR
0x00000001       0x00000008       0x00000010       0x00000048       

#IMPfilID        OFFidSTR         LENstrTBL        OFFstrTBL
0x00000002       0x000001a0       0x00000039       0x000001e8       


                        ***Import File Strings***
INDEX  PATH                          BASE                MEMBER              
0      /usr/lib:/lib                                                         
1                                    libc.a              shr.o
```

## And that's all I have to say about that. (For now?)

So what's the takeaway from all this?

I recommend using the `-blibpath` option to explicitly set your runtime library search path. This prevents GCC from adding weird directories to your search path, potentially problematic paths like '.' to your search path, but prevents your users from having to set the `LIBPATH` to find your stuff thus relegating `LIBPATH` for when a user installs the library in to a different path or you need to override an installed library with your own for debug/test reasons.