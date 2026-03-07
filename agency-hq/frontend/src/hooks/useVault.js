/**
 * useVault - Custom React hook for vault API integration
 * Handles data fetching, caching, and real-time updates
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { mockVaultData, generateGraphData } from '../data/mockVaultData';

const VAULT_API_BASE = 'http://localhost:8765/vault';

export const useVault = () => {
  // State
  const [notes, setNotes] = useState([]);
  const [graph, setGraph] = useState({ nodes: [], links: [] });
  const [selectedNote, setSelectedNote] = useState(null);
  const [vaultHealth, setVaultHealth] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filter, setFilter] = useState({
    type: 'all',
    status: 'all',
    author: 'all',
    search: ''
  });
  const [sortBy, setSortBy] = useState('recent');

  // SSE connection ref
  const eventSourceRef = useRef(null);

  // Fetch notes from API
  const fetchNotes = useCallback(async () => {
    try {
      const response = await fetch(`${VAULT_API_BASE}/notes`);
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data.notes || []);
      return data.notes || [];
    } catch (err) {
      console.warn('Vault API unavailable, using mock data:', err.message);
      // Fall back to mock data
      setNotes(mockVaultData.notes);
      return mockVaultData.notes;
    }
  }, []);

  // Fetch graph data
  const fetchGraph = useCallback(async () => {
    try {
      const response = await fetch(`${VAULT_API_BASE}/graph`);
      if (!response.ok) throw new Error('Failed to fetch graph');
      const data = await response.json();
      setGraph(data);
      return data;
    } catch (err) {
      console.warn('Vault API unavailable, using mock graph data');
      const mockGraph = generateGraphData();
      setGraph(mockGraph);
      return mockGraph;
    }
  }, []);

  // Fetch vault health
  const fetchHealth = useCallback(async () => {
    try {
      const response = await fetch(`${VAULT_API_BASE}/health`);
      if (!response.ok) throw new Error('Failed to fetch health');
      const data = await response.json();
      setVaultHealth(data);
      return data;
    } catch (err) {
      console.warn('Vault API unavailable, using mock health data');
      const mockHealth = {
        score: 87,
        totalNotes: mockVaultData.notes.length,
        totalLinks: generateGraphData().links.length,
        orphans: 3,
        conflicts: 0,
        status: 'good'
      };
      setVaultHealth(mockHealth);
      return mockHealth;
    }
  }, []);

  // Search notes
  const searchNotes = useCallback(async (query) => {
    if (!query.trim()) {
      return notes;
    }

    try {
      const response = await fetch(`${VAULT_API_BASE}/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      return data.results || [];
    } catch (err) {
      // Fallback to local search
      const q = query.toLowerCase();
      return notes.filter(note =>
        note.title.toLowerCase().includes(q) ||
        note.content.toLowerCase().includes(q) ||
        note.tags?.some(tag => tag.toLowerCase().includes(q))
      );
    }
  }, [notes]);

  // Create note
  const createNote = useCallback(async (noteData) => {
    try {
      const response = await fetch(`${VAULT_API_BASE}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData)
      });
      if (!response.ok) throw new Error('Failed to create note');
      const newNote = await response.json();
      setNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (err) {
      console.error('Failed to create note:', err);
      throw err;
    }
  }, []);

  // Update note
  const updateNote = useCallback(async (id, changes) => {
    try {
      const response = await fetch(`${VAULT_API_BASE}/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes)
      });
      if (!response.ok) throw new Error('Failed to update note');
      const updatedNote = await response.json();
      setNotes(prev => prev.map(n => n.id === id ? updatedNote : n));
      if (selectedNote?.id === id) {
        setSelectedNote(updatedNote);
      }
      return updatedNote;
    } catch (err) {
      console.error('Failed to update note:', err);
      throw err;
    }
  }, [selectedNote]);

  // Select note
  const selectNote = useCallback((note) => {
    if (typeof note === 'string') {
      const found = notes.find(n => n.id === note);
      setSelectedNote(found || null);
    } else {
      setSelectedNote(note);
    }
  }, [notes]);

  // Connect to SSE stream
  const setLive = useCallback((enabled) => {
    if (enabled) {
      if (eventSourceRef.current) return; // Already connected

      try {
        const eventSource = new EventSource(`${VAULT_API_BASE}/stream`);
        eventSourceRef.current = eventSource;

        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          handleStreamEvent(data);
        };

        eventSource.onerror = () => {
          console.warn('SSE connection error, retrying...');
          eventSource.close();
          eventSourceRef.current = null;
          // Retry after 5 seconds
          setTimeout(() => setLive(true), 5000);
        };

        setIsLive(true);
      } catch (err) {
        console.warn('Failed to connect to SSE stream:', err);
      }
    } else {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setIsLive(false);
    }
  }, []);

  // Handle SSE events
  const handleStreamEvent = useCallback((event) => {
    switch (event.type) {
      case 'note_created':
        setNotes(prev => [event.note, ...prev]);
        // Also update graph
        setGraph(prev => ({
          ...prev,
          nodes: [...prev.nodes, {
            id: event.note.id,
            title: event.note.title,
            type: event.note.type,
            status: event.note.status,
            backlinks: 0,
            links: event.note.links?.length || 0
          }]
        }));
        break;

      case 'note_updated':
        setNotes(prev => prev.map(n =>
          n.id === event.note.id ? event.note : n
        ));
        break;

      case 'link_created':
        setGraph(prev => ({
          ...prev,
          links: [...prev.links, { source: event.source, target: event.target }]
        }));
        break;

      default:
        break;
    }
  }, []);

  // Filtered and sorted notes
  const filteredNotes = useCallback(() => {
    let result = [...notes];

    // Apply filters
    if (filter.type !== 'all') {
      result = result.filter(n => n.type === filter.type);
    }
    if (filter.status !== 'all') {
      result = result.filter(n => n.status === filter.status);
    }
    if (filter.author !== 'all') {
      result = result.filter(n => n.author === filter.author);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // Apply sort
    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.modified) - new Date(a.modified));
        break;
      case 'linked':
        result.sort((a, b) => (b.backlinks?.length || 0) - (a.backlinks?.length || 0));
        break;
      case 'alpha':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return result;
  }, [notes, filter, sortBy]);

  // Initialize data
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([fetchNotes(), fetchGraph(), fetchHealth()]);
      setIsLoading(false);
    };
    init();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [fetchNotes, fetchGraph, fetchHealth]);

  // Get authors for filter
  const authors = [...new Set(notes.map(n => n.author))];

  // Get tags for autocomplete
  const allTags = [...new Set(notes.flatMap(n => n.tags || []))];

  return {
    // Data
    notes: filteredNotes(),
    allNotes: notes,
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
      await Promise.all([fetchNotes(), fetchGraph(), fetchHealth()]);
    }
  };
};

export default useVault;
