import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import GlassPanel from '../components/layout/GlassPanel'
import PriorityBadge from '../components/shared/PriorityBadge'
import { AGENT_PERSONALITIES } from '../data/personalities'
import lanesData from '@mock/lanes.json'

function formatElapsed(ms) {
  if (!ms) return '—'
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  if (h > 0) return `${h}h ${m % 60}m`
  return `${m}m ${s % 60}s`
}

function LaneCard({ lane }) {
  const [expanded, setExpanded] = useState(false)
  const isBlocked = lane.status === 'blocked'
  const isCritical = lane.priority === 'critical'
  const fromAgent = AGENT_PERSONALITIES[lane.from_agent]
  const toAgent = AGENT_PERSONALITIES[lane.to_agent]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-xl p-3.5 backdrop-blur-xl transition-all duration-300 ${isCritical ? 'animate-pulse-slow' : ''}`}
      style={{
        background: isBlocked ? 'rgba(239, 68, 68, 0.04)' : 'rgba(10, 14, 26, 0.6)',
        border: `1px solid ${isBlocked ? 'rgba(239, 68, 68, 0.2)' : 'rgba(148, 163, 184, 0.08)'}`,
        boxShadow: isBlocked
          ? '0 0 20px rgba(239, 68, 68, 0.08), 0 4px 20px rgba(0,0,0,0.4)'
          : '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      {/* Header: priority + lane ID */}
      <div className="flex items-center justify-between mb-2">
        <PriorityBadge priority={lane.priority} />
        <button
          onClick={() => navigator.clipboard?.writeText(lane.lane_id)}
          className="text-[9px] font-mono text-white/20 hover:text-white/50 transition-colors cursor-pointer"
          title="Copy lane ID"
        >
          {lane.lane_id.slice(-8)}
        </button>
      </div>

      {/* Subject */}
      <div className="text-sm font-display font-medium text-white/90 mb-2 leading-snug">
        {lane.subject}
      </div>

      {/* Team flow */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
          style={{ background: `${fromAgent?.color || '#888'}15`, color: fromAgent?.color || '#888' }}>
          {lane.from_team}
        </span>
        <span className="text-white/20 text-[10px]">→</span>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
          style={{ background: `${toAgent?.color || '#888'}15`, color: toAgent?.color || '#888' }}>
          {lane.to_team}
        </span>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 text-[10px] font-mono text-white/30">
        {lane.elapsed_ms > 0 && (
          <span>⏱ {formatElapsed(lane.elapsed_ms)}</span>
        )}
        {lane.token_spend > 0 && (
          <span>🪙 {lane.token_spend.toLocaleString()}</span>
        )}
      </div>

      {/* Blocked reason */}
      {isBlocked && lane.blocked_reason && (
        <div className="mt-2 px-2 py-1 rounded-md bg-red-500/8 border border-red-500/20 text-[10px] font-mono text-red-400">
          ⚠ {lane.blocked_reason}
        </div>
      )}

      {/* Expand button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 text-[10px] font-mono text-white/25 hover:text-white/50 transition-colors"
      >
        {expanded ? '▾ Hide Context' : '▸ View Full Context'}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-2 rounded-lg bg-black/30 text-[10px] font-mono text-white/40 whitespace-pre-wrap leading-relaxed">
              {lane.context}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const COLUMNS = [
  { key: 'pending', label: 'Pending', count: 0 },
  { key: 'active', label: 'Active', count: 0 },
  { key: 'blocked', label: 'Blocked', count: 0 },
]

export default function LaneQueuePage() {
  const lanes = lanesData.lanes
  const grouped = {
    pending: lanes.filter(l => l.status === 'pending'),
    active: lanes.filter(l => l.status === 'active'),
    blocked: lanes.filter(l => l.status === 'blocked'),
  }

  return (
    <div className="h-full flex flex-col p-6 gap-5">
      <PageHeader
        title="Lane"
        accent="Queue Monitor"
        accentColor="neon-text-blue"
        subtitle={`${lanes.length} lanes · ${grouped.blocked.length} blocked · ${grouped.active.length} active`}
      />

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
        {COLUMNS.map(col => (
          <GlassPanel key={col.key} className="p-4 flex flex-col min-h-0" neonAccent={col.key === 'blocked' ? 'amber' : 'blue'} animate>
            <div className="flex items-center justify-between mb-3">
              <span className="hq-label">{col.label}</span>
              <span className="text-[10px] font-mono text-white/30">{grouped[col.key].length}</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {grouped[col.key].map(lane => (
                <LaneCard key={lane.lane_id} lane={lane} />
              ))}
              {grouped[col.key].length === 0 && (
                <div className="text-center text-white/15 text-xs font-mono py-8">No lanes</div>
              )}
            </div>
          </GlassPanel>
        ))}
      </div>
    </div>
  )
}
