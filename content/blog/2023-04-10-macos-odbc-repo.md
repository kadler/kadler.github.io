+++
title = "IBM-provided Repositories macOS ODBC Driver Repositories"
slug = "2023-04-10-macos-odbc-repo"

[taxonomies]
tags = [ "odbc", "macos"]
+++

In May of last year, [I announced](@/blog/2022-05-20-odbc-repos.md) that we had
publicly released repositories for the Linux ODBC driver and IBM i Access Client Solutions application package.
Today I'm letting you know that we now<sup id="a1">[1](#f1)</sup> also have a [Homebrew](https://brew.sh)
repository for the macOS driver as well.

<!-- more -->

This repository is set up as a [Tap](https://docs.brew.sh/Tap). To enable it and install
the package, run the following commands:

```bash
brew tap ibm/iaccess https://public.dhe.ibm.com/software/ibmi/products/odbc/macos/tap/
brew install ibm-iaccess
```

Once installed, you can keep it up to date as new driver versions come out
using `brew upgrade` as you would for any other Homebrew package, eg:

```bash
brew upgrade ibm-iaccess
```

<b id="f1">1</b> This has actually been available since November, but I forgot to blog about it till now.[↩](#a1)
