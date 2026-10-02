const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  regionId: { type: String, required: true },
  regionName: String,
  condition: { type: String, enum: ['CLEAR', 'CLOUDY', 'STORM', 'RESTRICTED', 'EXTREME'], default: 'CLEAR' },
  restrictionLevel: { type: Number, min: 0, max: 5, default: 0 }, // 0=none, 5=no-fly
  affectedAircraftTypes: [String],
  validFrom: Date,
  validTo: Date,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('WeatherCondition', weatherSchema);
