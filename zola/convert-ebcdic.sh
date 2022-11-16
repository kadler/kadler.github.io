#!/bin/bash

for f in ../ebcdic/IBM-*.md;
do
   name=$(basename $f .md)
   
   cat <<EOF > content/ebcdic/${name}.md
+++
title = "$name"
aliases = [ "ebcdic/$name" ]
+++
EOF
    cp ../_includes/${name}.html content/ebcdic

done

