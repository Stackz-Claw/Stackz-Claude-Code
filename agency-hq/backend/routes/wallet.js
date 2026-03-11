const express = require('express')
const router = express.Router()
const walletService = require('../services/walletService')

// GET /api/wallet/balance - Get real-time balance
router.get('/balance', async (req, res) => {
  try {
    const balance = await walletService.getBalance()
    res.json({
      available: balance.available / 100,
      pending: balance.pending / 100,
      reserved: balance.reserved / 100,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('[WalletAPI] Error getting balance:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/wallet/transactions - Get transaction history
router.get('/transactions', (req, res) => {
  try {
    const { agent, period, type, status } = req.query
    const transactions = walletService.getTransactions({
      agentId: agent,
      period,
      type,
      status
    })

    res.json(transactions.map(t => ({
      ...t,
      amount: t.amount / 100
    })))
  } catch (error) {
    console.error('[WalletAPI] Error getting transactions:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/wallet/spend-by-agent - Get spend by agent
router.get('/spend-by-agent', (req, res) => {
  try {
    const { period, agent } = req.query

    if (agent) {
      const spend = walletService.getSpendByAgent(agent, period || 'month')
      return res.json(spend)
    }

    const allSpend = walletService.getSpendByTeam(period || 'month')
    res.json(allSpend)
  } catch (error) {
    console.error('[WalletAPI] Error getting spend:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/wallet/revenue - Get revenue records
router.get('/revenue', (req, res) => {
  try {
    const { period, source, venture } = req.query
    const revenue = walletService.getRevenue({
      period,
      source,
      ventureId: venture
    })

    res.json(revenue.map(r => ({
      ...r,
      amount: r.amount / 100
    })))
  } catch (error) {
    console.error('[WalletAPI] Error getting revenue:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/wallet/agent/:agentId/limits - Get agent spend limits
router.get('/agent/:agentId/limits', (req, res) => {
  try {
    const limits = walletService.getAgentLimits(req.params.agentId)

    if (!limits) {
      return res.status(404).json({ error: 'No limits configured for this agent' })
    }

    res.json(limits)
  } catch (error) {
    console.error('[WalletAPI] Error getting limits:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/wallet/agent/:agentId/limits - Update agent spend limits
router.post('/agent/:agentId/limits', (req, res) => {
  try {
    const { daily_limit, monthly_limit, per_tx_limit, allowed_categories } = req.body

    if (!daily_limit || !monthly_limit || !per_tx_limit) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const result = walletService.updateAgentLimits(
      req.params.agentId,
      { daily_limit, monthly_limit, per_tx_limit, allowed_categories },
      'cashflow'
    )

    // Emit socket event
    const io = req.app.get('io')
    if (io) {
      io.emit('wallet:limits_updated', {
        agentId: req.params.agentId,
        limits: { daily_limit, monthly_limit, per_tx_limit }
      })
    }

    res.json(result)
  } catch (error) {
    console.error('[WalletAPI] Error updating limits:', error)
    res.status(400).json({ error: error.message })
  }
})

// GET /api/wallet/runway - Get runway calculation
router.get('/runway', (req, res) => {
  try {
    const runway = walletService.getRunway()
    res.json(runway)
  } catch (error) {
    console.error('[WalletAPI] Error calculating runway:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/wallet/spend-request - Request spend from agent card
router.post('/spend-request', async (req, res) => {
  try {
    const { agent_id, amount, vendor, purpose, category } = req.body

    if (!agent_id || !amount || !vendor || !category) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const result = await walletService.requestSpend(agent_id, amount, vendor, purpose, category)

    // Emit socket event
    const io = req.app.get('io')
    if (io) {
      if (result.approved) {
        io.emit('wallet:spend_authorized', {
          agentId: agent_id,
          amount,
          vendor,
          transactionId: result.transactionId
        })
      } else {
        io.emit('wallet:spend_declined', {
          agentId: agent_id,
          amount,
          vendor,
          reason: result.reason
        })
      }
    }

    res.json(result)
  } catch (error) {
    console.error('[WalletAPI] Error processing spend request:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/wallet/revenue/log - Manual revenue logging
router.post('/revenue/log', async (req, res) => {
  try {
    const { source, amount, payment_intent_id, venture_id, source_type } = req.body

    if (!source || !amount) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const result = await walletService.logRevenue(
      source,
      amount,
      payment_intent_id || `manual_${Date.now()}`,
      venture_id,
      source_type
    )

    // Emit socket event
    const io = req.app.get('io')
    if (io) {
      io.emit('wallet:revenue_received', {
        source,
        amount,
        ventureId: venture_id
      })
    }

    res.json(result)
  } catch (error) {
    console.error('[WalletAPI] Error logging revenue:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/wallet/ventures/:ventureId/pnl - Get venture P&L
router.get('/ventures/:ventureId/pnl', (req, res) => {
  try {
    const db = require('../db/database').getDb()
    const { ventureId } = req.params

    // Get revenue for venture
    const revenue = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM revenue_records
      WHERE venture_id = ?
    `).get(ventureId)

    // Get spend attributed to venture
    const spend = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM wallet_transactions
      WHERE venture_id = ? AND type = 'spend'
    `).get(ventureId)

    res.json({
      ventureId,
      revenue: revenue.total / 100,
      spend: spend.total / 100,
      pnl: (revenue.total - spend.total) / 100
    })
  } catch (error) {
    console.error('[WalletAPI] Error getting P&L:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router