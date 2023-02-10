+++
title = "IBM i Open Source Updates July 2021"
aliases = [ "2022/01/07/july-2021-oss-updates.html",]
slug = "2022-01-07-july-2021-oss-updates"

[taxonomies]
tags = [ "ibmi-oss-updates",]
+++

Back with another overdue update, this time for July. Big news this month, which had been hinted at for a while. Did you figure it out ahead of time?
<!-- more -->

## New Packages

### Python 3.9

![Wild Python appeared](/assets/images/wild-python-appears.png)

In addition to the existing Python 2.7 and 3.6, you can now use Python 3.9 on IBM i. We've spent a significant amount of time running through the Python test suite and fixing issues found so this should be the most stable version of Python on the platform yet! If you're wondering what's new with 3.9, there's the [official docs](https://docs.python.org/3/whatsnew/3.9.html) as well as some great summaries like [this one](https://ayushi7rawat.hashnode.dev/python-39-all-you-need-to-know).

In addition to the Python 3.9 interpreter and runtime, we've ported the following Python 3.6 packages over:
- dateutil
- paramiko
- pytz
- six
- Pillow
- bcrypt
- cffi
- cryptography
- ibm_db
- itoolkit
- psycopg2
- pycparser
- pynacl
- pip
- setuptools
- wheel
- pyodbc

Some of these packages have been updated to the most recent version. In addition, cython has been packaged for Python 3.9 for dependencies while others like idna2 and asn1crypto were not brought over since they are no longer needed.

At this point, the only Python 3.6 packages we still have not brought to Python 3.9 are the ML-related packages:
- numpy
- pandas
- scikit-learn
- scipy

With Python 3.6 going EOL in December, it's recommended to start porting code to 3.9 as soon as possible.

By default upon installation, it _will_ set /QOpenSys/pkgs/bin/python3 to point to python3.9. For more info on handling Python on IBM i refer to our [docs](https://ibmi-oss-docs.readthedocs.io/en/latest/python/README.html). 

## Package Updates

### ncurses

The ncurses package was updated to ship pkg-config files in ncurses-devel. This can help when building packages which rely on pkg-config to determine the ncurses link and cflags instead of using ncurses' bespoke `ncurses6-config` script.

### python-rpm-macros

The `%py_install_wheel` macro was updated to adjust the INSTALLER file created by pip to show that the package was installed by rpm.

### Other Updates

- libsodium was updated to 1.0.18

## Closing

Another month down, 5 more to go. Come back next Monday for August updates!
