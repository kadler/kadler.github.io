---
layout: single
title: "PASE Linking Differences Explained"
desc: "Understand how PASE gets linked vs Linux"
date: 2017-11-17 16:36 -0600
categories: libpath pase
---

If you are used to Linux or other Unix systems, you may have noticed that AIX and PASE differ quite a bit. While most Unix systems use the "ELF" (Executable and Linking Format) object format, AIX and PASE use "XCOFF" (eXtended Common Object File Format). Another difference you might notice is in how AIX binaries are linked. 



Let's first step back and look at how we link to just the shared object (not the shared library). With AIX 5L, the AIX team added "Linux Affinity" to make it easier to port software from Linux and other Unix-like operating systems that expect to link with a .so file. So on other platforms, when you specify `-lfoo` the linker would normally look for a `libfoo.so` and link to it, but on AIX it looks for `libfoo.a` and links to any necessary members found inside it. We've seen this already. However, there's a lot of software that only knows how to build a shared object and not AIX shared libraries, so AIX was modified in order to support loading shared objects. Another difference between AIX and other Unix-like operating systems is that other operating systems use runtime-linking by default. 