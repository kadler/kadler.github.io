---
layout: single
title: Understanding the PPC TOC
layout: single
categories: ppc toc aix pase
---

The POWER and PowerPC (PPC) architectures use a Table of Contents (TOC) to hold addresses for position-independent code (PIC). Enough jargon for you? Let's dive in and see what this is all about.

## You Can't PIC Your Family...

What exactly is Position-Independent Code (PIC)? As always, [Wikipedia](https://en.wikipedia.org/wiki/Position-independent_code) has
a good article about it. To first understand PIC, we must first understand non-PIC or absolute code. Let's start with an example:

```c
#include <stdio.h>

int add(int x, int y)
{
  return x + y;
}

int main()
{
  return add(10, 4);
}
```

Compiling this example with `gcc -O2 -fno-inline pic.c` in PASE (or 64-bit AIX) gives the following disassembly (with `objdump -d a.out`):

*NOTE: We need to use `-fno-inline` or gcc will pre-compute the result of the addition and completely eliminate the function. This is
great for efficiency, but not great for examples*

```text
0000000010000480 <.main>:
    10000480:   7c 08 02 a6     mflr    r0
    10000484:   38 80 00 04     li      r4,4
    10000488:   38 60 00 0a     li      r3,10
    1000048c:   f8 01 00 10     std     r0,16(r1)
    10000490:   f8 21 ff 91     stdu    r1,-112(r1)
    10000494:   48 00 00 31     bl      100004c4 <.add>
    10000498:   38 21 00 70     addi    r1,r1,112
    1000049c:   e8 01 00 10     ld      r0,16(r1)
    100004a0:   7c 63 07 b4     extsw   r3,r3
    100004a4:   7c 08 03 a6     mtlr    r0
    100004a8:   4e 80 00 20     blr

00000000100004c4 <.add>:
    100004c4:   7c 63 22 14     add     r3,r3,r4
    100004c8:   4e 80 00 20     blr
```

Here, main sets up the two arguments by putting 10 in to `r3` and 4 in to `r4` using the `li` (load immediate) instruction:

```
    10000484:   38 80 00 04     li      r4,4
    10000488:   38 60 00 0a     li      r3,10
```

Then, register `r0` and `r1` are saved off. The PPC64 Application Binary Interface (ABI) says these are volatile registers
and must be saved before calling a function if you need them later. Technically, the `add` function does not modify them
so they wouldn't need to be saved, but the compiler did not know that.

```
    1000048c:   f8 01 00 10     std     r0,16(r1)
    10000490:   f8 21 ff 91     stdu    r1,-112(r1)
```

Finally, we call the `add` function by using the `bl` instruction (branch and set the link register). The `bl` instruction
saves off the next instruction address (here: 0x10000518) from the Instruction Address Register (IAR, sometimes called the
Program Counter or PC) in to the link register so that `add` can return back to where we left off in the main function.

```
    10000494:   48 00 00 31     bl      100004c4 <.add>
```

So one thing to note here is that we are doing a direct branch. On PPC, there are 3 branching operations:

- branch to the address stored in the instruction (`b`)
- branch to the address in the link register (`blr`)
- branch to the address in the counter register (`bctr`)

Due to all PPC instructions being 32 bits in size and some of those bits determine what kind of instruction it is, whether
the branch is relative or absolute, and whether to set the link register, there are only 24 bits to store the address in
the instruction. Here, the offset is 0x000030, which when added to 0x10000494 gives the address of `.add`.

When the branch instruction is executed, it will start executing our `add` function. Here, it adds the 2 arguments and
stores the output in the return register `r3` (which happens to be the first input argument register as well).

```
    100004c4:   7c 63 22 14     add     r3,r3,r4
```

Finally, we return back to our caller by branching to the address stored in the link register (set previously by the `bl`
instruction).

```
    100004c8:   4e 80 00 20     blr
```

Hopefully that was pretty easy to follow, but to summarize, when using non-PIC code, a function call is basically:

1. Set the input argument registers
2. Save any volatile registers needed later
3. Branch to a relative or absolute address
4. *Function call happens*
5. Continue executing after the function call


The key to non-PIC code is that the function's address was hard-coded at link time when the program was created. This is ok,
because the program determines where it will be loaded in to memory so we can be sure that our hard-coded function address
will always be the same. What happens if we want to call a function that is not in our program - like say `printf`, which is
in the libc shared library?

## ... But You Can PIC Your Nose!

When calling a function in a shared library, we will not know where the dynamic linker will place that shared library in
memory, so we can't hard-code its address at link time. Instead, we need to use some indirection. That is where PIC comes
in to play

Let's look at a new example here - your standard "Hello world" application:

```c
#include <stdio.h>

int main()
{
  return printf("I'm PIC!\n");
}
```

If we build this like above, we get the following from `objdump -d a.out`:

```
0000000010000480 <.main>:
    10000480:   7c 08 02 a6     mflr    r0
    10000484:   e8 62 00 78     ld      r3,120(r2)
    10000488:   f8 01 00 10     std     r0,16(r1)
    1000048c:   f8 21 ff 91     stdu    r1,-112(r1)
    10000490:   48 00 00 31     bl      100004c0 <.printf>
    10000494:   e8 41 00 28     ld      r2,40(r1)
    10000498:   38 21 00 70     addi    r1,r1,112
    1000049c:   e8 01 00 10     ld      r0,16(r1)
    100004a0:   7c 08 03 a6     mtlr    r0
    100004a4:   4e 80 00 20     blr

00000000100004c0 <.printf>:
    100004c0:   e9 82 00 80     ld      r12,128(r2)
    100004c4:   f8 41 00 28     std     r2,40(r1)
    100004c8:   e8 0c 00 00     ld      r0,0(r12)
    100004cc:   e8 4c 00 08     ld      r2,8(r12)
    100004d0:   7c 09 03 a6     mtctr   r0
    100004d4:   4e 80 04 20     bctr
```

This looks quite similar to the previous example, though how we load our arguments has changed slightly. But still, we make a relative branch to `.printf`. But didn't I just say we couldn't calculate `printf`'s address at program generation?

### glink and Special Sauce
Indeed we cannot, but if you look at the `.printf` assembly you might notice that it's way too simple to be the actual `printf` code. And what's with that `.` in the name? Well, this is actually a "glink stub". All external functions are called using this same stub code, so let's take a closer look.

First we load the target function's TOC entry in to `r12` (Hey we're finally getting to close to talking about the TOC!).

