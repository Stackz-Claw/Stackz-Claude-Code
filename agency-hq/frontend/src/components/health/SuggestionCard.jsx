import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApprovalStore } from '../../store/approvalStore'
import { timeAgo } from '../../utils/formatters'

const CATEGORY_COLORS = {
  Medical: '#9d4edd',
  Fitness: '#00ff88',
  Nutrition: '#ffb800',
  'Mental Health': '#00d4ff',
  Social: '#ff9f43',
}

export default function SuggestionCard({ suggestion }) {
  const [action, setAction] = useState(suggestion.status !== 'pending' ? suggestion.status : null)
  const { approveItem, rejectItem } = useApprovalStore()

  const color = CATEGORY_COLORS[suggestion.category] || '#00d4ff'

  const handleApprove = () => {
    setAction('approved')
    approveItem(suggestion.id)
  }

  const handleReject = () => {
    setAction('rejected')
    rejectItem(suggestion.id)
  }

  return (
    <motion.div
      layout
      className="glass-panel p-4"
      style={{ borderColor: `${color}25` }}
    >
      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        <span
          className="text-[9px] font-mono px-2 py-0.5 rounded-full border flex-shrink-0 mt-0.5"
          style={{ color, borderColor: `${color}44`, background: `${color}11` }}
        >
          {suggestion.category.toUpperCase()}
        </span>
        <div className="flex-1">
          <div className="text-sm font-medium text-white/90">{suggestion.title}</div>
          <div className="text-[10px] text-white/30 font-mono mt-0.5">{timeAgo(suggestion.createdAt)}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-xs font-mono font-bold" style={{ color }}>{suggestion.confidence}%</div>
          <div className="text-[9px] text-white/30">confidence</div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-white/60 leading-relaxed mb-3">{suggestion.description}</p>

      {/* Action */}
      {!action || action === 'pending' ? (
        <div className="flex gap-2">
          <button
            onClick={handleApprove}
            className="flex-1 py-1.5 bg-neon-green/10 border border-neon-green/30 text-neon-green rounded-lg
                       hover:bg-neon-green/20 transition-all text-xs font-mono"
          >
            ✓ Approve
          </button>
          <button
            onClick={handleReject}
            className="flex-1 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg
                       hover:bg-red-500/20 transition-all text-xs font-mono"
          >
            ✕ Reject
          </button>
          <button
            className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/40 rounded-lg
                       hover:bg-white/10 transition-all text-xs font-mono"
          >
            ↻
          </button>
        </div>
      ) : (
        <div
          className={`py-1.5 px-3 rounded-lg text-xs font-mono text-center
            ${action === 'approved' ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
        >
          {action === 'approved' ? '✓ Approved — Smoke is on it' : '✕ Rejected'}
        </div>
      )}
    </motion.div>
  )
}
