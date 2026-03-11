/**
 * useSoulStore - Global store for soul data in 3D scene
 * Caches soul data and listens for socket updates
 */

import { create } from 'zustand'
import { useSocket } from './useSocket'

const API_BASE = 'http://localhost:3001/api'

// Create zustand store
export const useSoulStore = create((set, get) => ({
  souls: {},  // { agentId: { frontmatter, body, status } }
  isLoading: false,

  // Fetch soul for specific agent
  fetchSoul: async (agentId) => {
    try {
      const response = await fetch(`${API_BASE}/agents/${agentId}/soul`)
      if (!response.ok) return null
      const data = await response.json()

      set(state => ({
        souls: {
          ...state.souls,
          [agentId]: {
            frontmatter: data.frontmatter,
            body: data.body,
            status: data.frontmatter?.status || 'active'
          }
        }
      }))

      return data
    } catch (err) {
      console.warn(`[useSoulStore] Failed to fetch soul for ${agentId}:`, err)
      return null
    }
  },

  // Fetch all souls
  fetchAllSouls: async (agentIds) => {
    set({ isLoading: true })
    await Promise.all(agentIds.map(id => get().fetchSoul(id)))
    set({ isLoading: false })
  },

  // Get soul for agent
  getSoul: (agentId) => get().souls[agentId] || null,

  // Check if agent is offline (from soul status)
  isAgentOffline: (agentId) => {
    const soul = get().souls[agentId]
    return soul?.status === 'offline'
  },

  // Update from socket event
  updateFromSocket: (data) => {
    if (!data || !data.agentId) return

    set(state => ({
      souls: {
        ...state.souls,
        [data.agentId]: {
          frontmatter: data.frontmatter,
          body: data.body,
          status: data.frontmatter?.status || 'active'
        }
      }
    }))
  }
}))

/**
 * Hook to initialize soul data and socket listener
 */
export function useSoulWatcher(agentIds = []) {
  const fetchAllSouls = useSoulStore(s => s.fetchAllSouls)
  const updateFromSocket = useSoulStore(s => s.updateFromSocket)
  const socket = useSocket()

  // Initial fetch
  useEffect(() => {
    if (agentIds.length > 0) {
      fetchAllSouls(agentIds)
    }
  }, [agentIds.join(',')])

  // Socket listener for soul updates
  useEffect(() => {
    if (!socket) return

    socket.on('agent:soul-updated', (data) => {
      updateFromSocket(data)
    })

    return () => {
      socket.off('agent:soul-updated', updateFromSocket)
    }
  }, [socket, updateFromSocket])
}