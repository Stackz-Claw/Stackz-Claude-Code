/**
 * PriorityBadge — Color-coded priority pill.
 * LOW (muted) / MEDIUM (blue) / HIGH (amber) / CRITICAL (red + pulse)
 */
const PRIORITY_CONFIG = {
  low:      { label: 'LOW',      bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)', text: 'text-white/40' },
  medium:   { label: 'MEDIUM',   bg: 'rgba(14,165,233,0.1)',  border: 'rgba(14,165,233,0.3)',  text: 'text-sky-400' },
  high:     { label: 'HIGH',     bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  text: 'text-amber-400' },
  critical: { label: 'CRITICAL', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   text: 'text-red-400' },
}

export default function PriorityBadge({ priority = 'medium' }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium
  const isCritical = priority === 'critical'

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider ${config.text} ${isCritical ? 'animate-pulse' : ''}`}
      style={{ background: config.bg, border: `1px solid ${config.border}` }}
    >
      {config.label}
    </span>
  )
}
