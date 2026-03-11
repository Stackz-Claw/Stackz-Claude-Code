const express = require('express')
const router = express.Router()

// Token economy data - uses fallback data if no agent_tasks table exists
// Can be connected to real metrics later

function getFallbackData() {
  const agents = [
    { id: 'stackz', team: 'Operations', tasks: 156, tokens: 245000, spend: 847.25, avg_per_task: 5.43 },
    { id: 'smoke', team: 'Operations', tasks: 89, tokens: 125000, spend: 412.50, avg_per_task: 4.64 },
    { id: 'nova', team: 'Creative', tasks: 67, tokens: 189000, spend: 623.70, avg_per_task: 9.31 },
    { id: 'bolt', team: 'Engineering', tasks: 234, tokens: 456000, spend: 1596.00, avg_per_task: 6.82 },
    { id: 'rex', team: 'Engineering', tasks: 178, tokens: 312000, spend: 1092.00, avg_per_task: 6.13 },
    { id: 'chill', team: 'Creative', tasks: 45, tokens: 89000, spend: 311.50, avg_per_task: 6.92 },
    { id: 'zip', team: 'Operations', tasks: 123, tokens: 178000, spend: 623.00, avg_per_task: 5.07 }
  ]

  const teams = [
    { id: 'operations', name: 'Operations', color: '#8B5CF6', budget: 4000, spent: 1882.75 },
    { id: 'engineering', name: 'Engineering', color: '#0EA5E9', budget: 3500, spent: 2688.00 },
    { id: 'creative', name: 'Creative', color: '#F59E0B', budget: 2500, spent: 935.20 }
  ]

  const warnings = [
    { type: 'budget', message: 'Budget 55% spent - $4,994 remaining' }
  ]

  const overview = {
    total_spent: 5505.95,
    total_budget: 10000,
    days_elapsed: 11,
    days_remaining: 20,
    projected_month_end: 15508.64,
    most_expensive_agent: { id: 'bolt', spend: 1596.00 }
  }

  return { overview, teams, agents, warnings }
}

// Try to get real data from database, fall back to static data
function getTokenEconomy() {
  try {
    const { getDb } = require('../db/database')
    const db = getDb()

    // Check if agent_tasks table exists
    const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='agent_tasks'").get()

    if (!tableExists) {
      return getFallbackData()
    }

    // Get agent task stats from database
    const rows = db.prepare(`
      SELECT
        agent_name,
        COUNT(*) as tasks,
        COALESCE(SUM(tokens_used), 0) as tokens,
        COALESCE(SUM(cost_usd), 0) as spend
      FROM agent_tasks
      WHERE created_at >= date('now', '-30 days')
      GROUP BY agent_name
    `).all()

    if (!rows || rows.length === 0) {
      return getFallbackData()
    }

    const agents = rows.map(row => ({
      id: row.agent_name,
      team: getTeamForAgent(row.agent_name),
      tasks: row.tasks || 0,
      tokens: row.tokens || 0,
      spend: row.spend || 0,
      avg_per_task: row.tasks > 0 ? (row.spend || 0) / row.tasks : 0
    }))

    const totalSpent = agents.reduce((sum, a) => sum + a.spend, 0)
    const totalTokens = agents.reduce((sum, a) => sum + a.tokens, 0)

    const teams = getTeamSpend(agents)
    const warnings = generateWarnings(totalSpent, teams, agents)

    const overview = {
      total_spent: totalSpent,
      total_budget: 10000,
      days_elapsed: getDaysElapsed(db),
      days_remaining: 31 - getDaysElapsed(db),
      projected_month_end: projectMonthEnd(totalSpent, getDaysElapsed(db)),
      most_expensive_agent: agents.reduce((max, a) => a.spend > max.spend ? a : max, { spend: 0, id: 'none' })
    }

    return { overview, teams, agents, warnings }

  } catch (e) {
    console.error('Token economy error:', e.message)
    return getFallbackData()
  }
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
    warnings.push({ type: 'budget', message: `Budget ${Math.round((totalSpent / budget) * 100)}% spent - $${Math.round(budget - totalSpent)} remaining` })
  }

  const overBudgetTeams = teams.filter(t => t.spent > t.budget)
  if (overBudgetTeams.length > 0) {
    warnings.push({ type: 'team', message: `${overBudgetTeams.map(t => t.name).join(', ')} over budget` })
  }

  return warnings
}

function getDaysElapsed(db) {
  try {
    const row = db.prepare("SELECT (CAST(julianday('now') - julianday(MIN(created_at)) AS INTEGER)) as days FROM agent_tasks").get()
    return row?.days || 11
  } catch (e) {
    return 11
  }
}

function projectMonthEnd(totalSpent, daysElapsed) {
  if (daysElapsed <= 0) return totalSpent
  return (totalSpent / daysElapsed) * 31
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