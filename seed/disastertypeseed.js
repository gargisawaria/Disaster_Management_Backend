const db = require('../database'); // Adjust path if needed
const { v4: uuidv4 } = require('uuid');

const insertDisasterType = db.prepare(`INSERT INTO disaster_type (id, type) VALUES (?, ?)`);

insertDisasterType.run(uuidv4(), 'Flood');
insertDisasterType.run(uuidv4(), 'Earthquake');
insertDisasterType.run(uuidv4(), 'Fire');
insertDisasterType.run(uuidv4(), 'Cyclone');
insertDisasterType.run(uuidv4(), 'Tornado');
insertDisasterType.run(uuidv4(), 'Landslide');

insertDisasterType.finalize(() => {
  console.log('✅ Disaster types inserted!');
  db.close();
});
