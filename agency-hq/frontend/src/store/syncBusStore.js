import { create } from 'zustand'
import syncBusData from '@mock/sync-bus.json'

export const useSyncBusStore = create((set, get) => ({
  messages: syncBusData.messages,
  overrides: syncBusData.overrides,
  isActive: false,
  lastPulse: null,

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
