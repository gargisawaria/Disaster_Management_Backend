// models/incident.js

class Incident {
  constructor(id, incidentType, severity, description, latitude, longitude, reporterName, timestamp) {
    this.id = id;
    this.incidentType = incidentType;
    this.severity = severity;
    this.description = description;
    this.latitude = latitude;
    this.longitude = longitude;
    this.reporterName = reporterName;
    this.timestamp = timestamp;
  }
}

module.exports = Incident;
