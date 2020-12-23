---
layout: single
title: IBM i Open Source Updates May 2020
layout: single
categories: ibmi-oss-updates
classes: wide
---

Well, I mentioned before that the May update was gonna be big and boy is it a doozy!

## New Packages

### logrotate

[logrotate](https://linux.die.net/man/8/logrotate) is a tool that can rotate your logs — you can configure it to automatically rotate, compress, and even remove your log files. This is very useful for log files that may grow very big if left unchecked. The HTTP Server for i supports this out of the box with log cycling, but not all products do this, so having a specialized tool can be useful.

logrotate is very configurable:
- should archived logs be numbered or dated (and if dated, what format)?
- how many logs do you want to keep before removal?
- how old should a log get before it's considered for rotation (daily, weekly, etc)?
- how big do you want a log to get before it's considered for rotation?
- Should the logs be compressed and if so, what compresion to use? (default is gzip)

`logrotate` is not a service that runs continuously — instead you must run it periodically. It will then analyze all the log files which it is configured to rotate and rotate the files as needed. You can set it up to run via the job scheduler. Perhaps one day it will even run via cron :wink:.

This fulfills RFE [125282](http://www.ibm.com/developerworks/rfe/execute?use_case=viewRfe&CR_ID=125282).


### PostgreSQL 12

[PostgreSQL](https://www.postgresql.org/) describes itself as

> a powerful, open source object-relational database system that uses and extends the SQL language combined with many features that safely store and scale the most complicated data workloads. The origins of PostgreSQL date back to 1986 as part of the POSTGRES project at the University of California at Berkeley and has more than 30 years of active development on the core platform.
>
> PostgreSQL has earned a strong reputation for its proven architecture, reliability, data integrity, robust feature set, extensibility, and the dedication of the open source community behind the software to consistently deliver performant and innovative solutions. 

PostgreSQL joins SQLite as another open source database available on IBM i from IBM. If you'd like to learn more on how to get started with PostgreSQL on IBM i, Richard Schoen has graciously contributed a [guide](http://ibm.biz/postgres-ibmi-get-started) on our examples repo.

If you're wondering why you'd want to use PostgreSQL on IBM i when Db2 exists out of the box, well I hear that Jesse Gorzinski will be talking all about that in a future entry on his [blog](https://www.ibmsystemsmag.com/Power-Systems/open-your-i-blog) :wink:.


### update-alternatives

update-alternatives is a utility which manages sets of symlinks of alternative versions of a package. This allows you to install multiple packages which could provide some command, say `node`, and then choose _which_ one of those packages will be the default. This is similar in concept to the rudimentary `nodever` script we have provided going all the way back to Node.js v4 shipped in 5733-OPS. update-alternatives is a much more general tool, however, and is more featureful to boot!

If you'd like to learn more about how `update-alternatives` impacts you and what that means for `nodever`, please check out [this](https://www.ibmsystemsmag.com/Power-Systems/05/2020/update-alternatives) guest blog by Mark Irish.


## Package Updates

### Node and nodever

As we move to use update-alternatives instead of nodever, all the Node packages (8, 10, 12) were updated. In addition, Node 12 was updated to [12.16.2](https://nodejs.org/en/blog/release/v12.16.2/).

As we are using update-alternatives to manage the various Node versions, nodever was re-written to be a wrapper around update-alternatives. As such, we bumped it to 1.0 and deprecated it. It should still work as it did previously, but we recommend users to use update-alternatives instead.

### git

git was one of our oldest packages which had never been updated. Until now we've continued to ship the same version that we shipped with 5733-OPS in 2016!

No longer, thoug as we've updated to the latest<sup>1</sup> version: [2.26.2](https://github.blog/2020-03-22-highlights-from-git-2-26/) fixing [CVE-2017-14867](https://nvd.nist.gov/vuln/detail/CVE-2017-14867) and [CVE-2020-5260](https://nvd.nist.gov/vuln/detail/CVE-2020-5260) as well as bringing in over 3 years of improvements!

<sup>1</sup> well it was when we shipped it :upside_down_face:

### Python 2

Python 2 was updated to [2.7.18](https://blog.python.org/2020/04/python-2718-last-release-of-python-2.html) which has the distinction of being the _very last_ version of Python 2 that will _ever_ be released.

Python 2 went out of support at the end of 2019 and 2.7.18 was really only a ceremonial release. We do not plan to support it any further, other than what's necessary to support yum. Many Python packages have already dropped Python 2 support and many more are on their way so if you're still using Python 2, be warned!

### Other Updates

- openssl 1.1 was updated to [1.1.1g](https://www.openssl.org/news/openssl-1.1.1-notes.html) for [CVE-2020-1967](https://www.openssl.org/news/vulnerabilities.html#2020-1967)
- libuv was updated to [1.38](https://github.com/libuv/libuv/releases/tag/v1.38.0)
- rpm was updated to [4.13.1](https://rpm.org/wiki/Releases/4.13.1) fixing [CVE-2017-7501](https://nvd.nist.gov/vuln/detail/CVE-2017-7501)
- expat was updated to [2.2.9]() to fix [CVE-2019-15903](https://nvd.nist.gov/vuln/detail/CVE-2019-15903)
- python3-dateutil was updated to [2.8.0](https://dateutil.readthedocs.io/en/stable/changelog.html#version-2-8-0-2019-02-04)
- libutil was updated to [0.8.0](https://github.com/IBM/portlibfori/releases/tag/0.8.0) bringing initial support for the `backtrace_symbols_fd` function and a fix from Calvin Buckley to deal with signal handler stack frames.
- db2util was updated to [1.0.10](https://github.com/IBM/ibmi-db2util/releases/tag/v1.0.10) bringing some JSON and CSV escaping fixes contributed by Liam Allen


## Package Fixes

### CMake 3.16

We updated CMake to 3.16 back in March. This was quite a major update that changed how it does linking on AIX. Due to this, we had to make some adjustments to get things working again in PASE. It's still going through some teething issues, so for now we recommend continuing to use cmake 3.7.2 which is also on the repo.

### libxml2

We fixed an issue in xml2-config that causes packages building with libxml2 to require a bunch of unnecessary libraries.

### yum-utils

I mentioned our changelog updates and yum-plugin-changelog in my [January update](/2020/01/08/oss-updates.html#changelog-updates). Unfortunately, you could only use `yum changelog all`, as we had no python2-dateutil package, only python3-dateutil. We have now shipped the Python 2 version of dateutil and updated yum-plugin-changelog to require it. This allows you to query changelogs by date range (eg. `yum changelog 2020-Jan git`) or by most recent count (eg. `yum changelog 4 python3`).

### GNU make

When GNU make runs with multiple jobs it tries to synchronize its output using stdout as a file lock. This does not work on IBM i when stdout is a pipe, such as when running in Jenkins or other batch build tools, and produces this spurious message: `fcntl(): Invalid Argument`. Since we know this will never work, the message is disabled an significantly cleans up build logs, especially for recursive make files.


## Closing

Wow! PostgreSQL 12, ~~nodever 1.0~~ update-alternatives, a new git version after 3+ years, *and* the last Python 2 version _ever_? Talk about a big month! What update in May was most important to you?
