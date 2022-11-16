---
layout: single
title: IBM i Open Source Updates June 2021
categories: ibmi-oss-updates
classes: wide
taxonomies:
  categories:
    - ibmi-oss-updates
---

New month, new updates!

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

Well, we're 6 months through the year and the pace has slowed down over the summer, but we still have quite a few big things coming. Some have even been hinted at here. :wink:
