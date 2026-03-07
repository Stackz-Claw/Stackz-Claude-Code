/**
 * VaultHealthWidget - Floating health card for Smart Notes
 */

import React from 'react';

// Icons
import { Brain, AlertTriangle, Link, AlertCircle } from 'lucide-react';

const VaultHealthWidget = ({
  health = null,
  onViewDetails = () => {}
}) => {
  if (!health) {
    return null;
  }

  const { score, totalNotes, totalLinks, orphans = 0, conflicts = 0, status = 'good' } = health;

  // Determine health color
  const getHealthColor = (s) => {
    if (s >= 80) return '#00d4aa';
    if (s >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const healthColor = getHealthColor(score);

  // Calculate percentage
  const percentage = (score / 100) * 100;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        width: 220,
        background: 'rgba(10, 10, 15, 0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 16,
        zIndex: 20,
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Brain size={18} color={healthColor} />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
          Vault Health
        </span>
        <span style={{
          marginLeft: 'auto',
          fontSize: 18,
          fontWeight: 700,
          color: healthColor
        }}>
          {score}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            height: 6,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: '100%',
              background: healthColor,
              borderRadius: 3,
              transition: 'width 0.5s ease'
            }}
          />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 4,
          fontSize: 11,
          color: 'rgba(255,255,255,0.5)'
        }}>
          <span>0</span>
          <span style={{ color: healthColor, fontWeight: 500, textTransform: 'capitalize' }}>
            {status}
          </span>
          <span>100</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <Link size={12} />
          <span>{totalNotes} notes</span>
          <span>·</span>
          <span>{totalLinks} links</span>
        </div>
      </div>

      {/* Warnings */}
      {(orphans > 0 || conflicts > 0) && (
        <div style={{ marginBottom: 12 }}>
          {orphans > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              color: '#f59e0b',
              marginBottom: 4
            }}>
              <AlertTriangle size={12} />
              <span>{orphans} orphans</span>
            </div>
          )}
          {conflicts > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              color: '#ef4444'
            }}>
              <AlertCircle size={12} />
              <span>{conflicts} conflicts</span>
            </div>
          )}
        </div>
      )}

      {/* View Details button */}
      <button
        onClick={onViewDetails}
        style={{
          width: '100%',
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)',
          color: 'rgba(255,255,255,0.7)',
          fontSize: 12,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        View Details
      </button>
    </div>
  );
};

export default VaultHealthWidget;
