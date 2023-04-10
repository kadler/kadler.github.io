+++
title = "IBM-provided Repositories ODBC Linux Driver Repositories"
aliases = [ "2022/05/20/odbc-repos.html",]
slug = "2022-05-20-odbc-repos"

[taxonomies]
tags = [ "odbc", "linux",]
+++

Today, we're pushing out something that I've been wanting for a long time. We
now have RPM and DEB repositories for Linux available directly from IBM for the
IBM i Access Client Solutions application package, which includes the IBM i
Access ODBC driver. This also includes the latest version of the IBM i Access
ODBC driver, which was released today.

While we have been pushing the IBM i Access ODBC driver as the "One True Way" to
access the database from open source for some time, the biggest hindrance has
been getting it installed. Previously, it was only available from the byzantine
labyrinth that is IBM ESS or from the MRS download site (conventiently
bookmarkable to <https://ibm.biz/ibmi-odbc-download>). Both of these require
manual steps to log in, agree to the license, download the zip, then extract the
zip and install the package. But Linux distributions have these fancy things
called package managers that can point to remote repositories of packages and
easily extend the distribution's package list with third-party software. Heck,
even _Microsoft_ provides Linux repositories nowadays, so it's high time that
IBM does similarly.

With this change, it will be much easier for end users to install the driver on
Linux. It also makes it easier for automation to install the driver as well,
whether that's Ansible system deployment scripts or Dockerfiles for building
ODBC-based Linux container apps. In addition, it makes updating the driver much
easier too, since the process uses the same upgrade procedure as the rest of the
system packages.

<!-- more -->

## Installing the Repository

The repositories are located under
<https://public.dhe.ibm.com/software/ibmi/products/odbc/>.

### Red Hat-based Distribution Setup

```bash
curl https://public.dhe.ibm.com/software/ibmi/products/odbc/rpms/ibmi-acs.repo | sudo tee /etc/yum.repos.d/ibmi-acs.repo
```

### SUSE-based Distribution Setup

```bash
curl https://public.dhe.ibm.com/software/ibmi/products/odbc/rpms/ibmi-acs.repo | sudo tee /etc/zypp/repos.d/ibmi-acs.repo
```

### Debian-based and Ubuntu-based Distribution Setup

```bash
curl https://public.dhe.ibm.com/software/ibmi/products/odbc/debs/dists/1.1.0/ibmi-acs-1.1.0.list | sudo tee /etc/apt/sources.list.d/ibmi-acs-1.1.0.list
```

## Installing the ODBC driver

### Red Hat-based Distribution Installation

```bash
sudo dnf install --refresh ibm-iaccess
```

### SUSE-based Distribution Installation

```bash
sudo zypper refresh
sudo zypper install ibm-iaccess
```

### Debian-based and Ubuntu-based Distribution Installation

```bash
sudo apt update
sudo apt install ibm-iaccess
```
