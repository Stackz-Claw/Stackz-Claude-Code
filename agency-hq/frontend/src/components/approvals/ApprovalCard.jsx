import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApprovalStore } from '../../store/approvalStore'
import { AGENT_PERSONALITIES } from '../../data/personalities'
import { RISK_COLORS } from '../../utils/colors'
import { timeAgo } from '../../utils/formatters'

export default function ApprovalCard({ item }) {
  const [note, setNote] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [action, setAction] = useState(null)
  const { approveItem, rejectItem } = useApprovalStore()

  const personality = AGENT_PERSONALITIES[item.agentId]
  const color = personality?.color || '#00d4ff'
  const riskColor = RISK_COLORS[item.riskLevel] || '#ffb800'

  const handleApprove = () => {
    setAction('approved')
    setTimeout(() => approveItem(item.id, note), 600)
  }

  const handleReject = () => {
    setAction('rejected')
    setTimeout(() => rejectItem(item.id, note), 600)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: action ? 0 : 1, y: action ? -20 : 0, scale: action ? 0.95 : 1 }}
      transition={{ duration: 0.3 }}
      className="glass-panel p-4 cursor-pointer"
      style={{ borderColor: `${color}22` }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Top row */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
          style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}
        >
          {item.agentName?.[0] || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white/90 leading-snug">{item.title}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-mono" style={{ color }}>{item.agentName}</span>
            <span className="text-white/20">·</span>
            <span className="text-[10px] text-white/40">{timeAgo(item.createdAt)}</span>
          </div>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end gap-1">
          <span
            className="text-[9px] font-mono px-2 py-0.5 rounded-full border"
            style={{ color: riskColor, borderColor: `${riskColor}44`, background: `${riskColor}11` }}
          >
            {item.riskLevel.toUpperCase()} RISK
          </span>
          <span className="text-[10px] text-white/40">{item.category}</span>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-1.5 rounded-lg bg-white/4">
          <div className="text-xs font-mono font-bold" style={{ color }}>{item.confidence}%</div>
          <div className="text-[9px] text-white/30">Confidence</div>
        </div>
        <div className="text-center p-1.5 rounded-lg bg-white/4">
          <div className="text-xs font-mono font-bold text-white/70">{item.riskScore}/10</div>
          <div className="text-[9px] text-white/30">Risk Score</div>
        </div>
        <div className="text-center p-1.5 rounded-lg bg-white/4">
          <div className="text-xs font-mono font-bold text-neon-green truncate">{item.estimatedImpact}</div>
          <div className="text-[9px] text-white/30">Impact</div>
        </div>
      </div>

      {/* Description (expanded) */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mb-3"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-xs text-white/60 leading-relaxed mb-3">{item.description}</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note (optional)..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white
                       placeholder-white/20 focus:outline-none focus:border-white/20 resize-none"
            rows={2}
          />
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleApprove}
          className="flex-1 py-2 bg-neon-green/10 border border-neon-green/30 text-neon-green rounded-lg
                     hover:bg-neon-green/20 transition-all text-xs font-mono font-medium"
        >
          ✓ Approve
        </button>
        <button
          onClick={handleReject}
          className="flex-1 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg
                     hover:bg-red-500/20 transition-all text-xs font-mono font-medium"
        >
          ✕ Reject
        </button>
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-3 py-2 bg-white/5 border border-white/10 text-white/40 rounded-lg
                     hover:bg-white/10 transition-all text-xs font-mono"
        >
          {expanded ? '↑' : '↓'}
        </button>
      </div>
    </motion.div>
  )
}
