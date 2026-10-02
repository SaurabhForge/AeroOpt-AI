const mongoose = require('mongoose');

const aircraftSchema = new mongoose.Schema({
  aircraftId: { type: String, required: true, unique: true },
  callsign: String,
  type: { type: String, enum: ['F-16C', 'C-130J', 'UH-60', 'P-8A', 'MQ-9'], required: true },
  availabilityStatus: { type: String, enum: ['SERVICEABLE', 'MAINTENANCE', 'GROUNDED', 'MISSION'], default: 'SERVICEABLE' },
  maintenanceStatus: { type: String, enum: ['CLEAR', 'SCHEDULED', 'UNSCHEDULED', 'COMPLETE'], default: 'CLEAR' },
  maintenanceWindowStart: Date,
  maintenanceWindowEnd: Date,
  lastServiceDate: Date,
  hoursFlown: { type: Number, default: 0 },
  maxHours: { type: Number, default: 200 },
  location: { type: String, default: 'BASE-ALPHA' },
  fuelLevel: { type: Number, min: 0, max: 100, default: 85 },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Aircraft', aircraftSchema);
