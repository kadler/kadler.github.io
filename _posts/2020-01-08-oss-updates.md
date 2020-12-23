---
layout: single
title: IBM i Open Source Updates Dec 2019
layout: single
categories: ibmi-oss-updates
classes: wide
---

It's a new year and so I'm finally getting around to doing something that I've wanted to do for a while now: write a blog series about various updates about what the IBM i OSS team is doing. I'm not sure the cadence of these updates, but I'll try to keep them updated periodically. For this first one, I'm going to handle it a bit differently as the team has just gotten back from the holiday break so there's not much to share so far for this year, but November and December were very busy, so that's what I'm going to talk about here.

## New Packages

Let's start with the fun part: new stuff!

### GNU CPIO

In December, we finally shipped cpio-gnu. We had originally planned to ship this with the original yum release back in 2018, but due to an oversight, it was missed but we finally got it shipped. cpio-gnu is the [GNU](https://www.gnu.org/software/cpio/) version of the `cpio` utility, supplementing the PASE version. It is more compatible with open source packages which generate CPIO archives, most notably [rpm2cpio](http://ftp.rpm.org/max-rpm/s1-rpm-miscellania-rpm2cpio.html) which might be useful if you wanted to, say, extract an AIX rpm without having to deal with getting rpm and yum to install these foreign rpms.

### PyODBC

We now have an rpm packaging [PyODBC](https://github.com/mkleehammer/pyodbc) for Python 3. This makes it *vastly* easier to get going with ODBC on IBM i, as previously you had to install a bunch of development tools and patch PyODBC to fix a few bugs. Instead, you can now say `yum install python3-pyodbc` and get going right away!

Note: We will _not_ be providing a PyODBC rpm for Python 2. Python 2 is now [EOL](https://pythonclock.org/) and you should be using Python 3 instead.

## Package Updates

- OpenSSL 1.1 updated to [1.1.1d](https://www.openssl.org/news/openssl-1.1.1-notes.html)
- OpenSSL 1.0.2 updated to [1.0.2t](https://www.openssl.org/news/openssl-1.0.2-notes.html)
- bzip2 patched for various CVE and other bug fixes
- libpng updated to 1.6.37 to fix various CVEs
- python3-ibm_db and python2-ibm_db updated to [2.0.5.12](https://github.com/kadler/python-ibmdb/releases/tag/2.0.5.12)
- rpm build with libarchive, enabling use of [rpm2archive](http://manpages.ubuntu.com/manpages/xenial/man8/rpm2archive.8.html)
- wget updated to [1.20.3](http://git.savannah.gnu.org/cgit/wget.git/tree/NEWS?h=v1.20.3&id=a220ead43505bc3e0ea8efb1572919111dbbf6dc) to work with OpenSSL 1.1
- curl updated to [7.65.3](https://curl.haxx.se/changes.html#7_65_3) to work with OpenSSL 1.1
- openssh updated to [8.1p1](https://www.openssh.com/txt/release-8.1) to work with OpenSSL 1.1
- Node.js v12 upated to [v12.13.0](https://nodejs.org/en/blog/release/v12.13.0/), also patched to fix [bug](https://bitbucket.org/ibmi/opensource/issues/80/issues-with-qp2term-and-nodejs-v1281) causing crashes when running in a 5250
- libutil updated to [0.6.2](https://github.com/IBM/portlibfori/releases/tag/0.6.2) to fix a bug affecting Jupyter
- Python 2 and 3 patched to fix CVE-2019-16935
- python3-pip now ships with a default pip.conf to supress the pesky upgrade notification

## OpenSSL 1.1 Migration

Back in August, I wrote a [guest entry](https://ibmsystemsmag.com/Power-Systems/08/2019/RPMs-and-YUM-on-IBM-i-7-1) on Jesse's blog to explain that all IBM i 7.1 rpms would be replaced with IBM i 7.2 rpms and why. As a refresher, the change was motivated by OpenSSL 1.0.2 going out of support at the [end of 2019](https://www.openssl.org/policies/releasestrat.html) and our OpenSSL 1.1 build only working on IBM i 7.2. To keep users protected, we had to migrate anything using OpenSSL 1.0.2 to OpenSSL 1.1, which included the package manager yum. Here's a list of packages that got updated to OpenSSL 1.1:

- curl
- git
- libarchive
- lftp
- python2
- python2-pycurl
- python3
- python3-cryptography
- openssh
- wget

You can now safely remove OpenSSL 1.0.2 libraries with `yum remove libopenssl1_0_0`. Now, if we could get rid of Python 2...

Note: For the most part the RPM dependencies should make sure that everything is consistent when updating, but it's possible something was missed. So, if you get odd OpenSSL errors from any of these packages you might want to make sure they're at the latest versions.

## IBM i 7.2 Rebuild

As mentioned in the previously mentioned blog post, we planned to rebuild all rpms on IBM i 7.2 by September 24th. We ran in to a few unexpected surprises along the way to doing so, so we only got a few packages rebuilt by then. We finally managed to rebuild all the packages by the end of the year. The repository is now 100% 7.2 rpms and along the way we cleaned up a few duplicate packages in there as well.

A side benefit of rebuilding all the packages is that we now have source rpms for all packages. When we originally started building rpms, we did not save the source rpms and so they were not published to the repository. Any of those packages that had been updated since then would have had source rpms published, but there were a few packages which never saw an update and so were still missing source rpms - this has now been fixed.

## Changelog Updates

While we were rebuilding all the packages on IBM i 7.2, it seemed a good time to go back and add changelogs to all the packages. A package's changelog can be viewed with `rpm` using `rpm -q --changelog <package name>`, eg. `rpm -q --changelog yum`. Alternatively, you can install `yum-plugin-changelog` to view changelogs with `yum`, either during install/upgrade/etc, eg. `yum upgrade --changelog` or to view a specific package's changelog, eg. `yum changelog all yum`. For more information on the yum-changelog plugin, refer to the [man page](https://linux.die.net/man/1/yum-changelog).

## License Updates

Again, while rebuilding all the packages we felt it was a good time to do more housekeeping. All of our packages were updated to use [SPDX](https://spdx.org/licenses) license identifiers. So instead of "BSD" or "GPL", we use a more specific license identifier like "BSD-3-Clause" or "GPL-3.0-or-later". If you or your company are worried about licensing issues with Open Source, this should make it a little easier to identify your licensing restrictions and obligations; if not, you can keep ignoring the license field.

In addition, we found that a few of our packages had incorrect licenses listed and were fixed. 

### GPL Licence Changes

A final thing to note here: we have changed how we handle GPL packages. A common part of the GPL text is that it gives the option to allow distribution under "any later version", eg. the GPL version 3 [says](https://www.gnu.org/licenses/gpl-3.0.en.html):

> Each version is given a distinguishing version number. If the Program specifies that a certain numbered version of the GNU General Public License “or any later version” applies to it, you have the option of following the terms and conditions either of that numbered version or of any later version published by the Free Software Foundation. If the Program does not specify a version number of the GNU General Public License, you may choose any version ever published by the Free Software Foundation.

Previously, we would distribute a GPL package under the version noted in the package license, even if the package allowed it to be distributed under a later version of the GPL. So if a package was distributed under the GPL version 2, we would also distribute it under the GPL version 2, *even if* the license allowed us to distribute it under the GPL version 3. However, our lawyers prefer GPL version 3 to version 2 and it makes our lives easier as well. With that in mind, *when possible* we will distribute any GPL v2 "or later" software under GPL v3 "or later". We do provide some GPL v2-only packages, so those and any of their dependencies will still be distributed under the GPL v2.
