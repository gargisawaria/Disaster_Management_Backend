// seed/incidentseed.js
const db = require('../database');
const { v4: uuidv4 } = require('uuid');

const insertIncident = db.prepare(`
  INSERT INTO incident (
    id, incidentType, severity, description,
    latitude, longitude, reporterName, timestamp
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

insertIncident.run(
  uuidv4(),
  '89384d66-5f97-41bf-a5ef-2165babeccfb', // Flood
  'e4de7d10-d072-496d-bfa7-7a3de5b3a613', // Low
  'Minor flooding observed near Ganga river',
  25.5941,
  85.1376,
  'Amit Sharma',
  new Date().toISOString()
);

insertIncident.run(
  uuidv4(),
  '4419691d-a52a-4701-bfdf-216c9a4661a7', // Earthquake
  'dfc15d28-5feb-42a2-bca6-05c51c4e8ab9', // Critical
  'Strong tremors felt in central Delhi',
  28.6139,
  77.2090,
  'Neha Singh',
  new Date().toISOString()
);

insertIncident.run(
  uuidv4(),
  '3ebfffe8-1ccb-4428-9753-ad13c9331cb3', // Fire
  'b12521fe-f253-4ecf-b4c1-70831173c915', // High
  'Fire outbreak in industrial area',
  19.0760,
  72.8777,
  'Ravi Patel',
  new Date().toISOString()
);

insertIncident.run(
  uuidv4(),
  'e55a10c3-35a2-400a-8195-497647e6bba5', // Cyclone
  '74e700a2-57d3-4d95-883b-bbf7fa6d5b83', // Medium
  'Cyclone alert in Chennai coast',
  13.0827,
  80.2707,
  'Pooja Nair',
  new Date().toISOString()
);

insertIncident.run(
  uuidv4(),
  'ebb73fd9-6aec-40e1-b287-86ec2949fa9c', // Tornado
  'e4de7d10-d072-496d-bfa7-7a3de5b3a613', // Low
  'Small tornado spotted near farmland',
  22.7196,
  75.8577,
  'Suresh Kumar',
  new Date().toISOString()
);

insertIncident.run(
  uuidv4(),
  'a61c32b5-a1c7-44d7-9dd4-1e7e4ac9b17b', // Landslide
  'b12521fe-f253-4ecf-b4c1-70831173c915', // High
  'Landslide blocked highway near Shimla',
  31.1048,
  77.1734,
  'Karan Rawat',
  new Date().toISOString()
);

insertIncident.run(
  uuidv4(),
  '89384d66-5f97-41bf-a5ef-2165babeccfb', // Flood
  '74e700a2-57d3-4d95-883b-bbf7fa6d5b83', // Medium
  'Water level rising due to continuous rains',
  23.2599,
  77.4126,
  'Priya Mehta',
  new Date().toISOString()
);

insertIncident.run(
  uuidv4(),
  '4419691d-a52a-4701-bfdf-216c9a4661a7', // Earthquake
  'e4de7d10-d072-496d-bfa7-7a3de5b3a613', // Low
  'Mild earthquake reported in Uttarakhand',
  30.0668,
  79.0193,
  'Anil Joshi',
  new Date().toISOString()
);

insertIncident.run(
  uuidv4(),
  '3ebfffe8-1ccb-4428-9753-ad13c9331cb3', // Fire
  'dfc15d28-5feb-42a2-bca6-05c51c4e8ab9', // Critical
  'Major fire at chemical plant',
  26.9124,
  75.7873,
  'Sunita Yadav',
  new Date().toISOString()
);

insertIncident.run(
  uuidv4(),
  'ebb73fd9-6aec-40e1-b287-86ec2949fa9c', // Tornado
  '74e700a2-57d3-4d95-883b-bbf7fa6d5b83', // Medium
  'Tornado caused damage to crops',
  27.1767,
  78.0081,
  'Mohit Verma',
  new Date().toISOString()
);

insertIncident.finalize(() => {
  console.log('10 Incident seed data inserted!');
  db.close();
});
