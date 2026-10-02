require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./models/User');
const { seedData } = require('./seeds/seed');
const redis = require('./lib/redis');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: 'http://localhost:5173', credentials: true } });

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// attach io to req
app.use((req, res, next) => { req.io = io; next(); });

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/aircraft', require('./routes/aircraft'));
app.use('/api/crew', require('./routes/crew'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/optimize', require('./routes/optimizer'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/scenarios', require('./routes/scenarios'));
app.use('/api/audit', require('./routes/audit'));
app.use('/api/reports', require('./routes/reports'));

// System status endpoint
app.get('/api/system/status', (req, res) => {
  res.json({
    status: 'OPERATIONAL',
    system: 'AeroOpt AI Tactical Engine',
    redis: redis.getStatus(),
    database: {
      type: 'MongoDB',
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState
    },
    timestamp: new Date().toISOString()
  });
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

async function start() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/aeroopt';
  let memoryServer = null;

  try {
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2500 });
    console.log('✅ Connected to MongoDB.');
  } catch (err) {
    console.log('⚠️  Local MongoDB not reachable. Initializing embedded in-memory MongoDB...');
    memoryServer = await MongoMemoryServer.create();
    const memUri = memoryServer.getUri();
    await mongoose.connect(memUri);
    console.log('✅ Connected to embedded in-memory MongoDB:', memUri);
  }

  // Auto-seed if database is empty
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('📦 Database is empty. Seeding initial mission & operations data...');
    await seedData();
  } else {
    console.log(`ℹ️  Existing records found (${userCount} users).`);
  }

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 AeroOpt AI Backend operational at http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('Fatal initialization error:', err);
  process.exit(1);
});
