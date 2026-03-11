import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import GlassPanel from '../components/layout/GlassPanel'

const API_BASE = 'http://localhost:4001/api'

// Hardcoded workflow data from spec
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

// Status colors
const STATUS_COLORS = {
  active: { bg: '#00d4aa22', border: '#00d4aa', dot: '#00d4aa', label: 'ACTIVE' },
  blocked: { bg: '#f59e0b22', border: '#f59e0b', dot: '#f59e0b', label: 'BLOCKED' },
  failed: { bg: '#ef444422', border: '#ef4444', dot: '#ef4444', label: 'FAILED' },
  idle: { bg: 'transparent', border: '#3d4457', dot: '#3d4457', label: 'IDLE' }
}

// Countdown component
function Countdown({ targetDate, status }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (!targetDate) return

    const update = () => {
      const now = new Date()
      const target = new Date(targetDate)
      const diff = target - now

      if (diff <= 0) {
        setTimeLeft('Now')
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      if (hours > 24) {
        const days = Math.floor(hours / 24)
        setTimeLeft(`${days}d ${hours % 24}h`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`)
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`)
      } else {
        setTimeLeft(`${seconds}s`)
      }
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  const isUrgent = timeLeft && !timeLeft.includes('d') && (
    timeLeft.includes('m') && parseInt(timeLeft) < 5 ||
    !timeLeft.includes('m')
  )

  if (status === 'active') {
    return <span className="text-[#00d4aa]">RUNNING</span>
  }

  return (
    <span style={{ color: isUrgent ? '#f59e0b' : '#7a8299' }}>
      {timeLeft || '—'}
    </span>
  )
}

// Workflow Card
function WorkflowCard({ workflow, onClick }) {
  const colors = STATUS_COLORS[workflow.status] || STATUS_COLORS.idle
  const isActive = workflow.status === 'active'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="cursor-pointer rounded-lg border-l-[3px] overflow-hidden"
      style={{
        borderColor: colors.border,
        background: colors.bg,
        boxShadow: isActive ? `0 0 20px ${colors.border}15` : 'none'
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#1e2330]">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${isActive ? 'animate-pulse' : ''}`}
            style={{
              background: colors.dot,
              boxShadow: isActive ? `0 0 8px ${colors.dot}` : 'none'
            }}
          />
          <span className="font-['IBM_Plex_Mono'] text-[10px] tracking-wider" style={{ color: colors.dot }}>
            {colors.label}
          </span>
        </div>
        <div className="text-[10px] font-mono text-[#7a8299]">
          {workflow.status === 'active' ? (
            <span>PHASE {workflow.currentPhase || 1}/{workflow.phases.length}</span>
          ) : workflow.nextRun ? (
            <Countdown targetDate={workflow.nextRun} status={workflow.status} />
          ) : workflow.scheduleHuman}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-['DM_Sans'] text-base font-semibold text-[#e8eaf0]">{workflow.name}</h3>
          <p className="text-xs text-[#7a8299] mt-0.5">{workflow.description}</p>
        </div>

        {/* Agents */}
        <div className="flex flex-wrap gap-1">
          {workflow.agents.map((agent, i) => (
            <span
              key={agent}
              className="text-[10px] px-2 py-0.5 rounded bg-[#1a1d24] text-[#7a8299]"
            >
              {i === 0 ? '├─ ' : '└─ '}{agent.toUpperCase()}
            </span>
          ))}
        </div>

        {/* Schedule info */}
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div>
            <span className="text-[#3d4457]">SCHEDULE</span>
            <div className="text-[#7a8299]">{workflow.scheduleHuman}</div>
          </div>
          <div>
            <span className="text-[#3d4457]">LAST RUN</span>
            <div className="flex items-center gap-1">
              <span className="text-[#7a8299]">
                {workflow.lastRun ? new Date(workflow.lastRun).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Never'}
              </span>
              {workflow.lastResult && (
                <span style={{ color: workflow.lastResult === 'clean' ? '#00d4aa' : workflow.lastResult === 'error' ? '#ef4444' : '#f59e0b' }}>
                  {workflow.lastResult === 'clean' ? '✓' : workflow.lastResult === 'error' ? '✗' : '⚠'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Phases */}
        <div className="pt-2 border-t border-[#1e2330]">
          <div className="text-[9px] text-[#3d4457] font-['IBM_Plex_Mono'] mb-1.5">PHASES</div>
          <div className="flex flex-wrap gap-1">
            {workflow.phases.slice(0, 4).map((phase, i) => (
              <span
                key={i}
                className={`text-[9px] px-1.5 py-0.5 rounded ${
                  isActive && i + 1 === workflow.currentPhase
                    ? 'bg-[#00d4aa] text-[#0a0b0d]'
                    : 'bg-[#1a1d24] text-[#7a8299]'
                }`}
              >
                {i + 1} {phase}
              </span>
            ))}
            {workflow.phases.length > 4 && (
              <span className="text-[9px] px-1.5 py-0.5 text-[#3d4457]">
                +{workflow.phases.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Blocked/Failed reason */}
        {workflow.status === 'blocked' && workflow.blockReason && (
          <div className="p-2 rounded bg-[#f59e0b15] border border-[#f59e0b30]">
            <span className="text-[10px] text-[#f59e0b]">⚠ {workflow.blockReason}</span>
          </div>
        )}
        {workflow.status === 'failed' && workflow.lastError && (
          <div className="p-2 rounded bg-[#ef444415] border border-[#ef444430]">
            <span className="text-[10px] text-[#ef4444]">✕ {workflow.lastError}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Workflow Detail Drawer
function WorkflowDrawer({ workflow, onClose }) {
  if (!workflow) return null

  const colors = STATUS_COLORS[workflow.status] || STATUS_COLORS.idle

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed right-0 top-0 h-full w-[400px] bg-[#111318] border-l border-[#2a3040] z-50 overflow-y-auto"
      style={{ boxShadow: '-20px 0 40px rgba(0,0,0,0.5)' }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-['IBM_Plex_Mono'] text-lg text-[#e8eaf0]">{workflow.name}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#1f232c] text-[#7a8299]"
          >
            ✕
          </button>
        </div>

        {/* Status */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: colors.dot }}
            />
            <span style={{ color: colors.dot }}>{colors.label}</span>
            {workflow.status === 'active' && (
              <span className="text-[#7a8299]">— Phase {workflow.currentPhase} of {workflow.phases.length}</span>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="text-[10px] text-[#3d4457] font-['IBM_Plex_Mono'] mb-2">PROGRESS</div>
          <div className="flex gap-1">
            {workflow.phases.map((phase, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                  i + 1 < (workflow.currentPhase || 0)
                    ? 'bg-[#00d4aa] text-[#0a0b0d]'
                    : i + 1 === workflow.currentPhase
                    ? 'bg-[#00d4aa] text-[#0a0b0d] animate-pulse'
                    : 'bg-[#1a1d24] text-[#3d4457]'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="mb-6">
          <div className="text-[10px] text-[#3d4457] font-['IBM_Plex_Mono'] mb-1">SCHEDULE</div>
          <div className="text-sm text-[#e8eaf0]">{workflow.schedule} · {workflow.scheduleHuman}</div>
          {workflow.nextRun && (
            <div className="text-xs text-[#7a8299]">Next: {new Date(workflow.nextRun).toLocaleString()}</div>
          )}
        </div>

        {/* Last 7 runs */}
        <div className="mb-6">
          <div className="text-[10px] text-[#3d4457] font-['IBM_Plex_Mono'] mb-2">LAST 7 RUNS</div>
          <div className="space-y-1 text-xs font-mono">
            {[
              { date: 'Mar 11', result: 'clean', duration: '35m' },
              { date: 'Mar 10', result: 'clean', duration: '33m' },
              { date: 'Mar 09', result: 'anomaly', duration: '41m' },
              { date: 'Mar 08', result: 'clean', duration: '34m' },
              { date: 'Mar 07', result: 'clean', duration: '36m' },
              { date: 'Mar 06', result: 'clean', duration: '32m' },
              { date: 'Mar 05', result: 'failed', duration: '8m' },
            ].map((run, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[#7a8299] w-16">{run.date}</span>
                <span style={{
                  color: run.result === 'clean' ? '#00d4aa' : run.result === 'failed' ? '#ef4444' : '#f59e0b'
                }}>
                  {run.result === 'clean' ? '✓' : run.result === 'failed' ? '✗' : '⚠'} {run.result}
                </span>
                <span className="text-[#3d4457]">{run.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MCP Servers */}
        <div className="mb-6">
          <div className="text-[10px] text-[#3d4457] font-['IBM_Plex_Mono'] mb-1">MCP SERVERS</div>
          <div className="flex flex-wrap gap-1">
            {workflow.mcpServers.map(server => (
              <span key={server} className="text-xs px-2 py-1 rounded bg-[#1a1d24] text-[#7a8299]">
                {server}
              </span>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <div className="text-[10px] text-[#3d4457] font-['IBM_Plex_Mono'] mb-1">SKILLS</div>
          <div className="flex flex-wrap gap-1">
            {workflow.skills.map(skill => (
              <span key={skill} className="text-xs px-2 py-1 rounded bg-[#5b6af022] text-[#5b6af0]">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Agents */}
        <div className="mb-6">
          <div className="text-[10px] text-[#3d4457] font-['IBM_Plex_Mono'] mb-1">AGENTS</div>
          <div className="text-sm text-[#e8eaf0]">
            {workflow.agents.join(' (primary) · ')} (review)
          </div>
        </div>

        {/* Obsidian Log */}
        <div className="mb-6">
          <div className="text-[10px] text-[#3d4457] font-['IBM_Plex_Mono'] mb-1">OBSIDIAN LOG</div>
          <a
            href={`obsidian://open?vault=Agents&file=${encodeURIComponent(workflow.obsidianLog)}`}
            className="text-xs text-[#5b6af0] hover:underline"
          >
            {workflow.obsidianLog}
          </a>
        </div>

        {/* Improvement button */}
        <button className="w-full py-3 rounded-lg bg-[#5b6af022] border border-[#5b6af0] text-[#5b6af0] text-sm font-medium hover:bg-[#5b6af0] hover:text-white transition-colors">
          + Submit Improvement for {workflow.name}
        </button>
      </div>
    </motion.div>
  )
}

// Improvement Panel
function ImprovementPanel({ workflows }) {
  const [expanded, setExpanded] = useState(true)
  const [selectedWorkflow, setSelectedWorkflow] = useState('')
  const [priority, setPriority] = useState('medium')
  const [execution, setExecution] = useState('next_run')
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)

  const handleSubmit = async () => {
    if (!selectedWorkflow || !text) return

    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/workflows/improvements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId: selectedWorkflow,
          text,
          priority,
          execution
        })
      })
      const data = await res.json()

      setSuccess(data.obsidianPath)
      setText('')
      setTimeout(() => setSuccess(null), 3000)
    } catch (e) {
      console.error('Submit failed:', e)
    }
    setSubmitting(false)
  }

  return (
    <div className="fixed bottom-0 left-60 right-0 bg-[#111318] border-t border-[#2a3040] z-40">
      <AnimatePresence>
        {expanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[#5b6af0]">⚡</span>
                <span className="font-['IBM_Plex_Mono'] text-xs text-[#e8eaf0] tracking-wider">
                  WORKFLOW IMPROVEMENT
                </span>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="text-[#7a8299] hover:text-[#e8eaf0] text-xs"
              >
                — Collapse
              </button>
            </div>

            {/* Form */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="text-[10px] text-[#3d4457] font-['IBM_Plex_Mono'] block mb-1">
                  TARGET WORKFLOW
                </label>
                <select
                  value={selectedWorkflow}
                  onChange={(e) => setSelectedWorkflow(e.target.value)}
                  className="w-full bg-[#1a1d24] border border-[#2a3040] rounded px-3 py-2 text-sm text-[#e8eaf0] focus:border-[#5b6af0] outline-none"
                >
                  <option value="">Select workflow...</option>
                  {workflows.map(wf => (
                    <option key={wf.id} value={wf.id}>{wf.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-[#3d4457] font-['IBM_Plex_Mono'] block mb-1">
                  PRIORITY
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-[#1a1d24] border border-[#2a3040] rounded px-3 py-2 text-sm text-[#e8eaf0] focus:border-[#5b6af0] outline-none"
                >
                  <option value="high">HIGH</option>
                  <option value="medium">MEDIUM</option>
                  <option value="low">LOW</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe the improvement..."
                className="w-full h-20 bg-[#1a1d24] border border-[#2a3040] rounded px-3 py-2 text-sm text-[#e8eaf0] placeholder-[#3d4457] focus:border-[#5b6af0] outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="text-[10px] text-[#7a8299]">Execution:</label>
                {['next_run', 'asap', 'flag_only'].map(opt => (
                  <label key={opt} className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="execution"
                      value={opt}
                      checked={execution === opt}
                      onChange={(e) => setExecution(e.target.value)}
                      className="accent-[#5b6af0]"
                    />
                    <span className="text-xs text-[#7a8299]">
                      {opt === 'next_run' ? 'Next run' : opt === 'asap' ? 'ASAP' : 'Flag only'}
                    </span>
                  </label>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={!selectedWorkflow || !text || submitting}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  success
                    ? 'bg-[#00d4aa] text-[#0a0b0d]'
                    : !selectedWorkflow || !text
                    ? 'bg-[#1a1d24] text-[#3d4457] cursor-not-allowed'
                    : 'bg-[#5b6af0] text-white hover:bg-[#6b7af1]'
                }`}
              >
                {submitting ? 'Filing...' : success ? '✓ Filed' : 'Submit Improvement →'}
              </button>
            </div>

            {success && (
              <div className="mt-2 text-xs text-[#00d4aa]">
                Improvement filed → {success}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 py-2 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-[#5b6af0]">⚡</span>
              <span className="text-xs text-[#7a8299]">Submit workflow improvement</span>
            </div>
            <button
              onClick={() => setExpanded(true)}
              className="text-xs text-[#5b6af0] hover:underline"
            >
              Expand →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Main Page
export default function Workflows() {
  const [filter, setFilter] = useState('all')
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [workflows, setWorkflows] = useState(WORKFLOWS)

  const fetchWorkflows = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/workflows/status`)
      const data = await res.json()
      setWorkflows(data.workflows)
      setLastUpdated(new Date())
    } catch (e) {
      console.warn('Using hardcoded workflows')
    }
  }, [])

  useEffect(() => {
    fetchWorkflows()
    const interval = setInterval(fetchWorkflows, 30000)
    return () => clearInterval(interval)
  }, [fetchWorkflows])

  const stats = {
    active: workflows.filter(w => w.status === 'active').length,
    blocked: workflows.filter(w => w.status === 'blocked').length,
    failed: workflows.filter(w => w.status === 'failed').length,
    idle: workflows.filter(w => w.status === 'idle').length
  }

  const filteredWorkflows = filter === 'all'
    ? workflows
    : workflows.filter(w => w.status === filter)

  const timeSinceUpdate = lastUpdated
    ? Math.floor((new Date() - lastUpdated) / 1000)
    : null

  return (
    <div className="h-full overflow-y-auto pb-40" style={{ background: '#0a0b0d' }}>
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-[#0a0b0d] border-b border-[#1e2330] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['IBM_Plex_Mono'] text-lg text-[#e8eaf0] tracking-widest uppercase">
              WORKFLOW ORCHESTRATION
            </h1>
            <div className="text-[10px] text-[#3d4457] mt-0.5 font-['IBM_Plex_Mono']">
              Last sync: {timeSinceUpdate ? `${timeSinceUpdate}s ago` : '—'}
            </div>
          </div>
          <button
            onClick={fetchWorkflows}
            className="px-3 py-1.5 rounded bg-[#1a1d24] border border-[#2a3040] text-xs text-[#7a8299] hover:text-[#e8eaf0] hover:border-[#5b6af0] transition-colors"
          >
            ↺ Refresh
          </button>
        </div>
      </div>

      {/* Status Summary Strip */}
      <div className="px-6 py-3 flex items-center gap-6 border-b border-[#1e2330]">
        {[
          { key: 'active', label: 'ACTIVE', color: '#00d4aa', count: stats.active, symbol: '●' },
          { key: 'blocked', label: 'BLOCKED', color: '#f59e0b', count: stats.blocked, symbol: '◐' },
          { key: 'failed', label: 'FAILED', color: '#ef4444', count: stats.failed, symbol: '✕' },
          { key: 'idle', label: 'IDLE', color: '#3d4457', count: stats.idle, symbol: '○' },
        ].map(status => (
          <button
            key={status.key}
            onClick={() => setFilter(filter === status.key ? 'all' : status.key)}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              filter === status.key ? '' : 'opacity-60 hover:opacity-100'
            }`}
            style={{ color: filter === status.key ? status.color : '#7a8299' }}
          >
            <span style={{ color: status.color }}>{status.symbol}</span>
            <span className="font-['IBM_Plex_Mono']">{status.count} {status.label}</span>
          </button>
        ))}
      </div>

      {/* Workflow Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredWorkflows.map((wf, i) => (
            <div key={wf.id} style={{ '--card-index': i }}>
              <WorkflowCard
                workflow={wf}
                onClick={() => setSelectedWorkflow(wf)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {selectedWorkflow && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedWorkflow(null)}
            />
            <WorkflowDrawer
              workflow={selectedWorkflow}
              onClose={() => setSelectedWorkflow(null)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Improvement Panel */}
      <ImprovementPanel workflows={workflows} />

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.7; }
        }
        .animate-pulse {
          animation: pulse-dot 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}