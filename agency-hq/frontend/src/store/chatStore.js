import { create } from 'zustand'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export const useChatStore = create((set) => ({
  messages: [],
  isLoading: false,
  error: null,

  // Fetch chat messages from live API
  fetchMessages: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${API_BASE}/chat`)
      if (!response.ok) throw new Error('Failed to fetch messages')
      const data = await response.json()

      set({
        messages: data.messages || [],
        isLoading: false
      })
    } catch (error) {
      console.error('[ChatStore] Error:', error)
      set({ error: error.message, isLoading: false })
    }
  },

  addMessage: (msg) =>
    set((state) => ({
      messages: [
        {
          id: `msg_${Date.now()}`,
          timestamp: new Date().toISOString(),
          ...msg,
        },
        ...state.messages,
      ],
    })),
}))