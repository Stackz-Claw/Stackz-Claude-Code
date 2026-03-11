const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

const VAULT_PATH = '/Users/jaleeljenkins/Documents/Agents'

function parseMarkdownTable(markdown) {
  const lines = (markdown || '').trim().split('\n').filter(line => line.trim() && !line.startsWith('---'))
  if (lines.length < 3) return []

  // Find header row (contains 'Idea ID' or similar)
  let headerIdx = lines.findIndex(l => l.includes('| Idea ID') || l.includes('| Name'))
  if (headerIdx === -1) headerIdx = 1

  const headers = lines[headerIdx].split('|').map(h => h.trim()).filter(h => h)
  const data = []

  for (let i = headerIdx + 2; i < lines.length; i++) {
    const row = lines[i].split('|').map(cell => cell.trim()).filter(cell => cell)
    if (row.length >= headers.length && row[0]) { // Must have first column (ID)
      const obj = {}
      headers.forEach((header, idx) => {
        const key = header.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '')
        obj[key] = row[idx] || ''
      })
      data.push(obj)
    }
  }

  return data
}

function loadFromVault() {
  try {
    const venturesPath = path.join(VAULT_PATH, 'Stackz', 'Ventures', 'Active Ventures.md')

    if (!fs.existsSync(venturesPath)) {
      console.warn('Vault file not found:', venturesPath)
      return { active: [], recentlyEvaluated: [], killed: [] }
    }

    const content = fs.readFileSync(venturesPath, 'utf-8')

    // Parse Recently Evaluated section for pending items
    const recentMatch = content.match(/## Recently Evaluated[\s\S]*?## Killed/)
    const recentSection = recentMatch ? recentMatch[0] : ''

    const recentItems = parseMarkdownTable(recentSection)
      .filter(item => item.verdict?.toLowerCase() === 'approved')
      .map(item => ({
        id: item.idea_id || `idea_${Date.now()}`,
        title: item.name || 'Untitled Idea',
        description: `Score: ${item.score}/10 | ${item.notes || ''} | Date: ${item.date || ''}`,
        status: 'pending',
        team: 'startup',
        agentId: 'radar',
        riskLevel: 'medium',
        estimatedImpact: 'TBD',
        cost: 'TBD',
        confidence: parseInt(item.score) * 10 || 75,
        createdAt: item.date ? new Date(item.date).toISOString() : new Date().toISOString(),
        stream: 'stackz',
      }))

    // Parse Active Ventures for running projects
    const activeMatch = content.match(/## Active Ventures[\s\S]*?## Recently Evaluated/)
    const activeSection = activeMatch ? activeMatch[0] : ''

    const activeItems = parseMarkdownTable(activeSection)
      .filter(item => item.name && item.venture_id)
      .map(item => ({
        id: item.venture_id,
        title: item.name,
        description: `Status: ${item.status} | Vertical: ${item.vertical} | Revenue: ${item.revenue || '$0'}`,
        status: 'active',
        team: 'startup',
        agentId: 'founder',
        riskLevel: 'low',
        estimatedImpact: item.revenue || '$0',
        cost: 'TBD',
        confidence: 90,
        createdAt: item.launch_date ? new Date(item.launch_date).toISOString() : new Date().toISOString(),
        stream: 'stackz',
      }))

    return {
      pending: [...activeItems, ...recentItems],
      history: [],
    }
  } catch (error) {
    console.error('Error loading from vault:', error)
    return { pending: [], history: [] }
  }
}

// GET pending approvals - load from Obsidian vault
router.get('/', (req, res) => {
  const data = loadFromVault()
  res.json(data)
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
