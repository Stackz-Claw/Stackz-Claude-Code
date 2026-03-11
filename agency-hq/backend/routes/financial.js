const express = require('express')
const router = express.Router()

// Use mock data as fallback, real Stripe data when available
let stripe = null
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
}

// Helper: fetch live Stripe data
async function getStripeFinancialData() {
  if (!stripe) {
    return null
  }

  try {
    const [balance, transactions, payouts] = await Promise.all([
      stripe.balance.retrieve(),
      stripe.balanceTransactions.list({ limit: 20 }),
      stripe.payouts.list({ limit: 10 })
    ])

    // Calculate revenue from successful payouts (negative = money out, positive = money in)
    const recentRevenue = transactions.data
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0) / 100

    // Calculate recent spend from fees (indicates activity)
    const recentSpend = transactions.data
      .reduce((sum, t) => sum + (t.fee || 0), 0) / 100

    return {
      connected: true,
      balance: {
        available: balance.available.reduce((s, b) => s + b.amount, 0) / 100,
        pending: balance.pending.reduce((s, b) => s + b.amount, 0) / 100,
        currency: balance.available[0]?.currency?.toUpperCase() || 'USD'
      },
      revenue: recentRevenue,
      spend: recentSpend,
      transactions: transactions.data.map(t => ({
        id: t.id,
        amount: t.amount / 100,
        fee: (t.fee || 0) / 100,
        type: t.type,
        available_on: t.available_on ? new Date(t.created * 1000).toISOString() : null,
        created: new Date(t.created * 1000).toISOString()
      })),
      payouts: payouts.data.map(p => ({
        id: p.id,
        amount: p.amount / 100,
        status: p.status,
        arrival_date: p.arrival_date ? new Date(p.arrival_date * 1000).toISOString() : null,
        created: new Date(p.created * 1000).toISOString()
      }))
    }
  } catch (error) {
    console.error('[Financial] Stripe API error:', error.message)
    return { connected: false, error: error.message }
  }
}

router.get('/', async (req, res) => {
  const mockData = require('../../mock-data/financial.json')

  // Try to get live Stripe data
  const stripeData = await getStripeFinancialData()

  // Merge with mock data for the frontend
  const response = {
    ...mockData,
    _meta: {
      hasStripe: !!stripe,
      stripeConnected: stripeData?.connected || false,
      lastUpdated: new Date().toISOString()
    }
  }

  // If Stripe is connected, add real financial data
  if (stripeData?.connected) {
    response.stripe = stripeData
    // Override mock values with real ones where available
    response.runway.cashOnHand = Math.round(stripeData.balance.available)
    response.burn.current = Math.round(stripeData.balance.available * 0.4) // Estimate burn
  }

  res.json(response)
})

// Get Stripe balance specifically
router.get('/balance', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe not configured', setupRequired: true })
  }

  try {
    const balance = await stripe.balance.retrieve()
    res.json({
      available: balance.available.reduce((s, b) => s + b.amount, 0) / 100,
      pending: balance.pending.reduce((s, b) => s + b.amount, 0) / 100,
      currency: balance.available[0]?.currency?.toUpperCase() || 'USD'
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get Stripe transactions
router.get('/transactions', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe not configured' })
  }

  try {
    const { limit = 20 } = req.query
    const transactions = await stripe.balanceTransactions.list({ limit: parseInt(limit) })
    res.json(transactions.data.map(t => ({
      id: t.id,
      amount: t.amount / 100,
      fee: (t.fee || 0) / 100,
      type: t.type,
      net: t.net / 100,
      created: new Date(t.created * 1000).toISOString()
    })))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get Stripe payouts
router.get('/payouts', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe not configured' })
  }

  try {
    const { limit = 10 } = req.query
    const payouts = await stripe.payouts.list({ limit: parseInt(limit) })
    res.json(payouts.data.map(p => ({
      id: p.id,
      amount: p.amount / 100,
      status: p.status,
      arrival_date: p.arrival_date ? new Date(p.arrival_date * 1000).toISOString() : null,
      created: new Date(p.created * 1000).toISOString()
    })))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get Stripe customers
router.get('/customers', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe not configured' })
  }

  try {
    const { limit = 20 } = req.query
    const customers = await stripe.customers.list({ limit: parseInt(limit) })
    res.json(customers.data.map(c => ({
      id: c.id,
      email: c.email,
      name: c.name,
      created: new Date(c.created * 1000).toISOString(),
      balance: c.balance / 100,
      currency: c.currency
    })))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get Stripe subscriptions
router.get('/subscriptions', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe not configured' })
  }

  try {
    const { limit = 20 } = req.query
    const subscriptions = await stripe.subscriptions.list({ limit: parseInt(limit) })
    res.json(subscriptions.data.map(s => ({
      id: s.id,
      customer: s.customer,
      status: s.status,
      current_period_start: new Date(s.current_period_start * 1000).toISOString(),
      current_period_end: new Date(s.current_period_end * 1000).toISOString(),
      plan: {
        amount: s.items.data[0]?.price?.unit_amount / 100,
        currency: s.items.data[0]?.price?.currency,
        interval: s.items.data[0]?.price?.recurring?.interval
      }
    })))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
