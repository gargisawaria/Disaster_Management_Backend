// db.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./mydb.sqlite', (err) => {
  if (err) return console.error(err.message);
  console.log('Connected to SQLite database.');
});

db.serialize(() => {
  // Enable foreign key constraints
  db.run(`PRAGMA foreign_keys = ON`);

  // Severity table
  db.run(`CREATE TABLE IF NOT EXISTS severity (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL
  )`);

  // Disaster Type table
  db.run(`CREATE TABLE IF NOT EXISTS disaster_type (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL
  )`);

  // Incident table
  db.run(`CREATE TABLE IF NOT EXISTS incident (
    id TEXT PRIMARY KEY,
    incidentType TEXT NOT NULL,
    severity TEXT NOT NULL,
    description TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    reporterName TEXT,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (incidentType) REFERENCES disaster_type(id),
    FOREIGN KEY (severity) REFERENCES severity(id)
  )`);
});

module.exports = db;
