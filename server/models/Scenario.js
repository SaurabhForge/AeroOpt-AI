const mongoose = require('mongoose');

const scenarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  disruptionType: { type: String, enum: ['AIRCRAFT_UNAVAILABLE', 'CREW_SHORTAGE', 'WEATHER_RESTRICTION', 'COMBINED'] },
  parameters: mongoose.Schema.Types.Mixed,
  baselineScheduleId: String,
  resultScheduleId: String,
  metrics: {
    baselineAssigned: Number,
    resultAssigned: Number,
    baselineUtilisation: Number,
    resultUtilisation: Number,
    affectedTasks: Number,
    replanningTimeMs: Number
  },
  status: { type: String, enum: ['DRAFT', 'RUNNING', 'COMPLETE', 'FAILED'], default: 'DRAFT' },
  createdBy: String
}, { timestamps: true });

module.exports = mongoose.model('Scenario', scenarioSchema);
