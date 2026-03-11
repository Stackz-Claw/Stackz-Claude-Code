const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

// Generate health metrics for agents
function generateHealthData(agentsData) {
  const teams = {}

  for (const agent of agentsData.agents || []) {
    const team = agent.type || 'other'

    if (!teams[team]) {
      teams[team] = {
        name: team.charAt(0).toUpperCase() + team.slice(1),
        color: getTeamColor(team),
        budget: {
          used: Math.random() * 500,
          allocated: 1000,
        },
        agents: [],
      }
    }

    // Add health metrics to each agent
    teams[team].agents.push({
      id: agent.id,
      name: agent.name,
      codename: agent.codename,
      status: Math.random() > 0.2 ? 'active' : 'idle',
      uptime: Math.floor(85 + Math.random() * 15),
      tasks_7d: Math.floor(50 + Math.random() * 200),
      avg_completion_ms: Math.floor(30000 + Math.random() * 120000),
      error_rate: Math.floor(Math.random() * 5),
      token_efficiency: Math.floor(70 + Math.random() * 30),
      last_active: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    })
  }

  return { teams }
}

function getTeamColor(team) {
  const colors = {
    health: '#14B8A6',
    business: '#10B981',
    security: '#6366F1',
    marketing: '#F59E0B',
    builder: '#EF4444',
    research: '#8B5CF6',
    creative: '#EC4899',
  }
  return colors[team] || '#64748B'
}

router.get('/', (req, res) => {
  try {
    const agentsData = require('../../mock-data/agents.json')
    const healthData = generateHealthData(agentsData)
    res.json({
      ...agentsData,
      ...healthData,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single agent health
router.get('/:id/health', (req, res) => {
  try {
    const agentsData = require('../../mock-data/agents.json')
    const agent = agentsData.agents?.find(a => a.id === req.params.id)

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' })
    }

    res.json({
      id: agent.id,
      status: Math.random() > 0.1 ? 'active' : 'idle',
      uptime: Math.floor(85 + Math.random() * 15),
      tasks_7d: Math.floor(50 + Math.random() * 200),
      avg_completion_ms: Math.floor(30000 + Math.random() * 120000),
      error_rate: Math.floor(Math.random() * 5),
      token_efficiency: Math.floor(70 + Math.random() * 30),
      last_active: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
