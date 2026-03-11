import { create } from 'zustand'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4001/api'

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

      set({
        pending: data.pending || [],
        resolved: data.history || [],
        isLoading: false
      })
    } catch (error) {
      console.error('[ApprovalInboxStore] Error:', error)
      set({ error: error.message, isLoading: false })
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