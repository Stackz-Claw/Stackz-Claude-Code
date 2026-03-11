import { create } from 'zustand'

const API_BASE = 'http://localhost:3001/api/approvals'

export const useStartupStore = create((set, get) => ({
  portfolio: [],
  selectedStartup: null,
  activePlanSection: 'section1_vision',
  loading: true,

  // Fetch ventures from Obsidian vault via backend API
  fetchVentures: async () => {
    set({ loading: true })
    try {
      const response = await fetch(`${API_BASE}/ventures`)
      const data = await response.json()

      // Transform active ventures to portfolio format
      const portfolio = (data.active || []).map((v, idx) => ({
        id: v.venture_id || `vent_00${idx + 1}`,
        name: v.name || 'Untitled',
        status: v.status || 'active',
        vertical: v.vertical || 'Unknown',
        launchDate: v.launch_date || new Date().toISOString(),
        revenue: v.revenue || '$0',
        phase: 1,
        phaseStatus: v.status === 'APPROVED' ? 'green' : 'yellow',
        mrr: parseInt(v.revenue?.replace(/[^0-9]/g, '')) || 0,
        mrrTrend: 'up',
        runway: '12 months',
        nextMilestone: 'TBD',
      }))

      set({ portfolio, loading: false })
    } catch (error) {
      console.error('Error fetching ventures:', error)
      set({ loading: false })
    }
  },

  setSelectedStartup: (startup) => set({ selectedStartup: startup, activePlanSection: 'section1_vision' }),
  clearSelectedStartup: () => set({ selectedStartup: null }),
  setActivePlanSection: (section) => set({ activePlanSection: section }),

  getStartup: (id) => get().portfolio.find((p) => p.id === id),

  updateStartup: (id, updates) =>
    set((state) => ({
      portfolio: state.portfolio.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  getPortfolioStats: () => {
    const portfolio = get().portfolio
    return {
      total: portfolio.length,
      active: portfolio.filter((p) => p.phaseStatus !== 'red').length,
      watchlist: portfolio.filter((p) => p.phaseStatus === 'red').length,
      totalMrr: portfolio.reduce((sum, p) => sum + (p.mrr || 0), 0),
    }
  },
}))