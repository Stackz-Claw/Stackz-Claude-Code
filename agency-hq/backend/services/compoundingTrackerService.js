/**
 * Compounding Tracker Service
 * Weekly financial reports and cumulative multiplier tracking
 */

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, '../db/agency.db');
const COMPOUNDING_DIR = path.join(__dirname, '../../docs/Finance/Compounding');
const SEED_FILE = path.join(__dirname, '../../docs/Finance/seed-record.md');

/**
 * Get database connection
 */
function getDb() {
  return new Database(DB_PATH);
}

/**
 * Get or create the seed record
 */
function getSeedRecord() {
  if (fs.existsSync(SEED_FILE)) {
    const content = fs.readFileSync(SEED_FILE, 'utf8');
    const amountMatch = content.match(/Initial Seed:\s*\$?([\d,.]+)/);
    const dateMatch = content.match(/Date:\s*(\d{4}-\d{2}-\d{2})/);

    return {
      initial_amount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null,
      date: dateMatch ? dateMatch[1] : null,
      exists: true
    };
  }

  return { exists: false };
}

/**
 * Initialize seed record
 */
function initializeSeed(amount, note = '') {
  const date = new Date().toISOString().split('T')[0];

  const content = `# Seed Record

**Initial Seed**: $${amount.toLocaleString()}
**Date**: ${date}
**Note**: ${note || 'Initial seed. This number only grows.'}

---

*This file is immutable after creation. The compounding tracker uses this as the denominator forever.*
`;

  fs.writeFileSync(SEED_FILE, content);
  console.log(`[CompoundingTracker] Seed initialized: $${amount}`);

  // Also save to database
  const db = getDb();
  db.prepare(`
    INSERT INTO wallet_seed (initial_amount, date, note)
    VALUES (?, ?, ?)
  `).run(amount, date, note);
  db.close();

  return { initial_amount: amount, date };
}

/**
 * Get current total balance across all pools
 */
function getTotalBalance() {
  const db = getDb();
  try {
    const result = db.prepare(`
      SELECT COALESCE(SUM(balance), 0) as total
      FROM wallet_pools
    `).get();
    return result.total;
  } finally {
    db.close();
  }
}

/**
 * Get pool balances and status
 */
function getPoolStatus() {
  const db = getDb();
  try {
    const pools = db.prepare(`
      SELECT pool_name, balance, monthly_burn
      FROM wallet_pools
    `).all();

    return pools.map(p => ({
      name: p.pool_name,
      balance: p.balance,
      monthly_burn: p.monthly_burn,
      months_remaining: p.monthly_burn > 0
        ? Math.round((p.balance / p.monthly_burn) * 10) / 10
        : 'N/A'
    }));
  } finally {
    db.close();
  }
}

/**
 * Calculate cumulative multiplier
 */
function getCumulativeMultiplier() {
  const seed = getSeedRecord();
  if (!seed.initial_amount) {
    return null;
  }

  const total = getTotalBalance();
  return total / seed.initial_amount;
}

/**
 * Get revenue and expenses for a period
 */
function getPeriodTotals(days = 7) {
  const db = getDb();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  try {
    const revenue = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM wallet_revenue
      WHERE created_at >= ?
    `).get(startDate.toISOString());

    const expenses = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM wallet_expenses
      WHERE created_at >= ?
    `).get(startDate.toISOString());

    return {
      revenue: revenue.total,
      expenses: expenses.total,
      net: revenue.total - expenses.total
    };
  } finally {
    db.close();
  }
}

/**
 * Get weekly report data
 */
function getWeekNumber(startDate) {
  const seed = getSeedRecord();
  if (!seed.date) return 1;

  const start = new Date(seed.date);
  const now = new Date();
  const diffTime = Math.abs(now - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7) + 1;
}

/**
 * Generate weekly compounding report
 */
