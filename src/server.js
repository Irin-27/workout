require('dotenv').config();

const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const axios     = require('axios');
const cron      = require('node-cron');

const workoutRoutes = require('./routes/workouts');
const userRoutes    = require('./routes/user');

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'https://workout-frontend-weld.vercel.app',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// 1) Apply CORS to all routes
app.use(cors(corsOptions));

// 2) Explicitly handle preflight requests
app.options('*', cors(corsOptions));

console.log('CORS enabled for:', corsOptions.origin);

// Built‑in middleware
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Application routes
app.use('/api/workouts', workoutRoutes);
app.use('/api/user',     userRoutes);

// Health‑check endpoint (used by cron job)
app.get('/ping', (req, res) => {
  console.log(`Ping received at ${new Date().toISOString()}`);
  res.json({ message: 'Server is awake' });
});

// Cron job to keep Render “warm”
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:4000';
cron.schedule('*/14 * * * *', async () => {
  try {
    console.log('Running cron job…');
    const response = await axios.get(`${SERVER_URL}/ping`);
    console.log('Ping response:', response.data);
  } catch (err) {
    console.error('Cron error:', err);
  }
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to database');
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });
