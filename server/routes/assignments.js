const router = require('express').Router();
const Assignment = require('../models/Assignment');
const Task = require('../models/Task');
const AuditLog = require('../models/AuditLog');
const auth = require('../middleware/auth');

router.get('/', auth(), async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('taskId')
      .populate('aircraftId')
      .populate('crewId')
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/schedule/:scheduleId', auth(), async (req, res) => {
  try {
    const assignments = await Assignment.find({ scheduleId: req.params.scheduleId })
      .populate('taskId').populate('aircraftId').populate('crewId');
    res.json(assignments);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/:id/approve', auth(['PLANNER', 'ADMIN']), async (req, res) => {
  try {
    const prev = await Assignment.findById(req.params.id).lean();
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { status: 'APPROVED', approvedBy: req.user.email, approvedAt: new Date() },
      { new: true }
    ).populate('taskId').populate('aircraftId').populate('crewId');

    // Update task status
    if (assignment.taskId) {
      await Task.findByIdAndUpdate(assignment.taskId._id, { status: 'ASSIGNED' });
    }

    // Log
    await AuditLog.create({
      userId: req.user.id, userEmail: req.user.email,
      action: 'SCHEDULE_APPROVED',
      payload: { assignmentId: req.params.id, previousStatus: prev.status },
      result: { status: 'APPROVED' },
      timestamp: new Date()
    });

    req.io.emit('schedule:approved', { assignmentId: req.params.id, approvedBy: req.user.email });
    res.json(assignment);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/:id/reject', auth(['PLANNER', 'ADMIN']), async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id, { status: 'REJECTED' }, { new: true }
    );
    await AuditLog.create({
      userId: req.user.id, userEmail: req.user.email,
      action: 'SCHEDULE_REJECTED',
      payload: { assignmentId: req.params.id },
      result: { status: 'REJECTED' },
      timestamp: new Date()
    });
    req.io.emit('schedule:rejected', { assignmentId: req.params.id });
    res.json(assignment);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/:id/rollback', auth(['ADMIN']), async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id, { status: 'ROLLED_BACK' }, { new: true }
    );
    if (assignment.taskId) {
      await Task.findByIdAndUpdate(assignment.taskId, { status: 'PENDING' });
    }
    await AuditLog.create({
      userId: req.user.id, userEmail: req.user.email,
      action: 'SCHEDULE_ROLLBACK',
      payload: { assignmentId: req.params.id },
      result: { status: 'ROLLED_BACK' },
      timestamp: new Date()
    });
    res.json(assignment);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
