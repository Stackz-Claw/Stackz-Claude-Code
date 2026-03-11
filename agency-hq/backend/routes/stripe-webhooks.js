const express = require('express')
const router = express.Router()
const { getDb } = require('../db/database')
const walletService = require('../services/walletService')

// Verify Stripe webhook signature (placeholder - implement with actual secret)
function verifyWebhookSignature(payload, signature, secret) {
  // In production, use: stripe.webhooks.constructEvent(payload, signature, secret)
  return true
}

/**
 * POST /api/webhooks/stripe/issuing-authorization
 * Real-time card authorization handler
 */
router.post('/issuing-authorization', express.raw({ type: 'application/json' }), async (req, res) => {
  const db = getDb()
  const sig = req.headers['stripe-signature']

  // In production, verify signature first
  // const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)

  try {
    const payload = JSON.parse(req.body.toString())
    const authorization = payload.data?.object

    if (!authorization) {
      return res.status(400).json({ error: 'Missing authorization object' })
    }

    // Get card metadata to identify agent
    const cardMetadata = authorization.card?.metadata || {}
    const agentId = cardMetadata.agent

    // Get today's spend for this agent
    const today = new Date().toISOString().split('T')[0]
    const dailySpent = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM wallet_transactions
      WHERE agent_id = ? AND type = 'spend' AND status IN ('authorized', 'settled')
      AND date(authorized_at) = ?
    `).get(agentId, today)

    // Get agent limits
    const limits = db.prepare('SELECT * FROM agent_spend_limits WHERE agent_id = ?').get(agentId)

    let approved = true
    let flagged = false
    let flagReason = null

    // Check daily limit
    if (limits && (dailySpent.total / 100) + (authorization.amount / 100) > limits.daily_limit) {
      approved = false
      flagReason = 'Daily limit exceeded'
    }

    // Anomaly detection (Smoke's logic)
    if (approved && agentId) {
      // Check if vendor is new (never used before)
      const vendorExists = db.prepare(`
        SELECT COUNT(*) as count FROM wallet_transactions
        WHERE agent_id = ? AND vendor = ?
      `).get(agentId, authorization.merchant_data?.name)

      if (vendorExists.count === 0) {
        flagged = true
        flagReason = 'New vendor'
      }

      // Check if amount is >2x typical transaction
      const avgTransaction = db.prepare(`
        SELECT AVG(amount) as avg FROM wallet_transactions
        WHERE agent_id = ? AND type = 'spend'
      `).get(agentId)

      if (avgTransaction.avg && authorization.amount > avgTransaction.avg * 2) {
        flagged = true
        flagReason = flagReason ? `${flagReason}; High transaction` : 'High transaction'
      }

      // Check if outside operating hours (2 AM - 10 PM PT)
      const hour = new Date().getHours()
      if (hour < 10 || hour > 22) {
        flagged = true
        flagReason = flagReason ? `${flagReason}; Off-hours` : 'Off-hours transaction'
      }
    }

    // Log the authorization attempt
    db.prepare(`
      INSERT INTO wallet_transactions (
        stripe_transaction_id, type, agent_id, amount, vendor, category,
        description, status, authorized_at, flagged, flag_reason, stripe_payload
      ) VALUES (?, 'spend', ?, ?, ?, ?, ?, ?, datetime('now'), ?, ?, ?)
    `).run(
      authorization.id,
      agentId || 'unknown',
      authorization.amount,
      authorization.merchant_data?.name || 'Unknown',
      authorization.merchant_data?.category || 'unknown',
      `Card authorization: ${authorization.id}`,
      approved ? 'authorized' : 'declined',
      flagged ? 1 : 0,
      flagReason,
      JSON.stringify(payload)
    )

    // Emit socket events
    const io = req.app.get('io')
    if (io) {
      if (flagged) {
        io.emit('wallet:anomaly_flagged', {
          agentId,
          amount: authorization.amount / 100,
          vendor: authorization.merchant_data?.name,
          reason: flagReason,
          transactionId: authorization.id
        })
      }

      io.emit('wallet:transaction', {
        agentId,
        type: 'spend',
        amount: authorization.amount / 100,
        vendor: authorization.merchant_data?.name,
        status: approved ? 'authorized' : 'declined',
        flagged
      })
    }

    // Check for critical balance
    const balance = await walletService.getBalance()
    if (balance.available < walletService.CRITICAL_BALANCE_THRESHOLD * 100) {
      // Freeze all cards - in production, call Stripe API
      const io = req.app.get('io')
      if (io) {
        io.emit('wallet:critical_balance', {
          balance: balance.available / 100,
          threshold: walletService.CRITICAL_BALANCE_THRESHOLD
        })
      }
    }

    res.json({ approved: true, metadata: flagged ? { flagged: true } : {} })
  } catch (error) {
    console.error('[StripeWebhook] Authorization error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * POST /api/webhooks/stripe/payment-intent-succeeded
 * Revenue reception handler
 */
router.post('/payment-intent-succeeded', express.raw({ type: 'application/json' }), async (req, res) => {
  const db = getDb()

  try {
    const payload = JSON.parse(req.body.toString())
    const paymentIntent = payload.data?.object

    if (!paymentIntent) {
      return res.status(400).json({ error: 'Missing payment intent' })
    }

    const amount = paymentIntent.amount / 100
    const source = paymentIntent.description || paymentIntent.id

    // Log revenue
    await walletService.logRevenue(
      source,
      amount,
      paymentIntent.id,
      paymentIntent.metadata?.venture_id,
      paymentIntent.metadata?.source_type || 'subscription'
    )

    // Emit socket event
    const io = req.app.get('io')
    if (io) {
      io.emit('wallet:revenue_received', {
        amount,
        source,
        paymentIntentId: paymentIntent.id
      })
    }

    res.json({ received: true })
  } catch (error) {
    console.error('[StripeWebhook] Payment intent error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * POST /api/webhooks/stripe/treasury-received-credit
 * ACH/wire receipt handler
 */
router.post('/treasury-received-credit', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const payload = JSON.parse(req.body.toString())
    const credit = payload.data?.object

    if (!credit) {
      return res.status(400).json({ error: 'Missing credit object' })
    }

    const amount = credit.amount / 100

    // Log ACH transfer as revenue
    await walletService.logRevenue(
      'ach_transfer',
      amount,
      credit.id,
      null,
      'ach'
    )

    // Emit socket event
    const io = req.app.get('io')
    if (io) {
      io.emit('wallet:ach_received', {
        amount,
        creditId: credit.id
      })
    }

    res.json({ received: true })
  } catch (error) {
    console.error('[StripeWebhook] Treasury credit error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * POST /api/webhooks/stripe/issuing-card transaction
 * Handle card transactions (settlement)
 */
router.post('/issuing-card-transaction', express.raw({ type: 'application/json' }), async (req, res) => {
  const db = getDb()

  try {
    const payload = JSON.parse(req.body.toString())
    const transaction = payload.data?.object

    if (!transaction) {
      return res.status(400).json({ error: 'Missing transaction object' })
    }

    // Update transaction status to settled
    db.prepare(`
      UPDATE wallet_transactions
      SET status = 'settled', settled_at = datetime('now')
      WHERE stripe_transaction_id = ?
    `).run(transaction.id)

    res.json({ settled: true })
  } catch (error) {
    console.error('[StripeWebhook] Card transaction error:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router