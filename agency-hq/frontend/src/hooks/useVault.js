/**
 * useVault - Custom React hook for vault API integration
 * Handles data fetching from the Agency HQ backend (Obsidian Zettelkasten)
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { mockVaultData, generateGraphData } from '../data/mockVaultData'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4001/api'

export const useVault = () => {
  // State
  const [notes, setNotes] = useState([])
  const [allNotes, setAllNotes] = useState([])
  const [graph, setGraph] = useState({ nodes: [], links: [] })
  const [selectedNote, setSelectedNote] = useState(null)
  const [vaultHealth, setVaultHealth] = useState(null)
  const [isLive, setIsLive] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [filter, setFilter] = useState({
    type: 'all',
    status: 'all',
    author: 'all',
    search: ''
  })
  const [sortBy, setSortBy] = useState('recent')

  // SSE connection ref
  const eventSourceRef = useRef(null)
  const socketRef = useRef(null)

  // Fetch notes from Zettelkasten API
  const fetchNotes = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/zettelkasten/recent?limit=100`)
      if (!response.ok) throw new Error('Failed to fetch notes')
      const data = await response.json()

      // Transform to vault format
      const transformed = (data.notes || []).map(n => ({
        id: n.id,
        title: n.title,
        content: n.title, // Use title as content placeholder
        author: n.agent,
        type: n.type || 'permanent',
        status: 'evergreen',
        tags: n.tags || [],
        links: [],
        backlinks: [],
        created: n.created_at,
        modified: n.created_at,
        ...n
      }))

      setAllNotes(transformed)
      return transformed
    } catch (err) {
      console.warn('[Vault] API unavailable, using mock data:', err.message)
      setAllNotes(mockVaultData.notes)
      return mockVaultData.notes
    }
  }, [])

  // Fetch graph data
  const fetchGraph = useCallback(async () => {
    try {
      // Build graph from notes links
      const notesData = allNotes.length > 0 ? allNotes : await fetchNotes()

      const nodes = notesData.map(n => ({
        id: n.id,
        title: n.title,
        type: n.type,
        status: n.status,
        backlinks: n.backlinks?.length || 0,
        links: n.links?.length || 0
      }))

      const links = []
      for (const note of notesData) {
        if (note.outbound_links) {
          for (const targetId of note.outbound_links) {
            links.push({ source: note.id, target: targetId })
          }
        }
      }

      const graphData = { nodes, links }
      setGraph(graphData)
      return graphData
    } catch (err) {
      console.warn('[Vault] Graph fetch failed, using mock:', err.message)
      const mockGraph = generateGraphData()
      setGraph(mockGraph)
      return mockGraph
    }
  }, [allNotes, fetchNotes])

  // Fetch vault health/stats
  const fetchHealth = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/zettelkasten/stats`)
      if (!response.ok) throw new Error('Failed to fetch health')
      const data = await response.json()

      const health = {
        score: Math.min(100, 50 + data.total_permanent_notes * 5),
        totalNotes: data.total_permanent_notes,
        totalLinks: data.total_permanent_notes * 3, // Estimate
        orphans: data.total_fleeting_pending,
        conflicts: 0,
        status: data.total_permanent_notes > 10 ? 'good' : 'building',
        stats: data
      }

      setVaultHealth(health)
      return health
    } catch (err) {
      console.warn('[Vault] Health fetch failed, using mock:', err.message)
      const mockHealth = {
        score: 87,
        totalNotes: mockVaultData.notes.length,
        totalLinks: generateGraphData().links.length,
        orphans: 3,
        conflicts: 0,
        status: 'good'
      }
      setVaultHealth(mockHealth)
      return mockHealth
    }
  }, [])

  // Search notes via API
  const searchNotes = useCallback(async (query) => {
    if (!query.trim()) {
      return allNotes
    }

    try {
      const response = await fetch(`${API_BASE}/zettelkasten/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error('Search failed')
      const data = await response.json()
      return data.results || []
    } catch (err) {
      // Fallback to local search
      const q = query.toLowerCase()
      return allNotes.filter(note =>
        note.title.toLowerCase().includes(q) ||
        (note.content && note.content.toLowerCase().includes(q)) ||
        note.tags?.some(tag => tag.toLowerCase().includes(q))
      )
    }
  }, [allNotes])

  // Create note (fleeting note in Zettelkasten)
  const createNote = useCallback(async (noteData) => {
    try {
      const response = await fetch(`${API_BASE}/zettelkasten/fleeting`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: noteData.author || 'human',
          team: noteData.team || 'agency',
          content: noteData.content || noteData.title,
          context: noteData.type
        })
      })

      if (!response.ok) throw new Error('Failed to create note')

      const newNote = await response.json()
      // Refresh notes after creation
      await fetchNotes()
      return newNote
    } catch (err) {
      console.error('[Vault] Failed to create note:', err)
      throw err
    }
  }, [fetchNotes])

  // Update note (would need a PUT endpoint - for now just local)
  const updateNote = useCallback(async (id, changes) => {
    try {
      // Try to update in backend
      const response = await fetch(`${API_BASE}/zettelkasten/note/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes)
      })

      if (!response.ok) throw new Error('Failed to update note')

      const updatedNote = await response.json()
      setAllNotes(prev => prev.map(n => n.id === id ? { ...n, ...updatedNote } : n))
      if (selectedNote?.id === id) {
        setSelectedNote({ ...selectedNote, ...updatedNote })
      }
      return updatedNote
    } catch (err) {
      console.error('[Vault] Failed to update note:', err)
      // Fallback to local update
      const updated = { ...allNotes.find(n => n.id === id), ...changes }
      setAllNotes(prev => prev.map(n => n.id === id ? updated : n))
      return updated
    }
  }, [allNotes, selectedNote])

  // Select note
  const selectNote = useCallback((note) => {
    if (typeof note === 'string') {
      const found = allNotes.find(n => n.id === note)
      setSelectedNote(found || null)
    } else {
      setSelectedNote(note)
    }
  }, [allNotes])

  // Connect to live updates via Socket.io
  const setLive = useCallback((enabled) => {
    if (enabled) {
      // For now, just refresh periodically
      // In production, you'd connect to a socket for real-time updates
      if (eventSourceRef.current) return

      // Simple polling for live updates
      const pollInterval = setInterval(async () => {
        await fetchNotes()
        await fetchHealth()
      }, 10000) // Every 10 seconds

      eventSourceRef.current = { close: () => clearInterval(pollInterval) }
      setIsLive(true)
    } else {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      setIsLive(false)
    }
  }, [fetchNotes, fetchHealth])

  // Filtered and sorted notes
  const filteredNotes = useCallback(() => {
    let result = [...allNotes]

    // Apply filters
    if (filter.type !== 'all') {
      result = result.filter(n => n.type === filter.type)
    }
    if (filter.status !== 'all') {
      result = result.filter(n => n.status === filter.status)
    }
    if (filter.author !== 'all') {
      result = result.filter(n => n.author === filter.author)
    }
    if (filter.search) {
      const q = filter.search.toLowerCase()
      result = result.filter(n =>
        n.title.toLowerCase().includes(q) ||
        (n.content && n.content.toLowerCase().includes(q)) ||
        n.tags?.some(t => t.toLowerCase().includes(q))
      )
    }

    // Apply sort
    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.created) - new Date(a.created))
        break
      case 'linked':
        result.sort((a, b) => (b.backlinks?.length || 0) - (a.backlinks?.length || 0))
        break
      case 'alpha':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        break
    }

    return result
  }, [allNotes, filter, sortBy])

  // Initialize data
  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      await Promise.all([fetchNotes(), fetchHealth()])
      await fetchGraph()
      setIsLoading(false)
    }
    init()

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [fetchNotes, fetchGraph, fetchHealth])

  // Get authors for filter
  const authors = [...new Set(allNotes.map(n => n.author).filter(Boolean))]

  // Get tags for autocomplete
  const allTags = [...new Set(allNotes.flatMap(n => n.tags || []))]

  return {
    // Data
    notes: filteredNotes(),
    allNotes,
    graph,
    selectedNote,
    vaultHealth,
    isLive,
    isLoading,
    error,

    // Filters
    filter,
    setFilter,
    sortBy,
    setSortBy,

    // Available options
    authors,
    allTags,

    // Actions
    selectNote,
    createNote,
    updateNote,
    searchNotes,
    setLive,
    refresh: async () => {
      await Promise.all([fetchNotes(), fetchGraph(), fetchHealth()])
    }
  }
}

export default useVault