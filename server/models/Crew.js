const mongoose = require('mongoose');

const crewSchema = new mongoose.Schema({
  crewId: { type: String, required: true, unique: true },
  name: String,
  rank: String,
  availabilityStatus: { type: String, enum: ['AVAILABLE', 'ON_DUTY', 'REST', 'SICK', 'LEAVE'], default: 'AVAILABLE' },
  qualifications: [{ type: String, enum: ['F-16C', 'C-130J', 'UH-60', 'P-8A', 'MQ-9'] }],
  dutyStatus: { type: String, enum: ['ACTIVE', 'STANDBY', 'OFF'], default: 'STANDBY' },
  hoursLast7Days: { type: Number, default: 0 },
  maxDutyHours: { type: Number, default: 60 },
  currentAssignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Crew', crewSchema);
