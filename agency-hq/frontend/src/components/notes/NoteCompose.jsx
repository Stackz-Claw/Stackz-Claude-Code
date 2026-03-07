/**
 * NoteCompose - New note drawer component
 */

import React, { useState } from 'react';
import { NOTE_TYPES, NOTE_STATUS } from './NoteTypeConfig';

// Icons
import { X, Bold, Italic, Link2, Code, Tag, Plus } from 'lucide-react';

const NoteCompose = ({
  isOpen = false,
  onClose = () => {},
  onSave = () => {},
  linkedFromNote = null,
  existingTags = []
}) => {
  const [noteType, setNoteType] = useState('concept');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState('seedling');

  // Handle save
  const handleSave = () => {
    if (!title.trim()) return;

    const noteData = {
      title: title.trim(),
      type: noteType,
      content: content.trim(),
      tags,
      status,
      author: 'user', // Would come from auth
      // If linked from another note, add backlink
      links: linkedFromNote ? [`[[${linkedFromNote.title}]]`] : []
    };

    onSave(noteData);
    handleClose();
  };

  // Handle close
  const handleClose = () => {
    setNoteType('concept');
    setTitle('');
    setContent('');
    setTags([]);
    setTagInput('');
    setStatus('seedling');
    onClose();
  };

  // Add tag
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  // Remove tag
  const handleRemoveTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  // Insert wikilink
  const insertWikilink = () => {
    setContent(content + '[[]]');
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 480,
        height: '100%',
        background: 'rgba(10, 10, 15, 0.98)',
        borderLeft: '1px solid rgba(255,255,255,0.1)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.2s ease'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 16,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#fff' }}>
          New Note
        </h3>
        <button
          onClick={handleClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
            padding: 4
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        {/* Note Type Selector */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>
            Note Type
          </label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.entries(NOTE_TYPES).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setNoteType(key)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: noteType === key ? config.color : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.2s ease'
                }}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: 14,
              outline: 'none'
            }}
          />
        </div>

        {/* Content */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>
            Content
          </label>

          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            <button style={toolbarBtnStyle}><Bold size={14} /></button>
            <button style={toolbarBtnStyle}><Italic size={14} /></button>
            <button style={toolbarBtnStyle} onClick={insertWikilink}><Link2 size={14} /></button>
            <button style={toolbarBtnStyle}><Code size={14} /></button>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note content here...

Use [[wikilinks]] to link to other notes."
            style={{
              width: '100%',
              minHeight: 200,
              padding: 12,
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: 13,
              fontFamily: 'monospace',
              resize: 'vertical',
              outline: 'none'
            }}
          />
        </div>

        {/* Tags */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>
            Tags
          </label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            {tags.map(tag => (
              <span
                key={tag}
                style={{
                  padding: '4px 8px',
                  borderRadius: 4,
                  background: 'rgba(0, 212, 170, 0.2)',
                  color: '#00d4aa',
                  fontSize: 11,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                {tag}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => handleRemoveTag(tag)} />
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Add tag..."
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: 12,
                outline: 'none'
              }}
            />
            <button
              onClick={handleAddTag}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: 'none',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              <Plus size={14} />
            </button>
          </div>
          {/* Existing tags autocomplete */}
          {existingTags.length > 0 && (
            <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {existingTags.filter(t => !tags.includes(t)).slice(0, 5).map(tag => (
                <button
                  key={tag}
                  onClick={() => setTags([...tags, tag])}
                  style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    border: 'none',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: 10,
                    cursor: 'pointer'
                  }}
                >
                  + {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>
            Status
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {Object.entries(NOTE_STATUS).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setStatus(key)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: status === key ? config.color : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: 11,
                  cursor: 'pointer'
                }}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* Linked from note */}
        {linkedFromNote && (
          <div style={{ marginTop: 16, padding: 12, background: 'rgba(0, 212, 170, 0.1)', borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
              Linked from
            </div>
            <div style={{ fontSize: 13, color: '#00d4aa' }}>
              [[{linkedFromNote.title}]]
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: 16,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          gap: 12,
          justifyContent: 'flex-end'
        }}
      >
        <button
          onClick={handleClose}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'transparent',
            color: '#fff',
            fontSize: 13,
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!title.trim()}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: 'none',
            background: title.trim() ? '#00d4aa' : 'rgba(0, 212, 170, 0.3)',
            color: title.trim() ? '#000' : 'rgba(0,0,0,0.5)',
            fontSize: 13,
            fontWeight: 500,
            cursor: title.trim() ? 'pointer' : 'not-allowed'
          }}
        >
          Save Note
        </button>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

const toolbarBtnStyle = {
  padding: 6,
  borderRadius: 4,
  border: 'none',
  background: 'rgba(255,255,255,0.05)',
  color: 'rgba(255,255,255,0.6)',
  cursor: 'pointer'
};

export default NoteCompose;
