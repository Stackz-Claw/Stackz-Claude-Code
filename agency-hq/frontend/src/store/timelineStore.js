import { create } from 'zustand'

const API_BASE = 'http://localhost:4001/api'

export const useTimelineStore = create((set, get) => ({
  entries: [],
  stats: null,
  isLoading: false,
  error: null,
  lastUpdated: null,

  // Fetch all timeline entries
  fetchEntries: async (filters = {}) => {
    set({ isLoading: true, error: null })
    try {
      const params = new URLSearchParams()
      if (filters.type) params.set('type', filters.type)
      if (filters.agent) params.set('agent', filters.agent)
      if (filters.limit) params.set('limit', filters.limit)
      else params.set('limit', '50')

      const res = await fetch(`${API_BASE}/timeline?${params}`)
      const data = await res.json()
      set({
        entries: data.entries,
        lastUpdated: new Date().toISOString(),
        isLoading: false
      })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  // Fetch stats
  fetchStats: async () => {
    try {
      const res = await fetch(`${API_BASE}/timeline/stats`)
      const data = await res.json()
      set({ stats: data })
    } catch (err) {
      console.error('[TimelineStore] Error fetching stats:', err)
    }
  },

  // Log an event
  logEvent: async (type, summary, metadata = {}) => {
    try {
      const res = await fetch(`${API_BASE}/timeline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, summary, ...metadata })
      })
      const entry = await res.json()

      // Add to local state
      set(state => ({
        entries: [entry, ...state.entries]
      }))

      return entry
    } catch (err) {
      console.error('[TimelineStore] Error logging event:', err)
      throw err
    }
  },

  // Log approval
  logApproval: async (agentId, approvalType, decision, details = {}) => {
    try {
      const res = await fetch(`${API_BASE}/timeline/approval`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, approvalType, decision, details })
      })
      const entry = await res.json()

      set(state => ({
        entries: [entry, ...state.entries]
      }))

      return entry
    } catch (err) {
      console.error('[TimelineStore] Error logging approval:', err)
    }
  },

  // Log agent event
  logAgentEvent: async (agentId, event, data = {}) => {
    try {
      const res = await fetch(`${API_BASE}/timeline/agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, event, ...data })
      })
      const entry = await res.json()

      set(state => ({
        entries: [entry, ...state.entries]
      }))

      return entry
    } catch (err) {
      console.error('[TimelineStore] Error logging agent event:', err)
    }
  },

  // Log note event
  logNoteEvent: async (noteId, title, author, action, type, changes) => {
    try {
      const res = await fetch(`${API_BASE}/timeline/note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId, title, author, action, type, changes })
      })
      const entry = await res.json()

      set(state => ({
        entries: [entry, ...state.entries]
      }))

      return entry
    } catch (err) {
      console.error('[TimelineStore] Error logging note event:', err)
    }
  },

  // Log decision
  logDecision: async (decision, context = {}, cost = null) => {
    try {
      const res = await fetch(`${API_BASE}/timeline/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, context, cost })
      })
      const entry = await res.json()

      set(state => ({
        entries: [entry, ...state.entries]
      }))

      return entry
    } catch (err) {
      console.error('[TimelineStore] Error logging decision:', err)
    }
  },

  // Log spend
  logSpend: async (agentId, amount, vendor, approved, reason = '') => {
    try {
      const res = await fetch(`${API_BASE}/timeline/spend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, amount, vendor, approved, reason })
      })
      const entry = await res.json()

      set(state => ({
        entries: [entry, ...state.entries]
      }))

      return entry
    } catch (err) {
      console.error('[TimelineStore] Error logging spend:', err)
    }
  },

  // Refresh all
  refresh: async () => {
    const { fetchEntries, fetchStats } = get()
    await Promise.all([fetchEntries(), fetchStats()])
  }
}))