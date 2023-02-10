#!/usr/bin/python3

import sys
import os.path

import yaml
import toml

from datetime import datetime

#
# We want to convert this:
#
#---
#layout: post
#published: true
#title: "Fabric Art History"
#date: 2017-07-10
#categories: [self]
#tags: [fabric]
#---
#
# Into this:
#
#+++
#title = "Fabric Art History"
#date = 2017-07-10
#
#[taxonomies]
#categories = ["self"]
#tags = ["fabric"]
#+++
#

from pprint import pprint

def parse_content(f):
    content = ''

    more_inserted = False

    for line in f:
        line = line.replace('```shell', '```bash')
        line = line.replace('```text', '```txt')
        line = line.replace('```cron', '```txt')

        if not more_inserted and line.startswith('## '):
            more_inserted = True
            content += '<!-- more -->\n\n'

        content += line

    return content


def parse_jekyll(f):
    front_matter = ''
    found = False
    while True:
        line = f.readline()
        if line.strip() == '---':
            if not found:
                found = True
                continue
            else:
                break

        else:
            if not found:
                continue
            else:
                front_matter += line

    return front_matter, parse_content(f)

def warn(*args, **kwargs):
    print(*args, **kwargs, file=sys.stderr)

def map_jekyll(path, jekyll):
    zola = {}

    for key, value in jekyll.items():
        if key == 'layout':
            if value not in ('post', 'single'):
                warn(f"{path} has a non-post layout '{value}'!")
        elif key == 'classes':
            # ignore class=wide
            # TODO: We'll have to see if the pages are wide enough and adjust sass as needed
            pass
        elif key == 'categories':
            if 'taxonomies' not in zola:
                zola['taxonomies'] = {}
            categories = value.split()
            zola['taxonomies']['tags'] = categories
        elif key == 'desc':
            zola['description'] = value
        elif key == 'published':
            if not isinstance(value, bool):
                # YAML parses 'true' and 'false' to a bool
                # Treat any other value as if it was draft = true
                value = True
            zola['draft'] = value
        elif key == 'date':
            # 2017-09-01 15:41:00 -0500
            pprint(value)
            if isinstance(value, datetime):
                d = value
            else:
                fmts = (
                    "%Y-%m-%d %H:%M:%S %z",
                    "%Y-%m-%d %H:%M %z",
                )

                d = None
                for fmt in fmts:
                    try:
                        d = datetime.strptime(value, fmt)
                        break
                    except ValueError:
                        pass
                
                assert d is not None

            print(d)
            #zola[key] = value
            zola[key] = d
        elif key in ('title',):
            # These map directly
            zola[key] = value

    filename = os.path.basename(path)
    tokens = filename.split('-')

    if tokens[0].startswith('20'):
        # date-prefixed
        slug_tokens = tokens[3:]
        date = "-".join(tokens[:3])
    else:
        slug_tokens = tokens
        date = None

    
    old_slug = "-".join(slug_tokens).replace('.md', '.html')

    if 'date' in zola:
        d = zola['date']
    else:
        assert date is not None
        d = datetime.strptime(date, "%Y-%m-%d")

    old_url = f'{d.year:04d}/{d.month:02d}/{d.day:02d}/{old_slug}'

    zola['aliases'] = [ old_url ]

    if 'slug' not in zola:
        slug = "-".join(slug_tokens).replace('.md', '')
        zola['slug'] = f'{d.year:04d}-{d.month:02d}-{d.day:02d}-{slug}'

    return zola

def convert(old_path):
    new_name = os.path.basename(old_path).replace('.markdown', '.md')
    new_path = f"content/{new_name}"

    with open(old_path, "r") as old, open(new_path, "w") as new:
        front_matter, content = parse_jekyll(old)
        jekyll = yaml.load(front_matter, Loader=yaml.Loader)
        zola = map_jekyll(new_path, jekyll)

        #f.seek(0, 0)
        print("+++", file=new)
        toml.dump(zola, new)
        print("+++", file=new)
        new.write(content)


    pass

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("convert-jekyll-to-zola.py [files...]")
        exit(1)

    for file in sys.argv[1:]:
        convert(file)

