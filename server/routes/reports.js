const router = require('express').Router();
const auth = require('../middleware/auth');
const Aircraft = require('../models/Aircraft');
const Crew = require('../models/Crew');
const { scoreAircraft, scoreCrew } = require('../services/readiness');

router.get('/readiness', auth(), async (req, res) => {
  try {
    const [aircraft, crew] = await Promise.all([Aircraft.find(), Crew.find()]);
    res.json({
      aircraft: scoreAircraft(aircraft),
      crew: scoreCrew(crew)
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
