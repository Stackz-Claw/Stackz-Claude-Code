import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import GlassPanel from '../components/layout/GlassPanel'
import StatusChip from '../components/shared/StatusChip'
import timelineData from '@mock/timeline.json'

const TYPE_CONFIG = {
  project_launched:    { label: 'PROJECT LAUNCHED',    color: '#10B981' },
  decision_made:       { label: 'DECISION MADE',       color: '#0EA5E9' },
  agent_deployed:      { label: 'AGENT DEPLOYED',      color: '#6366F1' },
  pivot:               { label: 'PIVOT',               color: '#F59E0B' },
  sentinel_flagged:    { label: 'SENTINEL FLAGGED',    color: '#EF4444' },
  approval_granted:    { label: 'APPROVAL GRANTED',    color: '#14B8A6' },
  approval_rejected:   { label: 'APPROVAL REJECTED',   color: '#EF4444' },
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'approvals', label: 'Approvals', types: ['approval_granted', 'approval_rejected'] },
  { key: 'projects', label: 'Projects', types: ['project_launched', 'pivot'] },
  { key: 'flags', label: 'Flags', types: ['sentinel_flagged'] },
  { key: 'financial', label: 'Financial', types: ['decision_made'] },
]

function TimelineEntry({ entry, index }) {
  const [expanded, setExpanded] = useState(false)
  const config = TYPE_CONFIG[entry.type] || { label: entry.type, color: '#94A3B8' }
  const date = new Date(entry.timestamp)

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="flex gap-4"
    >
      {/* Timeline stem */}
      <div className="flex flex-col items-center flex-shrink-0 w-8">
        <div
          className="w-3 h-3 rounded-full border-2 flex-shrink-0"
          style={{ borderColor: config.color, backgroundColor: `${config.color}20`, boxShadow: `0 0 8px ${config.color}30` }}
        />
        <div className="w-px flex-1 bg-white/5" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <StatusChip label={config.label} color={config.color} />
          <span className="text-[9px] font-mono text-white/20">
            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </span>
          {entry.cost != null && (
            <span className="text-[9px] font-mono text-white/15">${entry.cost.toFixed(2)}</span>
          )}
        </div>

        <p className="text-sm text-white/70 font-display leading-relaxed mb-2">{entry.summary}</p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[10px] font-mono text-white/20 hover:text-white/40 transition-colors"
          >
            {expanded ? '▾ Hide context' : '▸ View context'}
          </button>

          {(entry.type === 'decision_made' || entry.type === 'pivot') && (
            <button
              disabled
              className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/3 text-white/15 cursor-not-allowed"
              title="Coming soon — will restore full conversation context to Stackz"
            >
              ↩ Restore Context
            </button>
          )}
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-2 p-3 rounded-lg bg-black/30 text-[10px] font-mono text-white/35 whitespace-pre-wrap leading-relaxed">
                {entry.context}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function TimelinePage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const entries = timelineData.entries

  const filtered = activeFilter === 'all'
    ? entries
    : entries.filter(e => {
        const filter = FILTERS.find(f => f.key === activeFilter)
        return filter?.types?.includes(e.type)
      })

  return (
    <div className="h-full overflow-y-auto p-6 space-y-5">
      <PageHeader
        title="Semantic"
        accent="Timeline"
        accentColor="neon-text-blue"
        subtitle={`${entries.length} events · System decision history`}
      />

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-3 py-1 rounded-full text-[10px] font-mono transition-all duration-200 ${
              activeFilter === f.key
                ? 'bg-smoke-blue/15 border border-smoke-blue/30 text-smoke-blue'
                : 'bg-white/3 border border-white/6 text-white/30 hover:text-white/50 hover:bg-white/5'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <GlassPanel className="p-5" neonAccent="blue">
        <div className="space-y-0">
          {filtered.map((entry, i) => (
            <TimelineEntry key={entry.id} entry={entry} index={i} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-white/15 font-mono text-xs">No events match this filter</div>
          )}
        </div>
      </GlassPanel>
    </div>
  )
}
