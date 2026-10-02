const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  userId: String,
  userEmail: String,
  action: String,
  method: String,
  path: String,
  payload: mongoose.Schema.Types.Mixed,
  result: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditSchema);