```
    100004c0:   e9 82 00 80     ld      r12,128(r2)
```

Let's hold off on the details of this for a second. Next, we save off the current TOC pointer on the stack.

```
    100004c4:   f8 41 00 28     std     r2,40(r1)
```

Then we load the function's address in to `r0` and its TOC pointer in to `r2` (from the TOC entry).

```
    100004c8:   e8 0c 00 00     ld      r0,0(r12)
    100004cc:   e8 4c 00 08     ld      r2,8(r12)
```

Finally, we call the function

```
    100004d0:   7c 09 03 a6     mtctr   r0
    100004d4:   4e 80 04 20     bctr
```

Note that we used the counter register (`ctr`) instead of the link register. Since the link register is already used
as the return address, we can't use it here, so the only option is the counter register. This also means that the called function won't return to the glink stub, but all the way back to its caller:

```
main
     -----> .printf
                    -----> printf
     <--------------------
```

## TOC'n Bout My Generation

So we saw above that the TOC is used when calling external functions. But how exactly does this get set up?


You can think of the TOC as a giant array of pointers. For glink code, each pointer in the TOC links to a structure containing
3 pointers within it. The structure looks like this:

```
offset 0: target function starting address
offset 8: target function's TOC anchor
offset 12: reserved for compiler use
```

Each XCOFF binary contains information on where the TOC starts and what entries are in the TOC. The system linker/loader is responsible for setting up these TOC entries when the program or shared object is loaded in to memory. So, here the system loader found a reference to `printf` from the libc.a. If the object was not loaded, it loads it, then looks up the address for `printf` from this loaded object as well as that object's TOC anchor. Then it saves this information in to the TOC entry. The reserved field in the TOC entry is not used by either C or C++ (I think it might be used by Fortran or COBOL, but I'm not sure).


When the compiler is run, it does not know what TOC entry a given function will use. Instead, it leaves the entry (offset) as 0. The linker is then responsible for coalescing all symbols that need TOC entries and assigning them indexes in to the TOC. Once these entries are set up, it fixes up the references in the code to use the correct offset for that entry.
