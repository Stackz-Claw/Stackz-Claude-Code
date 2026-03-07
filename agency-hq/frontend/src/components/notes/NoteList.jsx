/**
 * NoteList - Left panel component for Smart Notes
 * Scrollable, filterable list of all vault notes
 */

import React, { useMemo } from 'react';
import { NOTE_TYPES, NOTE_STATUS, getNoteType, getNoteStatus } from './NoteTypeConfig';

// Icons
import { Search, Filter, SortAsc, Clock, Link, ChevronDown } from 'lucide-react';

const NoteList = ({
  notes = [],
  selectedNoteId = null,
  onSelectNote = () => {},
  filter = {},
  onFilterChange = () => {},
  sortBy = 'recent',
  onSortChange = () => {},
  authors = [],
  isLive = false
}) => {
  // Format relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Type filter pills
  const typeFilters = ['all', ...Object.keys(NOTE_TYPES)];

  return (
    <div
      className="note-list"
      style={{
        width: 280,
        minWidth: 280,
        height: '100%',
        background: 'rgba(10, 10, 15, 0.95)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Search */}
      <div style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 8,
            padding: '8px 12px',
            gap: 8
          }}
        >
          <Search size={16} color="rgba(255,255,255,0.5)" />
          <input
            type="text"
            placeholder="Search notes..."
            value={filter.search || ''}
            onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
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
      </div>

      {/* Type Filter Pills */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div
          style={{
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            paddingBottom: 4
          }}
        >
          {typeFilters.map(type => (
            <button
              key={type}
              onClick={() => onFilterChange({ ...filter, type })}
              style={{
                padding: '4px 10px',
                borderRadius: 12,
                border: 'none',
                fontSize: 11,
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: (filter.type || 'all') === type
                  ? (type === 'all' ? 'rgba(255,255,255,0.2)' : getNoteType(type).color)
                  : 'rgba(255,255,255,0.05)',
                color: (filter.type || 'all') === type ? '#fff' : 'rgba(255,255,255,0.6)',
                transition: 'all 0.2s ease'
              }}
            >
              {type === 'all' ? 'All' : getNoteType(type).label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Toggle */}
      <div
        style={{
          padding: '8px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
          {notes.length} notes
        </span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.7)',
            fontSize: 11,
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="recent">Recent</option>
          <option value="linked">Most Linked</option>
          <option value="alpha">A-Z</option>
        </select>
      </div>

      {/* Notes List */}
      <div style={{ flex: 1, overflow: 'auto', padding: 8 }}>
        {notes.map((note, index) => {
          const typeConfig = getNoteType(note.type);
          const statusConfig = getNoteStatus(note.status);
          const isSelected = selectedNoteId === note.id;
          const backlinkCount = note.backlinks?.length || 0;

          return (
            <div
              key={note.id}
              onClick={() => onSelectNote(note)}
              style={{
                padding: '12px',
                borderRadius: 8,
                marginBottom: 4,
                cursor: 'pointer',
                background: isSelected ? 'rgba(255,255,255,0.08)' : 'transparent',
                borderLeft: isSelected ? `3px solid ${typeConfig.color}` : '3px solid transparent',
                transition: 'all 0.15s ease',
                animation: index === 0 && isLive ? 'flash 0.5s ease' : 'none'
              }}
            >
              {/* Title */}
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#fff',
                  marginBottom: 6,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {note.title}
              </div>

              {/* Meta row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap'
                }}
              >
                {/* Type badge */}
                <span
                  style={{
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 500,
                    background: typeConfig.color + '20',
                    color: typeConfig.color
                  }}
                >
                  {typeConfig.label}
                </span>

                {/* Status dot */}
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: statusConfig.color,
                    display: 'inline-block',
                    boxShadow: statusConfig.dot === 'pulse' ? `0 0 6px ${statusConfig.color}` : 'none'
                  }}
                />

                {/* Backlinks */}
                {backlinkCount > 0 && (
                  <span
                    style={{
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <Link size={10} /> {backlinkCount}
                  </span>
                )}

                {/* Time */}
                <span
                  style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.4)',
                    marginLeft: 'auto'
                  }}
                >
                  {formatRelativeTime(note.modified)}
                </span>
              </div>
            </div>
          );
        })}

        {notes.length === 0 && (
          <div
            style={{
              padding: 24,
              textAlign: 'center',
              color: 'rgba(255,255,255,0.4)',
              fontSize: 13
            }}
          >
            No notes found
          </div>
        )}
      </div>

      {/* CSS Animation for live flash */}
      <style>{`
        @keyframes flash {
          0% { background: rgba(0, 212, 170, 0.2); }
          100% { background: transparent; }
        }
      `}</style>
    </div>
  );
};

export default NoteList;
