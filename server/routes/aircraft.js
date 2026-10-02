const router = require('express').Router();
const Aircraft = require('../models/Aircraft');
const auth = require('../middleware/auth');
const auditLogger = require('../middleware/auditLogger');
const redis = require('../lib/redis');

router.get('/', auth(), async (req, res) => {
  try { res.json(await Aircraft.find().sort({ aircraftId: 1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', auth(), async (req, res) => {
  try { res.json(await Aircraft.findById(req.params.id)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/:id/status', auth(), auditLogger('AIRCRAFT_STATUS_UPDATE'), async (req, res) => {
  try {
    const { availabilityStatus, maintenanceStatus, maintenanceWindowStart, maintenanceWindowEnd, notes } = req.body;
    const ac = await Aircraft.findByIdAndUpdate(
      req.params.id,
      { availabilityStatus, maintenanceStatus, maintenanceWindowStart, maintenanceWindowEnd, notes },
      { new: true, runValidators: true }
    );

    // Invalidate optimizer cache in Redis
    await redis.del('cache:optimizer:schedule:latest');

    req.io.emit('resource:updated', { type: 'aircraft', data: ac });
    res.json(ac);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/:id', auth(['ADMIN']), auditLogger('AIRCRAFT_UPDATE'), async (req, res) => {
  try {
    const ac = await Aircraft.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await redis.del('cache:optimizer:schedule:latest');
    req.io.emit('resource:updated', { type: 'aircraft', data: ac });
    res.json(ac);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
