---
layout: post
title:  "Messing with the AIX linker"
desc:   Linking can get weird...
---

In the previous post, I showed how you can change the runtime search path in the XCOFF header. I also pointed out that you can change the PATH for a given library by passing the full path to the library to the linker. What I failed to mention is that the same technique can be used to do some interesting tricks.

First, lets make a shared library. It'll have two methods: `bar` and `baz`:

```c
int bar(int a, int b)
{
    return a | b;
}

int baz(int a, int b)
{
    return a & b;
}
```

We can create a shared object like so:

```bash
$ gcc -shared -o libfoo.so libfoo.c
```

Now we'll create a main binary:

```c
#include <stdio.h>

extern int bar(int, int);
extern int baz(int, int);

int main()
{
    int a = 4, b = 5;
    printf("bar(%d, %d) = %d\n", a, b, bar(a, b));
    printf("baz(%d, %d) = %d\n", a, b, baz(a, b));
    return 0;
}
```

If we try to compile it and link to libfoo.so, we'll get errors, though:

```bash
$ gcc -o foo foo.c -lfoo -L.
ld: 0706-006 Cannot find or open library file: -l foo
        ld:open(): No such file or directory
collect2: error: ld returned 255 exit status
```

The problem is that we have a shared object and not a shared library. On most other platforms these mean the same thing, but not on AIX/PASE! We have to archive it first:

```bash
$ ar crlo libfoo.a libfoo.so

$ gcc -o foo foo.c -lfoo -L.

$ ./foo
bar(4, 5) = 5
baz(4, 5) = 4
```

If we dump the header, we can see that we linked against `libfoo.a`, with member `libfoo.so`:

```bash
$ dump -H foo   

foo:

                        ***Loader Section***
                      Loader Header Information
VERSION#         #SYMtableENT     #RELOCent        LENidSTR
0x00000001       0x0000000d       0x0000002f       0x000000e9       

#IMPfilID        OFFidSTR         LENstrTBL        OFFstrTBL
0x00000003       0x0000038c       0x00000039       0x00000475       


                        ***Import File Strings***
INDEX  PATH                          BASE                MEMBER              
0      .:/usr/lib:/lib                                         
1                                    libc.a              shr.o               
2                                    libfoo.a            libfoo.so
```

Notice that `shr.o` isn't a .so. Most other platforms use .so to refer to a "shared object": an object that can be dynamically linked and loaded, vs a .o which is just an "object file" which can only be statically linked in to the program binary. On AIX/PASE, though, this is not the case and you can use either-or... or really any extension you want:

```bash
$ rm libfoo.a

$ cp libfoo.so chunky-bacon.flavor

$ ar crlo libfoo.a chunky-bacon.flavor

$ gcc -o foo foo.c -lfoo -L.

$ ./foo
bar(4, 5) = 5
baz(4, 5) = 4

dump -H foo   

foo:

                        ***Loader Section***
                      Loader Header Information
VERSION#         #SYMtableENT     #RELOCent        LENidSTR
0x00000001       0x0000000d       0x0000002f       0x000000e9       

#IMPfilID        OFFidSTR         LENstrTBL        OFFstrTBL
0x00000003       0x0000038c       0x00000039       0x00000475       


                        ***Import File Strings***
INDEX  PATH                          BASE                MEMBER              
0      .:/usr/lib:/lib                                         
1                                    libc.a              shr.o               
2                                    libfoo.a            chunky-bacon.flavor
```

