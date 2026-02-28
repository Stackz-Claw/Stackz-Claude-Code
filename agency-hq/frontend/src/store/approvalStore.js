import { create } from 'zustand'
import approvalsData from '@mock/approvals.json'

export const useApprovalStore = create((set, get) => ({
  // Dual stream
  smokeApprovals: approvalsData.smokeApprovals.filter((a) => a.status === 'pending'),
  stackzApprovals: approvalsData.stackzApprovals.filter((a) => a.status === 'pending'),
  history: [
    ...approvalsData.smokeApprovals.filter((a) => a.status !== 'pending'),
    ...approvalsData.stackzApprovals.filter((a) => a.status !== 'pending'),
  ],

  get smokePendingCount() { return get().smokeApprovals.length },
  get stackzPendingCount() { return get().stackzApprovals.length },
  get totalPendingCount() { return get().smokeApprovals.length + get().stackzApprovals.length },

  approveSmoke: (id, note = '') => {
    const item = get().smokeApprovals.find((a) => a.id === id)
    if (!item) return
    set((state) => ({
      smokeApprovals: state.smokeApprovals.filter((a) => a.id !== id),
      history: [
        { ...item, status: 'approved', note, resolvedAt: new Date().toISOString() },
        ...state.history,
      ],
    }))
  },

  rejectSmoke: (id, note = '') => {
    const item = get().smokeApprovals.find((a) => a.id === id)
    if (!item) return
    set((state) => ({
      smokeApprovals: state.smokeApprovals.filter((a) => a.id !== id),
      history: [
        { ...item, status: 'rejected', note, resolvedAt: new Date().toISOString() },
        ...state.history,
      ],
    }))
  },

  rescheduleSmoke: (id, note = '') => {
    const item = get().smokeApprovals.find((a) => a.id === id)
    if (!item) return
    set((state) => ({
      smokeApprovals: state.smokeApprovals.filter((a) => a.id !== id),
      history: [
        { ...item, status: 'reschedule', note, resolvedAt: new Date().toISOString() },
        ...state.history,
      ],
    }))
  },

  approveStackz: (id, note = '') => {
    const item = get().stackzApprovals.find((a) => a.id === id)
    if (!item) return
    set((state) => ({
      stackzApprovals: state.stackzApprovals.filter((a) => a.id !== id),
      history: [
        { ...item, status: 'approved', note, resolvedAt: new Date().toISOString() },
        ...state.history,
      ],
    }))
  },

  rejectStackz: (id, note = '') => {
    const item = get().stackzApprovals.find((a) => a.id === id)
    if (!item) return
    set((state) => ({
      stackzApprovals: state.stackzApprovals.filter((a) => a.id !== id),
      history: [
        { ...item, status: 'rejected', note, resolvedAt: new Date().toISOString() },
        ...state.history,
      ],
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

  // Legacy: unified addApprovalRequest routes by stream field
  addApprovalRequest: (request) => {
    if (request.stream === 'smoke') {
      get().addSmokeApproval(request)
    } else {
      get().addStackzApproval(request)
    }
  },
}))
