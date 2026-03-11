const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const { getDb } = require('../db/database')

// Workflows data file
const WORKFLOWS_FILE = path.join(__dirname, '..', 'data', 'workflows.json')
const IMPROVEMENTS_DIR = '/Users/jaleeljenkins/Documents/Agents/Agency HQ/Ideas'

// Hardcoded workflow definitions
const WORKFLOWS = [
  {
    id: "self_build",
    name: "SELF BUILD",
    description: "Autonomous nightly development — Stackz builds, Smoke reviews",
    agents: ["stackz", "smoke"],
    schedule: "0 2 * * *",
    scheduleHuman: "2:00 AM PT",
    avgDuration: "~45 min",
    phases: ["Context Load", "Plan (≤3 tasks)", "Build", "Smoke Review", "Commit & Push", "Morning Brief"],
    status: "idle",
    lastRun: "2026-03-11T02:00:00Z",
    lastResult: "clean",
    nextRun: "2026-03-12T10:00:00Z",
    mcpServers: ["obsidian-vault-mcp", "filesystem"],
    skills: ["SELF_BUILD"],
    obsidianLog: "Agency HQ/Self-Build/"
  },
  {
    id: "wallet",
    name: "WALLET",
    description: "Nightly financial reconciliation — every dollar accounted for",
    agents: ["cashflow", "smoke"],
    schedule: "0 23 * * *",
    scheduleHuman: "11:00 PM PT",
    avgDuration: "~35 min",
    phases: ["Position Snapshot", "Revenue Recon", "Expense Recon", "P&L Update", "Reconciliation Report", "Smoke Review", "Briefing Handoff"],
    status: "active",
    currentPhase: 3,
    lastRun: "2026-03-10T23:00:00Z",
    lastResult: "clean",
    nextRun: "2026-03-11T23:00:00Z",
    mcpServers: ["stripe", "obsidian-vault-mcp"],
    skills: ["WALLET_SKILL", "CASHFLOW_SKILL"],
    obsidianLog: "Agency HQ/Finance/Reconciliation/"
  },
  {
    id: "megaphone_morning",
    name: "MEGAPHONE",
    description: "X community engagement, posting, research, brainstorm pipeline",
    agents: ["megaphone"],
    schedule: "0 8,12,17 * * *",
    scheduleHuman: "8AM / 12PM / 5PM PT",
    avgDuration: "~90 min/day total",
    phases: ["Mention Response", "Tier 1 Engagement", "Post Creation", "Follow Maintenance", "Research → Brainstorm", "Next Day Planning"],
    status: "blocked",
    lastRun: "2026-03-11T08:00:00Z",
    lastResult: "partial",
    nextRun: "2026-03-11T12:00:00Z",
    blockReason: "x-mcp-server rate limit — resuming at 12:00 PM",
    mcpServers: ["x-mcp-server", "obsidian-vault-mcp", "brave-search"],
    skills: ["MEGAPHONE_SKILL", "twitter-algorithm-optimizer"],
    obsidianLog: "Agency HQ/Megaphone/activity-log.md"
  },
  {
    id: "activity_tracker",
    name: "ACTIVITY TRACKER",
    description: "Morning briefing generation — aggregates everything from 7 sources",
    agents: ["cashflow", "smoke"],
    schedule: "0 6 * * *",
    scheduleHuman: "6:00 AM PT",
    avgDuration: "~20 min",
    phases: ["Collect Sources", "Smoke Editorial Pass", "Post to Briefings API", "Write Obsidian Mirror"],
    status: "idle",
    lastRun: "2026-03-11T06:00:00Z",
    lastResult: "clean",
    nextRun: "2026-03-12T06:00:00Z",
    mcpServers: ["obsidian-vault-mcp"],
    skills: ["ACTIVITY_TRACKER"],
    obsidianLog: "Agency HQ/Briefings/"
  },
  {
    id: "vault_organizer",
    name: "VAULT ORGANIZER",
    description: "Nightly Obsidian structure audit, safe auto-changes, proposals",
    agents: ["stackz"],
    schedule: "0 2 * * *",
    scheduleHuman: "2:00 AM PT (after SELF_BUILD)",
    avgDuration: "~25 min",
    phases: ["Audit", "Structural Analysis", "Safe Auto-Changes", "Proposals", "Summary Report"],
    status: "idle",
    lastRun: "2026-03-11T02:45:00Z",
    lastResult: "changes_proposed",
    nextRun: "2026-03-12T02:45:00Z",
    mcpServers: ["obsidian-vault-mcp"],
    skills: ["VAULT_ORGANIZER"],
    obsidianLog: "Agency HQ/Vault Maintenance/"
  },
  {
    id: "zettelkasten",
    name: "ZETTELKASTEN",
    description: "Nightly knowledge consolidation — fleeting → permanent notes",
    agents: ["stackz", "cashflow", "megaphone"],
    schedule: "0 3 * * *",
    scheduleHuman: "3:00 AM PT",
    avgDuration: "~30 min",
    phases: ["Process Expired Fleeting", "Detect Clusters", "Detect Conflicts", "Update Master Index", "Weekly Digest (Sundays)"],
    status: "failed",
    lastRun: "2026-03-11T03:00:00Z",
    lastResult: "error",
    lastError: "Phase 1: obsidian-vault-mcp timeout reading Fleeting/ directory (47 files)",
    nextRun: "2026-03-12T03:00:00Z",
    mcpServers: ["obsidian-vault-mcp"],
    skills: ["ZETTELKASTEN"],
    obsidianLog: "Agency HQ/Zettelkasten/"
  },
  {
    id: "revenue",
    name: "REVENUE",
    description: "On-demand revenue actions — invoices, payment links, subscriptions",
    agents: ["cashflow", "stackz"],
    schedule: null,
    scheduleHuman: "ON DEMAND",
    avgDuration: "~10 min/action",
    phases: ["A: Create Invoice", "B: Create Payment Link", "C: Create Subscription", "D: Log Manual Revenue"],
    status: "idle",
    lastRun: "2026-03-09T14:22:00Z",
    lastResult: "clean",
    nextRun: null,
    mcpServers: ["stripe", "obsidian-vault-mcp"],
    skills: ["WALLET_SKILL", "CASHFLOW_SKILL", "REVENUE"],
    obsidianLog: "Agency HQ/Finance/"
  }
]

