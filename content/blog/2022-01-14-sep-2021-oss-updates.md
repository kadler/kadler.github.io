+++
title = "IBM i Open Source Updates September 2021"
aliases = [ "2022/01/14/sep-2021-oss-updates.html",]
slug = "2022-01-14-sep-2021-oss-updates"

[taxonomies]
tags = [ "ibmi-oss-updates",]
+++

September was a pretty quiet month, but still some good stuff.

<!-- more -->

## New Packages

### Service Commander

[Service Commander](https://github.com/ThePrez/ServiceCommander-IBMi) is tool for starting and managing services on IBM i. It makes it easy to manage your open source PASE services as well as traditional ILE services and jobs.

**Some examples:**

Start the service named `kafka`:

```sh
sc start kafka
```

Stop the service named `zookeeper`:

```sh
sc stop zookeeper
```

Check status of all configured services (all services belong to a special group named "all")

```sh
sc check group:all
```

### Other Updates

- db2util was updated to [1.0.12](https://github.com/IBM/ibmi-db2util/releases/tag/v1.0.12)

## Closing

Come back Monday for October updates!