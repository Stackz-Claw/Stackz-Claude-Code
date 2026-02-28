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
  `)
}
