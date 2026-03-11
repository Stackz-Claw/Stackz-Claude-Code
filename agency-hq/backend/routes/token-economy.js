const express = require('express')
const router = express.Router()

// Token economy data - could be connected to real metrics later
// For now, aggregates from SQLite for real agent task data

function getTokenEconomy() {
  const { getDb } = require('../db/database')
  const db = getDb()

  // Get agent task stats from database
  let agents = []
  try {
    const stmt = db.prepare(`
      SELECT
        agent_name,
        COUNT(*) as tasks,
        SUM(tokens_used) as tokens,
        SUM(cost_usd) as spend
      FROM agent_tasks
      WHERE created_at >= date('now', '-30 days')
      GROUP BY agent_name
    `)
    const rows = stmt.all()

    agents = rows.map(row => ({
      id: row.agent_name,
      team: getTeamForAgent(row.agent_name),
      tasks: row.tasks || 0,
      tokens: row.tokens || 0,
      spend: row.spend || 0,
      avg_per_task: row.tasks > 0 ? (row.spend || 0) / row.tasks : 0
    }))
  } catch (e) {
    // Table doesn't exist yet - use fallback data
    agents = getFallbackAgents()
  }

  // Calculate totals
  const totalSpent = agents.reduce((sum, a) => sum + a.spend, 0)
  const totalTokens = agents.reduce((sum, a) => sum + a.tokens, 0)

  // Get team data
  const teams = getTeamSpend(agents)

  // Generate warnings
  const warnings = generateWarnings(totalSpent, teams, agents)

  const overview = {
    total_spent: totalSpent,
    total_budget: 10000, // Monthly budget
    days_elapsed: getDaysElapsed(),
    days_remaining: 31 - getDaysElapsed(),
    projected_month_end: projectMonthEnd(totalSpent, getDaysElapsed()),
    most_expensive_agent: agents.reduce((max, a) => a.spend > max.spend ? a : max, { spend: 0 })
  }

  return { overview, teams, agents, warnings }
}

function getTeamForAgent(agentName) {
  const teamMap = {
    stackz: 'Operations',
    smoke: 'Operations',
    nova: 'Creative',
    bolt: 'Engineering',
    rex: 'Engineering',
    chill: 'Creative',
    zip: 'Operations'
  }
  return teamMap[agentName?.toLowerCase()] || 'Operations'
}

function getTeamSpend(agents) {
  const teamMap = {
    Operations: { color: '#8B5CF6', budget: 4000 },
    Engineering: { color: '#0EA5E9', budget: 3500 },
    Creative: { color: '#F59E0B', budget: 2500 }
  }

  const teamSpend = {}
  agents.forEach(a => {
    const team = a.team || 'Operations'
    teamSpend[team] = (teamSpend[team] || 0) + a.spend
  })

  return Object.entries(teamMap).map(([name, info]) => ({
    id: name.toLowerCase(),
    name,
    color: info.color,
    budget: info.budget,
    spent: teamSpend[name] || 0
  }))
}

function generateWarnings(totalSpent, teams, agents) {
  const warnings = []

  const budget = 10000
  if (totalSpent > budget * 0.8) {
    warnings.push({ type: 'budget', message: `Budget ${Math.round((totalSpent / budget) * 100)}% spent - ${Math.round(budget - totalSpent)} remaining` })
  }

  const overBudgetTeams = teams.filter(t => t.spent > t.budget)
  if (overBudgetTeams.length > 0) {
    warnings.push({ type: 'team', message: `${overBudgetTeams.map(t => t.name).join(', ')} over budget` })
  }

  return warnings
}

function getDaysElapsed() {
  const { getDb } = require('../db/database')
  const db = getDb()
  try {
    const stmt = db.prepare("SELECT (CAST(julianday('now') - julianday(MIN(created_at)) AS INTEGER)) as days FROM agent_tasks")
    const row = stmt.get()
    return row?.days || 1
  } catch (e) {
    return 11 // Default to day 11 of month
  }
}

function projectMonthEnd(totalSpent, daysElapsed) {
  if (daysElapsed <= 0) return totalSpent
  return (totalSpent / daysElapsed) * 31
}

function getFallbackAgents() {
  return [
    { id: 'stackz', team: 'Operations', tasks: 156, tokens: 245000, spend: 847.25, avg_per_task: 5.43 },
    { id: 'smoke', team: 'Operations', tasks: 89, tokens: 125000, spend: 412.50, avg_per_task: 4.64 },
    { id: 'nova', team: 'Creative', tasks: 67, tokens: 189000, spend: 623.70, avg_per_task: 9.31 },
    { id: 'bolt', team: 'Engineering', tasks: 234, tokens: 456000, spend: 1596.00, avg_per_task: 6.82 },
    { id: 'rex', team: 'Engineering', tasks: 178, tokens: 312000, spend: 1092.00, avg_per_task: 6.13 },
    { id: 'chill', team: 'Creative', tasks: 45, tokens: 89000, spend: 311.50, avg_per_task: 6.92 },
    { id: 'zip', team: 'Operations', tasks: 123, tokens: 178000, spend: 623.00, avg_per_task: 5.07 }
  ]
}

// API Routes
router.get('/', (req, res) => {
  const data = getTokenEconomy()
  res.json(data)
})

router.get('/overview', (req, res) => {
  const data = getTokenEconomy()
  res.json(data.overview)
})

router.get('/agents', (req, res) => {
  const data = getTokenEconomy()
  res.json(data.agents)
})

router.get('/teams', (req, res) => {
  const data = getTokenEconomy()
  res.json(data.teams)
})

module.exports = router
module.exports.getTokenEconomy = getTokenEconomy