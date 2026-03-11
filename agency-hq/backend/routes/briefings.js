const express = require('express')
const router = express.Router()
const { getDb } = require('../db/database')

// POST /api/briefings - Create or update a briefing
router.post('/', (req, res) => {
  const {
    date,
    generated_at,
    period,
    highlights,
    stats,
    activity_feed,
    by_agent,
    by_category,
    pending_for_jaleel,
    idea_threads,
    obsidian_notes_touched
  } = req.body

  if (!date || !generated_at || !period) {
    return res.status(400).json({ error: 'Missing required fields: date, generated_at, period' })
  }

  try {
    const db = getDb()
    const payload = JSON.stringify(req.body)

    // Check if briefing already exists for this date
    const existing = db.prepare('SELECT id FROM briefings WHERE date = ?').get(date)

    if (existing) {
      // Update existing briefing
      db.prepare(`
        UPDATE briefings SET
          generated_at = ?,
          period_from = ?,
          period_to = ?,
          payload = ?,
          highlights_count = ?,
          events_count = ?,
          pending_count = ?
        WHERE date = ?
      `).run(
        generated_at,
        period.from,
        period.to,
        payload,
        highlights?.length || 0,
        activity_feed?.length || 0,
        pending_for_jaleel?.length || 0,
        date
      )

      // Emit socket event
      const io = req.app.get('io')
      if (io) {
        io.emit('briefing:updated', { date, updated_at: new Date().toISOString() })
      }

      res.json({ success: true, date, updated: true })
    } else {
      // Insert new briefing
      const result = db.prepare(`
        INSERT INTO briefings (date, generated_at, period_from, period_to, payload, highlights_count, events_count, pending_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        date,
        generated_at,
        period.from,
        period.to,
        payload,
        highlights?.length || 0,
        activity_feed?.length || 0,
        pending_for_jaleel?.length || 0
      )

      // Emit socket event
      const io = req.app.get('io')
      if (io) {
        io.emit('briefing:updated', { date, is_new: true })
      }

      res.json({ success: true, id: result.lastInsertRowid, date })
    }
  } catch (error) {
    console.error('[BriefingsAPI] Error saving briefing:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/briefings/latest - Get the most recent briefing
router.get('/latest', (req, res) => {
  try {
    const db = getDb()
    const briefing = db.prepare('SELECT * FROM briefings ORDER BY date DESC LIMIT 1').get()

    if (!briefing) {
      return res.status(404).json({ error: 'No briefings found' })
    }

    const payload = JSON.parse(briefing.payload)
    res.json({
      ...payload,
      id: briefing.id,
      created_at: briefing.created_at
    })
  } catch (error) {
    console.error('[BriefingsAPI] Error fetching latest briefing:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/briefings/:date - Get briefing for a specific date
router.get('/:date', (req, res) => {
  const { date } = req.params

  try {
    const db = getDb()
    const briefing = db.prepare('SELECT * FROM briefings WHERE date = ?').get(date)

    if (!briefing) {
      return res.status(404).json({ error: `No briefing found for date: ${date}` })
    }

    const payload = JSON.parse(briefing.payload)
    res.json({
      ...payload,
      id: briefing.id,
      created_at: briefing.created_at
    })
  } catch (error) {
    console.error('[BriefingsAPI] Error fetching briefing:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/briefings/history - Get list of all briefing dates
router.get('/history/list', (req, res) => {
  try {
    const db = getDb()
    const history = db.prepare(`
      SELECT date, highlights_count, events_count, pending_count, generated_at
      FROM briefings
      ORDER BY date DESC
    `).all()

    res.json(history)
  } catch (error) {
    console.error('[BriefingsAPI] Error fetching history:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/briefings/stats - Get aggregate stats across all briefings
router.get('/stats/summary', (req, res) => {
  try {
    const db = getDb()

    const totalBriefings = db.prepare('SELECT COUNT(*) as count FROM briefings').get().count
    const totalEvents = db.prepare('SELECT SUM(events_count) as total FROM briefings').get().total || 0
    const totalHighlights = db.prepare('SELECT SUM(highlights_count) as total FROM briefings').get().total || 0
    const totalPending = db.prepare('SELECT SUM(pending_count) as total FROM briefings').get().total || 0
    const latestBriefing = db.prepare('SELECT date FROM briefings ORDER BY date DESC LIMIT 1').get()

    res.json({
      total_briefings: totalBriefings,
      total_events: totalEvents,
      total_highlights: totalHighlights,
      total_pending_items: totalPending,
      latest_date: latestBriefing?.date || null
    })
  } catch (error) {
    console.error('[BriefingsAPI] Error fetching stats:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router