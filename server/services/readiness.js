/**
 * Predictive readiness scoring.
 * Returns risk scores for aircraft and crew.
 */

function scoreAircraft(aircraft) {
  return aircraft.map(a => {
    const hoursRatio = a.hoursFlown / (a.maxHours || 200);
    const daysSinceService = a.lastServiceDate
      ? Math.floor((Date.now() - new Date(a.lastServiceDate)) / 86400000)
      : 999;
    // Risk 0-100: higher = riskier
    const risk = Math.min(100, Math.round(hoursRatio * 60 + Math.min(daysSinceService, 60) * 0.67));
    return {
      aircraftId: a.aircraftId,
      callsign: a.callsign,
      type: a.type,
      hoursFlown: a.hoursFlown,
      maxHours: a.maxHours,
      daysSinceService,
      maintenanceRisk: risk,
      riskLevel: risk >= 70 ? 'HIGH' : risk >= 40 ? 'MEDIUM' : 'LOW'
    };
  });
}

function scoreCrew(crew) {
  return crew.map(c => {
    const fatigue = Math.min(100, Math.round((c.hoursLast7Days / c.maxDutyHours) * 100));
    return {
      crewId: c.crewId,
      name: c.name,
      hoursLast7Days: c.hoursLast7Days,
      maxDutyHours: c.maxDutyHours,
      fatigueIndex: fatigue,
      riskLevel: fatigue >= 80 ? 'HIGH' : fatigue >= 50 ? 'MEDIUM' : 'LOW'
    };
  });
}

module.exports = { scoreAircraft, scoreCrew };
