import { create } from 'zustand'
import agentsData from '@mock/agents.json'

export const useAgentStore = create((set, get) => ({
  agents: agentsData.agents.map(a => ({ ...a, state: a.state ?? 'idle' })),
  subAgents: agentsData.subAgents,
  selectedAgent: null,
  agentPositions: {},

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
