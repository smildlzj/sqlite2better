import sqlite from 'better-sqlite3'

class Statement {
  constructor (stmt, params) {
    this.stmt = stmt
    this.params = params

    var methods = ['get', 'run', 'all']
    methods.forEach((k) => {
      this[k] = (params, cb) => {
        if (typeof params  == 'function') {
          params = null
        }
        try {
          return this.stmt[k](params || this.params)
        } finally {
          cb && cb()
        }
      }
    })
  }
  iterate (...args) {
    return this.stmt.iterate(...args)
  }
  finalize (cb) {
    cb && cb()
  }
}

class Database {
  constructor(...args){
    this.db = new sqlite(...args)
  }

  serialize (cb) {
    cb()
  }
  prepare (sql, params) {
    return new Statement(this.db.prepare(sql), params)
  }
  exec (sql, cb) {
    var ret = this.db.exec(sql)
    cb(null, ret)
  }
  get (sql, params, cb) {
    var stmt = this.prepare(sql)
    var rs = stmt.get(params)
    cb && cb(null, rs)
  }
  all (sql, params, cb) {
    var stmt = this.prepare(sql)
    var ret = stmt.iterate(params)
    cb && cb(null, Array.from(ret))
  }
  run (sql, params, cb) {
    if (sql == 'begin transaction') {
      this.prepare('BEGIN').run()
      return
    }
    if (sql == 'commit') {
      this.prepare('commit').run()
      return
    }
    var stmt = this.prepare(sql)
    params && stmt.run(params)
    cb && cb()
  }
}

export default Database