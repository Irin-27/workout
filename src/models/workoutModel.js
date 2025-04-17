const mongoose = require('mongoose')

const Schema = mongoose.Schema

const workoutSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  reps: {
    type: Number,
    required: true
  },
  load: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'balance', 'hiit'],
    default: 'strength'
  },
  duration: {
    type: Number,
    default: null
  },
  notes: {
    type: String,
    default: ""
  },
  user_id: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Workout', workoutSchema)