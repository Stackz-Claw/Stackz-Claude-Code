import { create } from 'zustand'

const API_BASE = 'http://localhost:3001/api'

export const useAgentStore = create((set, get) => ({
  agents: [],
  subAgents: {},
  selectedAgent: null,
  agentPositions: {},
  isLoading: true,
  error: null,

  // Fetch agents from live API
  fetchAgents: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${API_BASE}/agents`)
      if (!response.ok) throw new Error('Failed to fetch agents')
      const data = await response.json()

      set({
        agents: data.agents?.map(a => ({ ...a, state: a.state ?? 'idle' })) || [],
        subAgents: data.subAgents || {},
        isLoading: false
      })
    } catch (error) {
      console.error('[AgentStore] Error fetching agents:', error)
      set({ error: error.message, isLoading: false })
    }
  },

  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
  clearSelectedAgent: () => set({ selectedAgent: null }),

  updateAgentStatus: (agentId, updates) =>
    set((state) => ({
      agents: state.agents.map((a) =>
        a.id === agentId ? { ...a, ...updates } : a
      ),
    })),

  updateAgentPosition: (agentId, position) =>
    set((state) => ({
      agentPositions: { ...state.agentPositions, [agentId]: position },
    })),

  updateAgentState: (agentId, newState) =>
    set((state) => ({
      agents: state.agents.map((a) => a.id === agentId ? { ...a, state: newState } : a),
    })),

  getAgent: (agentId) => get().agents.find((a) => a.id === agentId),

  getAgentsByDomain: (domain) => get().agents.filter((a) => a.domain === domain),

  getSubAgentsByLead: (leadId) => {
    const all = get().subAgents
    for (const zone of Object.values(all)) {
      const found = zone.filter((s) => s.lead === leadId)
      if (found.length) return found
    }
    return []
  },
}))