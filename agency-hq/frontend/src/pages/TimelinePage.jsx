import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import GlassPanel from '../components/layout/GlassPanel'
import StatusChip from '../components/shared/StatusChip'
import { useTimelineStore } from '../store/timelineStore'

const TYPE_CONFIG = {
  project_launched:    { label: 'PROJECT LAUNCHED',    color: '#10B981' },
  decision_made:       { label: 'DECISION MADE',       color: '#0EA5E9' },
  agent_deployed:      { label: 'AGENT DEPLOYED',      color: '#6366F1' },
  pivot:               { label: 'PIVOT',               color: '#F59E0B' },
  sentinel_flagged:    { label: 'SENTINEL FLAGGED',    color: '#EF4444' },
  approval_granted:    { label: 'APPROVAL GRANTED',    color: '#14B8A6' },
  approval_rejected:   { label: 'APPROVAL REJECTED',   color: '#EF4444' },
  note_created:        { label: 'NOTE CREATED',        color: '#8B5CF6' },
  note_updated:        { label: 'NOTE UPDATED',        color: '#A855F7' },
  revenue_received:    { label: 'REVENUE RECEIVED',    color: '#22C55E' },
  spend_authorized:    { label: 'SPEND AUTHORIZED',    color: '#10B981' },
  spend_declined:      { label: 'SPEND DECLINED',      color: '#EF4444' },
  agent_status_change: { label: 'STATUS CHANGE',       color: '#F97316' }
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'approvals', label: 'Approvals', types: ['approval_granted', 'approval_rejected'] },
  { key: 'agents', label: 'Agents', types: ['agent_deployed', 'agent_status_change'] },
  { key: 'notes', label: 'Notes', types: ['note_created', 'note_updated'] },
  { key: 'financial', label: 'Financial', types: ['revenue_received', 'spend_authorized', 'spend_declined', 'decision_made'] },
  { key: 'flags', label: 'Flags', types: ['sentinel_flagged'] },
]

function TimelineEntry({ entry, index }) {
  const [expanded, setExpanded] = useState(false)
  const config = TYPE_CONFIG[entry.type] || { label: entry.type?.replace(/_/g, ' '), color: '#94A3B8' }
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
          {entry.amount != null && (
            <span className="text-[9px] font-mono text-neon-green">${entry.amount}</span>
          )}
          {entry.agentId && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-smoke-blue/10 text-smoke-blue/70">
              {entry.agentId}
            </span>
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

          {entry.context && (
            <button
              disabled
              className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/3 text-white/15 cursor-not-allowed"
              title="Context available"
            >
              ↩ Restore Context
            </button>
          )}
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-2 p-3 rounded-lg bg-black/30 text-[10px] font-mono text-white/35 whitespace-pre-wrap leading-relaxed">
                {entry.context ? JSON.stringify(JSON.parse(entry.context), null, 2) : JSON.stringify(entry, null, 2)}
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
  const { entries, fetchEntries, stats, fetchStats, isLoading, lastUpdated } = useTimelineStore()

  useEffect(() => {
    fetchEntries()
    fetchStats()
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchEntries()
      fetchStats()
    }, 30000)
    return () => clearInterval(interval)
  }, [fetchEntries, fetchStats])

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
        subtitle={`${entries.length} events · ${stats?.today || 0} today · Live`}
        actions={
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-[10px] font-mono text-white/20">
                Updated {new Date(lastUpdated).toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={() => fetchEntries()}
              className="btn-primary text-xs flex items-center gap-2"
            >
              {isLoading ? '⟳' : '↻'} Refresh
            </button>
          </div>
        }
      />

      {/* Stats bar */}
      {stats && (
        <div className="flex items-center gap-4 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/8">
            <span className="text-white/30">Today:</span>
            <span className="text-white/70 ml-1 font-mono">{stats.today}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/8">
            <span className="text-white/30">Total:</span>
            <span className="text-white/70 ml-1 font-mono">{stats.total}</span>
          </div>
          {Object.entries(stats.byType || {}).slice(0, 3).map(([type, count]) => (
            <div key={type} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/8">
              <span className="text-white/30">{type.replace(/_/g, ' ')}:</span>
              <span className="text-white/70 ml-1 font-mono">{count}</span>
            </div>
          ))}
        </div>
      )}

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
        {isLoading && entries.length === 0 ? (
          <div className="text-center py-8 text-white/30 font-mono text-xs">Loading timeline...</div>
        ) : (
          <div className="space-y-0">
            {filtered.map((entry, i) => (
              <TimelineEntry key={entry.id} entry={entry} index={i} />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-8 text-white/15 font-mono text-xs">
                No events yet. Activity will appear here as it happens.
              </div>
            )}
          </div>
        )}
      </GlassPanel>
    </div>
  )
}