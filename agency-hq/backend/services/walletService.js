const { getDb } = require('../db/database')
const fs = require('fs')
const path = require('path')

// Load Stripe config
const STRIPE_CONFIG_PATH = path.join(__dirname, '..', 'config', 'stripe.json')

function getStripeConfig() {
  try {
    if (fs.existsSync(STRIPE_CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(STRIPE_CONFIG_PATH, 'utf-8'))
    }
  } catch (e) {
    console.error('[WalletService] Error loading Stripe config:', e)
  }
  return {}
}

// Constants
const MAX_LIMIT_INCREASE_PER_DAY = 0.20 // 20%
const CRITICAL_BALANCE_THRESHOLD = 500 // $5.00

/**
 * Get the current balance from Stripe Financial Account
 */
async function getBalance() {
  const config = getStripeConfig()
  if (!config.financial_account_id) {
    throw new Error('Financial account not configured')
  }

  // In production, this would call Stripe API
  // const balance = await stripe.treasury.financialAccounts.retrieveBalance(config.financial_account_id)
  // For now, return from SQLite
  const db = getDb()
  const latest = db.prepare('SELECT * FROM wallet_balances ORDER BY snapshot_at DESC LIMIT 1').get()

  if (!latest) {
    return { available: 0, pending: 0, reserved: 0 }
  }

  return {
    available: latest.available,
    pending: latest.pending,
    reserved: latest.restricted
  }
}

/**
 * Request spend from an agent's virtual card
 * @param {string} agentId - Agent identifier
 * @param {number} amount - Amount in dollars
 * @param {string} vendor - Vendor name
 * @param {string} purpose - Purpose description
 * @param {string} category - Merchant category
 */
async function requestSpend(agentId, amount, vendor, purpose, category) {
  const db = getDb()
  const config = getStripeConfig()

  // Get agent limits
  const limits = db.prepare('SELECT * FROM agent_spend_limits WHERE agent_id = ?').get(agentId)

  if (!limits) {
    return { approved: false, reason: 'No card configured for this agent', escalate: false }
  }

  // Check per-transaction limit
  if (amount > limits.per_tx_limit) {
    return {
      approved: false,
      reason: `Amount $${amount} exceeds per-transaction limit of $${limits.per_tx_limit}`,
      escalate: true
    }
  }

  // Check daily limit
  const today = new Date().toISOString().split('T')[0]
  const dailySpent = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total
    FROM wallet_transactions
    WHERE agent_id = ? AND type = 'spend' AND status IN ('authorized', 'settled')
    AND date(authorized_at) = ?
  `).get(agentId, today)

  if ((dailySpent.total / 100) + amount > limits.daily_limit) {
    return {
      approved: false,
      reason: `Would exceed daily limit of $${limits.daily_limit}`,
      escalate: true
    }
  }

  // Check monthly limit
  const monthStart = today.substring(0, 7) + '-01'
  const monthlySpent = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total
    FROM wallet_transactions
    WHERE agent_id = ? AND type = 'spend' AND status IN ('authorized', 'settled')
    AND authorized_at >= ?
  `).get(agentId, monthStart)

  if ((monthlySpent.total / 100) + amount > limits.monthly_limit) {
    return {
      approved: false,
      reason: `Would exceed monthly limit of $${limits.monthly_limit}`,
      escalate: true
    }
  }

  // Check category (if not "all")
  const allowed = JSON.parse(limits.allowed_categories || '[]')
  if (!allowed.includes('all') && !allowed.includes(category)) {
    return {
      approved: false,
      reason: `Category "${category}" not allowed for this agent`,
      escalate: true
    }
  }

  // Get card details (masked)
  const cardNumber = config.card_numbers?.[agentId]
  const maskedCard = cardNumber ? `**** **** **** ${cardNumber.slice(-4)}` : null

  // Log the transaction
  const txId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  db.prepare(`
    INSERT INTO wallet_transactions (
      stripe_transaction_id, type, agent_id, amount, vendor, category,
      description, status, authorized_at
    ) VALUES (?, 'spend', ?, ?, ?, ?, ?, 'authorized', datetime('now'))
  `).run(txId, agentId, Math.round(amount * 100), vendor, category, purpose)

  return {
    approved: true,
    card: maskedCard,
    transactionId: txId,
    dailySpent: (dailySpent.total / 100) + amount,
    dailyLimit: limits.daily_limit
  }
}

