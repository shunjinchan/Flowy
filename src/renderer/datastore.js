import path from 'path'
import Nedb from 'nedb'
import bluebird from 'bluebird'
import { remote } from 'electron'

bluebird.promisifyAll(Nedb.prototype)
const db = new Nedb({
  autoload: true,
  timestampData: true,
  filename: path.join(remote.app.getPath('userData'), '/data.db')
})
const Cursor = db.find().constructor
bluebird.promisifyAll(Cursor.prototype)

// db.update callback 函数有多个参数，需要单独处理
const update = db.update
db.updateAsync = function (...args) {
  return new Promise((resolve, reject) => {
    update.apply(db, [...args, (err, numAffected, affectedDocuments, upsert) => {
      return err ? reject(err) : resolve({
        numAffected,
        affectedDocuments,
        upsert
      })
    }])
  })
}

export default db
