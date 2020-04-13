---
layout: single
title: IBM i Open Source Updates Feb 2020
layout: single
categories: ibmi-oss-updates
---

Wow, hasn't even been a week! In this blog entry, I'm going to go over what my team delivered in February.

## New Packages

### jq

[jq](https://stedolan.github.io/jq/) is described as "`sed` for JSON". If you don't know what `sed` is, it stands for Stream EDitor and basically it allows you to slice and dice text in numerous ways. Equivallently, `jq` allows you to manipulate JSON. It's better than `sed` for this because it understands the structure of JSON data and lets you leverage that structure to manipulate it. If you'd like to see some examples of what it can do, check out their [tutorial](https://stedolan.github.io/jq/tutorial/).

This addresses RFE [128972](http://www.ibm.com/developerworks/rfe/execute?use_case=viewRfe&CR_ID=128972).

### expect

[expect](https://core.tcl-lang.org/expect/index) is a tool that many of our customers use when they need to automate some interactive tool. Many times this is used for doing sftp operations that require filling in passwords. Scott Klement has long had `expect` [available](https://www.scottklement.com/expect) and we thank Scott for his excellent contributions, but this should make it even easier for users to acquire and use.

NOTE: We found out after we started building this but before shipping that Calvin Buckley had already built this for [qseco.fr](https://repo.qseco.fr/) repository. Because our packages are built differently, we adjusted our package to prevent getting a bad state. If you have already installed `jq` from that repository, it will seamlessly upgrade to our version.

### autossh

[autossh](https://www.harding.motd.ca/autossh/) is a tool for keeping SSH tunnels open - it will automatically restart the tunnel if it crashes. You might think of it as a simplified VPN.

This addresses RFE [123939](http://www.ibm.com/developerworks/rfe/execute?use_case=viewRfe&CR_ID=123939), where the customer wanted to keep connections open between their IBM i system and systems in Amazon EC2.

### oniguruma

[oniguruma](https://github.com/kkos/oniguruma) is a regular expression engine used by `jq`. While we mostly ported this to support `jq`, perhaps other packages can take advantage in the future.

## Package Updates

- less was updated to [551](http://www.greenwoodsoftware.com/less/news.551.html). (I really wish I understood their versioning scheme :man_shrugging:)
- pcre was updated to [8.43](http://www.rexegg.com/pcre-doc/ChangeLog).
- python3-cryptography was updated to [2.8](https://cryptography.io/en/latest/changelog/#v2-8) (mostly for something we shipped in March :wink:).
- nodejs10 was updated to [10.19](https://nodejs.org/en/blog/release/v10.19.0/)
- nodejs12 was updated to [12.15](https://nodejs.org/en/blog/release/v12.15.0/) and then to [12.16.1](https://nodejs.org/en/blog/release/v12.16.1/)


## Closing

We had quite a few new packages ship this month and some good version updates to existing packages, but there was even more going on that we didn't get to. Some of it I'll be talking about in my next blog post. Hopefully, the rest I can cover in my April update.