// Load workflow status from DB or file
function getWorkflowStatus() {
  try {
    const db = getDb()

    const statusRows = db.prepare('SELECT * FROM workflow_status').all()
    const statusMap = {}
    for (const row of statusRows) {
      statusMap[row.workflow_id] = row
    }

    const historyRows = db.prepare('SELECT * FROM workflow_run_history ORDER BY run_date DESC LIMIT 49').all()
    const historyMap = {}
    for (const row of historyRows) {
      if (!historyMap[row.workflow_id]) historyMap[row.workflow_id] = []
      if (historyMap[row.workflow_id].length < 7) {
        historyMap[row.workflow_id].push(row)
      }
    }

    return { statusMap, historyMap }
  } catch (e) {
    return { statusMap: {}, historyMap: {} }
  }
}

// GET /api/workflows/status - Get all workflow statuses
router.get('/status', (req, res) => {
  const { statusMap, historyMap } = getWorkflowStatus()

  const workflows = WORKFLOWS.map(wf => {
    const dbStatus = statusMap[wf.id] || {}

    return {
      ...wf,
      status: dbStatus.status || wf.status,
      currentPhase: dbStatus.current_phase || wf.currentPhase,
      lastRun: dbStatus.last_run || wf.lastRun,
      lastResult: dbStatus.last_result || wf.lastResult,
      lastError: dbStatus.last_error || wf.lastError,
      nextRun: dbStatus.next_run || wf.nextRun,
      blockReason: dbStatus.block_reason || wf.blockReason,
      runHistory: historyMap[wf.id] || []
    }
  })

  res.json({
    workflows,
    lastUpdated: new Date().toISOString()
  })
})

// GET /api/workflows - List all workflows (definitions)
router.get('/', (req, res) => {
  res.json({ workflows: WORKFLOWS })
})

// GET /api/workflows/:id - Get single workflow
router.get('/:id', (req, res) => {
  const wf = WORKFLOWS.find(w => w.id === req.params.id)

  if (!wf) {
    return res.status(404).json({ error: 'Workflow not found' })
  }

  const { statusMap, historyMap } = getWorkflowStatus()
  const dbStatus = statusMap[wf.id] || {}

  res.json({
    ...wf,
    status: dbStatus.status || wf.status,
    currentPhase: dbStatus.current_phase || wf.currentPhase,
    lastRun: dbStatus.last_run || wf.lastRun,
    lastResult: dbStatus.last_result || wf.lastResult,
    lastError: dbStatus.last_error || wf.lastError,
    nextRun: dbStatus.next_run || wf.nextRun,
    blockReason: dbStatus.block_reason || wf.blockReason,
    runHistory: historyMap[wf.id] || []
  })
})

