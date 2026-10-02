const router = require('express').Router();
const WeatherCondition = require('../models/WeatherCondition');
const auth = require('../middleware/auth');

router.get('/', auth(), async (req, res) => {
  try { res.json(await WeatherCondition.find()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth(), async (req, res) => {
  try {
    const w = await WeatherCondition.create(req.body);
    req.io.emit('resource:updated', { type: 'weather', data: w });
    res.status(201).json(w);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.patch('/:id', auth(), async (req, res) => {
  try {
    const w = await WeatherCondition.findByIdAndUpdate(req.params.id, req.body, { new: true });
    req.io.emit('resource:updated', { type: 'weather', data: w });
    res.json(w);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
