// Centralized API client for Agency HQ
// All API calls should go through this client

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `API ${res.status}: ${path}`);
  }
  return res.json();
}

// API client with domain-specific methods
export const api = {
  // Briefing
  briefings: {
    latest: () => apiFetch('/api/briefings/latest'),
    byDate: (date) => apiFetch(`/api/briefings/${date}`),
    history: () => apiFetch('/api/briefings/history'),
  },

  // Workflows
  workflows: {
    status: () => apiFetch('/api/workflows/status'),
    improvements: {
      list: () => apiFetch('/api/workflows/improvements'),
      submit: (data) => apiFetch('/api/workflows/improvements', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    },
  },

  // Agents
  agents: {
    list: () => apiFetch('/api/agents'),
    get: (id) => apiFetch(`/api/agents/${id}`),
    soul: (id) => apiFetch(`/api/agents/${id}/soul`),
    memory: (id) => apiFetch(`/api/agents/${id}/memory`),
    sessions: (id) => apiFetch(`/api/agents/${id}/sessions`),
  },

  // Wallet
  wallet: {
    balance: () => apiFetch('/api/wallet/balance'),
    transactions: (params) => apiFetch(`/api/wallet/transactions?${new URLSearchParams(params)}`),
    spendByAgent: () => apiFetch('/api/wallet/spend-by-agent'),
    runway: () => apiFetch('/api/wallet/runway'),
    agentLimits: (id) => apiFetch(`/api/wallet/agent/${id}/limits`),
    revenue: (params) => apiFetch(`/api/wallet/revenue?${new URLSearchParams(params)}`),
  },

  // Zettelkasten
  zettelkasten: {
    stats: () => apiFetch('/api/zettelkasten/stats'),
    recent: (limit = 10) => apiFetch(`/api/zettelkasten/recent?limit=${limit}`),
    search: (q) => apiFetch(`/api/zettelkasten/search?q=${encodeURIComponent(q)}`),
    note: (id) => apiFetch(`/api/zettelkasten/note/${id}`),
    mocs: () => apiFetch('/api/zettelkasten/mocs'),
    weeklyDigest: () => apiFetch('/api/zettelkasten/weekly-digest'),
  },

  // Ideas / Conversations
  ideas: {
    list: () => apiFetch('/api/ideas'),
    get: (id) => apiFetch(`/api/ideas/${id}`),
    reply: (id, data) => apiFetch(`/api/ideas/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    create: (data) => apiFetch('/api/ideas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },

  // Approvals
  approvals: {
    pending: () => apiFetch('/api/approvals/pending'),
    history: () => apiFetch('/api/approvals/history'),
    approve: (id) => apiFetch(`/api/approvals/${id}/approve`, { method: 'POST' }),
    decline: (id, reason) => apiFetch(`/api/approvals/${id}/decline`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
  },

  // Timeline
  timeline: {
    events: (params) => apiFetch(`/api/timeline?${new URLSearchParams(params)}`),
    byAgent: (agentId, params) => apiFetch(`/api/timeline/agent/${agentId}?${new URLSearchParams(params)}`),
  },

  // Vault
  vault: {
    recentFiles: () => apiFetch('/api/vault/recent'),
    folder: (path) => apiFetch(`/api/vault/folder?path=${encodeURIComponent(path)}`),
    file: (path) => apiFetch(`/api/vault/file?path=${encodeURIComponent(path)}`),
    search: (q) => apiFetch(`/api/vault/search?q=${encodeURIComponent(q)}`),
  },

  // System health
  health: () => apiFetch('/api/health'),
  heartbeat: {
    status: () => apiFetch('/api/heartbeat/status'),
    full: () => apiFetch('/api/heartbeat'),
  },

  // Lanes
  lanes: {
    status: () => apiFetch('/api/lanes'),
    queue: () => apiFetch('/api/lanes/queue'),
  },

  // Browser agent
  browser: {
    status: () => apiFetch('/api/browser/status'),
    sessions: () => apiFetch('/api/browser/sessions'),
  },

  // PinchTab
  pinchTab: {
    status: () => apiFetch('/api/pinchtad/status'),
  },

  // Notes
  notes: {
    list: () => apiFetch('/api/notes'),
    search: (q) => apiFetch(`/api/notes/search?q=${encodeURIComponent(q)}`),
  },
};

export default api;