---
layout: single
title: Using System Naming in Python ibm_db
categories: python ibm_db
classes: wide
---
Like last-week's post about commitment control in Python ibm_db, you may run in to this unexpected error as well:

```python
>>> cur.callproc('qcmdexc', ('ADDLIBLE QIWS',))
('ADDLIBLE QIWS',)
>>> cur.execute("select * from qcustcdt")
Traceback (most recent call last):
  File "/QOpenSys/pkgs/lib/python3.6/site-packages/ibm_db_dbi.py", line 1254, in _prepare_helper
    self.stmt_handler = ibm_db.prepare(self.conn_handler, operation)
Exception: QCUSTCDT in KADLER type *FILE not found. SQLSTATE=42704 SQLCODE=-204

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/QOpenSys/pkgs/lib/python3.6/site-packages/ibm_db_dbi.py", line 1394, in execute
    self._prepare_helper(operation)
  File "/QOpenSys/pkgs/lib/python3.6/site-packages/ibm_db_dbi.py", line 1257, in _prepare_helper
    raise self.messages[-1]
ibm_db_dbi.ProgrammingError: ibm_db_dbi::ProgrammingError: QCUSTCDT in KADLER type *FILE not found. SQLSTATE=42704 SQLCODE=-204
```

The problem is that ibm_db uses the IBM CLI default of `*SQL` naming instead of `*SYS` naming, so the library list is not used for unqualified look-ups.

Again, there's two ways to fix this:

1. Modify your SQL to qualify the table with the correct schema
2. Tell ibm_db to use `*SYS` naming mode

Luckily, ibm_db allows the user to set arbitrary IBM CLI statement and connection attributes using the `set_option` method on the cursor or connection object. The only problem with this is you need to know what the integer values are for the attributes and their values, which means digging through IBM CLI header files or looking through the documentation.

With ibm_db 2.0.5.7 and higher, `SQL_ATTR_DBC_SYS_NAMING` is now defined by the `ibm_db_dbi` module for easy reference. The values you can use are:

- `SQL_FALSE`: use `*SQL` naming (default)
- `SQL_TRUE`: use `*SYS` naming

Here's an example using this new functionality:

```python
import ibm_db_dbi as db2

conn = db2.connect()
conn.set_option({ db2.SQL_ATTR_DBC_SYS_NAMING: db2.SQL_TRUE })

cur = conn.cursor()
cur.callproc('qcmdexc', ('ADDLIBLE QIWS',))
cur.execute("select * from qcustcdt")
for row in cur:
    print(row)
```

In fact, traditional IBM i users may want to use this as a standard template when using ibm_db:

```python
import ibm_db_dbi as db2
options = {
    db2.SQL_ATTR_TXN_ISOLATION: db2.SQL_TXN_NO_COMMIT,
    db2.SQL_ATTR_DBC_SYS_NAMING: db2.SQL_TRUE,
}
conn = db2.connect()
conn.set_option(options)
```