#!/bin/sh

if [ -z "$1" ]
then
    echo "$0 [title-url]"
    exit 1
fi

file=./_posts/$1.markdown

cat <<EOF > $file
---
layout: post
title:  "TODO: Title here"
date:   TBD
desc:   TODO: Summary here
---

Lorem ipsum ...
EOF

echo "Wrote $file"