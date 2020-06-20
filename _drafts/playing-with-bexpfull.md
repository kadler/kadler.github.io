foo.c:
```
#include <stdio.h>
#include <string.h>

int foo(char* f)
{
        int i = 34;

        strcpy(f, "asdf");
        return i;
}

void bar()
{
        printf("strcpy = %p\n", &strcpy);
}
```

test.c:
```
#include <stdio.h>
#include <string.h>

int foo(char*);
void bar(void);

int main() 
{
    char d[100];
    strcpy(d, "asdfasdfa");

    printf("&foo    = %p\n", &foo);
    printf("&bar    = %p\n", &bar);
    printf("&strcpy = %p\n", &strcpy);
    bar();

    return foo(d);
}
```

```
$ gcc -shared -o libfoo.so foo.c
$ gcc -o test test.c ./libfoo.so

$ dump -X64 -Tv libfoo.so

libfoo.so:

                        ***Loader Section***

                        ***Loader Symbol Table Information***
[Index]      Value      Scn     IMEX Sclass   Type           IMPid Name

[0]     0x20000568    .data              RW SECdef        [noIMid] __rtinit
[1]     0x00000000    undef      IMP     DS EXTref libgcc_s.so.1(shr_64.o) __cxa_finalize
[2]     0x0000fe00    undef      IMP     XO EXTref libc.a(shr_64.o) ___strcpy64
[3]     0x00000000    undef      IMP     DS EXTref libc.a(shr_64.o) printf
[4]     0x200005f0    .data      EXP     DS   Ldef        [noIMid] __init_aix_libgcc_cxa_atexit
[5]     0x20000650    .data      EXP     DS   Ldef        [noIMid] _GLOBAL__AIXI_libfoo_so
[6]     0x20000668    .data      EXP     DS   Ldef        [noIMid] _GLOBAL__AIXD_libfoo_so
[7]     0x20000690    .data      EXP     DS   Ldef        [noIMid] foo
[8]     0x200006a8    .data      EXP     DS   Ldef        [noIMid] bar

$ dump -X64 -Tv test

test:

                        ***Loader Section***

                        ***Loader Symbol Table Information***
[Index]      Value      Scn     IMEX Sclass   Type           IMPid Name

[0]     0x20000f68    .data              RW SECdef        [noIMid] __rtinit
[1]     0x00000000    undef      IMP     RW EXTref libc.a(shr_64.o) errno
[2]     0x0000fe00    undef      IMP     XO EXTref libc.a(shr_64.o) ___strcpy64
[3]     0x00000000    undef      IMP     DS EXTref libc.a(shr_64.o) __mod_init
[4]     0x00000000    undef      IMP     DS EXTref libc.a(shr_64.o) calloc
[5]     0x00000000    undef      IMP     DS EXTref libc.a(shr_64.o) exit
[6]     0x00000000    undef      IMP     DS EXTref libc.a(shr_64.o) printf
[7]     0x00000000    undef      IMP     DS EXTref libc.a(shr_64.o) __assert
[8]     0x00000000    undef      IMP     RW EXTref libc.a(shr_64.o) __n_pthreads
[9]     0x00000000    undef      IMP     BS EXTref libc.a(shr_64.o) __crt0v
[10]    0x00000000    undef      IMP     BS EXTref libc.a(shr_64.o) __malloc_user_defined_name
[11]    0x00000000    undef      IMP     DS EXTref     ./libfoo.so _GLOBAL__AIXI_libfoo_so
[12]    0x00000000    undef      IMP     DS EXTref     ./libfoo.so _GLOBAL__AIXD_libfoo_so
[13]    0x00000000    undef      IMP     DS EXTref     ./libfoo.so foo
[14]    0x00000000    undef      IMP     DS EXTref     ./libfoo.so bar
[15]    0x20000fe8    .data    ENTpt     DS SECdef        [noIMid] __start
```
```
$ gcc -shared -o libfoo.so -Wl,-bexpfull foo.c
$ gcc -o test test.c ./libfoo.so

$ dump -X64 -Tv libfoo.so
libfoo.so:

                        ***Loader Section***

                        ***Loader Symbol Table Information***
[Index]      Value      Scn     IMEX Sclass   Type           IMPid Name

[0]     0x20000570    .data              RW SECdef        [noIMid] __rtinit
[1]     0x00000000    undef      IMP     DS EXTref libgcc_s.so.1(shr_64.o) __cxa_finalize
[2]     0x0000fe00    undef      IMP     XO EXTref libc.a(shr_64.o) ___strcpy64
[3]     0x00000000    undef      IMP     DS EXTref libc.a(shr_64.o) printf
[4]     0x20000550    .data      EXP     RW   Ldef        [noIMid] __dso_handle
[5]     0x20000568    .data      EXP     RW   Ldef        [noIMid] __gcc_unwind_dbase
[6]     0x200005f8    .data      EXP     DS   Ldef        [noIMid] __init_aix_libgcc_cxa_atexit
[7]     0x20000610    .data      EXP     DS   Ldef        [noIMid] _GLOBAL__D_65535_0___dso_handle
[8]     0x20000628    .data      EXP     DS   Ldef        [noIMid] _GLOBAL__FI_libfoo_so
[9]     0x20000640    .data      EXP     DS   Ldef        [noIMid] _GLOBAL__FD_libfoo_so
[10]    0x20000658    .data      EXP     DS   Ldef        [noIMid] _GLOBAL__AIXI_libfoo_so
[11]    0x20000670    .data      EXP     DS   Ldef        [noIMid] _GLOBAL__AIXD_libfoo_so
[12]    0x20000688    .data      EXP     DS SECdef        [noIMid] strcpy
[13]    0x20000698    .data      EXP     DS   Ldef        [noIMid] foo
[14]    0x200006b0    .data      EXP     DS   Ldef        [noIMid] bar
[15]    0x20000718     .bss      EXP     RW    BSS        [noIMid] __rtld

$ dump -X64 -Tv test

test:

                        ***Loader Section***

                        ***Loader Symbol Table Information***
[Index]      Value      Scn     IMEX Sclass   Type           IMPid Name

[0]     0x20000f48    .data              RW SECdef        [noIMid] __rtinit
[1]     0x00000000    undef      IMP     RW EXTref libc.a(shr_64.o) errno
[2]     0x00000000    undef      IMP     DS EXTref libc.a(shr_64.o) __mod_init
[3]     0x00000000    undef      IMP     DS EXTref libc.a(shr_64.o) calloc
[4]     0x00000000    undef      IMP     DS EXTref libc.a(shr_64.o) exit
[5]     0x00000000    undef      IMP     DS EXTref libc.a(shr_64.o) __assert
[6]     0x00000000    undef      IMP     DS EXTref libc.a(shr_64.o) printf
[7]     0x00000000    undef      IMP     RW EXTref libc.a(shr_64.o) __n_pthreads
[8]     0x00000000    undef      IMP     BS EXTref libc.a(shr_64.o) __crt0v
[9]     0x00000000    undef      IMP     BS EXTref libc.a(shr_64.o) __malloc_user_defined_name
[10]    0x00000000    undef      IMP     DS EXTref     ./libfoo.so _GLOBAL__AIXI_libfoo_so
[11]    0x00000000    undef      IMP     DS EXTref     ./libfoo.so _GLOBAL__AIXD_libfoo_so
[12]    0x00000000    undef      IMP     DS EXTref     ./libfoo.so strcpy
[13]    0x00000000    undef      IMP     DS EXTref     ./libfoo.so foo
[14]    0x00000000    undef      IMP     DS EXTref     ./libfoo.so bar
[15]    0x00000000    undef      IMP     BS EXTref     ./libfoo.so __rtld
[16]    0x20000fc8    .data    ENTpt     DS SECdef        [noIMid] __start
```

