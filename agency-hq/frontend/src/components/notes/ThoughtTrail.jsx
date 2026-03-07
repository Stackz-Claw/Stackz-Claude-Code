/**
 * ThoughtTrail - Trace reasoning chains backwards through backlinks
 * Shows the path from raw signal to insight/decision
 */

import React, { useState, useMemo, useEffect } from 'react';

// Icons
import { GitBranch, Play, X, ChevronRight, Clock, Lightbulb, Zap } from 'lucide-react';

const ThoughtTrail = ({
  currentNote = null,
  allNotes = [],
  onNavigateToNote = () => {},
  onHighlightPath = () => {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [trail, setTrail] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate the thought trail
  const calculateTrail = async () => {
    if (!currentNote) return;

    setIsCalculating(true);

    // Build reasoning chain using backlinks
    // Start from current note and trace back through:
    // 1. Raw signals (insights from data)
    // 2. Analysis (processing signals)
    // 3. Decisions (conclusions)
    // 4. Final insight

    const reasoningNotes = [];
    const visited = new Set();
    const queue = [currentNote.id];

    // BFS to find all ancestors
    while (queue.length > 0 && reasoningNotes.length < 10) {
      const noteId = queue.shift();

      if (visited.has(noteId)) continue;
      visited.add(noteId);

      const note = allNotes.find(n => n.id === noteId);
      if (!note) continue;

      reasoningNotes.unshift(note); // Add to front (oldest first)

      // Add backlinks to queue
      for (const backlinkId of note.backlinks || []) {
        if (!visited.has(backlinkId)) {
          queue.push(backlinkId);
        }
      }
    }

    // Categorize each note in the trail
    const categorizedTrail = reasoningNotes.map((note, index) => {
      // Determine stage based on note type and position
      let stage;
      if (index === 0) {
        stage = 'origin';
      } else if (note.type === 'insight' || note.type === 'resource') {
        stage = 'signal';
      } else if (note.type === 'decision') {
        stage = 'decision';
      } else if (note.type === 'concept') {
        stage = 'analysis';
      } else {
        stage = 'context';
      }

      return {
        ...note,
        stage,
        stageLabel: getStageLabel(stage)
      };
    });

    setTrail(categorizedTrail);
    setIsCalculating(false);
  };

  // Get stage label
  const getStageLabel = (stage) => {
    switch (stage) {
      case 'origin': return { label: 'Origin', color: '#94a3b8', icon: Clock };
      case 'signal': return { label: 'Signal', color: '#06b6d4', icon: Zap };
      case 'analysis': return { label: 'Analysis', color: '#7c3aed', icon: Lightbulb };
      case 'decision': return { label: 'Decision', color: '#ef4444', icon: GitBranch };
      case 'context': return { label: 'Context', color: '#64748b', icon: Clock };
      default: return { label: 'Note', color: '#fff', icon: Clock };
    }
  };

  // Handle trail playback
  const playTrail = () => {
    if (trail.length === 0) return;

    // Highlight each note in sequence on the graph
    trail.forEach((note, index) => {
      setTimeout(() => {
        onHighlightPath(note.id);
      }, index * 800);
    });
  };

  // Navigate to a specific note in the trail
  const navigateToNote = (note) => {
    onNavigateToNote(note);
  };

  if (!currentNote) return null;

  return (
    <div style={{ marginTop: 16 }}>
      {/* Thought Trail Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) calculateTrail();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 16px',
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(124, 58, 237, 0.1)',
          color: '#a78bfa',
          fontSize: 13,
          cursor: 'pointer',
          width: '100%',
          transition: 'all 0.2s ease'
        }}
      >
        <GitBranch size={16} />
        How did we get here?
        <span style={{ marginLeft: 'auto', opacity: 0.6 }}>
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {/* Thought Trail Panel */}
      {isOpen && (
        <div
          style={{
            marginTop: 12,
            background: 'rgba(0,0,0,0.3)',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
                Reasoning Chain
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                {trail.length} notes in the trail
              </div>
            </div>

            {trail.length > 0 && (
              <button
                onClick={playTrail}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#7c3aed',
                  color: '#fff',
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                <Play size={12} /> Play
              </button>
            )}
          </div>

          {/* Loading state */}
          {isCalculating && (
            <div style={{ padding: 24, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
              Tracing reasoning chain...
            </div>
          )}

          {/* Trail content */}
          {!isCalculating && trail.length > 0 && (
            <div style={{ maxHeight: 400, overflow: 'auto' }}>
              {trail.map((note, index) => {
                const stageInfo = getStageLabel(note.stage);
                const StageIcon = stageInfo.icon;
                const isFirst = index === 0;
                const isLast = index === trail.length - 1;

                return (
                  <div key={note.id}>
                    {/* Connector line */}
                    {!isFirst && (
                      <div
                        style={{
                          position: 'absolute',
                          left: 40,
                          top: -8,
                          width: 2,
                          height: 16,
                          background: 'rgba(255,255,255,0.1)'
                        }}
                      />
                    )}

                    {/* Note card */}
                    <div
                      onClick={() => navigateToNote(note)}
                      style={{
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                        cursor: 'pointer',
                        background: isLast ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                        transition: 'background 0.2s ease'
                      }}
                    >
                      {/* Stage indicator */}
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: stageInfo.color + '20',
                          border: `2px solid ${stageInfo.color}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <StageIcon size={12} color={stageInfo.color} />
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 12,
                            color: stageInfo.color,
                            marginBottom: 2
                          }}
                        >
                          {stageInfo.label}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: '#fff',
                            fontWeight: isLast ? 600 : 400,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {note.title}
                        </div>
                        {note.author && (
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                            {note.author} • {note.type}
                          </div>
                        )}
                      </div>

                      {/* Arrow */}
                      <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!isCalculating && trail.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
                No reasoning trail found
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                This note doesn't have linked backlinks to trace back
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ThoughtTrail;
