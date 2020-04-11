---
layout: single
title: IBM i Open Source Updates Jan 2020
layout: single
categories: ibmi-oss-updates
---

Well, I hadn't planned to take this long to get out another blog, but the world of OSS moves fast and things have been very busy around here. I'm planning on having more frequent updates than every other month. Let's start with what my team did in January.


## Package Updates

- nodejs (8) was updated to [8.17](https://nodejs.org/en/blog/release/v8.17.0/).
- nodejs10 was updated to [10.18](https://nodejs.org/en/blog/release/v10.18.0/)
- nodejs12 was updated to [12.14](https://nodejs.org/en/blog/release/v12.14.0/)

NOTE: Node.js 8.17 is the last update for the 8.x version.

No more updates will be provided, security or otherwise. It is recommended to migrate to a newer version. Node.js v10 will be supported through April 2021 and v12 will be supported April 2022. See [Node.js Releases](https://nodejs.org/en/about/releases) page for more info.

## Package fixes

### NGINX

NGINX was patched to handle `ENDTCP` properly. Prior to this, NGINX would keep running if TCP/IP was ended, but any sockets it had open would always return `EUNATACH` and its event loop would spin furiously, generating massive error logs. Now, when NGINX receives `EUNATACH`, it exits.

### R

R was updated to generate the libR.pc file correctly. This is a [pkg-config](https://www.freedesktop.org/wiki/Software/pkg-config/) file used to build R extensions.

### libarchive

libarchive was patched to address [CVE-2019-18408](https://nvd.nist.gov/vuln/detail/CVE-2019-18408). This affects reading RAR format archives. We ship two packages that use libarchive: cmake and rpm. 

For cmake, this is only affects running `cmake -E tar tf` or `cmake -E tar xf` with a RAR file.

For rpm, libarchive is only used by the `rpm2archive` command. This command only _writes_ to files and never reads, so it is not affected.

Regardless, it is always recommended to update for known security vulnerabilities.

## Bootstrap updates

While `yum` and `rpm` can install and update all the rpms we provide, they are not shipped with the IBM i OS itself. So if you need to have `yum` and `rpm` installed to install `yum` and `rpm`, how do you get it installed in the first place? Seems like a classic Catch-22!

To get around this problem we need to "bootstrap" the environment. This bootstrap environment is an installation of `yum` and its dependencies that are in a separate format that a different installer can install. This is what we use when using either the ACS Open Source Package Management GUI or the offline install method and in January, we did some big updates to it.

As we have now migrated to all packages being built for 7.2+, the bootstrap was updated with these packages built on 7.2. This now means you absolutely need 7.2 or later to install any of our open source environment. Sorry 7.1, but it's been 600+ days (700+ at the time of writing) since it went out of support. To prevent users from accidentally installing the 7.2 environment on a 7.1 system, a version check was added to the bootstrap installer. Additionally, a check was added to prevent accidentally running the bootstrap on an already bootstrapped system. Running the boostrap more than once on the same system is almost never needed and will likely cause more problems than when you started.

Finally, the bootstrap install now includes `ca-certificates`/`ca-certificates-mozilla`, `yum-utils`, and `coreutils-gnu` packages by default.

### ca-certificates

`ca-certificates` is a framework for managing various CA certificates in a central location. You can have multiple providers of certificates as well as multiple consumers of these certificates in different formats. Out of the box, `ca-certificates` knows how to generate trust stores for OpenSSL as well as Java Keystore (jks) files, but you can also add your own scripts to `/QOpenSys/etc/ca-certificates/update.d` to support different formats or trust store locations. Add your own internal or business partner's CA certificates in PEM or DER format to `/QOpenSys/etc/pki/trust/anchors` and run `update-ca-certificates` and all the configured trust stores will be updated for you.

Of course, having a centralized management framework for CA certificates doesn't do a whole lot if you don't have any certificates. That's why we provide `ca-certificates-mozilla` and automatically install it by default now. These are the same set of CA certificates provided by Mozilla with Firefox and many Linux distributions uses this same set of trusted CAs.

If you don't want to trust these CAs, you can remove `ca-certificates-mozilla` at any point. You can also more selectively distrust CAs by adding certificates to `/QOpenSys/etc/pki/trust/blacklist`.

By providing these packages, the out of the box experience should be much better:
- Using `git` now works out of the box with GitHub, BitBucket, or GitLab HTTPS URLs and you no longer need to disable SSL verification
- `curl` and `wget` should be able to retrieve most any HTTPS URL on the public internet
- Python, Node.js, and other packages using OpenSSL can properly validate HTTPS requests


### yum-utils

`yum-utils` is a collection of plugins for `yum` and adds the `yum-config-manager` utility. This utility makes it much easier to add or remove repositories, including third-party repos. You can browse the growing list of third-party repositories [here](https://bitbucket.org/ibmi/opensource/src/master/docs/yum/3RD_PARTY_REPOS.md).


### coreutils-gnu

`coreutils-gnu` is a set of core UNIX utilities like `ls`, `cp`, `df`, etc. While PASE already includes most of these utilities, there are some which PASE does not include (eg. `readlink`, `base64`, `md5sum`, ...) and the GNU versions usually have more features than the standard UNIX versions.

Users of Linux or other operating systems will find the GNU versions more familiar and all users should find them more comfortable and user-friendly.


## Wrapup

And that does it for January. Come back next time for February updates and stay safe out there!