/**
 * Log revenue received
 */
async function logRevenue(source, amount, paymentIntentId, ventureId, sourceType = 'other') {
  const db = getDb()

  const id = `rev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  db.prepare(`
    INSERT INTO revenue_records (
      stripe_payment_intent_id, source, source_type, amount, venture_id, received_at
    ) VALUES (?, ?, ?, ?, ?, datetime('now'))
  `).run(paymentIntentId, source, sourceType, Math.round(amount * 100), ventureId)

  // Also log to wallet_transactions
  db.prepare(`
    INSERT INTO wallet_transactions (
      stripe_transaction_id, type, agent_id, amount, vendor, category,
      description, status, authorized_at, settled_at
    ) VALUES (?, 'revenue', ?, ?, ?, ?, ?, 'settled', datetime('now'), datetime('now'))
  `).run(paymentIntentId, 'cashflow', Math.round(amount * 100), source, sourceType, `Revenue from ${source}`)

  return { id, amount, source }
}

/**
 * Get spend by agent for a period
 */
function getSpendByAgent(agentId, period = 'month') {
  const db = getDb()
  let startDate

  if (period === 'day') {
    startDate = new Date().toISOString().split('T')[0]
  } else if (period === 'week') {
    const d = new Date()
    d.setDate(d.getDate() - 7)
    startDate = d.toISOString().split('T')[0]
  } else { // month
    startDate = new Date().toISOString().substring(0, 7) + '-01'
  }

  const transactions = db.prepare(`
    SELECT * FROM wallet_transactions
    WHERE agent_id = ? AND type = 'spend' AND status IN ('authorized', 'settled')
    AND authorized_at >= ?
    ORDER BY authorized_at DESC
  `).all(agentId, startDate)

  const total = transactions.reduce((sum, t) => sum + t.amount, 0)

  return {
    agentId,
    period,
    total: total / 100,
    count: transactions.length,
    transactions
  }
}

/**
 * Get spend by all teams
 */
function getSpendByTeam(period = 'month') {
  const db = getDb()
  let startDate

  if (period === 'day') {
    startDate = new Date().toISOString().split('T')[0]
  } else if (period === 'week') {
    const d = new Date()
    d.setDate(d.getDate() - 7)
    startDate = d.toISOString().split('T')[0]
  } else {
    startDate = new Date().toISOString().substring(0, 7) + '-01'
  }

  const byAgent = db.prepare(`
    SELECT agent_id, team, SUM(amount) as total, COUNT(*) as count
    FROM wallet_transactions
    WHERE type = 'spend' AND status IN ('authorized', 'settled')
    AND authorized_at >= ?
    GROUP BY agent_id
  `).all(startDate)

  return byAgent.map(a => ({
    agentId: a.agent_id,
    team: a.team,
    total: a.total / 100,
    count: a.count
  }))
}

/**
 * Update agent spend limits (Cashflow only)
 */
function updateAgentLimits(agentId, newLimits, updatedBy = 'cashflow') {
  const db = getDb()

  // Get current limits
  const current = db.prepare('SELECT * FROM agent_spend_limits WHERE agent_id = ?').get(agentId)

  if (!current) {
    throw new Error('Agent not found')
  }

  // Check if increase is within 20% rule
  if (newLimits.daily_limit > current.daily_limit) {
    const increase = (newLimits.daily_limit - current.daily_limit) / current.daily_limit
    if (increase > MAX_LIMIT_INCREASE_PER_DAY) {
      throw new Error(`Cannot increase daily limit by more than ${MAX_LIMIT_INCREASE_PER_DAY * 100}% without approval`)
    }
  }

  db.prepare(`
    UPDATE agent_spend_limits
    SET daily_limit = ?, monthly_limit = ?, per_tx_limit = ?,
        allowed_categories = ?, last_updated = datetime('now'), updated_by = ?
    WHERE agent_id = ?
  `).run(
    newLimits.daily_limit,
    newLimits.monthly_limit,
    newLimits.per_tx_limit,
    JSON.stringify(newLimits.allowed_categories || []),
    updatedBy,
    agentId
  )

  return { success: true, agentId }
}

/**
 * Get agent limits
 */
function getAgentLimits(agentId) {
  const db = getDb()
  const limits = db.prepare('SELECT * FROM agent_spend_limits WHERE agent_id = ?').get(agentId)

  if (!limits) return null

  return {
    ...limits,
    allowed_categories: JSON.parse(limits.allowed_categories || '[]')
  }
}

/**
 * Calculate runway
 */
function getRunway() {
  const db = getDb()

  // Get current balance
  const balance = getBalance()

  // Calculate 7-day and 30-day burn rates
  const last7Days = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total
    FROM wallet_transactions
    WHERE type = 'spend' AND status IN ('authorized', 'settled')
    AND authorized_at >= datetime('now', '-7 days')
  `).get()

  const last30Days = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total
    FROM wallet_transactions
    WHERE type = 'spend' AND status IN ('authorized', 'settled')
    AND authorized_at >= datetime('now', '-30 days')
  `).get()

  const dailyBurn7 = last7Days.total / 7 / 100
  const dailyBurn30 = last30Days.total / 30 / 100
  const available = balance.available / 100

  return {
    available,
    burnRate7Day: dailyBurn7,
    burnRate30Day: dailyBurn30,
    runway7Day: dailyBurn7 > 0 ? Math.round(available / dailyBurn7) : null,
    runway30Day: dailyBurn30 > 0 ? Math.round(available / dailyBurn30) : null
  }
}

/**
 * Get transactions with filters
 */
function getTransactions(filters = {}) {
  const db = getDb()
  let query = 'SELECT * FROM wallet_transactions WHERE 1=1'
  const params = []

  if (filters.agentId) {
    query += ' AND agent_id = ?'
    params.push(filters.agentId)
  }

  if (filters.type) {
    query += ' AND type = ?'
    params.push(filters.type)
  }

  if (filters.period) {
    let startDate
    if (filters.period === 'day') {
      startDate = new Date().toISOString().split('T')[0]
    } else if (filters.period === 'week') {
      const d = new Date()
      d.setDate(d.getDate() - 7)
      startDate = d.toISOString().split('T')[0]
    } else {
      startDate = new Date().toISOString().substring(0, 7) + '-01'
    }
    query += ' AND authorized_at >= ?'
    params.push(startDate)
  }

  if (filters.status) {
    query += ' AND status = ?'
    params.push(filters.status)
  }

  query += ' ORDER BY authorized_at DESC LIMIT 100'

  return db.prepare(query).all(...params)
}

/**
 * Get revenue records
 */
function getRevenue(filters = {}) {
  const db = getDb()
  let query = 'SELECT * FROM revenue_records WHERE 1=1'
  const params = []

  if (filters.ventureId) {
    query += ' AND venture_id = ?'
    params.push(filters.ventureId)
  }

  if (filters.source) {
    query += ' AND source = ?'
    params.push(filters.source)
  }

  if (filters.period) {
    let startDate
    if (filters.period === 'day') {
      startDate = new Date().toISOString().split('T')[0]
    } else if (filters.period === 'week') {
      const d = new Date()
      d.setDate(d.getDate() - 7)
      startDate = d.toISOString().split('T')[0]
    } else {
      startDate = new Date().toISOString().substring(0, 7) + '-01'
    }
    query += ' AND received_at >= ?'
    params.push(startDate)
  }

  query += ' ORDER BY received_at DESC LIMIT 100'

  return db.prepare(query).all(...params)
}

module.exports = {
  getBalance,
  requestSpend,
  logRevenue,
  getSpendByAgent,
  getSpendByTeam,
  updateAgentLimits,
  getAgentLimits,
  getRunway,
  getTransactions,
  getRevenue,
  CRITICAL_BALANCE_THRESHOLD
}