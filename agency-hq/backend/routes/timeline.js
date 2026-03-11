const express = require('express')
const router = express.Router()
const timelineLogger = require('../services/timelineLogger')

// GET /api/timeline - Get all timeline events
router.get('/', (req, res) => {
  try {
    const { type, agent, limit = 50 } = req.query

    const filters = {
      limit: parseInt(limit)
    }

    if (type) {
      filters.type = type
    }

    if (agent) {
      filters.agentId = agent
    }

    const entries = timelineLogger.getEvents(filters)
    res.json({ entries, count: entries.length })
  } catch (error) {
    console.error('[TimelineAPI] Error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/timeline/stats - Get timeline statistics
router.get('/stats', (req, res) => {
  try {
    const entries = timelineLogger.getEvents({ limit: 1000 })

    const stats = {
      total: entries.length,
      byType: {},
      byAgent: {},
      recent: entries.slice(0, 10)
    }

    for (const entry of entries) {
      stats.byType[entry.type] = (stats.byType[entry.type] || 0) + 1

      if (entry.agentId) {
        stats.byAgent[entry.agentId] = (stats.byAgent[entry.agentId] || 0) + 1
      }
    }

    // Calculate today's events
    const today = new Date().toISOString().split('T')[0]
    stats.today = entries.filter(e => e.timestamp.startsWith(today)).length

    res.json(stats)
  } catch (error) {
    console.error('[TimelineAPI] Stats error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/timeline/types - Get available event types
router.get('/types', (req, res) => {
  res.json({
    types: Object.entries(timelineLogger.EVENT_TYPES).map(([key, value]) => ({
      key,
      value,
      label: key.replace(/_/g, ' ').toLowerCase()
    }))
  })
})

// POST /api/timeline - Create a new timeline event (manual)
router.post('/', (req, res) => {
  try {
    const { type, summary, ...metadata } = req.body

    if (!type || !summary) {
      return res.status(400).json({ error: 'type and summary are required' })
    }

    const entry = timelineLogger.logEvent(type, summary, metadata)
    res.status(201).json(entry)
  } catch (error) {
    console.error('[TimelineAPI] Create error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/timeline/approval - Log approval decision
router.post('/approval', (req, res) => {
  try {
    const { agentId, approvalType, decision, details } = req.body

    if (!agentId || !approvalType || !decision) {
      return res.status(400).json({ error: 'agentId, approvalType, and decision are required' })
    }

    const entry = timelineLogger.logApproval(agentId, approvalType, decision, details)
    res.status(201).json(entry)
  } catch (error) {
    console.error('[TimelineAPI] Approval log error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/timeline/agent - Log agent event
router.post('/agent', (req, res) => {
  try {
    const { agentId, event, status, role, reason } = req.body

    if (!agentId || !event) {
      return res.status(400).json({ error: 'agentId and event are required' })
    }

    let entry
    switch (event) {
      case 'deployed':
        entry = timelineLogger.logAgentDeployed(agentId, role || 'unknown')
        break
      case 'status_change':
        entry = timelineLogger.logAgentStatusChange(agentId, status?.old, status?.new, reason)
        break
      default:
        entry = timelineLogger.logEvent('agent_event', `${agentId}: ${event}`, { agentId, event })
    }

    res.status(201).json(entry)
  } catch (error) {
    console.error('[TimelineAPI] Agent log error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/timeline/note - Log note event
router.post('/note', (req, res) => {
  try {
    const { noteId, title, author, action, type, changes } = req.body

    if (!noteId || !author || !action) {
      return res.status(400).json({ error: 'noteId, author, and action are required' })
    }

    let entry
    if (action === 'created') {
      entry = timelineLogger.logNoteCreated(noteId, title, author, type)
    } else if (action === 'updated') {
      entry = timelineLogger.logNoteUpdated(noteId, title, author, changes)
    } else {
      entry = timelineLogger.logEvent('note_event', `${author} ${action}: ${title}`, { noteId, title, author, action })
    }

    res.status(201).json(entry)
  } catch (error) {
    console.error('[TimelineAPI] Note log error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/timeline/decision - Log a decision
router.post('/decision', (req, res) => {
  try {
    const { decision, context, cost } = req.body

    if (!decision) {
      return res.status(400).json({ error: 'decision is required' })
    }

    const entry = timelineLogger.logDecision(decision, context, cost)
    res.status(201).json(entry)
  } catch (error) {
    console.error('[TimelineAPI] Decision log error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/timeline/spend - Log spend event
router.post('/spend', (req, res) => {
  try {
    const { agentId, amount, vendor, approved, reason } = req.body

    if (!agentId || amount == null || !vendor) {
      return res.status(400).json({ error: 'agentId, amount, and vendor are required' })
    }

    const entry = timelineLogger.logSpend(agentId, amount, vendor, approved, reason)
    res.status(201).json(entry)
  } catch (error) {
    console.error('[TimelineAPI] Spend log error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/timeline/sentinel - Log sentinel flag
router.post('/sentinel', (req, res) => {
  try {
    const { flagType, message, severity, metadata } = req.body

    if (!flagType || !message) {
      return res.status(400).json({ error: 'flagType and message are required' })
    }

    const entry = timelineLogger.logSentinelFlag(flagType, message, severity, metadata)
    res.status(201).json(entry)
  } catch (error) {
    console.error('[TimelineAPI] Sentinel log error:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/timeline - Clear all events (admin)
router.delete('/', (req, res) => {
  try {
    timelineLogger.clearEvents()
    res.json({ success: true, message: 'Timeline cleared' })
  } catch (error) {
    console.error('[TimelineAPI] Clear error:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router