const router = require('express').Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const auditLogger = require('../middleware/auditLogger');

router.get('/', auth(), async (req, res) => {
  try { res.json(await Task.find().sort({ priority: -1, deadline: 1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth(), auditLogger('TASK_CREATE'), async (req, res) => {
  try { res.status(201).json(await Task.create(req.body)); }
  catch (err) { res.status(400).json({ error: err.message }); }
});

router.patch('/:id', auth(), auditLogger('TASK_UPDATE'), async (req, res) => {
  try { res.json(await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth(['ADMIN']), auditLogger('TASK_DELETE'), async (req, res) => {
  try { await Task.findByIdAndDelete(req.params.id); res.json({ ok: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