function weeklyReport() {
  const weekNum = getWeekNumber();
  const seed = getSeedRecord();
  const totalBalance = getTotalBalance();
  const pools = getPoolStatus();
  const totals = getPeriodTotals(7);
  const multiplier = getCumulativeMultiplier();

  // Get best/worst ROI expenses this week
  const db = getDb();
  let bestROI = { vendor: 'None', multiplier: 0 };
  let worstROI = { vendor: 'None', multiplier: Infinity };

  try {
    const expenses = db.prepare(`
      SELECT vendor, actual_multiplier
      FROM wallet_expenses
      WHERE created_at >= date('now', '-7 days')
        AND actual_multiplier IS NOT NULL
    `).all();

    if (expenses.length > 0) {
      const withROI = expenses.filter(e => e.actual_multiplier > 0);
      if (withROI.length > 0) {
        withROI.sort((a, b) => b.actual_multiplier - a.actual_multiplier);
        bestROI = { vendor: withROI[0].vendor, multiplier: withROI[0].actual_multiplier };
        worstROI = {
          vendor: withROI[withROI.length - 1].vendor,
          multiplier: withROI[withROI.length - 1].actual_multiplier
        };
      }
    }
  } finally {
    db.close();
  }

  // Determine status
  let status = 'YES';
  if (multiplier !== null && multiplier < 1) {
    status = 'NO';
  } else if (multiplier !== null && multiplier < 1.5) {
    status = 'WATCH';
  }

  const report = `# Week ${weekNum} Compounding Report

**Generated**: ${new Date().toISOString()}

## Balance Summary

| Metric | Amount |
|--------|--------|
| Opening Balance | $${(seed.initial_amount || 0).toLocaleString()} |
| Revenue In | $${totals.revenue.toLocaleString()} |
| Expenses Out | $${totals.expenses.toLocaleString()} |
| Net | $${totals.net.toLocaleString()} |
| **Closing Balance** | **$${totalBalance.toLocaleString()}** |

## Multipliers

| Metric | Value |
|--------|-------|
| Weekly Multiplier | ${totals.expenses > 0 ? (totals.revenue / totals.expenses).toFixed(2) : 'N/A'} |
| Cumulative Multiplier | ${multiplier ? multiplier.toFixed(2) : 'N/A'} |

## ROI This Week

- **Best ROI**: ${bestROI.vendor} — ${bestROI.multiplier.toFixed(2)}x
- **Worst ROI**: ${worstROI.vendor} — ${worstROI.multiplier === Infinity ? 'N/A' : worstROI.multiplier.toFixed(2) + 'x'}

## Pool Status

| Pool | Balance | Monthly Burn | Months Remaining |
|------|---------|--------------|------------------|
${pools.map(p => `| ${p.name.charAt(0).toUpperCase() + p.name.slice(1)} | $${p.balance.toLocaleString()} | $${p.monthly_burn.toLocaleString()} | ${p.months_remaining} |`).join('\n')}

## Status

**On Track for Exponential Growth**: ${status}

${status !== 'YES' ? '## Corrective Actions Needed\n\n- [ ] Review all recent expenses for ROI\n- [ ] Identify revenue opportunities\n- [ ] Consider freezing non-essential spend' : ''}

---

*Generated by Compounding Tracker*
`;

  // Save to file
  if (!fs.existsSync(COMPOUNDING_DIR)) {
    fs.mkdirSync(COMPOUNDING_DIR, { recursive: true });
  }

  const filepath = path.join(COMPOUNDING_DIR, `week-${weekNum}.md`);
  fs.writeFileSync(filepath, report);

  console.log(`[CompoundingTracker] Week ${weekNum} report saved to ${filepath}`);

  return {
    week: weekNum,
    total_balance: totalBalance,
    multiplier,
    status,
    filepath
  };
}

/**
 * Get compounding history
 */
function getCompoundingHistory() {
  if (!fs.existsSync(COMPOUNDING_DIR)) {
    return [];
  }

  const files = fs.readdirSync(COMPOUNDING_DIR)
    .filter(f => f.startsWith('week-') && f.endsWith('.md'))
    .sort();

  return files.map(f => {
    const content = fs.readFileSync(path.join(COMPOUNDING_DIR, f), 'utf8');
    const multiplierMatch = content.match(/Cumulative Multiplier.*\|\s*([\d.]+)/);
    const balanceMatch = content.match(/Closing Balance.*\|\s*\*\*?\$?([\d,]+)/);
    const statusMatch = content.match(/On Track.*?:\s*(\w+)/);

    return {
      week: f.replace('week-', '').replace('.md', ''),
      multiplier: multiplierMatch ? parseFloat(multiplierMatch[1]) : null,
      balance: balanceMatch ? parseFloat(balanceMatch[1].replace(/,/g, '')) : null,
      status: statusMatch ? statusMatch[1] : null
    };
  });
}

/**
 * Initialize database tables
 */
function initialize() {
  const db = getDb();

  // Create wallet_seed table
  db.exec(`
    CREATE TABLE IF NOT EXISTS wallet_seed (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      initial_amount REAL NOT NULL,
      date TEXT NOT NULL,
      note TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create wallet_revenue table
  db.exec(`
    CREATE TABLE IF NOT EXISTS wallet_revenue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      source TEXT,
      note TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create wallet_expenses table (if not exists)
  db.exec(`
    CREATE TABLE IF NOT EXISTS wallet_expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendor TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT,
      pool TEXT,
      multiplier REAL,
      actual_multiplier REAL,
      intent_note TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Make sure pools exist
  db.exec(`
    INSERT OR IGNORE INTO wallet_pools (pool_name, balance, monthly_burn)
    VALUES ('operational', 0, 0), ('growth', 0, 0), ('reserve', 0, 0)
  `);

  db.close();
  console.log('[CompoundingTracker] Service initialized');
}

module.exports = {
  initialize,
  getSeedRecord,
  initializeSeed,
  getTotalBalance,
  getPoolStatus,
  getCumulativeMultiplier,
  getPeriodTotals,
  weeklyReport,
  getCompoundingHistory
};