import { create } from 'zustand'

const API_BASE = 'http://localhost:3001/api/approvals'

export const useApprovalStore = create((set, get) => ({
  smokeApprovals: [],
  stackzApprovals: [],
  history: [],
  loading: true,

  // Fetch from backend API (which reads from Obsidian vault)
  fetchApprovals: async () => {
    set({ loading: true })
    try {
      const response = await fetch(API_BASE)
      const data = await response.json()

      // Transform vault data to approval format
      const approvals = (data.pending || []).map(item => ({
        ...item,
        stream: 'stackz',
      }))

      set({
        stackzApprovals: approvals,
        history: data.history || [],
        loading: false,
      })
    } catch (error) {
      console.error('Error fetching approvals:', error)
      set({ loading: false })
    }
  },

  get smokePendingCount() { return get().smokeApprovals.length },
  get stackzPendingCount() { return get().stackzApprovals.length },
  get totalPendingCount() { return get().smokeApprovals.length + get().stackzApprovals.length },

  approveSmoke: (id, note = '') => {
    const item = get().smokeApprovals.find((a) => a.id === id)
    if (!item) return
    set((state) => ({
      smokeApprovals: state.smokeApprovals.filter((a) => a.id !== id),
      history: [{ ...item, status: 'approved', note, resolvedAt: new Date().toISOString() }, ...state.history],
    }))
  },

  rejectSmoke: (id, note = '') => {
    const item = get().smokeApprovals.find((a) => a.id === id)
    if (!item) return
    set((state) => ({
      smokeApprovals: state.smokeApprovals.filter((a) => a.id !== id),
      history: [{ ...item, status: 'rejected', note, resolvedAt: new Date().toISOString() }, ...state.history],
    }))
  },

  approveStackz: (id, note = '') => {
    const item = get().stackzApprovals.find((a) => a.id === id)
    if (!item) return
    set((state) => ({
      stackzApprovals: state.stackzApprovals.filter((a) => a.id !== id),
      history: [{ ...item, status: 'approved', note, resolvedAt: new Date().toISOString() }, ...state.history],
    }))
  },

  rejectStackz: (id, note = '') => {
    const item = get().stackzApprovals.find((a) => a.id === id)
    if (!item) return
    set((state) => ({
      stackzApprovals: state.stackzApprovals.filter((a) => a.id !== id),
      history: [{ ...item, status: 'rejected', note, resolvedAt: new Date().toISOString() }, ...state.history],
    }))
  },

  addSmokeApproval: (request) =>
    set((state) => ({
      smokeApprovals: [{ ...request, stream: 'smoke', status: 'pending' }, ...state.smokeApprovals],
    })),

  addStackzApproval: (request) =>
    set((state) => ({
      stackzApprovals: [{ ...request, stream: 'stackz', status: 'pending' }, ...state.stackzApprovals],
    })),

  addApprovalRequest: (request) => {
    if (request.stream === 'smoke') {
      get().addSmokeApproval(request)
    } else {
      get().addStackzApproval(request)
    }
  },
}))