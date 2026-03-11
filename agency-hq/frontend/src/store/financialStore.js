import { create } from 'zustand'

const API_BASE = 'http://localhost:4001/api'

export const useFinancialStore = create((set, get) => ({
  financialData: null,
  balance: null,
  transactions: [],
  stripeConnected: false,
  isLoading: false,
  error: null,
  lastUpdated: null,

  // Fetch all financial data
  fetchFinancialData: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`${API_BASE}/financial`)
      const data = await res.json()
      set({
        financialData: data,
        stripeConnected: data._meta?.stripeConnected || false,
        lastUpdated: data._meta?.lastUpdated || new Date().toISOString(),
        isLoading: false
      })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  // Fetch Stripe balance
  fetchBalance: async () => {
    try {
      const res = await fetch(`${API_BASE}/financial/balance`)
      if (res.ok) {
        const data = await res.json()
        set({ balance: data })
      }
    } catch (err) {
      console.error('[FinancialStore] Error fetching balance:', err)
    }
  },

  // Fetch transactions
  fetchTransactions: async (limit = 20) => {
    try {
      const res = await fetch(`${API_BASE}/financial/transactions?limit=${limit}`)
      if (res.ok) {
        const data = await res.json()
        set({ transactions: data })
      }
    } catch (err) {
      console.error('[FinancialStore] Error fetching transactions:', err)
    }
  },

  // Refresh all data
  refresh: async () => {
    const { fetchFinancialData, fetchBalance, fetchTransactions } = get()
    await Promise.all([
      fetchFinancialData(),
      fetchBalance(),
      fetchTransactions()
    ])
  }
}))