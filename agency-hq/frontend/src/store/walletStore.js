import { create } from 'zustand'

const API_BASE = 'http://localhost:4001/api/wallet'
const TIMELINE_API = 'http://localhost:4001/api/timeline'

// Helper to log to timeline
const logToTimeline = async (type, summary, metadata = {}) => {
  try {
    await fetch(`${TIMELINE_API}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, summary, ...metadata })
    })
  } catch (e) {
    console.warn('[WalletStore] Timeline log failed:', e.message)
  }
}

export const useWalletStore = create((set, get) => ({
  balance: null,
  transactions: [],
  spendByAgent: [],
  revenue: [],
  runway: null,
  isLoading: false,
  error: null,
  lastUpdated: null,

  // Fetch balance
  fetchBalance: async () => {
    try {
      const res = await fetch(`${API_BASE}/balance`)
      const data = await res.json()
      set({ balance: data, lastUpdated: new Date().toISOString() })
      return data
    } catch (err) {
      console.error('[WalletStore] Error fetching balance:', err)
      return null
    }
  },

  // Fetch transactions
  fetchTransactions: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters)
      const res = await fetch(`${API_BASE}/transactions?${params}`)
      const data = await res.json()
      set({ transactions: data })
      return data
    } catch (err) {
      console.error('[WalletStore] Error fetching transactions:', err)
      return []
    }
  },

  // Fetch spend by agent
  fetchSpendByAgent: async (period = 'month') => {
    try {
      const res = await fetch(`${API_BASE}/spend-by-agent?period=${period}`)
      const data = await res.json()
      set({ spendByAgent: data })
      return data
    } catch (err) {
      console.error('[WalletStore] Error fetching spend:', err)
      return []
    }
  },

  // Fetch revenue
  fetchRevenue: async (period = 'month') => {
    try {
      const res = await fetch(`${API_BASE}/revenue?period=${period}`)
      const data = await res.json()
      set({ revenue: data })
      return data
    } catch (err) {
      console.error('[WalletStore] Error fetching revenue:', err)
      return []
    }
  },

  // Fetch runway
  fetchRunway: async () => {
    try {
      const res = await fetch(`${API_BASE}/runway`)
      const data = await res.json()
      set({ runway: data })
      return data
    } catch (err) {
      console.error('[WalletStore] Error fetching runway:', err)
      return null
    }
  },

  // Request spend (logs to timeline on approval/decline)
  requestSpend: async (agentId, amount, vendor, purpose, category) => {
    try {
      const res = await fetch(`${API_BASE}/spend-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agentId, amount, vendor, purpose, category })
      })
      const data = await res.json()

      // Log to timeline
      if (data.approved) {
        await logToTimeline('spend_authorized', `${agentId} spend: $${amount} to ${vendor}`, {
          agentId,
          amount,
          vendor,
          approved: true,
          transactionId: data.transactionId
        })
      } else {
        await logToTimeline('spend_declined', `${agentId} spend declined: $${amount} to ${vendor} - ${data.reason}`, {
          agentId,
          amount,
          vendor,
          approved: false,
          reason: data.reason
        })
      }

      // Refresh data
      await get().fetchTransactions()
      await get().fetchSpendByAgent()

      return data
    } catch (err) {
      console.error('[WalletStore] Error requesting spend:', err)
      throw err
    }
  },

  // Log revenue (logs to timeline)
  logRevenue: async (source, amount, ventureId, sourceType) => {
    try {
      const res = await fetch(`${API_BASE}/revenue/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, amount, venture_id: ventureId, source_type: sourceType })
      })
      const data = await res.json()

      // Log to timeline
      await logToTimeline('revenue_received', `Revenue: $${amount} from ${source}`, {
        source,
        amount,
        ventureId,
        sourceType
      })

      // Refresh data
      await get().fetchBalance()
      await get().fetchRevenue()
      await get().fetchRunway()

      return data
    } catch (err) {
      console.error('[WalletStore] Error logging revenue:', err)
      throw err
    }
  },

  // Get agent limits
  getAgentLimits: async (agentId) => {
    try {
      const res = await fetch(`${API_BASE}/agent/${agentId}/limits`)
      return await res.json()
    } catch (err) {
      console.error('[WalletStore] Error getting limits:', err)
      return null
    }
  },

  // Update agent limits
  updateAgentLimits: async (agentId, limits) => {
    try {
      const res = await fetch(`${API_BASE}/agent/${agentId}/limits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(limits)
      })
      return await res.json()
    } catch (err) {
      console.error('[WalletStore] Error updating limits:', err)
      throw err
    }
  },

  // Refresh all
  refresh: async () => {
    set({ isLoading: true })
    await Promise.all([
      get().fetchBalance(),
      get().fetchTransactions(),
      get().fetchSpendByAgent(),
      get().fetchRevenue(),
      get().fetchRunway()
    ])
    set({ isLoading: false })
  }
}))