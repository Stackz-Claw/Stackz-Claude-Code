import { create } from 'zustand'
import notesData from '@mock/notes.json'

export const useNotesStore = create((set, get) => ({
  nodes: notesData.nodes,
  edges: notesData.edges,
  filter: { agentId: 'all', category: 'all' },

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