foo.exp:
```
strcpy list
__rtld list
__dso_handle list
__gcc_unwind_dbase list
_GLOBAL__D_65535_0___dso_handle list
_GLOBAL__FI_libfoo_so list
_GLOBAL__FD_libfoo_so list
```

```
$ gcc -shared -o libfoo.so -Wl,-bexpfull -Wl,-bE:foo.exp test.c 
$ dump -X64 -Tv libfoo.so 
libfoo.so:

                        ***Loader Section***

                        ***Loader Symbol Table Information***
[Index]      Value      Scn     IMEX Sclass   Type           IMPid Name

[0]     0x20000570    .data              RW SECdef        [noIMid] __rtinit
[1]     0x00000000    undef      IMP     DS EXTref libgcc_s.so.1(shr_64.o) __cxa_finalize
[2]     0x0000fe00    undef      IMP     XO EXTref libc.a(shr_64.o) ___strcpy64
[3]     0x00000000    undef      IMP     DS EXTref libc.a(shr_64.o) printf
[4]     0x20000550    .data              RW   Ldef        [noIMid] __dso_handle
[5]     0x20000568    .data              RW   Ldef        [noIMid] __gcc_unwind_dbase
[6]     0x200005f8    .data      EXP     DS   Ldef        [noIMid] __init_aix_libgcc_cxa_atexit
[7]     0x20000610    .data              DS   Ldef        [noIMid] _GLOBAL__D_65535_0___dso_handle
[8]     0x20000628    .data              DS   Ldef        [noIMid] _GLOBAL__FI_libfoo_so
[9]     0x20000640    .data              DS   Ldef        [noIMid] _GLOBAL__FD_libfoo_so
[10]    0x20000658    .data      EXP     DS   Ldef        [noIMid] _GLOBAL__AIXI_libfoo_so
[11]    0x20000670    .data      EXP     DS   Ldef        [noIMid] _GLOBAL__AIXD_libfoo_so
[12]    0x20000688    .data              DS SECdef        [noIMid] strcpy
[13]    0x20000698    .data      EXP     DS   Ldef        [noIMid] foo
[14]    0x200006b0    .data      EXP     DS   Ldef        [noIMid] bar
[15]    0x20000718     .bss              RW    BSS        [noIMid] __rtld
```

