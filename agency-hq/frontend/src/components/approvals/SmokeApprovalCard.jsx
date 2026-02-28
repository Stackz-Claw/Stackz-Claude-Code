import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApprovalStore } from '../../store/approvalStore'
import { timeAgo } from '../../utils/formatters'

const DOMAIN_ICONS = {
  Medical: '🫀',
  Fitness: '💪',
  Nutrition: '🥗',
  'Mental Health': '🧠',
  Calendar: '📅',
  Finance: '💳',
}

const CONFIDENCE_COLOR = (c) => {
  if (c >= 90) return '#10B981'
  if (c >= 75) return '#F59E0B'
  return '#EF4444'
}

export default function SmokeApprovalCard({ item }) {
  const [note, setNote] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [action, setAction] = useState(null)
  const { approveSmoke, rejectSmoke, rescheduleSmoke } = useApprovalStore()

  const color = '#0EA5E9'
  const domainIcon = DOMAIN_ICONS[item.domain] || '⚡'

  const handleApprove = () => {
    setAction('approved')
    setTimeout(() => approveSmoke(item.id, note), 500)
  }

  const handleReject = () => {
    setAction('rejected')
    setTimeout(() => rejectSmoke(item.id, note), 500)
  }

  const handleReschedule = () => {
    setAction('reschedule')
    setTimeout(() => rescheduleSmoke(item.id, note), 500)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: action ? 0 : 1, y: action ? -16 : 0, scale: action ? 0.97 : 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border cursor-pointer"
      style={{ background: 'rgba(14, 165, 233, 0.04)', borderColor: 'rgba(14, 165, 233, 0.18)' }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-3.5">
        {/* Header row */}
        <div className="flex items-start gap-2.5 mb-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
            style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.25)' }}
          >
            {domainIcon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white/90 leading-snug">{item.title}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-mono" style={{ color }}>SMOKE · {item.domain}</span>
              <span className="text-white/20">·</span>
              <span className="text-[10px] text-white/35">{timeAgo(item.createdAt)}</span>
            </div>
          </div>
          <div className="flex-shrink-0 flex flex-col items-end gap-1">
            <div
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
              style={{ color: CONFIDENCE_COLOR(item.confidence), background: `${CONFIDENCE_COLOR(item.confidence)}15`, border: `1px solid ${CONFIDENCE_COLOR(item.confidence)}30` }}
            >
              {item.confidence}%
            </div>
            {item.syncBusConflict && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400">
                CONFLICT
              </span>
            )}
          </div>
        </div>

        {/* Sheldon note — always visible */}
        {item.sheldonNote && (
          <div
            className="rounded-lg px-3 py-2 mb-2.5 text-xs leading-relaxed"
            style={{ background: 'rgba(14,165,233,0.08)', borderLeft: '2px solid rgba(14,165,233,0.5)' }}
          >
            <span className="text-[10px] font-mono text-sky-400/70 block mb-0.5">SHELDON</span>
            <span className="text-sky-100/70 italic">"{item.sheldonNote}"</span>
          </div>
        )}

        {/* Metadata row */}
        <div className="grid grid-cols-2 gap-2 mb-2.5">
          <div className="rounded-lg p-2 bg-white/3">
            <div className="text-[9px] text-white/30 mb-0.5">CALENDAR IMPACT</div>
            <div className="text-[11px] text-white/65 leading-snug">{item.calendarImpact || 'None'}</div>
          </div>
          <div className="rounded-lg p-2 bg-white/3">
            <div className="text-[9px] text-white/30 mb-0.5">DATA SOURCE</div>
            <div className="text-[11px] text-white/65 leading-snug">{item.dataSource || '—'}</div>
          </div>
        </div>

        {/* Expanded description */}
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-2.5 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs text-white/55 leading-relaxed mb-2.5">{item.description}</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Override note (optional)..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white
                         placeholder-white/20 focus:outline-none focus:border-sky-400/30 resize-none"
              rows={2}
            />
          </motion.div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleApprove}
            className="flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-all"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16,185,129,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(16,185,129,0.1)'}
          >
            ✓ Approve
          </button>
          <button
            onClick={handleReschedule}
            className="flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-all"
            style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.25)', color: '#0EA5E9' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(14,165,233,0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(14,165,233,0.08)'}
          >
            ↺ Later
          </button>
          <button
            onClick={handleReject}
            className="flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-all"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#F87171' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
          >
            ✕ Reject
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
            className="px-3 py-1.5 rounded-lg bg-white/4 border border-white/8 text-white/35
                       hover:bg-white/8 transition-all text-xs font-mono"
          >
            {expanded ? '↑' : '↓'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
