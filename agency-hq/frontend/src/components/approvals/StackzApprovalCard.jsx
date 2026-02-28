import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApprovalStore } from '../../store/approvalStore'
import { AGENT_PERSONALITIES } from '../../data/personalities'
import { timeAgo } from '../../utils/formatters'

const TEAM_COLORS = {
  marketing: '#EC4899',
  dev: '#6366F1',
  design: '#A78BFA',
  finance: '#22C55E',
  startup: '#F97316',
  hr: '#F59E0B',
  ops: '#14B8A6',
}

const RISK_CONFIG = {
  low: { color: '#10B981', label: 'LOW RISK' },
  medium: { color: '#F59E0B', label: 'MED RISK' },
  high: { color: '#EF4444', label: 'HIGH RISK' },
}

export default function StackzApprovalCard({ item }) {
  const [note, setNote] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [action, setAction] = useState(null)
  const { approveStackz, rejectStackz } = useApprovalStore()

  const color = '#10B981'
  const agentPersonality = AGENT_PERSONALITIES[item.agentId]
  const agentColor = agentPersonality?.color || TEAM_COLORS[item.team] || color
  const risk = RISK_CONFIG[item.riskLevel] || RISK_CONFIG.medium

  const handleApprove = () => {
    setAction('approved')
    setTimeout(() => approveStackz(item.id, note), 500)
  }

  const handleReject = () => {
    setAction('rejected')
    setTimeout(() => rejectStackz(item.id, note), 500)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: action ? 0 : 1, y: action ? -16 : 0, scale: action ? 0.97 : 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border cursor-pointer"
      style={{ background: 'rgba(16, 185, 129, 0.04)', borderColor: 'rgba(16, 185, 129, 0.18)' }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-3.5">
        {/* Header row */}
        <div className="flex items-start gap-2.5 mb-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: `${agentColor}15`, border: `1px solid ${agentColor}35`, color: agentColor }}
          >
            {agentPersonality?.avatar || item.agentId?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white/90 leading-snug">{item.title}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-mono capitalize" style={{ color: agentColor }}>
                {item.agentId || 'stackz'} · {item.team}
              </span>
              <span className="text-white/20">·</span>
              <span className="text-[10px] text-white/35">{timeAgo(item.createdAt)}</span>
            </div>
          </div>
          <div className="flex-shrink-0 flex flex-col items-end gap-1">
            <span
              className="text-[9px] font-mono px-2 py-0.5 rounded-full border"
              style={{ color: risk.color, borderColor: `${risk.color}40`, background: `${risk.color}12` }}
            >
              {risk.label}
            </span>
            <div className="text-[10px] font-mono text-white/40">{item.confidence}% conf</div>
          </div>
        </div>

        {/* Impact + cost row */}
        <div className="grid grid-cols-2 gap-2 mb-2.5">
          <div className="rounded-lg p-2 bg-white/3">
            <div className="text-[9px] text-white/30 mb-0.5">ESTIMATED IMPACT</div>
            <div className="text-[11px] font-mono" style={{ color }}>{item.estimatedImpact || '—'}</div>
          </div>
          <div className="rounded-lg p-2 bg-white/3">
            <div className="text-[9px] text-white/30 mb-0.5">COST</div>
            <div className="text-[11px] font-mono text-white/65">{item.cost || 'None'}</div>
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
              placeholder="Decision note (optional)..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white
                         placeholder-white/20 focus:outline-none focus:border-emerald-400/30 resize-none"
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
