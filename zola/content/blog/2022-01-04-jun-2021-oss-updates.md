+++
title = "IBM i Open Source Updates June 2021"
aliases = [ "2022/01/04/jun-2021-oss-updates.html",]
slug = "2022-01-04-jun-2021-oss-updates"

[taxonomies]
tags = [ "ibmi-oss-updates",]
+++

Hey, it's been a while! I got way behind on pushing out update blogs, so I'll be pushing out updates to catch up on the 2021 and try to be more consistent for 2022.

<!-- more -->

## New Packages

### python-rpm-macros

This package contains improved rpm macros for Python. The rpm-devel package already ships some Python macros in /QOpenSys/pkgs/lib/rpm/macros.python3, but these have been removed from the latest version of rpm and replaced by the macros in this package.

## Package Updates

### GNU Readline

GNU Readline was updated to version 8.1, which now ships libreadline8 instead of libreadline6. Both Readline packages are available, so existing packages will not have problems, but packages will link to libreadline8 as they get updated.

### BASH

BASH was updated to 5.1. There are a variety of changes since 4.4. You can read more about the changes in [5.0](https://lists.gnu.org/archive/html/bug-bash/2019-01/msg00063.html) and [5.1](https://lists.gnu.org/archive/html/info-gnu/2020-12/msg00003.html) in the release announcements.

### libidn2

The package was updated to handle upgrading from community versions of libidn2.

### Ansible

Ansible was updated to force using /QOpenSys/pkgs/bin/python3.6 instead of /QOpenSys/pkgs/bin/python3. The python3 symlink depends on the update-alternatives choice for Python 3 and while today we only have one alternative (Python 3.6), that won't be the case for long.

### Other Updates

- python3-pip was updated to 21.1.2
- python3-setuptools was updated to 57.0.0
- python3-wheel was updated to 0.36.2
- ant was updated to 1.10.10

## Closing

Well, 6 months through 2021. Lots of stuff delivered and lots of stuff to come. Hopefully back in a few days with a report on July 2021.
