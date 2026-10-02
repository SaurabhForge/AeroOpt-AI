const router = require('express').Router();
const Scenario = require('../models/Scenario');
const Aircraft = require('../models/Aircraft');
const Crew = require('../models/Crew');
const Task = require('../models/Task');
const WeatherCondition = require('../models/WeatherCondition');
const Assignment = require('../models/Assignment');
const { runOptimizer } = require('../services/optimizer');
const auth = require('../middleware/auth');

router.get('/', auth(), async (req, res) => {
  try { res.json(await Scenario.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth(), async (req, res) => {
  try {
    const scenario = await Scenario.create({ ...req.body, createdBy: req.user.email, status: 'DRAFT' });
    res.status(201).json(scenario);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.post('/:id/run', auth(), async (req, res) => {
  try {
    const scenario = await Scenario.findById(req.params.id);
    if (!scenario) return res.status(404).json({ error: 'Scenario not found' });

    await Scenario.findByIdAndUpdate(req.params.id, { status: 'RUNNING' });

    // Load current data
    let [aircraft, crew, tasks, weather] = await Promise.all([
      Aircraft.find(), Crew.find(),
      Task.find({ status: 'PENDING' }), WeatherCondition.find()
    ]);

    // Apply disruptions (in-memory, doesn't persist)
    const params = scenario.parameters || {};
    if (scenario.disruptionType === 'AIRCRAFT_UNAVAILABLE' && params.aircraftId) {
      aircraft = aircraft.map(a =>
        a.aircraftId === params.aircraftId ? { ...a.toObject(), availabilityStatus: 'GROUNDED' } : a
      );
    }
    if (scenario.disruptionType === 'CREW_SHORTAGE' && params.crewId) {
      crew = crew.map(c =>
        c.crewId === params.crewId ? { ...c.toObject(), availabilityStatus: 'SICK' } : c
      );
    }
    if (scenario.disruptionType === 'WEATHER_RESTRICTION') {
      weather = [...weather, {
        _id: 'scenario-wx', regionId: params.regionId || 'SECTOR-3',
        condition: 'STORM', restrictionLevel: 4,
        affectedAircraftTypes: params.affectedTypes || [],
        validFrom: new Date(), validTo: new Date(Date.now() + 6 * 3600000)
      }];
    }

    // Run baseline
    const [baselineAircraft, baselineCrew, baselineTasks, baselineWeather] = await Promise.all([
      Aircraft.find(), Crew.find(), Task.find({ status: 'PENDING' }), WeatherCondition.find()
    ]);
    const baseline = runOptimizer({ aircraft: baselineAircraft, crew: baselineCrew, tasks: baselineTasks, weather: baselineWeather });

    // Run scenario
    const result = runOptimizer({ aircraft, crew, tasks, weather });

    // Save assignments
    if (result.assignments.length) await Assignment.insertMany(result.assignments);

    const updated = await Scenario.findByIdAndUpdate(req.params.id, {
      status: 'COMPLETE',
      baselineScheduleId: baseline.scheduleId,
      resultScheduleId: result.scheduleId,
      metrics: {
        baselineAssigned: baseline.metrics.assignedCount,
        resultAssigned: result.metrics.assignedCount,
        baselineUtilisation: baseline.metrics.aircraftUtilisation,
        resultUtilisation: result.metrics.aircraftUtilisation,
        affectedTasks: baseline.metrics.assignedCount - result.metrics.assignedCount,
        replanningTimeMs: result.metrics.replanningTimeMs
      }
    }, { new: true });

    req.io.emit('scenario:complete', { scenarioId: req.params.id, metrics: updated.metrics });
    res.json({ scenario: updated, baseline: baseline.metrics, result: result.metrics,
      baselineAssignments: baseline.assignments, resultAssignments: result.assignments,
      unassigned: result.unassigned });
  } catch (err) {
    await Scenario.findByIdAndUpdate(req.params.id, { status: 'FAILED' }).catch(() => {});
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
