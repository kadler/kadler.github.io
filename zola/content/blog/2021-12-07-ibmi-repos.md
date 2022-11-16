+++
title = "IBM-provided Repositories and YUM Updates"
draft = false
aliases = [ "2021/12/07/ibmi-repos.html",]
slug = "2021-12-07-ibmi-repos"

[taxonomies]
tags = [ "ibmi-oss-updates",]
+++

Today, we're pushing out an update to YUM which will automatically pull in a
new ibmi-repos package. The ibmi-repos package will provide two "new"
repositories:

- ibmi-base
- ibmi-release

The new ibmi-base repo will point to the same place that the current ibm repo
does, while the ibmi-release repo will point at an IBM i version-specific repo.

This will make it easier for us to push out updates to these repos as things
change. Currently, the ibm repo is only shipped with the bootstrap and not
owned by any package, so we can't push out any updates to it automatically.

Because we would like to make the transition from the ibm repo to the new repos
as seamless and error-free as possible, we're pushing out new repo files
instead of trying to update the existing repo in-place and we're making yum
depend on this new package. This will ensure that all users will get this
update when they run updates and any of their local changes to the existing
repo will not get overwritten in the process (if the sysadmin has made any
changes).

Once migrated to the new repos, the old ibm.repo file can be removed.

More details and a FAQ is available in our
[docs](https://ibmi-oss-docs.readthedocs.io/en/latest/yum/IBM_REPOS.html)
