import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import GlassPanel from '../components/layout/GlassPanel'
import AgentAvatar from '../components/AgentAvatar'
import ConfidenceArc from '../components/shared/ConfidenceArc'
import StatusChip from '../components/shared/StatusChip'
import { useApprovalInboxStore } from '../store/approvalInboxStore'
import DebatePanel from '../components/shared/DebatePanel'

const RISK_COLORS = { routine: '#14B8A6', elevated: '#F59E0B', high_stakes: '#EF4444' }
const RISK_LABELS = { routine: 'ROUTINE', elevated: 'ELEVATED', high_stakes: 'HIGH STAKES' }

function ApprovalCard({ item, onApprove, onReject, onModify, isResolved }) {
  const [expanded, setExpanded] = useState(false)
  const [showModify, setShowModify] = useState(false)
  const [modifyText, setModifyText] = useState('')
  const [showDebate, setShowDebate] = useState(false)

  const riskColor = RISK_COLORS[item.risk_level] || '#14B8A6'

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
      <GlassPanel className="p-4" neonAccent={isResolved ? 'purple' : 'blue'} hover={!isResolved}>
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <AgentAvatar agentId={item.agent_id} size="8" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-display font-semibold text-white/90">{item.title}</div>
            <div className="text-[10px] font-mono text-white/30 mt-0.5">{item.agent_name} · {item.team}</div>
          </div>
          <div className="flex items-center gap-2">
            <StatusChip label={RISK_LABELS[item.risk_level]} color={riskColor} />
            <ConfidenceArc value={item.confidence} size={40} />
          </div>
        </div>

        {/* Summary */}
        <p className="text-xs text-white/50 mb-3 leading-relaxed">{item.summary}</p>

        {/* Stackz recommendation */}
        <div className="p-2.5 rounded-lg bg-stackz-green/5 border border-stackz-green/15 mb-3">
          <div className="text-[9px] font-mono text-stackz-green/70 mb-1 tracking-wider">STACKZ SAYS</div>
          <p className="text-[11px] text-white/60 italic leading-relaxed">"{item.recommendation}"</p>
        </div>

        {/* Cost */}
        <div className="flex items-center gap-4 mb-3 text-[10px] font-mono text-white/30">
          <span>🪙 {item.estimated_cost.tokens.toLocaleString()} tokens</span>
          <span>💵 ${item.estimated_cost.api_cost.toFixed(2)}</span>
        </div>

        {/* Conflict / Debate */}
        {item.conflict && item.debate && (
          <button
            onClick={() => setShowDebate(!showDebate)}
            className="mb-3 w-full p-2 rounded-lg bg-amber-500/8 border border-amber-500/20 text-[10px] font-mono text-amber-400 hover:bg-amber-500/12 transition-colors text-left"
          >
            ⚡ Agent Conflict — {item.debate.agent_a.agent_id} vs {item.debate.agent_b.agent_id} — Click to view debate
          </button>
        )}

        <AnimatePresence>
          {showDebate && item.debate && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-3">
              <DebatePanel debate={item.debate} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expand context */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] font-mono text-white/20 hover:text-white/40 transition-colors mb-3"
        >
          {expanded ? '▾ Hide full context' : '▸ View full context'}
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="p-3 rounded-lg bg-black/30 text-[10px] font-mono text-white/35 whitespace-pre-wrap leading-relaxed mb-3">
                {item.full_context}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resolved info */}
        {isResolved && (
          <div className="flex items-center gap-2 pt-2 border-t border-white/5">
            <StatusChip
              label={item.status === 'approved' ? '✓ APPROVED' : item.status === 'rejected' ? '✗ REJECTED' : '✎ MODIFIED'}
              color={item.status === 'approved' ? '#10B981' : item.status === 'rejected' ? '#EF4444' : '#F59E0B'}
            />
            <span className="text-[9px] font-mono text-white/20">
              {new Date(item.resolved_at).toLocaleTimeString()}
            </span>
            {item.modify_instructions && (
              <span className="text-[9px] font-mono text-white/25 ml-2 italic">"{item.modify_instructions}"</span>
            )}
          </div>
        )}

        {/* Actions */}
        {!isResolved && (
          <div className="flex items-center gap-2 pt-3 border-t border-white/5">
            <button onClick={() => onApprove(item.id)} className="btn-gradient-green flex items-center gap-1.5 text-xs py-1.5 px-3">
              <span>✓</span> Approve
            </button>
            <button onClick={() => onReject(item.id)} className="px-3 py-1.5 rounded-lg bg-red-500/8 border border-red-500/20 text-red-400 text-xs font-mono hover:bg-red-500/15 transition-colors">
              <span>✗</span> Reject
            </button>
            <button
              onClick={() => setShowModify(!showModify)}
              className="px-3 py-1.5 rounded-lg bg-white/4 border border-white/8 text-white/40 text-xs font-mono hover:bg-white/6 hover:text-white/60 transition-colors"
            >
              Modify
            </button>
          </div>
        )}

        {/* Modify inline */}
        <AnimatePresence>
          {showModify && !isResolved && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="flex gap-2 mt-2">
                <input
                  value={modifyText}
                  onChange={e => setModifyText(e.target.value)}
                  placeholder="Add instructions before re-queuing..."
                  className="flex-1 px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-xs font-mono text-white/70 placeholder:text-white/20 focus:border-smoke-blue/30 focus:outline-none"
                />
                <button
                  onClick={() => { onModify(item.id, modifyText); setShowModify(false); setModifyText('') }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-mono hover:bg-amber-500/20 transition-colors"
                >
                  Send
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassPanel>
    </motion.div>
  )
}

export default function ApprovalInboxPage() {
  const { pending, resolved, approve, reject, modify, fetchApprovals } = useApprovalInboxStore()

  // Fetch approvals on mount
  useEffect(() => {
    fetchApprovals()
  }, [fetchApprovals])

  return (
    <div className="h-full overflow-y-auto p-6 space-y-5">
      <PageHeader
        title="Approval"
        accent="Inbox"
        accentColor="neon-text-blue"
        subtitle={`${pending.length} pending · ${resolved.length} resolved`}
      />

      {/* Pending */}
      <div className="space-y-4">
        <AnimatePresence>
          {pending.map(item => (
            <ApprovalCard key={item.id} item={item} onApprove={approve} onReject={reject} onModify={modify} isResolved={false} />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {pending.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl mb-3"
          >
            ✓
          </motion.div>
          <div className="text-white/30 font-display text-lg">All clear.</div>
          <div className="text-white/15 font-mono text-xs mt-1">Stackz is running clean.</div>
        </motion.div>
      )}

      {/* Resolved section */}
      {resolved.length > 0 && (
        <div>
          <div className="hq-label mb-3">Resolved</div>
          <div className="space-y-3 opacity-60">
            {resolved.map(item => (
              <ApprovalCard key={item.id + '_resolved'} item={item} isResolved />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}