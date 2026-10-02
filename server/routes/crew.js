const router = require('express').Router();
const Crew = require('../models/Crew');
const auth = require('../middleware/auth');
const auditLogger = require('../middleware/auditLogger');

router.get('/', auth(), async (req, res) => {
  try { res.json(await Crew.find().sort({ crewId: 1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/:id/status', auth(), auditLogger('CREW_STATUS_UPDATE'), async (req, res) => {
  try {
    const cr = await Crew.findByIdAndUpdate(req.params.id, req.body, { new: true });
    req.io.emit('resource:updated', { type: 'crew', data: cr });
    res.json(cr);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
