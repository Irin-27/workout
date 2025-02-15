require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const workoutRoutes = require('./routes/workouts')
const userRoutes = require('./routes/user')
const axios=require('axios')
const cron=require('node-cron')
const cors=require('cors')
// express app
const app = express()
app.use(cors({
  origin: process.env.SERVER_URL ||"*", // Allow all origins for now , later replace with frontend url
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true
}))
// middleware
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/api/workouts', workoutRoutes)
app.use('/api/user', userRoutes)
app.get('/ping', (req, res) => {
  console.log(`Ping received at ${new Date().toISOString()}`);
  res.json({ message: "Server is awake" });
});
const SERVER_URL = process.env.SERVER_URL || "http://localhost:4000"; // Use localhost for now
// Cron Job
cron.schedule('*/14 * * * *', async () => {
  try {
      console.log('Running cron job');
      const response = await axios.get(`${SERVER_URL}/ping`);
      console.log('API response:', response.data);
  } catch (error) {
      console.error('Error in cron job:', error);
  }
});

// connect to db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('connected to database')
    // listen to port
    app.listen(process.env.PORT||4000, () => {
      console.log('listening for requests on port', process.env.PORT||4000)
    })
  })
  .catch((err) => {
    console.error('Database connection failed:',err);
  }) 