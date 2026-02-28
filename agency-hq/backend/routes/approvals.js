const express = require('express')
const router = express.Router()
const { getDb } = require('../db/database')

// GET pending approvals
router.get('/', (req, res) => {
  try {
    const db = getDb()
    const pending = db.prepare('SELECT * FROM approvals WHERE status = ? ORDER BY createdAt DESC').all('pending')
    const history = db.prepare('SELECT * FROM approvals WHERE status != ? ORDER BY resolvedAt DESC LIMIT 20').all('pending')
    res.json({ pending, history })
  } catch {
    // Fallback to mock data
    const data = require('../../mock-data/approvals.json')
    res.json(data)
  }
})

// POST new approval request
router.post('/', (req, res) => {
  const { id, agentId, agentName, title, description, riskLevel, riskScore, estimatedImpact, confidence, category } = req.body
  try {
    const db = getDb()
    db.prepare(`
      INSERT INTO approvals (id, agentId, agentName, title, description, riskLevel, riskScore, estimatedImpact, confidence, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, agentId, agentName, title, description, riskLevel, riskScore, estimatedImpact, confidence, category)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH resolve approval
router.patch('/:id', (req, res) => {
  const { status, note } = req.body
  try {
    const db = getDb()
    db.prepare(`
      UPDATE approvals SET status = ?, note = ?, resolvedAt = datetime('now') WHERE id = ?
    `).run(status, note || '', req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
