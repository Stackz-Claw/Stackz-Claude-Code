import { create } from 'zustand'

const API_BASE = 'http://localhost:4001/api'

export const useWorkflowStore = create((set, get) => ({
  workflows: [],
  stats: { active: 0, blocked: 0, failed: 0, idle: 0 },
  improvements: [],
  selectedWorkflow: null,
  isLoading: false,
  lastUpdated: null,
  error: null,
  filter: 'all', // all, active, blocked, failed, idle

  // Fetch workflows
  fetchWorkflows: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`${API_BASE}/workflows/status`)
      const data = await res.json()
      set({
        workflows: data.workflows,
        lastUpdated: data.lastUpdated,
        isLoading: false
      })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  // Fetch stats
  fetchStats: async () => {
    try {
      const res = await fetch(`${API_BASE}/workflows/stats`)
      const data = await res.json()
      set({ stats: data })
    } catch (err) {
      console.error('[WorkflowStore] Stats error:', err)
    }
  },

  // Fetch improvements
  fetchImprovements: async () => {
    try {
      const res = await fetch(`${API_BASE}/workflows/improvements`)
      const data = await res.json()
      set({ improvements: data.improvements })
    } catch (err) {
      console.error('[WorkflowStore] Improvements error:', err)
    }
  },

  // Submit improvement
  submitImprovement: async (workflowId, text, priority, execution) => {
    try {
      const res = await fetch(`${API_BASE}/workflows/improvements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId, text, priority, execution })
      })
      const data = await res.json()

      // Refresh improvements
      await get().fetchImprovements()

      return data
    } catch (err) {
      console.error('[WorkflowStore] Submit error:', err)
      throw err
    }
  },

  // Select workflow for drawer
  selectWorkflow: (workflow) => set({ selectedWorkflow: workflow }),
  clearSelection: () => set({ selectedWorkflow: null }),

  // Set filter
  setFilter: (filter) => set({ filter }),

  // Get filtered workflows
  getFilteredWorkflows: () => {
    const { workflows, filter } = get()
    if (filter === 'all') return workflows
    return workflows.filter(w => w.status === filter)
  },

  // Refresh all
  refresh: async () => {
    await Promise.all([get().fetchWorkflows(), get().fetchStats(), get().fetchImprovements()])
  }
}))