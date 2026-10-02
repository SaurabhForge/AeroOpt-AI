/**
 * AeroOpt AI — Constraint-Based Greedy Resource Scheduler
 * Equivalent logic to OR-Tools CP-SAT greedy with constraint propagation.
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Run the optimizer.
 * @param {Object} data - { aircraft[], crew[], tasks[], weather[], existingAssignments[] }
 * @returns {Object} { scheduleId, assignments[], unassigned[], metrics }
 */
function runOptimizer(data) {
  const startTime = Date.now();
  const { aircraft, crew, tasks, weather } = data;
  const scheduleId = uuidv4();
  const now = new Date();

  // ── HARD CONSTRAINTS ──────────────────────────────────────────
  // 1. Aircraft must be SERVICEABLE (not MAINTENANCE, GROUNDED, MISSION)
  const availableAircraft = aircraft.filter(a => {
    if (a.availabilityStatus !== 'SERVICEABLE') return false;
    // Maintenance window check
    if (a.maintenanceWindowStart && a.maintenanceWindowEnd) {
      const windowEnd = new Date(a.maintenanceWindowEnd);
      if (windowEnd > now) return false;
    }
    return true;
  });

  // 2. Crew must be AVAILABLE and not exceed duty hours
  const availableCrew = crew.filter(c =>
    c.availabilityStatus === 'AVAILABLE' &&
    c.hoursLast7Days < c.maxDutyHours
  );

  // 3. Active weather restrictions (level >= 3 = no-fly for sensitive tasks)
  const activeRestrictions = weather.filter(w =>
    w.restrictionLevel >= 3 &&
    (!w.validTo || new Date(w.validTo) > now)
  );

  // ── SORT: priority DESC, deadline ASC ─────────────────────────
  const sortedTasks = [...tasks]
    .filter(t => t.status === 'PENDING')
    .sort((a, b) => b.priority - a.priority || new Date(a.deadline) - new Date(b.deadline));

  const assignments = [];
  const unassigned = [];
  const usedAircraft = new Set();
  const usedCrew = new Set();

  for (const task of sortedTasks) {
    let assigned = false;
    let failReason = [];

    // Check weather block
    if (task.weatherSensitive && activeRestrictions.length > 0) {
      const blocked = activeRestrictions.some(w =>
        !w.affectedAircraftTypes?.length ||
        w.affectedAircraftTypes.includes(task.requiredAircraftType)
      );
      if (blocked) {
        unassigned.push({ task, reason: 'WEATHER_RESTRICTION' });
        continue;
      }
    }

    // Find matching aircraft
    const matchingAircraft = availableAircraft.filter(a =>
      !usedAircraft.has(a._id.toString()) &&
      (task.requiredAircraftType === 'ANY' || a.type === task.requiredAircraftType)
    );

    if (!matchingAircraft.length) {
      failReason.push(`No available ${task.requiredAircraftType} aircraft`);
    }

    // Find qualified crew
    const matchingCrew = availableCrew.filter(c =>
      !usedCrew.has(c._id.toString()) &&
      (task.requiredAircraftType === 'ANY' || c.qualifications.includes(task.requiredAircraftType))
    );

    if (!matchingCrew.length) {
      failReason.push(`No qualified crew for ${task.requiredAircraftType}`);
    }

    if (matchingAircraft.length && matchingCrew.length) {
      // Select: aircraft with highest fuel, crew with most remaining hours (load balancing)
      const ac = matchingAircraft.sort((a, b) => b.fuelLevel - a.fuelLevel)[0];
      const cr = matchingCrew.sort((a, b) => a.hoursLast7Days - b.hoursLast7Days)[0];

      const scheduledStart = new Date(now.getTime() + 30 * 60 * 1000); // +30min buffer
      const scheduledEnd = new Date(scheduledStart.getTime() + task.estimatedDuration * 60 * 1000);

      assignments.push({
        scheduleId,
        taskId: task._id,
        aircraftId: ac._id,
        crewId: cr._id,
        scheduledStart,
        scheduledEnd,
        status: 'PROPOSED',
        constraintsSatisfied: [
          'AIRCRAFT_SERVICEABLE',
          'CREW_AVAILABLE',
          'DUTY_HOURS_OK',
          ...(task.weatherSensitive ? ['WEATHER_CLEAR'] : [])
        ]
      });

      usedAircraft.add(ac._id.toString());
      usedCrew.add(cr._id.toString());
      assigned = true;
    }

    if (!assigned) {
      unassigned.push({ task, reason: failReason.join('; ') || 'RESOURCE_UNAVAILABLE' });
    }
  }

  const totalTasks = sortedTasks.length;
  const assignedCount = assignments.length;
  const aircraftUtilisation = availableAircraft.length
    ? Math.round((usedAircraft.size / availableAircraft.length) * 100)
    : 0;
  const crewUtilisation = availableCrew.length
    ? Math.round((usedCrew.size / availableCrew.length) * 100)
    : 0;

  return {
    scheduleId,
    assignments,
    unassigned,
    metrics: {
      totalTasks,
      assignedCount,
      unassignedCount: unassigned.length,
      assignmentRate: totalTasks ? Math.round((assignedCount / totalTasks) * 100) : 0,
      availableAircraft: availableAircraft.length,
      availableCrew: availableCrew.length,
      aircraftUtilisation,
      crewUtilisation,
      activeWeatherRestrictions: activeRestrictions.length,
      replanningTimeMs: Date.now() - startTime
    }
  };
}

module.exports = { runOptimizer };
