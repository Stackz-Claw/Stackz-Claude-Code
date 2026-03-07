/**
 * NoteDetail - Right panel component for Smart Notes
 * Renders full selected note with read/edit capability
 */

import React, { useState, useMemo } from 'react';
import { NOTE_TYPES, NOTE_STATUS, getNoteType, getNoteStatus } from './NoteTypeConfig';

// Icons
import { Edit3, Link2, Archive, Clock, Tag, Plus, X, Sparkles } from 'lucide-react';

const NoteDetail = ({
  note = null,
  onUpdate = () => {},
  onArchive = () => {},
  onTagClick = () => {},
  onLinkClick = () => {},
  onNewLinkedNote = () => {},
  allNotes = []
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [showBacklinks, setShowBacklinks] = useState(true);
  const [showAIAssist, setShowAIAssist] = useState(true);

  // Start editing
  const handleStartEdit = () => {
    setEditContent(note.content);
    setIsEditing(true);
  };

  // Save edits
  const handleSaveEdit = () => {
    onUpdate(note.id, { content: editContent });
    setIsEditing(false);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent('');
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
    return formatDate(dateString);
  };

  // Render wikilinks as clickable
  const renderContent = useMemo(() => {
    if (!note?.content) return null;

    // Replace [[link]] with clickable spans
    const content = note.content.replace(/\[\[([^\]]+)\]\]/g, (match, linkText) => {
      const linkedNote = allNotes.find(n =>
        n.title.toLowerCase().includes(linkText.toLowerCase()) ||
        n.id === linkText
      );

      return `<span class="wikilink" data-note-id="${linkedNote?.id || ''}" data-link="${linkText}">${linkText}</span>`;
    });

    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }, [note?.content, allNotes]);

  // Handle wikilink click
  const handleContentClick = (e) => {
    if (e.target.classList.contains('wikilink')) {
      const noteId = e.target.dataset.noteId;
      const link = e.target.dataset.link;
      if (noteId) {
        onLinkClick(noteId);
      }
    }
  };

  // Confidence arc component
  const ConfidenceArc = ({ score, size = 40 }) => {
    const radius = size / 2 - 4;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="4"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={score >= 80 ? '#00d4aa' : score >= 60 ? '#f59e0b' : '#ef4444'}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#fff"
          fontSize={size / 3}
          fontWeight="600"
        >
          {score}
        </text>
      </svg>
    );
  };

  if (!note) {
    return (
      <div
        style={{
          width: 360,
          minWidth: 360,
          height: '100%',
          background: 'rgba(10, 10, 15, 0.95)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.3)',
          fontSize: 14
        }}
      >
        Select a note to view details
      </div>
    );
  }

  const typeConfig = getNoteType(note.type);
  const statusConfig = getNoteStatus(note.status);

  return (
    <div
      className="note-detail"
      style={{
        width: 360,
        minWidth: 360,
        height: '100%',
        background: 'rgba(10, 10, 15, 0.95)',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 16,
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: '#fff',
            marginBottom: 8
          }}
        >
          {note.title}
        </div>

        {/* Badges row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <span
            style={{
              padding: '4px 8px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 500,
              background: typeConfig.color + '20',
              color: typeConfig.color
            }}
          >
            {typeConfig.label}
          </span>
          <span
            style={{
              padding: '4px 8px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 500,
              background: statusConfig.color + '20',
              color: statusConfig.color,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: statusConfig.color
              }}
            />
            {statusConfig.label}
          </span>
        </div>

        {/* Author + Time */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 12
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: typeConfig.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 600,
              color: '#fff'
            }}
          >
            {note.author?.charAt(0).toUpperCase()}
          </div>
          <span>{note.author}</span>
          <span>•</span>
          <span>modified {formatRelativeTime(note.modified)}</span>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleStartEdit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: 12,
              cursor: 'pointer'
            }}
          >
            <Edit3 size={14} /> Edit
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(`[[${note.title}]]`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: 12,
              cursor: 'pointer'
            }}
          >
            <Link2 size={14} /> Copy Link
          </button>
          <button
            onClick={() => onArchive(note.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 12,
              cursor: 'pointer'
            }}
          >
            <Archive size={14} />
          </button>
        </div>
      </div>

      {/* Metadata strip */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          gap: 16,
          alignItems: 'center'
        }}
      >
        {/* Confidence */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ConfidenceArc score={note.confidence || 0} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>confidence</span>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 4, flex: 1, flexWrap: 'wrap' }}>
          {note.tags?.slice(0, 3).map(tag => (
            <span
              key={tag}
              onClick={() => onTagClick(tag)}
              style={{
                padding: '2px 8px',
                borderRadius: 10,
                fontSize: 10,
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer'
              }}
            >
              {tag}
            </span>
          ))}
          {note.tags?.length > 3 && (
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
              +{note.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Content area */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: 16
        }}
      >
        {isEditing ? (
          <div>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              style={{
                width: '100%',
                minHeight: 300,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: 12,
                color: '#fff',
                fontSize: 13,
                fontFamily: 'monospace',
                resize: 'vertical',
                outline: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button
                onClick={handleSaveEdit}
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#00d4aa',
                  color: '#000',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'transparent',
                  color: '#fff',
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={handleContentClick}
            style={{
              fontSize: 13,
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.85)',
              whiteSpace: 'pre-wrap'
            }}
            className="note-content"
          >
            {renderContent}
          </div>
        )}
      </div>

      {/* Backlinks section */}
      {note.backlinks?.length > 0 && (
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <button
            onClick={() => setShowBacklinks(!showBacklinks)}
            style={{
              width: '100%',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.7)',
              fontSize: 12,
              cursor: 'pointer'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              ↩ Referenced by {note.backlinks.length} notes
            </span>
            <ChevronDown
              size={14}
              style={{ transform: showBacklinks ? 'rotate(180deg)' : 'none' }}
            />
          </button>
          {showBacklinks && (
            <div style={{ padding: '0 16px 16px' }}>
              {note.backlinks.map(blId => {
                const blNote = allNotes.find(n => n.id === blId);
                if (!blNote) return null;
                return (
                  <div
                    key={blId}
                    onClick={() => onLinkClick(blId)}
                    style={{
                      padding: 8,
                      marginBottom: 4,
                      borderRadius: 6,
                      background: 'rgba(255,255,255,0.05)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: 12, color: '#fff', marginBottom: 2 }}>
                      {blNote.title}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                      {getNoteType(blNote.type).label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* New Linked Note button */}
      <div
        style={{
          padding: 16,
          borderTop: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <button
          onClick={() => onNewLinkedNote(note)}
          style={{
            width: '100%',
            padding: '10px 16px',
            borderRadius: 8,
            border: '1px dashed rgba(255,255,255,0.2)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.6)',
            fontSize: 12,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
        >
          <Plus size={14} /> Write New Linked Note
        </button>
      </div>

      {/* AI Assist strip */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <button
          onClick={() => setShowAIAssist(!showAIAssist)}
          style={{
            width: '100%',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.7)',
            fontSize: 12,
            cursor: 'pointer'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={14} /> Sheldon AI Assist
          </span>
          <ChevronDown
            size={14}
            style={{ transform: showAIAssist ? 'rotate(180deg)' : 'none' }}
          />
        </button>
        {showAIAssist && (
          <div style={{ padding: '0 16px 16px' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
              Related notes you might not have linked:
            </div>
            {/* AI suggestions would go here */}
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
              No suggestions yet
            </div>
          </div>
        )}
      </div>

      {/* Wikilink styles */}
      <style>{`
        .note-content .wikilink {
          color: #00d4aa;
          cursor: pointer;
          text-decoration: underline;
          text-decoration-style: dotted;
        }
        .note-content .wikilink:hover {
          color: #00ffcc;
        }
      `}</style>
    </div>
  );
};

export default NoteDetail;
