module.exports = function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT,
      status TEXT DEFAULT 'active',
      currentTask TEXT,
      energyLevel INTEGER DEFAULT 80,
      lastAction TEXT,
      moodState TEXT DEFAULT 'focused',
      updatedAt TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS approvals (
      id TEXT PRIMARY KEY,
      agentId TEXT NOT NULL,
      agentName TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      riskLevel TEXT DEFAULT 'low',
      riskScore INTEGER DEFAULT 2,
      estimatedImpact TEXT,
      confidence INTEGER DEFAULT 75,
      category TEXT DEFAULT 'General',
      status TEXT DEFAULT 'pending',
      note TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      resolvedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      agentId TEXT NOT NULL,
      text TEXT NOT NULL,
      type TEXT DEFAULT 'normal',
      timestamp TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT,
      agentId TEXT NOT NULL,
      agentName TEXT,
      category TEXT DEFAULT 'General',
      votes INTEGER DEFAULT 0,
      posX REAL DEFAULT 200,
      posY REAL DEFAULT 200,
      color TEXT DEFAULT '#00d4ff',
      isRecent INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS note_edges (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      target TEXT NOT NULL,
      label TEXT
    );

    CREATE TABLE IF NOT EXISTS wallet_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stripe_transaction_id TEXT UNIQUE,
      type TEXT,
      agent_id TEXT,
      team TEXT,
      amount INTEGER,
      currency TEXT DEFAULT 'usd',
      vendor TEXT,
      category TEXT,
      description TEXT,
      status TEXT,
      venture_id TEXT,
      authorized_at TEXT DEFAULT (datetime('now')),
      settled_at TEXT,
      flagged INTEGER DEFAULT 0,
      flag_reason TEXT,
      stripe_payload TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS wallet_balances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      snapshot_at TEXT DEFAULT (datetime('now')),
      available INTEGER,
      pending INTEGER,
      restricted INTEGER,
      recorded_by TEXT
    );

    CREATE TABLE IF NOT EXISTS agent_spend_limits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agent_id TEXT UNIQUE,
      card_id TEXT,
      cardholder_id TEXT,
      daily_limit INTEGER,
      monthly_limit INTEGER,
      per_tx_limit INTEGER,
      allowed_categories TEXT,
      last_updated TEXT DEFAULT (datetime('now')),
      updated_by TEXT
    );

    CREATE TABLE IF NOT EXISTS revenue_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stripe_payment_intent_id TEXT UNIQUE,
      source TEXT,
      source_type TEXT,
      amount INTEGER,
      venture_id TEXT,
      received_at TEXT DEFAULT (datetime('now')),
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS workflow_status (
      workflow_id TEXT PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'idle',
      current_phase INTEGER,
      last_run TEXT,
      last_result TEXT,
      last_error TEXT,
      next_run TEXT,
      block_reason TEXT,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS workflow_run_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workflow_id TEXT NOT NULL,
      run_date TEXT NOT NULL,
      result TEXT,
      duration_minutes INTEGER,
      phases_completed INTEGER,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS workflow_improvements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workflow_id TEXT NOT NULL,
      submitted_by TEXT DEFAULT 'jaleel',
      text TEXT NOT NULL,
      priority TEXT DEFAULT 'medium',
      execution TEXT DEFAULT 'next_run',
      status TEXT DEFAULT 'open',
      obsidian_path TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      actioned_at TEXT
    );
  `)
}