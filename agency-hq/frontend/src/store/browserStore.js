import { create } from 'zustand'

const API_BASE = 'http://localhost:4001/api'

export const useBrowserStore = create((set, get) => ({
  isInstalled: false,
  sessions: [],
  currentSession: null,
  snapshot: null,
  screenshot: null,
  isLoading: false,
  error: null,
  lastAction: null,

  // Check browser status
  checkStatus: async () => {
    try {
      const res = await fetch(`${API_BASE}/browser/status`)
      const data = await res.json()
      set({ isInstalled: data.installed, sessions: data.sessions })
      return data
    } catch (err) {
      set({ error: err.message })
      return null
    }
  },

  // Create session
  createSession: async (agentId) => {
    set({ isLoading: true })
    try {
      const res = await fetch(`${API_BASE}/browser/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId })
      })
      const data = await res.json()
      set({ currentSession: data.sessionId, isLoading: false })
      return data
    } catch (err) {
      set({ error: err.message, isLoading: false })
      throw err
    }
  },

  // Open URL
  openUrl: async (url) => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`${API_BASE}/browser/open`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      const data = await res.json()
      set({ isLoading: false, lastAction: { type: 'open', url, time: new Date().toISOString() } })
      return data
    } catch (err) {
      set({ error: err.message, isLoading: false })
      throw err
    }
  },

  // Get snapshot
  getSnapshot: async () => {
    try {
      const res = await fetch(`${API_BASE}/browser/snapshot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      const data = await res.json()
      set({ snapshot: data.snapshot })
      return data
    } catch (err) {
      set({ error: err.message })
      throw err
    }
  },

  // Click element
  click: async (element) => {
    try {
      const res = await fetch(`${API_BASE}/browser/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ element })
      })
      const data = await res.json()
      set({ lastAction: { type: 'click', element, time: new Date().toISOString() } })
      return data
    } catch (err) {
      set({ error: err.message })
      throw err
    }
  },

  // Fill input
  fill: async (element, value) => {
    try {
      const res = await fetch(`${API_BASE}/browser/fill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ element, value })
      })
      const data = await res.json()
      set({ lastAction: { type: 'fill', element, value, time: new Date().toISOString() } })
      return data
    } catch (err) {
      set({ error: err.message })
      throw err
    }
  },

  // Type text
  type: async (text) => {
    try {
      const res = await fetch(`${API_BASE}/browser/type`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      const data = await res.json()
      return data
    } catch (err) {
      set({ error: err.message })
      throw err
    }
  },

  // Press key
  press: async (key) => {
    try {
      const res = await fetch(`${API_BASE}/browser/press`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      })
      const data = await res.json()
      return data
    } catch (err) {
      set({ error: err.message })
      throw err
    }
  },

  // Scroll
  scroll: async (direction = 'down', amount = 300) => {
    try {
      const res = await fetch(`${API_BASE}/browser/scroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction, amount })
      })
      const data = await res.json()
      return data
    } catch (err) {
      set({ error: err.message })
      throw err
    }
  },

  // Screenshot
  takeScreenshot: async () => {
    try {
      const res = await fetch(`${API_BASE}/browser/screenshot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      const data = await res.json()
      set({ screenshot: data.screenshot })
      return data
    } catch (err) {
      set({ error: err.message })
      throw err
    }
  },

  // Close browser
  close: async () => {
    try {
      const res = await fetch(`${API_BASE}/browser/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      const data = await res.json()
      set({ currentSession: null, snapshot: null, screenshot: null })
      return data
    } catch (err) {
      set({ error: err.message })
      throw err
    }
  },

  // Execute multi-step task
  executeTask: async (steps) => {
    set({ isLoading: true })
    try {
      const res = await fetch(`${API_BASE}/browser/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steps })
      })
      const data = await res.json()
      set({ isLoading: false })
      return data
    } catch (err) {
      set({ error: err.message, isLoading: false })
      throw err
    }
  }
}))