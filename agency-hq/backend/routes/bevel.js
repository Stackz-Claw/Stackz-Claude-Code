const express = require('express')
const router = express.Router()

// Bevel API configuration
// You'll need to set BEVEL_API_KEY in your .env file
const BEVEL_API_BASE = process.env.BEVEL_API_BASE || 'https://api.getbevel.com/v1'

// Mock health data (replace with actual API calls when connected)
const generateHealthMetrics = () => {
  const today = new Date()
  return {
    // Daily metrics
    daily: {
      date: today.toISOString().split('T')[0],
      steps: Math.floor(8000 + Math.random() * 6000),
      active_minutes: Math.floor(30 + Math.random() * 60),
      calories: Math.floor(2000 + Math.random() * 1000),
      sleep_hours: Math.floor(6 + Math.random() * 3),
      sleep_quality: Math.floor(70 + Math.random() * 30),
      heart_rate_avg: Math.floor(60 + Math.random() * 20),
      heart_rate_resting: Math.floor(55 + Math.random() * 15),
      hrv: Math.floor(30 + Math.random() * 40),
      stress_level: Math.floor(20 + Math.random() * 40),
      mood: ['great', 'good', 'okay', 'low'][Math.floor(Math.random() * 4)],
    },
    // Weekly summary
    weekly: {
      avg_steps: Math.floor(8000 + Math.random() * 4000),
      avg_sleep: Math.floor(6.5 + Math.random() * 2),
      avg_hr: Math.floor(60 + Math.random() * 15),
      workout_days: Math.floor(3 + Math.random() * 3),
      total_active_minutes: Math.floor(150 + Math.random() * 150),
    },
    // Biometrics
    biometrics: {
      weight: Math.floor(160 + Math.random() * 30) + Math.random(),
      body_fat: Math.floor(15 + Math.random() * 10),
      muscle_mass: Math.floor(70 + Math.random() * 15),
      bmi: Math.floor(22 + Math.random() * 4) + Math.random(),
      blood_pressure_systolic: Math.floor(110 + Math.random() * 20),
      blood_pressure_diastolic: Math.floor(70 + Math.random() * 15),
      blood_oxygen: Math.floor(96 + Math.random() * 4),
      skin_temp: Math.floor(96 + Math.random() * 4),
    },
    // Vitals trend (last 7 days)
    vitals_trend: Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return {
        date: d.toISOString().split('T')[0],
        heart_rate: Math.floor(55 + Math.random() * 25),
        hrv: Math.floor(25 + Math.random() * 45),
        sleep_hours: Math.floor(5 + Math.random() * 4),
        steps: Math.floor(5000 + Math.random() * 8000),
      }
    }),
    // Workouts
    workouts: [
      {
        id: 'wo_001',
        type: 'Strength',
        duration: 45,
        calories: 320,
        intensity: 'moderate',
        date: new Date().toISOString().split('T')[0],
      },
      {
        id: 'wo_002',
        type: 'Cardio',
        duration: 30,
        calories: 280,
        intensity: 'high',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      },
    ],
    last_sync: new Date().toISOString(),
  }
}

// GET health metrics
router.get('/health', (req, res) => {
  try {
    const metrics = generateHealthMetrics()
    res.json({
      success: true,
      source: 'mock', // Change to 'bevel' when real API is connected
      data: metrics,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET daily summary
router.get('/daily', (req, res) => {
  try {
    const metrics = generateHealthMetrics()
    res.json({
      success: true,
      data: metrics.daily,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET weekly summary
router.get('/weekly', (req, res) => {
  try {
    const metrics = generateHealthMetrics()
    res.json({
      success: true,
      data: metrics.weekly,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET biometrics
router.get('/biometrics', (req, res) => {
  try {
    const metrics = generateHealthMetrics()
    res.json({
      success: true,
      data: metrics.biometrics,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET vitals trend
router.get('/vitals', (req, res) => {
  try {
    const metrics = generateHealthMetrics()
    res.json({
      success: true,
      data: metrics.vitals_trend,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET workouts
router.get('/workouts', (req, res) => {
  try {
    const metrics = generateHealthMetrics()
    res.json({
      success: true,
      data: metrics.workouts,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST sync (placeholder for real Bevel API integration)
router.post('/sync', (req, res) => {
  // This would be used to push data TO Bevel
  // For now, just returns success
  res.json({
    success: true,
    message: 'Sync endpoint ready. Add BEVEL_API_KEY to .env to connect to real API.',
  })
})

module.exports = router