#!/bin/sh

# TODO: Is there a way to do this with categories?

cat <<EOF > ebcdic/index.md
---
layout: single
title: EBCDIC
permalink: /ebcdic/
---
EOF

for f in _includes/IBM-*.html
do
  link=$(basename $f .html)
  echo "- [$link]({% link ebcdic/$link.md %})" >> ebcdic/index.md

  cat <<EOF > ebcdic/$link.md
---
layout: single
title: $link
classes: wide
---

{% include $(basename $f) %}
EOF
done