// POST /api/workflows/improvements - Submit improvement
router.post('/improvements', async (req, res) => {
  try {
    const { workflowId, text, priority = 'medium', execution = 'next_run' } = req.body

    if (!workflowId || !text) {
      return res.status(400).json({ error: 'workflowId and text are required' })
    }

    const wf = WORKFLOWS.find(w => w.id === workflowId)
    if (!wf) {
      return res.status(404).json({ error: 'Workflow not found' })
    }

    const now = new Date()
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '')
    const id = `${dateStr}-jaleel-${workflowId}-improvement`
    const filename = `${id}.md`

    // Write to Obsidian
    const obsidianPath = path.join(IMPROVEMENTS_DIR, filename)

    const content = `---
from: jaleel
to: stackz
workflow: ${workflowId}
priority: ${priority}
execution: ${execution}
status: open
submitted_at: ${now.toISOString()}
---

${text}
`

    // Ensure directory exists
    if (!fs.existsSync(IMPROVEMENTS_DIR)) {
      fs.mkdirSync(IMPROVEMENTS_DIR, { recursive: true })
    }

    fs.writeFileSync(obsidianPath, content)

    // Also save to DB
    try {
      const db = getDb()
      db.prepare(`
        INSERT INTO workflow_improvements (workflow_id, text, priority, execution, status, obsidian_path)
        VALUES (?, ?, ?, ?, 'open', ?)
      `).run(workflowId, text, priority, execution, `Agency HQ/Ideas/${filename}`)
    } catch (e) {
      console.warn('[Workflows] DB insert failed:', e.message)
    }

    // If ASAP, also write to pending approvals
    if (execution === 'asap') {
      const pendingDir = '/Users/jaleeljenkins/Documents/Agents/Agency HQ/Approvals/pending'
      if (!fs.existsSync(pendingDir)) {
        fs.mkdirSync(pendingDir, { recursive: true })
      }

      const pendingContent = `---
from: jaleel
to: stackz
type: workflow_improvement
workflow: ${workflowId}
priority: ${priority}
status: pending
created_at: ${now.toISOString()}
---

IMPROVEMENT REQUEST: ${wf.name}

${text}

**Priority:** ${priority}
**Execution:** ${execution}
`

      fs.writeFileSync(path.join(pendingDir, `${id}.md`), pendingContent)
    }

    res.status(201).json({
      id,
      obsidianPath: `Agency HQ/Ideas/${filename}`,
      status: 'filed'
    })
  } catch (error) {
    console.error('[Workflows] Improvement error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/workflows/improvements - List improvements
router.get('/improvements', (req, res) => {
  try {
    const db = getDb()
    const improvements = db.prepare(`
      SELECT * FROM workflow_improvements
      ORDER BY created_at DESC
      LIMIT 20
    `).all()

    res.json({ improvements })
  } catch (e) {
    res.json({ improvements: [] })
  }
})

// POST /api/workflows/:id/status - Update workflow status
router.post('/:id/status', (req, res) => {
  try {
    const { status, currentPhase, lastResult, lastError, blockReason } = req.body
    const { id } = req.params

    const db = getDb()

    db.prepare(`
      INSERT OR REPLACE INTO workflow_status (workflow_id, status, current_phase, last_result, last_error, block_reason, last_run, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(id, status, currentPhase, lastResult, lastError, blockReason)

    res.json({ success: true })
  } catch (error) {
    console.error('[Workflows] Status update error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/workflows/stats - Get aggregated stats
router.get('/stats', (req, res) => {
  const { statusMap } = getWorkflowStatus()

  const stats = {
    active: 0,
    blocked: 0,
    failed: 0,
    idle: 0
  }

  for (const wf of WORKFLOWS) {
    const status = statusMap[wf.id]?.status || wf.status
    if (stats[status] !== undefined) {
      stats[status]++
    }
  }

  res.json(stats)
})

module.exports = router