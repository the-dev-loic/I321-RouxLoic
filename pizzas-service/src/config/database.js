// config/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbFile = process.env.DB_FILE || path.join(__dirname, '..', '..', 'pizzas.sqlite');

const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Could not connect to sqlite', err);
        process.exit(1);
    }
    console.log('Connected to sqlite database:', dbFile);
});

// Initialize tables if not exists.
// product_compositions links a pizza to ingredients owned by the ingredients
// microservice: ingredient_id is a remote reference (no FK, other database).
const initSql = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS pizzas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  imageUrl TEXT,
  price REAL NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS product_compositions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pizza_id INTEGER NOT NULL REFERENCES pizzas(id) ON DELETE CASCADE,
  ingredient_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE (pizza_id, ingredient_id)
);
`;

db.serialize(() => {
    db.exec(initSql, (err) => {
        if (err) {
            console.error('Failed to initialize database', err);
            process.exit(1);
        }
    });
});

module.exports = db;
