/**
 * Wallet Autonomous Routes
 * API endpoints for the autonomous wallet system
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, '../db/agency.db');

// Approved vendors (in-memory + file-backed for now)
const APPROVED_VENDORS_FILE = path.join(__dirname, '../../docs/Finance/approved-vendors.json');

function getDb() {
  return new Database(DB_PATH);
}

// ============================================
// POOLS
// ============================================

// GET /api/wallet/pools - Get current pool balances
router.get('/pools', (req, res) => {
  const db = getDb();
  try {
    const pools = db.prepare(`
      SELECT pool_name, balance, monthly_burn,
             CASE WHEN monthly_burn > 0 THEN balance / monthly_burn ELSE 0 END as months_remaining
      FROM wallet_pools
    `).all();

    res.json({
      pools: pools.map(p => ({
        name: p.pool_name,
        balance: p.balance,
        monthly_burn: p.monthly_burn,
        months_remaining: Math.round(p.months_remaining * 10) / 10
      })),
      total: pools.reduce((sum, p) => sum + p.balance, 0)
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    db.close();
  }
});

// ============================================
// VENDORS
// ============================================

// GET /api/wallet/vendors/approved - Get all approved vendors
router.get('/vendors/approved', (req, res) => {
  const db = getDb();
  try {
    const vendors = db.prepare(`
      SELECT * FROM approved_vendors ORDER BY category, name
    `).all();

    res.json({ vendors });
  } catch (e) {
    // Table might not exist, return empty
    res.json({ vendors: [] });
  } finally {
    db.close();
  }
});

// GET /api/wallet/vendors/approved?name=... - Check specific vendor
router.get('/vendors/approved', (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: 'Missing vendor name' });
  }

  const db = getDb();
  try {
    const vendor = db.prepare(`
      SELECT * FROM approved_vendors WHERE name LIKE ?
    `).get(`%${name}%`);

    res.json({ vendor: vendor || null, approved: !!vendor });
  } catch (e) {
    res.json({ vendor: null, approved: false });
  } finally {
    db.close();
  }
});

// POST /api/wallet/vendors/approve - Add new vendor to approved list
router.post('/vendors/approve', (req, res) => {
  const { name, category, monthly_cap, justification } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: 'Missing required fields: name, category' });
  }

  const db = getDb();
  try {
    // Create table if not exists
    db.exec(`
      CREATE TABLE IF NOT EXISTS approved_vendors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        monthly_cap REAL,
        justification TEXT,
        approved_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.prepare(`
      INSERT OR REPLACE INTO approved_vendors (name, category, monthly_cap, justification)
      VALUES (?, ?, ?, ?)
    `).run(name, category, monthly_cap || 0, justification || '');

    res.json({ success: true, vendor: { name, category, monthly_cap } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    db.close();
  }
});

// ============================================
// CARDS
// ============================================

// GET /api/wallet/cards - List cards by category (placeholder for Stripe Issuing)
router.get('/cards', (req, res) => {
  const { category } = req.query;

  // Placeholder - would integrate with Stripe Issuing
  const cards = [
    { id: 'card_api', name: 'stackz-api', category: 'api', balance: 500, limit: 500 },
    { id: 'card_tools', name: 'stackz-tools', category: 'tools', balance: 300, limit: 300 },
    { id: 'card_infra', name: 'stackz-infra', category: 'infrastructure', balance: 400, limit: 400 },
    { id: 'card_growth', name: 'stackz-growth', category: 'marketing', balance: 500, limit: 500 },
    { id: 'card_launch', name: 'stackz-launch', category: 'campaigns', balance: 1000, limit: 1000 },
    { id: 'card_trial', name: 'stackz-trial', category: 'trials', balance: 150, limit: 150 },
    { id: 'card_reserve', name: 'stackz-reserve', category: 'emergency', balance: 0, limit: 0 }
  ];

  if (category) {
    return res.json({ cards: cards.filter(c => c.category === category) });
  }

  res.json({ cards });
});

// GET /api/wallet/cards/:id/balance - Get card balance
router.get('/cards/:id/balance', (req, res) => {
  const { id } = req.params;

  // Placeholder - would call Stripe Issuing API
  res.json({
    card_id: id,
    available: 500,
    spent: 0,
    currency: 'usd'
  });
});

// ============================================
// EXPENSES
// ============================================

// POST /api/wallet/expense/log - Log an expense
router.post('/expense/log', (req, res) => {
  const { vendor, amount, category, pool, multiplier, intent_note } = req.body;

  if (!vendor || !amount) {
    return res.status(400).json({ error: 'Missing required fields: vendor, amount' });
  }

  const db = getDb();
  try {
    db.prepare(`
      INSERT INTO wallet_expenses (vendor, amount, category, pool, multiplier, intent_note)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(vendor, amount, category || 'uncategorized', pool || 'operational', multiplier, intent_note);

    // Update pool balance
    if (pool) {
      db.prepare(`
        UPDATE wallet_pools SET balance = balance - ? WHERE pool_name = ?
      `).run(amount, pool);
    }

    res.json({ success: true, expense: { vendor, amount, category, pool } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    db.close();
  }
});

// GET /api/wallet/recent-expenses - Get recent expenses
router.get('/recent-expenses', (req, res) => {
  const { agent, days = 7 } = req.query;
  const db = getDb();

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const expenses = db.prepare(`
      SELECT * FROM wallet_expenses
      WHERE created_at >= ?
      ORDER BY created_at DESC
      LIMIT 50
    `).all(startDate.toISOString());

    res.json({ expenses });
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    db.close();
  }
});

// ============================================
// REVENUE
// ============================================

// POST /api/wallet/revenue/log - Log revenue
router.post('/revenue/log', (req, res) => {
  const { amount, source, note } = req.body;

  if (!amount) {
    return res.status(400).json({ error: 'Missing required field: amount' });
  }

  const db = getDb();
  try {
    db.prepare(`
      INSERT INTO wallet_revenue (amount, source, note)
      VALUES (?, ?, ?)
    `).run(amount, source || 'unknown', note || '');

    // Add to operational pool by default
    db.prepare(`
      UPDATE wallet_pools SET balance = balance + ? WHERE pool_name = 'operational'
    `).run(amount);

    res.json({ success: true, revenue: { amount, source } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    db.close();
  }
});

// ============================================
// SEED
// ============================================

// GET /api/wallet/seed - Get seed record
router.get('/seed', (req, res) => {
  const db = getDb();
  try {
    const seed = db.prepare(`
      SELECT * FROM wallet_seed ORDER BY id DESC LIMIT 1
    `).get();

    if (seed) {
      return res.json({
        initial_amount: seed.initial_amount,
        date: seed.date,
        note: seed.note
      });
    }

    res.json({ initialized: false });
  } catch (e) {
    res.json({ initialized: false });
  } finally {
    db.close();
  }
});

// POST /api/wallet/seed/initialize - Initialize seed
router.post('/seed/initialize', (req, res) => {
  const { initial_amount, date, note, pool_split } = req.body;

  if (!initial_amount) {
    return res.status(400).json({ error: 'Missing required field: initial_amount' });
  }

  const db = getDb();
  try {
    // Check if already initialized
    const existing = db.prepare('SELECT COUNT(*) as count FROM wallet_seed').get();
    if (existing.count > 0) {
      return res.status(400).json({ error: 'Seed already initialized' });
    }

    // Insert seed
    db.prepare(`
      INSERT INTO wallet_seed (initial_amount, date, note)
      VALUES (?, ?, ?)
    `).run(initial_amount, date || new Date().toISOString().split('T')[0], note || '');

    // Distribute to pools
    const split = pool_split || { operational: 0.50, growth: 0.35, reserve: 0.15 };
    const operational = initial_amount * split.operational;
    const growth = initial_amount * split.growth;
    const reserve = initial_amount * split.reserve;

    db.prepare('UPDATE wallet_pools SET balance = ? WHERE pool_name = ?').run(operational, 'operational');
    db.prepare('UPDATE wallet_pools SET balance = ? WHERE pool_name = ?').run(growth, 'growth');
    db.prepare('UPDATE wallet_pools SET balance = ? WHERE pool_name = ?').run(reserve, 'reserve');

    res.json({
      success: true,
      seed: { initial_amount, date },
      pools: { operational, growth, reserve }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    db.close();
  }
});

// ============================================
// COMPOUNDING
// ============================================

// GET /api/wallet/compounding - Get compounding history
router.get('/compounding', (req, res) => {
  const compounding = require('../services/compoundingTrackerService');

  try {
    const multiplier = compounding.getCumulativeMultiplier();
    const pools = compounding.getPoolStatus();
    const history = compounding.getCompoundingHistory();

    res.json({
      multiplier,
      pools,
      history
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================
// CIRCUIT BREAKERS
// ============================================

// GET /api/wallet/circuit-breakers/status - Get circuit breaker status
router.get('/circuit-breakers/status', (req, res) => {
  const autoRenewal = require('../services/autoRenewalService');

  try {
    const status = autoRenewal.getFrozenStatus();
    const pools = autoRenewal.getPoolBalances();

    res.json({
      frozen: status.frozen,
      last_check: status.last_check,
      pools
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;