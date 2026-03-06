import { create } from 'zustand'
import approvalData from '@mock/approval-inbox.json'

export const useApprovalInboxStore = create((set, get) => ({
  pending: approvalData.approvals.map(a => ({ ...a, status: 'pending' })),
  resolved: [],

  approve: (id) => {
    const item = get().pending.find(a => a.id === id)
    if (!item) return
    set(s => ({
      pending: s.pending.filter(a => a.id !== id),
      resolved: [{ ...item, status: 'approved', resolved_at: new Date().toISOString() }, ...s.resolved],
    }))
  },

  reject: (id) => {
    const item = get().pending.find(a => a.id === id)
    if (!item) return
    set(s => ({
      pending: s.pending.filter(a => a.id !== id),
      resolved: [{ ...item, status: 'rejected', resolved_at: new Date().toISOString() }, ...s.resolved],
    }))
  },

  modify: (id, instructions) => {
    const item = get().pending.find(a => a.id === id)
    if (!item) return
    set(s => ({
      pending: s.pending.filter(a => a.id !== id),
      resolved: [{ ...item, status: 'modified', modify_instructions: instructions, resolved_at: new Date().toISOString() }, ...s.resolved],
    }))
  },
}))
