import { create } from 'zustand'
import { useSoul } from '../hooks/useSoul'

export const useSoulStore = create((set, get) => ({
  souls: {},  // { [agentId]: { frontmatter, body, timestamp } }

  // Update soul from socket event
  updateFromSocket: (agentId, data) =>
    set((state) => ({
      souls: {
        ...state.souls,
        [agentId]: {
          frontmatter: data.frontmatter,
          body: data.body,
          timestamp: data.timestamp || new Date().toISOString()
        }
      }
    })),

  // Get soul for agent
  getSoul: (agentId) => get().souls[agentId] || null,

  // Check if agent should be visually offline based on soul status
  isSoulOffline: (agentId) => {
    const soul = get().souls[agentId]
    if (!soul) return false
    return soul.frontmatter?.status?.toLowerCase() === 'offline'
  }
}))