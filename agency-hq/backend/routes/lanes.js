const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

// Transform mock lanes to match frontend expectations
function transformLanes(mockData) {
  const lanes = []
  const agents = ['smoke', 'stackz', 'radar', 'forge', 'megaphone', 'warden', 'canvas']
  const teams = ['health', 'business', 'research', 'builder', 'marketing', 'security', 'creative']

  let id = 1
  for (const lane of mockData.lanes || []) {
    for (const item of lane.items || []) {
      const fromAgent = agents[Math.floor(Math.random() * agents.length)]
      const toAgent = agents[Math.floor(Math.random() * agents.length)]

      let status = 'pending'
      if (item.status === 'in_progress') status = 'active'
      else if (item.status === 'backlog') status = 'pending'

      lanes.push({
        lane_id: `lane_${String(id++).padStart(3, '0')}`,
        status,
        priority: lane.priority,
        from_agent: fromAgent,
        to_agent: toAgent,
        from_team: teams[agents.indexOf(fromAgent)],
        to_team: teams[agents.indexOf(toAgent)],
        subject: item.title,
        elapsed_ms: item.age,
        token_spend: Math.floor(Math.random() * 50000),
        blocked_reason: status === 'blocked' ? 'Awaiting resource allocation' : null,
        context: `Task from ${item.agent} agent. Priority: ${lane.priority}. Age: ${Math.floor(item.age / 60000)} minutes.`,
      })
    }
  }

  return lanes
}

// GET all lanes
router.get('/', (req, res) => {
  try {
    const lanesPath = path.join(__dirname, '../../mock-data/lanes.json')

    if (!fs.existsSync(lanesPath)) {
      return res.json({ lanes: [], pending: [], active: [], blocked: [] })
    }

    const mockData = JSON.parse(fs.readFileSync(lanesPath, 'utf-8'))
    const lanes = transformLanes(mockData)

    res.json({
      lanes,
      pending: lanes.filter(l => l.status === 'pending'),
      active: lanes.filter(l => l.status === 'active'),
      blocked: lanes.filter(l => l.status === 'blocked'),
    })
  } catch (error) {
    console.error('[Lanes API] Error:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router