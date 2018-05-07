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

export default db
