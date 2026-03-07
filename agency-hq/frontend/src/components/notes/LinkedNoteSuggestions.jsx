/**
 * LinkedNoteSuggestions - AI Assist strip for note suggestions
 * Shows related notes, contradictions, and tag suggestions
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Link2, Tag, AlertTriangle, X, Check } from 'lucide-react';

const LinkedNoteSuggestions = ({
  note = null,
  allNotes = [],
  onAddLink = () => {},
  onAddTag = () => {}
}) => {
  const [relatedNotes, setRelatedNotes] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Generate suggestions based on note content
  useEffect(() => {
    if (!note) return;

    const generateSuggestions = async () => {
      setIsLoading(true);

      // Simulate AI analysis (in production, this would call vault_engine)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find related notes based on tags and content
      const noteTags = note.tags || [];
      const related = allNotes
        .filter(n => n.id !== note.id)
        .map(n => {
          // Calculate relevance score
          let score = 0;
          const noteTags2 = n.tags || [];

          // Tag overlap
          const commonTags = noteTags.filter(t => noteTags2.includes(t));
          score += commonTags.length * 2;

          // Type match (agents relate to agents)
          if (n.type === note.type) score += 1;

          // Author match
          if (n.author === note.author) score += 0.5;

          return { note: n, score };
        })
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(r => r.note);

      setRelatedNotes(related);

      // Simulate tag suggestions
      const contentWords = (note.content || '').toLowerCase().split(/\s+/);
      const allTags = [...new Set(allNotes.flatMap(n => n.tags || []))];
      const suggestions = allTags
        .filter(t => !noteTags.includes(t))
        .filter(t => contentWords.some(w => t.includes(w) || w.includes(t)))
        .slice(0, 3);
      setTagSuggestions(suggestions);

      // No conflicts in this mock (would be from vault_engine analysis)
      setConflicts([]);

      setIsLoading(false);
    };

    generateSuggestions();
  }, [note, allNotes]);

  if (!note) return null;

  const hasSuggestions = relatedNotes.length > 0 || conflicts.length > 0 || tagSuggestions.length > 0;

  return (
    <div
      style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(0,0,0,0.2)'
      }}
    >
      {/* Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
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
          <Sparkles size={14} color="#f59e0b" />
          Sheldon AI Assist
          {isLoading && (
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
              analyzing...
            </span>
          )}
        </span>
        <span style={{
          transform: isExpanded ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s ease'
        }}>
          ▼
        </span>
      </button>

      {/* Content */}
      {isExpanded && (
        <div style={{ padding: '0 16px 16px' }}>
          {/* Related Notes */}
          {relatedNotes.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.4)',
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <Link2 size={12} />
                Related notes you might not have linked:
              </div>
              {relatedNotes.map(n => (
                <div
                  key={n.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    marginBottom: 4,
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 6
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, color: '#fff', marginBottom: 2 }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
                      {n.type} · {n.author}
                    </div>
                  </div>
                  <button
                    onClick={() => onAddLink(note.id, n.id)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      border: 'none',
                      background: 'rgba(0, 212, 170, 0.2)',
                      color: '#00d4aa',
                      fontSize: 11,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <Link2 size={10} /> Add
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Conflicts */}
          {conflicts.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 11,
                color: '#ef4444',
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <AlertTriangle size={12} />
                This note contradicts:
              </div>
              {conflicts.map(c => (
                <div
                  key={c.id}
                  style={{
                    padding: '8px 10px',
                    marginBottom: 4,
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: 6,
                    borderLeft: '2px solid #ef4444'
                  }}
                >
                  <div style={{ fontSize: 12, color: '#fff', marginBottom: 2 }}>
                    {c.title}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
                    {c.reason}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tag Suggestions */}
          {tagSuggestions.length > 0 && (
            <div>
              <div style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.4)',
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <Tag size={12} />
                Suggested tags based on content:
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {tagSuggestions.map(tag => (
                  <button
                    key={tag}
                    onClick={() => onAddTag(note.id, tag)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 12,
                      border: '1px dashed rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: 11,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <Tag size={10} /> {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No suggestions */}
          {!isLoading && !hasSuggestions && (
            <div style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.4)',
              fontStyle: 'italic'
            }}>
              No suggestions at this time
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LinkedNoteSuggestions;
