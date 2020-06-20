---
layout: single
title: Deciphering AIX and PASE Syscalls
layout: single
categories: ppc toc aix pase
---

One interesting thing about AIX is that system calls (syscalls) are implemented differently than on other platforms - they are actually functions exported by the kernel!

## What's a Syscall?

A system call (or syscall) is a function provided by the kernel. System calls are usually created because they require some privilege that user-space code does not have. For instance, only the kernel is trusted to talk directly to hardware, so filesystem code must usually live in the kernel. If you want to open a file, you must ask the kernel to do it on your behalf, because you cannot read the disks directly.

A sample of system calls:

- `open` - open a handle to a file
- `read` - read from a file handle
- `write` - write to a file handle
- `exit` - stop the current process
- `fork` - create a copy of the current process
- `sbrk` - allocate or deallocate memory assigned to the process

A system call differs from calling a normal function call because the processor must switch states and enter kernel mode (called a context switch) when the call is made.

## Traditional System Calls

On most computers with separate privilege rings (user / kernel space separation) there is a processor instruction for entering kernel mode that can be used for system calls.

On x86_64 architecture, there are actually 3 methods:

- `int 0x80` - `int` is the interrupt instruction, causing the interrupt handler associated with the given number to be run. Interrupt 0x80 is reserved for system calls.
- `sysenter`
- `syscall`

On POWER/PowerPC, there is just `sc`.

The basic function is the same, though:
- load the syscall number in to the defined register
- load the sycall arguments in to the defined registers
- execute the sycall instruction

The syscall instruction causes the processor to switch state (among other things) and start executing in kernel mode in the syscall handler routine. This routine is responsible for mapping a sycall number to the actual function in the kernel which will be run. Usually, this is done by using a table of function pointers and using the syscall number as an index into the table (after bounds checking first!).

## 

Most people don't call syscalls directly anymore, however. Instead, user-mode wrappers are provided by the operating system's libraries such as libc. Thus on systems like Linux, you can just call the `write` function and GNU libc does the work of converting the function's arguments in to syscall arguments and calling the correct system call number for that platform.


## AIX "syscalls"

On AIX (and the IBM i PASE environment) libc does not provide system call wrappers, but instead the system calls are exported by `/unix`. On AIX, this is the kernel image, but in PASE a dummy one is provided by the SLIC (System Licensed Internal Code) kernel. This image is mapped in to every process. Let's take a look at how it works.


```
(dbx) stopi in kwrite
[1] stopi in kwrite
(dbx) run
[1] stopped in kwrite at 0x9000000002f1e50
0x9000000002f1e50 (kwrite)    e9820af8          ld   r12,0xaf8(r2)
(dbx) listi
0x9000000002f1e50 (kwrite)      e9820af8          ld   r12,0xaf8(r2)
0x9000000002f1e54 (kwrite+0x4)  f8410028         std   r2,0x28(r1)
0x9000000002f1e58 (kwrite+0x8)  e80c0000          ld   r0,0x0(r12)
0x9000000002f1e5c (kwrite+0xc)  e84c0008          ld   r2,0x8(r12)
0x9000000002f1e60 (kwrite+0x10) 7c0903a6       mtctr   r0
0x9000000002f1e64 (kwrite+0x14) 4e800420        bctr
```

Hmm, that looks like glink code that we looked at last time! Let's see where it takes us.

```
0x9000000002f1e64 (kwrite+0x14) 4e800420        bctr
(dbx) registers
  $r0:0x0000000000003610  $stkp:0x0ffffffffffff9c0   $toc:0x000000000000017e  
  $r3:0x0000000000000001    $r4:0x0000000100000b20    $r5:0x0000000000000006  
  $r6:0x0000000000000000    $r7:0x0fffffffffffffe0    $r8:0x0000000000000000  
  $r9:0x000000008a004428   $r10:0xb03490000cc00000   $r11:0xb03490000cc00f30  
 $r12:0x0900000000706050   $r13:0xbadc0ffee0ddf00d   $r14:0x0000000000000001  
 $r15:0x0ffffffffffffc68   $r16:0x0ffffffffffffc78   $r17:0x0800200140000000  
 $r18:0x0ffffffffffffed0   $r19:0x09fffffff000c8a0   $r20:0xbadc0ffee0ddf00d  
 $r21:0xbadc0ffee0ddf00d   $r22:0xbadc0ffee0ddf00d   $r23:0xbadc0ffee0ddf00d  
 $r24:0xbadc0ffee0ddf00d   $r25:0xbadc0ffee0ddf00d   $r26:0xbadc0ffee0ddf00d  
 $r27:0xbadc0ffee0ddf00d   $r28:0xbadc0ffee0ddf00d   $r29:0xbadc0ffee0ddf00d  
 $r30:0x0000000000000001   $r31:0x0000000000000006  
 $iar:0x09000000002f1e64   $msr:0x800000000282f032    $cr:0x8a000428  
$link:0x09000000002f18e0   $ctr:0x0000000000003610   $xer:0x04000001  
```

We're just about to branch to 0x3610. We can see that `r3` contains `1`, which was our file descriptor, `r4` contains the address of our string, and `r5` contains the length of the string. We've also loaded the functions TOC anchor, which is oddly 0x17e. Let's see what's at 0x3610.

```
0x0000000000003610 4cc63342       crorc   cr6,cr6,cr6
0x0000000000003614 44000002          sc   0x0
0x0000000000003618 4e800020         blr
0x000000000000361c 4e800020         blr
```

I'm not sure exactly what the `crorc` instruction is doing. As far as I can tell, it ensures that `cr6` (condition register bit 6) is set on. The more important instruction is the next one though - that's the `sc` instruction, which does the actual system call. But which system call number are we calling?

An astute reader would have recognized that 0x17e doesn't really appear to be a valid TOC address. Indeed, it is not, but instead it is the system call number to execute!


So when calling an AIX "system call", you really call the glink glue code provided by `/unix`. When the glue code is called, the code loads the glue code function information from the current TOC and branches to it. Once the glue code starts executing, it now is using its own TOC. Seemingly most system calls use the same function pointer (in this case it was 0x3610) and the TOC entry for the target function contains the system call number instead.
