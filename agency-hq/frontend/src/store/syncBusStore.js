import { create } from 'zustand'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4001/api'

export const useSyncBusStore = create((set, get) => ({
  messages: [],
  overrides: [],
  isActive: false,
  lastPulse: null,
  isLoading: false,
  error: null,

  // Fetch sync bus data from live API
  fetchSyncBus: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${API_BASE}/sync-bus`)
      if (!response.ok) throw new Error('Failed to fetch sync bus')
      const data = await response.json()

      set({
        messages: data.messages || [],
        overrides: data.overrides || [],
        isLoading: false
      })
    } catch (error) {
      console.error('[SyncBusStore] Error:', error)
      set({ error: error.message, isLoading: false })
    }
  },

  addMessage: (msg) =>
    set((state) => ({
      messages: [
        {
          id: `sync_${Date.now()}`,
          timestamp: new Date().toISOString(),
          resolved: false,
          ...msg,
        },
        ...state.messages,
      ],
      isActive: true,
      lastPulse: new Date().toISOString(),
    })),

  resolveMessage: (id) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, resolved: true } : m
      ),
    })),

  addOverride: (override) =>
    set((state) => ({
      overrides: [
        {
          id: `override_${Date.now()}`,
          timestamp: new Date().toISOString(),
          ...override,
        },
        ...state.overrides,
      ],
    })),

  triggerPulse: () =>
    set({ isActive: true, lastPulse: new Date().toISOString() }),

  getUnresolved: () =>
    get().messages.filter((m) => !m.resolved),

  getMessagesByType: (type) =>
    get().messages.filter((m) => m.type === type),

  getOverrideCount: () => get().overrides.length,
}))