+++
title = "Using Python ibm_db with Un-journaled Tables"
aliases = [ "2018/09/20/using-python-ibm-db-with-un-journaled-files.html",]
slug = "2018-09-20-using-python-ibm-db-with-un-journaled-files"

[taxonomies]
tags = [ "python", "ibm_db",]
+++
When using the Python ibm_db package to interact with the Db2 for i database, you may run in to this error:

```python
>>> cur.execute('insert into qtemp.foo values(1)')
Traceback (most recent call last):
  File "/QOpenSys/pkgs/lib/python3.6/site-packages/ibm_db_dbi.py", line 1311, in _execute_helper
    return_value = ibm_db.execute(self.stmt_handler)
Exception: Statement Execute Failed: FOO in QTEMP not valid for operation. SQLSTATE=55019 SQLCODE=-7008

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/QOpenSys/pkgs/lib/python3.6/site-packages/ibm_db_dbi.py", line 1396, in execute
    self._execute_helper(parameters)
  File "/QOpenSys/pkgs/lib/python3.6/site-packages/ibm_db_dbi.py", line 1321, in _execute_helper
    raise self.messages[-1]
ibm_db_dbi.ProgrammingError: ibm_db_dbi::ProgrammingError: Statement Execute Failed: FOO in QTEMP not valid for operation. SQLSTATE=55019 SQLCODE=-7008
```

<!-- more -->

The problem is that tables in un-journaled libraries cannot be modified when run under commitment control and ibm_db uses the IBM CLI default of `*CHG`.

There's two ways to fix this:

1. Modify your SQL to specify `WITH NC`
2. Disable commitment control in ibm_db

Luckily, ibm_db allows the user to set arbitrary IBM CLI statement and connection attributes using the `set_option` method on the cursor or connection object. The only problem with this is you need to know what the integer values are for the attributes and their values, which means digging through IBM CLI header files or looking through the documentation.

With ibm_db 2.0.5.7 and higher, `SQL_ATTR_TXN_ISOLATION` and the values associated with it are now defined by the `ibm_db_dbi` module for easy reference. The values you can use are:

- `SQL_TXN_READ_UNCOMMITTED` (`*CHG` or `*UR`)
- `SQL_TXN_READ_COMMITTED` (`*CS`)
- `SQL_TXN_REPEATABLE_READ` (`*ALL` or `*RS`)
- `SQL_TXN_SERIALIZABLE` (`*RR`)
- `SQL_TXN_NO_COMMIT` (`*NONE` or `*NC`)

Here's an example using this new functionality:

```python
import ibm_db_dbi as db2

conn = db2.connect()
conn.set_option({ db2.SQL_ATTR_TXN_ISOLATION:
                  db2.SQL_TXN_NO_COMMIT })

cur = conn.cursor()
cur.execute('create table qtemp.foo(i int)')
cur.execute('insert into qtemp.foo values(1)')
```
