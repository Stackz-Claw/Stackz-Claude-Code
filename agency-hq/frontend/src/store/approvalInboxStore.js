import { create } from 'zustand'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Sample pending approvals for demo (when vault data doesn't have rich details)
const SAMPLE_PENDING = [
  {
    id: 'approval_001',
    agent_id: 'radar',
    agent_name: 'Radar',
    team: 'startup',
    title: 'AI Back-Office Agent for B2B Consultants',
    summary: 'An autonomous AI agent that handles bookkeeping, invoicing, and financial reporting for independent consultants.',
    risk_level: 'elevated',
    confidence: 75,
    recommendation: 'Strong market fit. Consultants need this. Build MVP first.',
    estimated_cost: { tokens: 125000, api_cost: 45.00 },
    full_context: 'Target: 50K+ solo consultants in US charging $150-300/hr. Problem: 10-15hrs/week on admin. Solution: AI agent automates 80% of back-office work.',
    status: 'pending'
  },
  {
    id: 'approval_002',
    agent_id: 'forge',
    agent_name: 'Forge',
    team: 'startup',
    title: 'Agentic Threads - AI Fashion Designer',
    summary: 'Generate unique streetwear designs using AI, produce on-demand via print-on-demand partners.',
    risk_level: 'routine',
    confidence: 82,
    recommendation: 'Low cost to test. High viral potential. Proceed with Phase 1.',
    estimated_cost: { tokens: 85000, api_cost: 32.50 },
    full_context: 'Multi-brand platform. Users describe style preferences, AI generates designs. Print-on-demand for production. Zero inventory.',
    status: 'pending'
  }
]

export const useApprovalInboxStore = create((set, get) => ({
  pending: [],
  resolved: [],
  isLoading: false,
  error: null,

  // Fetch approvals from live API
  fetchApprovals: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${API_BASE}/approvals`)
      if (!response.ok) throw new Error('Failed to fetch approvals')
      const data = await response.json()

      // If API returns rich data (has summary field), use it; otherwise use samples
      const hasRichData = (data.pending || []).some(item => item.summary)

      set({
        pending: hasRichData ? data.pending : SAMPLE_PENDING,
        resolved: data.history || [],
        isLoading: false
      })
    } catch (error) {
      console.error('[ApprovalInboxStore] Error:', error)
      // Fall back to sample data on error
      set({ pending: SAMPLE_PENDING, resolved: [], isLoading: false })
    }
  },

  approve: async (id) => {
    try {
      const response = await fetch(`${API_BASE}/approvals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      })

      if (!response.ok) throw new Error('Failed to approve')

      // Optimistic update
      const item = get().pending.find(a => a.id === id)
      if (item) {
        set(s => ({
          pending: s.pending.filter(a => a.id !== id),
          resolved: [{ ...item, status: 'approved', resolved_at: new Date().toISOString() }, ...s.resolved],
        }))
      }
    } catch (error) {
      console.error('[ApprovalInboxStore] Approve error:', error)
    }
  },

  reject: async (id) => {
    try {
      const response = await fetch(`${API_BASE}/approvals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      })

      if (!response.ok) throw new Error('Failed to reject')

      const item = get().pending.find(a => a.id === id)
      if (item) {
        set(s => ({
          pending: s.pending.filter(a => a.id !== id),
          resolved: [{ ...item, status: 'rejected', resolved_at: new Date().toISOString() }, ...s.resolved],
        }))
      }
    } catch (error) {
      console.error('[ApprovalInboxStore] Reject error:', error)
    }
  },

  modify: async (id, instructions) => {
    const item = get().pending.find(a => a.id === id)
    if (item) {
      set(s => ({
        pending: s.pending.filter(a => a.id !== id),
        resolved: [{ ...item, status: 'modified', modify_instructions: instructions, resolved_at: new Date().toISOString() }, ...s.resolved],
      }))
    }
  },

  // Local state updates (for real-time socket updates)
  addPending: (item) =>
    set((state) => ({
      pending: [item, ...state.pending]
    })),
}))