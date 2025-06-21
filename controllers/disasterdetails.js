const express = require('express');
const router = express.Router();
const db = require('../database');
const Severity = require('../models/severity');
const DisasterType = require('../models/disastertype');
const Incident= require('../models/incident');
/**
 * @swagger
 * /severities:
 *   get:
 *     summary: Get all severity types
 *     description: Returns a list of all severities from the database.
 *     responses:
 *       200:
 *         description: A list of severity items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   type:
 *                     type: string
 */
router.get('/severities', (req, res) => {
  db.all('SELECT * FROM severity', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error' });

    const severities = rows.map(row => new Severity(row.id, row.type));
    res.status(200).json(severities);
  });
});

/**
 * @swagger
 * /disastertypes:
 *   get:
 *     summary: Get all disaster types
 *     description: Returns a list of all disaster types from the database.
 *     responses:
 *       200:
 *         description: A list of disaster types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   type:
 *                     type: string
 */
router.get('/disastertypes', async(req, res) => {
 await db.all('SELECT * FROM disaster_type', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error' });

    const disasterTypes = rows.map(row => new DisasterType(row.id, row.type));
    res.status(200).json(disasterTypes);
  });
});

/**
 * @swagger
 * /incidents:
 *   get:
 *     summary: Get all incidents
 *     description: Returns a list of incidents with human-readable severity and incident type. You can filter using query parameters like severity, incident type, and date range.
 *     parameters:
 *       - in: query
 *         name: severities
 *         schema:
 *           type: string
 *         required: false
 *         description: Comma-separated list of severity types (e.g., High,Low)
 *       - in: query
 *         name: incidentTypes
 *         schema:
 *           type: string
 *         required: false
 *         description: Comma-separated list of disaster types (e.g., Fire,Flood)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Start date for filtering (e.g., 2025-06-01)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: End date for filtering (e.g., 2025-06-14)
 *     responses:
 *       200:
 *         description: A list of incident items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   incidentType:
 *                     type: string
 *                   severity:
 *                     type: string
 *                   description:
 *                     type: string
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *                   reporterName:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 */

router.get('/incidents', (req, res) => {
  const { severities, incidentTypes, startDate, endDate } = req.query;

  const severityList = severities ? severities.split(',') : [];
  const typeList = incidentTypes ? incidentTypes.split(',') : [];

  let query = `
    SELECT i.id, dt.type AS incidentType, s.type AS severity, 
           i.description, i.latitude, i.longitude, i.reporterName, i.timestamp
    FROM incident i
    JOIN disaster_type dt ON i.incidentType = dt.id
    JOIN severity s ON i.severity = s.id
  `;

  const conditions = [];
  const params = [];

  if (typeList.length > 0) {
    conditions.push(`dt.type IN (${typeList.map(() => '?').join(', ')})`);
    params.push(...typeList);
  }

  if (severityList.length > 0) {
    conditions.push(`s.type IN (${severityList.map(() => '?').join(', ')})`);
    params.push(...severityList);
  }

  if (startDate && endDate) {
    conditions.push(`DATE(i.timestamp) BETWEEN DATE(?) AND DATE(?)`);
    params.push(startDate, endDate);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error' });

    const incidents = rows.map(row =>
      new Incident(
        row.id,
        row.incidentType,
        row.severity,
        row.description,
        row.latitude,
        row.longitude,
        row.reporterName,
        row.timestamp
      )
    );

    res.status(200).json(incidents);
  });
});


const { v4: uuidv4 } = require('uuid');

/**
 * @swagger
 * /incidents:
 *   post:
 *     summary: Create a new incident
 *     description: Adds a new incident to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - incidentType
 *               - severity
 *               - description
 *               - latitude
 *               - longitude
 *             properties:
 *               incidentType:
 *                 type: string
 *                 description: ID of the disaster type
 *               severity:
 *                 type: string
 *                 description: ID of the severity level
 *               description:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               reporterName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Incident created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/incidents', (req, res) => {
  const body = req.body;

  const requiredFields = ['incidentType', 'severity', 'description', 'latitude', 'longitude'];
  for (const field of requiredFields) {
    if (body[field] == null) {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }

  const id = uuidv4();
  const timestamp = new Date().toISOString();

  const incident = new Incident(
    id,
    body.incidentType,
    body.severity,
    body.description,
    body.latitude,
    body.longitude,
    body.reporterName,
    timestamp
  );

  const query = `
    INSERT INTO incident (id, incidentType, severity, description, latitude, longitude, reporterName, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      incident.id,
      incident.incidentType,
      incident.severity,
      incident.description,
      incident.latitude,
      incident.longitude,
      incident.reporterName,
      incident.timestamp
    ],
    function (err) {
      if (err) return res.status(500).json({ error: 'Internal Server Error' });

      res.status(201).json({ message: 'Incident created', id: incident.id });
    }
  );
});


module.exports = router;
