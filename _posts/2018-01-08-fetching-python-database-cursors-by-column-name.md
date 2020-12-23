---
layout: single
title: Fetching Python Database Cursors by Column Name
date: 2018-01-08 19:29 -0600
categories: python ibm_db
classes: wide
---

Today I got asked if you can index in to rows returned by `ibm_db_dbi` by column name. While this doesn't come out of the box<sup id="a1">[1](#f1)</sup>, it can be done pretty easily.

Here's some bog-standard Python code that executes a query and prints out each row:

```python
import ibm_db_dbi as db2 

cur = db2.connect().cursor()
cur.execute('select * from example')

for row in cur:
    print(row)
```

This produces the output below:
```
(1, 'Bob', 'Sales')
(2, 'Joe', 'Accounting')
(3, 'Vera', 'Development')
(4, 'Yu', 'Support')
```

Notice that each row is a Python `tuple` and thus can only be indexed by column index. However, PEP 249 requires the column names (and other metadata) to be stored in the cursor [description](https://www.python.org/dev/peps/pep-0249/#description) attribute. With that information, we can easily map column index to column name with that. In fact, with a quick Google search, I found a recipe in the [Python Cookbook](https://www.safaribooksonline.com/library/view/python-cookbook/0596001673/ch08s09.html) that does just that:

```python
def fields(cursor):
    """ Given a DB API 2.0 cursor object that has been executed, returns
    a dictionary that maps each field name to a column index; 0 and up. """
    results = {}
    column = 0
    for d in cursor.description:
        results[d[0]] = column
        column = column + 1

    return results

field_map = fields(cur)

for row in cur:
    print(row[field_map['NAME']])
```

```
Bob
Joe
Vera
Yu
```

The downfall of this approach is that we have to first generate a column index map and then every time we want to index by name, we have to look up the column name in the map to find its column index. We can certainly do better with the help of Python [generators](https://wiki.python.org/moin/Generators)! A generator implements the [Iterator Pattern](https://en.wikipedia.org/wiki/Iterator_pattern), giving back a value when `__next__()` is called until a `StopIteration` exception is thrown. This is usually done implicitly using a `for` loop and not called directly. We can create a generator class which returns a dictionary, mapping the values in the tuple to their column name using the descriptions in the cursor object. Since a cursor object is itself a generator, it's easy to write a simple wrapper:

```python
class CursorByName():
    def __init__(self, cursor):
        self._cursor = cursor
    
    def __iter__(self):
        return self

    def __next__(self):
        row = self._cursor.__next__()

        return { description[0]: row[col] for col, description in enumerate(self._cursor.description) }
    
for row in CursorByName(cur):
    print(row)
```

All the magic happens in the `__next__` function. It simply calls the `self._cursor.__next__()` to get the next row, while letting the `StopIteration` bubble up to the caller. We then use a `dict comprehension` to map the items in the tuple to a dictionary. We use the [enumerate](https://docs.python.org/3/library/functions.html#enumerate) built-in function to loop through each column description in the cursor description along with its column index. Now each row you get back is a dictionary:

```
{'ID': 1, 'NAME': 'Bob', 'DEPT': 'Sales'}
{'ID': 2, 'NAME': 'Joe', 'DEPT': 'Accounting'}
{'ID': 3, 'NAME': 'Vera', 'DEPT': 'Development'}
{'ID': 4, 'NAME': 'Yu', 'DEPT': 'Support'}
```

An interesting idea would be to create a class which acts as both a `dict` and `tuple`, such that you could mimic [db2_fetch_both](http://php.net/manual/en/function.db2-fetch-both.php) from the PHP `ibm_db2` interface. While you could just add column index keys to the dictionary above, but you will lose out on slicing and other sequence operations that you can do on tuples.

<b id="f1">1</b> You can actually do this by using `ibm_db` directly by calling either `ibm_db.fetch_assoc` or `ibm_db.fetch_both`, but using `ibm_db` is a pain and you lose out on all the PEP 249 goodness as well.[↩](#a1)