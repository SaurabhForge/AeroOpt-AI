const AuditLog = require('../models/AuditLog');

const auditLogger = (action) => async (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = async (body) => {
    if (res.statusCode < 400 && req.user) {
      await AuditLog.create({
        userId: req.user.id,
        userEmail: req.user.email,
        action,
        method: req.method,
        path: req.path,
        payload: req.body,
        result: body,
        timestamp: new Date()
      }).catch(() => {});
    }
    return originalJson(body);
  };
  next();
};

module.exports = auditLogger;
