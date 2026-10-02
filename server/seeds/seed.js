require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');
const Aircraft = require('../models/Aircraft');
const Crew = require('../models/Crew');
const Task = require('../models/Task');
const WeatherCondition = require('../models/WeatherCondition');

const now = new Date();
const h = (hrs) => new Date(now.getTime() + hrs * 3600000);

async function seedData() {
  console.log('Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Aircraft.deleteMany({}),
    Crew.deleteMany({}),
    Task.deleteMany({}),
    WeatherCondition.deleteMany({})
  ]);

  // ── Users (User.create triggers pre-save bcrypt hash) ───────────
  await User.create([
    { email: 'admin@aeroopt.ai', username: 'admin', password: 'Admin@1234', name: 'Air Marshal Singh', role: 'ADMIN' },
    { email: 'planner@aeroopt.ai', username: 'planner', password: 'Planner@1234', name: 'Sqn Ldr Patel', role: 'PLANNER' },
    { email: 'saurabhkr@aeroopt.ai', username: 'saurabhkr', password: 'Password@1234', name: 'Wg Cdr Saurabh Kumar', role: 'ADMIN' }
  ]);
  console.log('Users seeded (3)');

  // ── Aircraft ───────────────────────────────────────────────────
  await Aircraft.insertMany([
    { aircraftId: 'AO-01', callsign: 'HAWK-01', type: 'F-16C', availabilityStatus: 'SERVICEABLE', maintenanceStatus: 'CLEAR', lastServiceDate: new Date(now - 5*86400000), hoursFlown: 142, maxHours: 200, fuelLevel: 92 },
    { aircraftId: 'AO-02', callsign: 'HAWK-02', type: 'F-16C', availabilityStatus: 'SERVICEABLE', maintenanceStatus: 'CLEAR', lastServiceDate: new Date(now - 12*86400000), hoursFlown: 178, maxHours: 200, fuelLevel: 88 },
    { aircraftId: 'AO-03', callsign: 'HAWK-03', type: 'F-16C', availabilityStatus: 'MAINTENANCE', maintenanceStatus: 'SCHEDULED', maintenanceWindowStart: now, maintenanceWindowEnd: h(6), lastServiceDate: new Date(now - 30*86400000), hoursFlown: 198, maxHours: 200, fuelLevel: 60, notes: 'Engine inspection' },
    { aircraftId: 'AO-04', callsign: 'ATLAS-01', type: 'C-130J', availabilityStatus: 'SERVICEABLE', maintenanceStatus: 'CLEAR', lastServiceDate: new Date(now - 3*86400000), hoursFlown: 89, maxHours: 300, fuelLevel: 95 },
    { aircraftId: 'AO-05', callsign: 'ATLAS-02', type: 'C-130J', availabilityStatus: 'SERVICEABLE', maintenanceStatus: 'CLEAR', lastServiceDate: new Date(now - 8*86400000), hoursFlown: 145, maxHours: 300, fuelLevel: 78 },
    { aircraftId: 'AO-06', callsign: 'ATLAS-03', type: 'C-130J', availabilityStatus: 'GROUNDED', maintenanceStatus: 'UNSCHEDULED', lastServiceDate: new Date(now - 45*86400000), hoursFlown: 290, maxHours: 300, fuelLevel: 40, notes: 'Hydraulic fault — AOG' },
    { aircraftId: 'AO-07', callsign: 'EAGLE-01', type: 'UH-60', availabilityStatus: 'SERVICEABLE', maintenanceStatus: 'CLEAR', lastServiceDate: new Date(now - 2*86400000), hoursFlown: 55, maxHours: 150, fuelLevel: 90 },
    { aircraftId: 'AO-08', callsign: 'EAGLE-02', type: 'UH-60', availabilityStatus: 'SERVICEABLE', maintenanceStatus: 'CLEAR', lastServiceDate: new Date(now - 7*86400000), hoursFlown: 112, maxHours: 150, fuelLevel: 82 },
    { aircraftId: 'AO-09', callsign: 'POSEIDON-01', type: 'P-8A', availabilityStatus: 'SERVICEABLE', maintenanceStatus: 'CLEAR', lastServiceDate: new Date(now - 1*86400000), hoursFlown: 220, maxHours: 400, fuelLevel: 96 },
    { aircraftId: 'AO-10', callsign: 'REAPER-01', type: 'MQ-9', availabilityStatus: 'SERVICEABLE', maintenanceStatus: 'CLEAR', lastServiceDate: new Date(now - 4*86400000), hoursFlown: 310, maxHours: 500, fuelLevel: 88 }
  ]);
  console.log('Aircraft seeded (10)');

  // ── Crew ───────────────────────────────────────────────────────
  await Crew.insertMany([
    { crewId: 'CR-001', name: 'Wg Cdr Arjun Mehta', rank: 'Wing Commander', availabilityStatus: 'AVAILABLE', qualifications: ['F-16C'], dutyStatus: 'STANDBY', hoursLast7Days: 18, maxDutyHours: 60 },
    { crewId: 'CR-002', name: 'Sqn Ldr Priya Sharma', rank: 'Squadron Leader', availabilityStatus: 'AVAILABLE', qualifications: ['F-16C', 'C-130J'], dutyStatus: 'STANDBY', hoursLast7Days: 32, maxDutyHours: 60 },
    { crewId: 'CR-003', name: 'Flt Lt Rahul Verma', rank: 'Flight Lieutenant', availabilityStatus: 'AVAILABLE', qualifications: ['C-130J'], dutyStatus: 'STANDBY', hoursLast7Days: 24, maxDutyHours: 60 },
    { crewId: 'CR-004', name: 'Flt Lt Ananya Singh', rank: 'Flight Lieutenant', availabilityStatus: 'AVAILABLE', qualifications: ['UH-60', 'C-130J'], dutyStatus: 'STANDBY', hoursLast7Days: 40, maxDutyHours: 60 },
    { crewId: 'CR-005', name: 'Fg Offr Vikram Nair', rank: 'Flying Officer', availabilityStatus: 'AVAILABLE', qualifications: ['UH-60'], dutyStatus: 'STANDBY', hoursLast7Days: 12, maxDutyHours: 60 },
    { crewId: 'CR-006', name: 'Sqn Ldr Dev Kapoor', rank: 'Squadron Leader', availabilityStatus: 'REST', qualifications: ['P-8A', 'MQ-9'], dutyStatus: 'OFF', hoursLast7Days: 58, maxDutyHours: 60 },
    { crewId: 'CR-007', name: 'Flt Lt Meera Iyer', rank: 'Flight Lieutenant', availabilityStatus: 'AVAILABLE', qualifications: ['MQ-9'], dutyStatus: 'STANDBY', hoursLast7Days: 22, maxDutyHours: 60 },
    { crewId: 'CR-008', name: 'Fg Offr Sanjay Bose', rank: 'Flying Officer', availabilityStatus: 'SICK', qualifications: ['F-16C'], dutyStatus: 'OFF', hoursLast7Days: 10, maxDutyHours: 60 }
  ]);
  console.log('Crew seeded (8)');

  // ── Tasks ──────────────────────────────────────────────────────
  await Task.insertMany([
    { taskId: 'TSK-001', title: 'Northern Border Patrol', description: 'Air defence patrol along northern sector', priority: 5, deadline: h(3), requiredAircraftType: 'F-16C', estimatedDuration: 90, sector: 'NORTH', weatherSensitive: false, missionType: 'PATROL' },
    { taskId: 'TSK-002', title: 'Logistics Resupply — FWD Base', description: 'Resupply of forward operating base', priority: 4, deadline: h(5), requiredAircraftType: 'C-130J', estimatedDuration: 120, sector: 'WEST', weatherSensitive: true, missionType: 'TRANSPORT' },
    { taskId: 'TSK-003', title: 'MEDEVAC — Sector 7', description: 'Medical evacuation mission', priority: 5, deadline: h(1), requiredAircraftType: 'UH-60', estimatedDuration: 60, sector: 'EAST', weatherSensitive: true, missionType: 'MEDEVAC' },
    { taskId: 'TSK-004', title: 'Maritime Recon — Bay of Bengal', description: 'Long-range maritime surveillance', priority: 3, deadline: h(8), requiredAircraftType: 'P-8A', estimatedDuration: 240, sector: 'SOUTH', weatherSensitive: false, missionType: 'RECON' },
    { taskId: 'TSK-005', title: 'ISR Overwatch — FOB Kilo', description: 'Persistent surveillance of forward base', priority: 4, deadline: h(4), requiredAircraftType: 'MQ-9', estimatedDuration: 180, sector: 'NORTH', weatherSensitive: false, missionType: 'RECON' },
    { taskId: 'TSK-006', title: 'Combat Air Patrol — Sector 3', description: 'High-priority combat air patrol', priority: 5, deadline: h(2), requiredAircraftType: 'F-16C', estimatedDuration: 75, sector: 'WEST', weatherSensitive: false, missionType: 'PATROL' },
    { taskId: 'TSK-007', title: 'Troop Transport — Delta LZ', description: 'Rapid troop deployment to landing zone', priority: 3, deadline: h(6), requiredAircraftType: 'C-130J', estimatedDuration: 150, sector: 'CENTRAL', weatherSensitive: true, missionType: 'TRANSPORT' },
    { taskId: 'TSK-008', title: 'SAR — Pilot Recovery', description: 'Search and rescue for downed pilot', priority: 5, deadline: h(1), requiredAircraftType: 'UH-60', estimatedDuration: 120, sector: 'NORTH', weatherSensitive: true, missionType: 'SAR' },
    { taskId: 'TSK-009', title: 'Fighter Training — Block 3', description: 'Scheduled combat training sorties', priority: 2, deadline: h(10), requiredAircraftType: 'F-16C', estimatedDuration: 60, sector: 'TRAINING', weatherSensitive: false, missionType: 'TRAINING' },
    { taskId: 'TSK-010', title: 'Coastal Surveillance — West Coast', description: 'Anti-submarine patrol', priority: 3, deadline: h(7), requiredAircraftType: 'P-8A', estimatedDuration: 200, sector: 'WEST', weatherSensitive: false, missionType: 'RECON' },
    { taskId: 'TSK-011', title: 'Drone Strike Coordination', description: 'Precision overwatch for ground operation', priority: 4, deadline: h(3), requiredAircraftType: 'MQ-9', estimatedDuration: 120, sector: 'EAST', weatherSensitive: false, missionType: 'RECON' },
    { taskId: 'TSK-012', title: 'VIP Transport — Capital', description: 'Senior official transport mission', priority: 3, deadline: h(9), requiredAircraftType: 'C-130J', estimatedDuration: 90, sector: 'CENTRAL', weatherSensitive: false, missionType: 'TRANSPORT' }
  ]);
  console.log('Tasks seeded (12)');

  // ── Weather ────────────────────────────────────────────────────
  await WeatherCondition.insertMany([
    { regionId: 'SECTOR-NORTH', regionName: 'Northern Sector', condition: 'CLEAR', restrictionLevel: 0, validFrom: now, validTo: h(12) },
    { regionId: 'SECTOR-WEST', regionName: 'Western Sector', condition: 'STORM', restrictionLevel: 3, affectedAircraftTypes: ['UH-60', 'C-130J'], validFrom: now, validTo: h(4), notes: 'Convective storm cells, avoid IFR below FL180' },
    { regionId: 'SECTOR-SOUTH', regionName: 'Southern Sector', condition: 'CLOUDY', restrictionLevel: 1, validFrom: now, validTo: h(6) }
  ]);
  console.log('Weather conditions seeded (3)');

  console.log('\n✅ Seed complete!');
  console.log('  admin@aeroopt.ai  / Admin@1234');
  console.log('  planner@aeroopt.ai / Planner@1234');
}

async function runStandalone() {
  let memServer = null;
  try {
    console.log('Attempting connection to:', process.env.MONGO_URI || 'mongodb://localhost:27017/aeroopt');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aeroopt', {
      serverSelectionTimeoutMS: 2500
    });
    console.log('Connected to MongoDB.');
  } catch (err) {
    console.log('Local MongoDB not reachable. Testing in-memory MongoDB seed...');
    memServer = await MongoMemoryServer.create();
    const uri = memServer.getUri();
    await mongoose.connect(uri);
    console.log('Connected to In-Memory MongoDB:', uri);
  }

  await seedData();

  await mongoose.disconnect();
  if (memServer) await memServer.stop();
  console.log('Done.');
}

if (require.main === module) {
  runStandalone().catch(err => {
    console.error('Seed execution error:', err);
    process.exit(1);
  });
}

module.exports = { seedData };
