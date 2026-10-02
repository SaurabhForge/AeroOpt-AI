const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  scheduleId: { type: String, required: true }, // groups all assignments from one optimize run
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  aircraftId: { type: mongoose.Schema.Types.ObjectId, ref: 'Aircraft' },
  crewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crew' },
  scheduledStart: Date,
  scheduledEnd: Date,
  status: { type: String, enum: ['PROPOSED', 'APPROVED', 'ACTIVE', 'COMPLETE', 'REJECTED', 'ROLLED_BACK'], default: 'PROPOSED' },
  constraintsSatisfied: [String],
  approvedBy: String,
  approvedAt: Date,
  version: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
