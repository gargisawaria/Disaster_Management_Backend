const db = require('../database');
const { v4: uuidv4 } = require('uuid');

const insertSeverity = db.prepare(`INSERT INTO severity (id, type) VALUES (?, ?)`);

insertSeverity.run(uuidv4(), 'Low');
insertSeverity.run(uuidv4(), 'Medium');
insertSeverity.run(uuidv4(), 'High');
insertSeverity.run(uuidv4(), 'Critical'); 
insertSeverity.finalize(() => {
  console.log('Severity data inserted!');
  db.close();
}); 