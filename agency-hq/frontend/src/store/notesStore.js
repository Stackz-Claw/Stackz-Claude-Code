import { create } from 'zustand'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4001/api'

export const useNotesStore = create((set, get) => ({
  nodes: [],
  edges: [],
  filter: { agentId: 'all', category: 'all' },
  isLoading: false,
  error: null,

  // Fetch notes from live API
  fetchNotes: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${API_BASE}/notes`)
      if (!response.ok) throw new Error('Failed to fetch notes')
      const data = await response.json()

      set({
        nodes: data.nodes || [],
        edges: data.edges || [],
        isLoading: false
      })
    } catch (error) {
      console.error('[NotesStore] Error:', error)
      set({ error: error.message, isLoading: false })
    }
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNote: (note) =>
    set((state) => ({
      nodes: [
        ...state.nodes,
        {
          id: `note_${Date.now()}`,
          type: 'note',
          position: { x: Math.random() * 600 + 100, y: Math.random() * 400 + 100 },
          data: {
            ...note,
            createdAt: new Date().toISOString(),
            isRecent: true,
            votes: 0,
          },
        },
      ],
    })),

  voteNote: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, votes: (n.data.votes || 0) + 1 } }
          : n
      ),
    })),

  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),

  getFilteredNodes: () => {
    const { nodes, filter } = get()
    return nodes.filter((n) => {
      if (filter.agentId !== 'all' && n.data.agentId !== filter.agentId) return false
      if (filter.category !== 'all' && n.data.category !== filter.category) return false
      return true
    })
  },
}))