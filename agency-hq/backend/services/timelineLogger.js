/**
 * Timeline Logger Service
 * Centralized event logging for the Agency HQ
 * Logs all significant actions: approvals, agent actions, decisions, pivots, etc.
 */

const fs = require('fs')
const path = require('path')

// In-memory event store (persisted to file)
const EVENTS_FILE = path.join(__dirname, '..', 'data', 'timeline-events.json')

// Event types
const EVENT_TYPES = {
  PROJECT_LAUNCHED: 'project_launched',
  DECISION_MADE: 'decision_made',
  AGENT_DEPLOYED: 'agent_deployed',
  PIVOT: 'pivot',
  SENTINEL_FLAGGED: 'sentinel_flagged',
  APPROVAL_GRANTED: 'approval_granted',
  APPROVAL_REJECTED: 'approval_rejected',
  NOTE_CREATED: 'note_created',
  NOTE_UPDATED: 'note_updated',
  REVENUE_RECEIVED: 'revenue_received',
  SPEND_AUTHORIZED: 'spend_authorized',
  SPEND_DECLINED: 'spend_declined',
  AGENT_STATUS_CHANGE: 'agent_status_change',
  SYSTEM_ALERT: 'system_alert'
}

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, '..', 'data')
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Load events from file
function loadEvents() {
  try {
    if (fs.existsSync(EVENTS_FILE)) {
      const data = fs.readFileSync(EVENTS_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (e) {
    console.error('[TimelineLogger] Error loading events:', e.message)
  }
  return { entries: [], lastId: 0 }
}

// Save events to file
function saveEvents(data) {
  try {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(data, null, 2))
  } catch (e) {
    console.error('[TimelineLogger] Error saving events:', e.message)
  }
}

/**
 * Log an event to the timeline
 * @param {string} type - Event type from EVENT_TYPES
 * @param {string} summary - Brief summary of what happened
 * @param {object} metadata - Additional context (agent, cost, etc.)
 */
function logEvent(type, summary, metadata = {}) {
  const data = loadEvents()
  const now = new Date()

  const entry = {
    id: `tl_${++data.lastId}`,
    type,
    summary,
    timestamp: now.toISOString(),
    ...metadata
  }

  data.entries.unshift(entry) // Add to beginning (most recent first)

  // Keep only last 1000 entries
  if (data.entries.length > 1000) {
    data.entries = data.entries.slice(0, 1000)
  }

  saveEvents(data)

  // Also emit to connected clients via Socket.io if available
  // This will be called from the server context
  return entry
}

/**
 * Log approval decision
 */
function logApproval(agentId, approvalType, decision, details = {}) {
  const type = decision === 'approved' ? EVENT_TYPES.APPROVAL_GRANTED : EVENT_TYPES.APPROVAL_REJECTED

  return logEvent(type, `${agentId} ${decision} ${approvalType}`, {
    agentId,
    approvalType,
    decision,
    ...details
  })
}

/**
 * Log agent deployment
 */
function logAgentDeployed(agentId, role, context = {}) {
  return logEvent(EVENT_TYPES.AGENT_DEPLOYED, `${agentId} deployed as ${role}`, {
    agentId,
    role,
    ...context
  })
}

/**
 * Log agent status change
 */
function logAgentStatusChange(agentId, oldStatus, newStatus, reason = '') {
  return logEvent(EVENT_TYPES.AGENT_STATUS_CHANGE, `${agentId} status: ${oldStatus} → ${newStatus}`, {
    agentId,
    oldStatus,
    newStatus,
    reason
  })
}

/**
 * Log a decision made
 */
function logDecision(decision, context = {}, cost = null) {
  return logEvent(EVENT_TYPES.DECISION_MADE, decision, {
    context: JSON.stringify(context),
    cost,
    ...context
  })
}

/**
 * Log a pivot
 */
function logPivot(from, to, reason = '') {
  return logEvent(EVENT_TYPES.PIVOT, `Pivoted from ${from} to ${to}`, {
    from,
    to,
    reason
  })
}

/**
 * Log a sentinel flag
 */
function logSentinelFlag(flagType, message, severity = 'warning', metadata = {}) {
  return logEvent(EVENT_TYPES.SENTINEL_FLAGGED, `[${flagType}] ${message}`, {
    severity,
    flagType,
    ...metadata
  })
}

/**
 * Log note creation
 */
function logNoteCreated(noteId, title, author, type = 'note') {
  return logEvent(EVENT_TYPES.NOTE_CREATED, `${author} created: ${title}`, {
    noteId,
    title,
    author,
    noteType: type
  })
}

/**
 * Log note update
 */
function logNoteUpdated(noteId, title, author, changes = []) {
  return logEvent(EVENT_TYPES.NOTE_UPDATED, `${author} updated: ${title}`, {
    noteId,
    title,
    author,
    changes
  })
}

/**
 * Log revenue
 */
function logRevenue(source, amount, metadata = {}) {
  return logEvent(EVENT_TYPES.REVENUE_RECEIVED, `Revenue: $${amount} from ${source}`, {
    source,
    amount,
    ...metadata
  })
}

/**
 * Log spend
 */
function logSpend(agentId, amount, vendor, approved, reason = '') {
  const type = approved ? EVENT_TYPES.SPEND_AUTHORIZED : EVENT_TYPES.SPEND_DECLINED
  const summary = approved
    ? `${agentId} spend: $${amount} to ${vendor}`
    : `${agentId} spend declined: $${amount} to ${vendor}`

  return logEvent(type, summary, {
    agentId,
    amount,
    vendor,
    reason
  })
}

/**
 * Get all events with optional filtering
 */
function getEvents(filters = {}) {
  const data = loadEvents()
  let entries = [...data.entries]

  if (filters.type) {
    entries = entries.filter(e => e.type === filters.type)
  }

  if (filters.types) {
    entries = entries.filter(e => filters.types.includes(e.type))
  }

  if (filters.agentId) {
    entries = entries.filter(e => e.agentId === filters.agentId)
  }

  if (filters.from) {
    entries = entries.filter(e => new Date(e.timestamp) >= new Date(filters.from))
  }

  if (filters.to) {
    entries = entries.filter(e => new Date(e.timestamp) <= new Date(filters.to))
  }

  // Limit results
  if (filters.limit) {
    entries = entries.slice(0, filters.limit)
  }

  return entries
}

/**
 * Get events grouped by date
 */
function getEventsByDate(limit = 30) {
  const entries = getEvents({ limit: 1000 })

  const grouped = {}
  for (const entry of entries) {
    const date = entry.timestamp.split('T')[0]
    if (!grouped[date]) {
      grouped[date] = []
    }
    grouped[date].push(entry)
  }

  return grouped
}

/**
 * Clear all events (admin only)
 */
function clearEvents() {
  saveEvents({ entries: [], lastId: 0 })
}

module.exports = {
  EVENT_TYPES,
  logEvent,
  logApproval,
  logAgentDeployed,
  logAgentStatusChange,
  logDecision,
  logPivot,
  logSentinelFlag,
  logNoteCreated,
  logNoteUpdated,
  logRevenue,
  logSpend,
  getEvents,
  getEventsByDate,
  clearEvents
}