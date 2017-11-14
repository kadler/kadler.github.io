#!/bin/sh

if [ -z "$1" ]
then
    echo "$0 [title-url]"
    exit 1
fi

DATE=$(date --iso)
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S %:z")

file=./_posts/$1.markdown
newfile=./_posts/$DATE-$1.markdown

if [ ! -f "$file" ]
then
  echo "$file doesn't exist"
  exit 1
fi

sed -i "s|date:   TBD|date:   $TIMESTAMP|" $file
mv $file $newfile
