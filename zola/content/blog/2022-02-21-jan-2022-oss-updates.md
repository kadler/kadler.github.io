+++
title = "IBM i Open Source Updates January 2022"
aliases = [ "2022/02/21/jan-2022-oss-updates.html",]
slug = "2022-02-21-jan-2022-oss-updates"

[taxonomies]
tags = [ "ibmi-oss-updates",]
+++

Happy new year! I know it's late February now, but it's still the first post of
2022 here, so let's see what January had to offer. :grin:

<!-- more -->

## New Packages

### GNU binutils

[GNU binutils](https://www.gnu.org/software/binutils/) is a collection of
binary tools, mainly the GNU linker (`ld`) and the GNU assembler (`as`).  Many
changes have gone in to the 2.37 release to improve AIX compatibility in the
linker, however it is not yet recommended for production usage.  The assembler
seems to be in much better shape, however, and supports up to Power 10
instructions even back to IBM i 7.3 while the PASE assembler only supports
up to POWER8 on 7.3 and POWER9 on 7.4.

Additional utilities that may be of interest are `c++filt` and `objdump`.

*NOTE: This package is only available for IBM i 7.3 and newer.*

## Package Updates

### service-commander

service-commander went through a few updates this month to 1.0.1, 1.0.2, and
finally 1.1.0.

Major improvements include:
- Common IBM i services such as HTTP Admin servers, IBM i Host Servers, etc
  are now pre-configured out of the box
- Services now support multiple ports and/or multiple jobs
- Python 3.9 is now used instead of 3.6

For more information, refer to the
[1.1.0](https://github.com/ThePrez/ServiceCommander-IBMi/releases/tag/v1.1.0),
[1.0.2](https://github.com/ThePrez/ServiceCommander-IBMi/releases/tag/v1.0.2),
and
[1.0.1](https://github.com/ThePrez/ServiceCommander-IBMi/releases/tag/v1.0.1)
release notes.

### GCC 10

GCC 10 has now been updated to 10.3.0. In addition, numerous improvements have
been made:
- Fixed Power 10 support
- Add alias for `-m64` -> `-maix64`
- Fortran support added
- Add comptibility for libgfortran3 from GCC 6
- Use Red Hat-style compiler identification in `gcc --version`
- Remove unsupported `-mpe` option
- Disable building GCC with `-G` linker flag, which should improve performance
- Simplified rpm build spec file

*NOTE: This package is only available for IBM i 7.3 and newer.*

### sbin Changes

On Unix platforms, there's a distinction between bin/ and sbin/ directories,
where bin/ contains programs usable by all users while sbin/ contains programs
that are meant for admins and usually require "root" authority and are usually
only added to the `$PATH` if the user is root.

On IBM i, users may have multiple different special authorities such as
`*ALLOBJ`, `*SECADM`, etc instead of having a special "root" user (though
QSECOFR does exist) so this distinction doesn't make as much sense. In
addition, sbin/ directories are not added to the `$PATH`, which can lead to
confusion for users unaware of this split, especially since most packages we
ship do not contain any sbin/ programs.

Because this split behavior is rather foreign and doesn't make as much sense on
a platform with special authorities, we have decided to move away from
packaging anything in `/QOpenSys/pkgs/sbin`. All existing packages that have
sbin/ files have moved those files to bin/, with compatibility symlinks in
sbin/ left for now.

The following packages (programs) were affected:

- yum-utils (yum-complete-transaction, yumdb)
- gnupg2 (addgnupghome, applygnupgdefaults)
- logrotate (logrotate)
- man-db (accessdb)
- openssh (sshd)

In addition, we plan to make a change to rpm to change the `%{_sbindir}` macro to
be the same as `%{_bindir}`. This should ensure the majority of packages going
forward require no special changes.

### tn5250

Encrypted 5250 is now supported using TLS/SSL, eg `tn5250
ssl:ibmi.example.com`.

### Other Updates

- python39-paramiko was updated to 2.7.2
- python39-psycopg2 was updated to 2.9.1
- mariadb was updated to
  [10.3.32](https://mariadb.com/kb/en/mariadb-10332-release-notes/)
- nodejs12 was updated to [12.22.9](https://nodejs.org/en/blog/release/v12.22.9/)
- nodejs14 was updated to [14.18.1](https://nodejs.org/en/blog/release/v14.18.1/)
- nodejs16 was updated to [16.13.2](https://nodejs.org/en/blog/release/v16.13.2/)

## Closing

Quite a few big changes, especially on 7.3 and up packages Hmm. :thinking:

