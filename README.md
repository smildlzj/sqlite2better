# sqlite2better
* support use node-sqlite3 api for better-sqlite3

## Usage
```js
var Database = require('sqlite2better');
var db = new Database('foobar.db', options);
db.get('SELECT * FROM users WHERE id=?', [userId], (err, row) => {
  
})

```