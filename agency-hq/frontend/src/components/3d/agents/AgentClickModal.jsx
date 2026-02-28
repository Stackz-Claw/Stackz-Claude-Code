import { motion, AnimatePresence } from 'framer-motion'
import { useAgentStore } from '../../../store/agentStore'
import { AGENT_PERSONALITIES } from '../../../data/personalities'
import { timeAgo } from '../../../utils/formatters'

export default function AgentClickModal() {
  const { selectedAgent, clearSelectedAgent } = useAgentStore()

  if (!selectedAgent) return null

  const personality = AGENT_PERSONALITIES[selectedAgent.id]
  const color = personality?.color || '#00d4ff'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-80"
      >
        <div className="glass-panel p-5" style={{ borderColor: `${color}33` }}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
              style={{ background: `${color}22`, border: `1px solid ${color}44`, color }}
            >
              {selectedAgent.avatar}
            </div>
            <div>
              <div className="font-display font-bold text-white text-lg">{selectedAgent.name}</div>
              <div className="text-xs font-mono" style={{ color }}>{selectedAgent.role}</div>
            </div>
            <button
              onClick={clearSelectedAgent}
              className="ml-auto p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Personality */}
          <div className="mb-3 p-2.5 rounded-lg bg-white/5">
            <div className="hq-label mb-1">Personality</div>
            <p className="text-xs text-white/70 italic">"{selectedAgent.personality}"</p>
          </div>

          {/* Current Task */}
          <div className="mb-3">
            <div className="hq-label mb-1">Currently Working On</div>
            <p className="text-sm text-white/80">{selectedAgent.currentTask}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: 'Tasks Done', value: selectedAgent.stats?.tasksCompleted || '—' },
              { label: 'Approval Rate', value: selectedAgent.stats?.approvalRate ? `${selectedAgent.stats.approvalRate}%` : '—' },
              { label: 'Response', value: selectedAgent.stats?.responseTime || '—' },
            ].map((stat) => (
              <div key={stat.label} className="p-2 rounded-lg bg-white/5 text-center">
                <div className="font-mono font-bold text-white text-sm" style={{ color }}>{stat.value}</div>
                <div className="text-[10px] text-white/40 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Energy bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <div className="hq-label">Energy Level</div>
              <div className="text-xs font-mono" style={{ color }}>{selectedAgent.energyLevel}%</div>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: color }}
                initial={{ width: 0 }}
                animate={{ width: `${selectedAgent.energyLevel}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Last action */}
          <div className="text-xs text-white/40">
            <span className="text-white/20">Last action: </span>
            {selectedAgent.lastAction}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
