const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  priority: { type: Number, min: 1, max: 5, required: true },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETE', 'CANCELLED', 'FAILED'], default: 'PENDING' },
  requiredAircraftType: { type: String, enum: ['F-16C', 'C-130J', 'UH-60', 'P-8A', 'MQ-9', 'ANY'] },
  estimatedDuration: { type: Number, default: 120 }, // minutes
  sector: String,
  weatherSensitive: { type: Boolean, default: false },
  missionType: { type: String, enum: ['RECON', 'TRANSPORT', 'PATROL', 'TRAINING', 'SAR', 'MEDEVAC'], default: 'PATROL' }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
