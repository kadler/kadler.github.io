---
layout: single
title: IBM i Open Source Updates November 2021
categories: ibmi-oss-updates
classes: wide
---

November brings some nice goodies for IBM i 7.3+ users and some security fixes.

## New Packages

### ibmi-repos

I previously talked about this package [here]({% link _posts/2021-12-07-ibmi-repos.md %}).

### Leptonica

[Leptonica](http://leptonica.org/) is a set of image processing and analysis
libraries.  It supports numerous operations:

- Raster operations
- Affine transforms (scaling, translation, rotation, shear) on images of
  arbitrary pixel depth
- Projective and bilinear transforms
- Binary and grayscale morphology, rank order filters, and convolution
- and more

*NOTE: This package is only available for IBM i 7.3 and newer.*

### Tesseract

[Tesseract](https://tesseract-ocr.github.io/) is an open source text
recognition engine using a trained machine learning model as its basis.

*NOTE: This package is only available for IBM i 7.3 and newer.*

## Package Updates

### PCRE

PCRE was updated to 8.45, which is the **final** release of PCRE1. Applications
should migrate to PCRE2, which is also packaged.

### NGINX

Patched against [CVE-2021-23017](https://nvd.nist.gov/vuln/detail/CVE-2021-23017)

### Other Updates

- service-commander was updated to [0.6.0](https://github.com/ThePrez/ServiceCommander-IBMi/releases/tag/v0.6.0)

## Closing

Come back next Monday for December updates!
