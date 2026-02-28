import { create } from 'zustand'

export const useUIStore = create((set) => ({
  activeView: 'office',  // office | executive | financial | health | notes | approvals
  isChatOpen: true,
  isApprovalOpen: false,
  soundEnabled: false,
  isLoading: true,
  selectedZone: null,

  setActiveView: (view) => set({ activeView: view }),
  toggleChat: () => set((s) => ({ isChatOpen: !s.isChatOpen })),
  toggleApprovals: () => set((s) => ({ isApprovalOpen: !s.isApprovalOpen })),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  setLoading: (val) => set({ isLoading: val }),
  setSelectedZone: (zone) => set({ selectedZone: zone }),
}))
