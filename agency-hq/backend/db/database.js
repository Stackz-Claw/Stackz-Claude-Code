const Database = require('better-sqlite3')
const path = require('path')
const initSchema = require('./schema')

let db

function getDb() {
  if (!db) {
    const dbPath = path.join(__dirname, 'agency.db')
    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    initSchema(db)
  }
  return db
}

module.exports = { getDb }
