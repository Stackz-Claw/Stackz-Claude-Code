/**
 * NoteLiveStream - SSE connection + ticker for live updates
 */

import React, { useEffect, useState, useRef } from 'react';

// Icons
import { Zap, ZapOff, Activity, X } from 'lucide-react';

const NoteLiveStream = ({
  isLive = false,
  onToggle = () => {},
  events = []
}) => {
  const [recentEvents, setRecentEvents] = useState([]);
  const [showTicker, setShowTicker] = useState(true);
  const scrollRef = useRef(null);

  // Add new events to the list
  useEffect(() => {
    if (events.length > 0) {
      setRecentEvents(prev => {
        const newEvents = [...events, ...prev].slice(0, 10);
        return newEvents;
      });
    }
  }, [events]);

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);

    if (diffSecs < 60) return `${diffSecs}s ago`;
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Get event icon
  const getEventIcon = (type) => {
    switch (type) {
      case 'note_created': return '+';
      case 'note_updated': return '↻';
      case 'link_created': return '🔗';
      default: return '•';
    }
  };

  // Get event color
  const getEventColor = (type) => {
    switch (type) {
      case 'note_created': return '#00d4aa';
      case 'note_updated': return '#3b82f6';
      case 'link_created': return '#f59e0b';
      default: return '#64748b';
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}
    >
      {/* Live Toggle */}
      <button
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 6,
          border: isLive ? '1px solid #00d4aa' : '1px solid rgba(255,255,255,0.1)',
          background: isLive ? 'rgba(0, 212, 170, 0.1)' : 'rgba(255,255,255,0.05)',
          color: isLive ? '#00d4aa' : 'rgba(255,255,255,0.5)',
          fontSize: 12,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        {isLive ? <Zap size={14} /> : <ZapOff size={14} />}
        {isLive ? 'Live' : 'Live'}
      </button>

      {/* Ticker */}
      {isLive && showTicker && recentEvents.length > 0 && (
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            maxWidth: 300,
            overflow: 'hidden',
            maskImage: 'linear-gradient(to right, transparent, black 20px, black 95%, transparent)'
          }}
        >
          <Activity size={12} color="rgba(255,255,255,0.3)" />
          <div style={{ display: 'flex', gap: 8, overflow: 'hidden' }}>
            {recentEvents.slice(0, 3).map((event, index) => (
              <span
                key={event.id || index}
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.6)',
                  whiteSpace: 'nowrap',
                  animation: index === 0 ? 'fadeIn 0.3s ease' : 'none'
                }}
              >
                <span style={{ color: getEventColor(event.type), marginRight: 4 }}>
                  {getEventIcon(event.type)}
                </span>
                {event.author || 'Someone'}{' '}
                {event.type === 'note_created' ? 'created' : event.type === 'note_updated' ? 'updated' : 'linked'}{' '}
                <span style={{ color: '#00d4aa' }}>{event.title || 'a note'}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>
                  · {formatTime(event.timestamp || new Date())}
                </span>
              </span>
            ))}
          </div>
          <button
            onClick={() => setShowTicker(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.3)',
              cursor: 'pointer',
              padding: 2
            }}
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default NoteLiveStream;
