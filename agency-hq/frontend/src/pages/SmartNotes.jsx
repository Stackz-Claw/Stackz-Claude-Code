/**
 * SmartNotes - Main Smart Notes page
 * The primary visual interface for the Stackz Zettelkasten vault
 */

import React, { useState, useCallback } from 'react';
import useVault from '../hooks/useVault';
import KnowledgeGraph from '../components/notes/KnowledgeGraph';
import NoteList from '../components/notes/NoteList';
import NoteDetail from '../components/notes/NoteDetail';
import NoteCompose from '../components/notes/NoteCompose';
import VaultHealthWidget from '../components/notes/VaultHealthWidget';
import NoteLiveStream from '../components/notes/NoteLiveStream';
import { NOTE_TYPES } from '../components/notes/NoteTypeConfig';

// Icons
import { Search, Plus, Filter, Grid, List, Zap } from 'lucide-react';

const SmartNotes = () => {
  // Vault state
  const {
    notes,
    allNotes,
    graph,
    selectedNote,
    vaultHealth,
    isLive,
    isLoading,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    selectNote,
    createNote,
    updateNote,
    setLive,
    authors,
    allTags
  } = useVault();

  // UI state
  const [showCompose, setShowCompose] = useState(false);
  const [highlightedTrail, setHighlightedTrail] = useState({ nodes: [], edges: [] });
  const [linkedFromNote, setLinkedFromNote] = useState(null);
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [rightPanelVisible, setRightPanelVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Handlers
  const handleNoteSelect = useCallback((note) => {
    selectNote(note);
  }, [selectNote]);

  const handleCreateNote = useCallback(async (noteData) => {
    await createNote(noteData);
    setShowCompose(false);
    setLinkedFromNote(null);
  }, [createNote]);

  const handleUpdateNote = useCallback(async (id, changes) => {
    await updateNote(id, changes);
  }, [updateNote]);

  const handleNewLinkedNote = useCallback((note) => {
    setLinkedFromNote(note);
    setShowCompose(true);
  }, []);

  const handleTagClick = useCallback((tag) => {
    setFilter({ ...filter, search: tag });
  }, [filter, setFilter]);

  const handleLinkClick = useCallback((noteId) => {
    const note = allNotes.find(n => n.id === noteId);
    if (note) {
      selectNote(note);
    }
  }, [allNotes, selectNote]);

  // Loading state
  if (isLoading) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#050508',
          color: 'rgba(255,255,255,0.5)'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 16 }}>Loading vault...</div>
        </div>
      </div>
    );
  }

  // Empty state - Zettelkasten guide
  if (notes.length === 0) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#050508',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative background network */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 30%, rgba(0,212,170,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(124,58,237,0.1) 0%, transparent 50%)',
            animation: 'pulse 8s ease-in-out infinite'
          }}
        />

        {/* Empty state card */}
        <div
          style={{
            background: 'rgba(10,10,15,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16,
            padding: 48,
            maxWidth: 500,
            textAlign: 'center',
            position: 'relative',
            zIndex: 10
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 24 }}>🧠</div>
          <h2 style={{ fontSize: 24, fontWeight: 600, color: '#fff', marginBottom: 16 }}>
            Your Second Brain
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 32, lineHeight: 1.6 }}>
            Every note is an atomic idea. Every link is a connection your agents — and you — made on purpose.
            The more notes, the smarter the whole system gets.
          </p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>
            Start with one idea. The graph builds itself.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={() => setShowCompose(true)}
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                border: 'none',
                background: '#00d4aa',
                color: '#000',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Create my first note
            </button>
            <button
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'transparent',
                color: '#fff',
                fontSize: 14,
                cursor: 'pointer'
              }}
            >
              Let agents populate it
            </button>
          </div>
        </div>

        <NoteCompose
          isOpen={showCompose}
          onClose={() => setShowCompose(false)}
          onSave={handleCreateNote}
        />

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#050508',
        overflow: 'hidden'
      }}
    >
      {/* TOOLBAR */}
      <div
        style={{
          padding: '12px 16px',
          background: 'rgba(10, 10, 15, 0.95)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          zIndex: 100
        }}
      >
        {/* Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 8,
            padding: '8px 12px',
            gap: 8,
            flex: 1,
            maxWidth: 400
          }}
        >
          <Search size={16} color="rgba(255,255,255,0.5)" />
          <input
            type="text"
            placeholder="Search vault..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setFilter({ ...filter, search: e.target.value });
            }}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: 13,
              outline: 'none'
            }}
          />
        </div>

        {/* Filter dropdowns */}
        <select
          value={filter.type || 'all'}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6,
            padding: '8px 12px',
            color: '#fff',
            fontSize: 12,
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="all">All Types</option>
          {Object.entries(NOTE_TYPES).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>

        <select
          value={filter.status || 'all'}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6,
            padding: '8px 12px',
            color: '#fff',
            fontSize: 12,
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="all">All Status</option>
          <option value="evergreen">Evergreen</option>
          <option value="budding">Budding</option>
          <option value="seedling">Seedling</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={filter.author || 'all'}
          onChange={(e) => setFilter({ ...filter, author: e.target.value })}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6,
            padding: '8px 12px',
            color: '#fff',
            fontSize: 12,
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="all">All Authors</option>
          {authors.map(author => (
            <option key={author} value={author}>{author}</option>
          ))}
        </select>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Live stream */}
        <NoteLiveStream
          isLive={isLive}
          onToggle={() => setLive(!isLive)}
        />

        {/* New Note button */}
        <button
          onClick={() => setShowCompose(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderRadius: 8,
            border: 'none',
            background: '#00d4aa',
            color: '#000',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          <Plus size={16} /> New Note
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: rightPanelVisible
            ? leftPanelVisible ? '280px 1fr 360px' : '1fr 360px'
            : leftPanelVisible ? '280px 1fr' : '1fr',
          overflow: 'hidden'
        }}
      >
        {/* LEFT PANEL - Note List */}
        {leftPanelVisible && (
          <NoteList
            notes={notes}
            selectedNoteId={selectedNote?.id}
            onSelectNote={handleNoteSelect}
            filter={filter}
            onFilterChange={setFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            authors={authors}
            isLive={isLive}
          />
        )}

        {/* CENTER PANEL - Knowledge Graph */}
        <KnowledgeGraph
          notes={notes}
          onNodeClick={handleNoteSelect}
          selectedNodeId={selectedNote?.id}
          highlightedNodeIds={highlightedTrail.nodes}
          highlightedEdgeIds={highlightedTrail.edges}
        />

        {/* RIGHT PANEL - Note Detail */}
        {rightPanelVisible && (
          <NoteDetail
            note={selectedNote}
            onUpdate={handleUpdateNote}
            onTagClick={handleTagClick}
            onLinkClick={handleLinkClick}
            onNewLinkedNote={handleNewLinkedNote}
            allNotes={allNotes}
            onHighlightTrail={setHighlightedTrail}
          />
        )}
      </div>

      {/* Vault Health Widget */}
      <VaultHealthWidget
        health={vaultHealth}
        onViewDetails={() => {}}
      />

      {/* Note Compose Drawer */}
      <NoteCompose
        isOpen={showCompose}
        onClose={() => {
          setShowCompose(false);
          setLinkedFromNote(null);
        }}
        onSave={handleCreateNote}
        linkedFromNote={linkedFromNote}
        existingTags={allTags}
      />
    </div>
  );
};

export default SmartNotes;
