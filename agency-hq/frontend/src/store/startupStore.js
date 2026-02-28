import { create } from 'zustand'
import startupsData from '@mock/startups.json'

export const useStartupStore = create((set, get) => ({
  portfolio: startupsData.portfolio,
  selectedStartup: null,
  activePlanSection: 'section1_vision',

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
