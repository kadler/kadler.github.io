+++
title = "IBM i Open Source Updates May 2021"
aliases = [ "2021/06/04/may-oss-updates.html",]
slug = "2021-06-04-may-oss-updates"

[taxonomies]
tags = [ "ibmi-oss-updates",]
+++

May updates at the same time as April updates? Madness, I say!

<!-- more -->

## New Packages

### HarfBuzz

[HarfBuzz](https://harfbuzz.github.io/) is a text shaping library with quite a [unique name](https://harfbuzz.github.io/why-is-it-called-harfbuzz.html).

I mentioned in April's update that Pango used Harfbuzz for complex text shaping. Well, apparently in our haste to ship Pango we forgot to ship harfbuzz too. Whoops!

### GNU IDN Library

[GNU IDN](https://www.gnu.org/software/libidn/) is a library which implements functions for handling internationalized hostnames. For example, this allows proper handling of the host name <räksmörgås.josefsson.org>

## Package Updates

### Ccache

Ccache now supports being used with GCC 10.

### cURL

Curl has been built with brotli and libidn2, so these examples now work properly:

```txt
$ curl --compressed https://httpbin.org/brotli 
{
  "brotli": true, 
  "headers": {
    "Accept": "*/*", 
    "Accept-Encoding": "deflate, gzip, br", 
    "Host": "httpbin.org", 
    "User-Agent": "curl/7.76.1", 
    "X-Amzn-Trace-Id": "Root=1-60ba8841-79dfa33d6c5a76b85b1d5863"
  }, 
  "method": "GET", 
  "origin": "206.9.215.19"
}

curl -s 'https://räksmörgås.josefsson.org/' | head
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
<html>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <head>
    <title>Räksmörgås.josefßon.org aka xn--rksmrgs-5wao1o.josefsson.org</title>
  </head>

  <body>

    <h1>Räksmörgås.josefßon.org aka xn--rksmrgs-5wao1o.josefsson.org</h1>
```

### Node.js 10, 12, 14

Versions of Node.js built on IBM i w/ GCC 6 cause the Node binary to export two C++ standard library functions. These functions are listed in node.exp, which is used for building C/C++ Node.js extensions. On Node.js 16, which is built with GCC 10, these functions are no longer exported by the node binary, causing problems for any extentions that expect the node binary to provide these functions (such as idb-connector).

Node.js 10, 12, and 14 have been patched to no longer list these functions in the node.exp file. A version of idb-connector which is built with these fixed Node.js builds should be available shortly.

### Other Updates

- openssl was updated to [1.1.1k](https://www.openssl.org/news/changelog.html#openssl-111).

## Closing

Slower month in May, but still important updates.
