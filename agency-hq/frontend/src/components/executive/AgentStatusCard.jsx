import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAgentStore } from '../../store/agentStore'
import { AGENT_PERSONALITIES } from '../../data/personalities'
import RadialMenu from './RadialMenu'

export default function AgentStatusCard({ agentId }) {
  const agent = useAgentStore((s) => s.agents.find((a) => a.id === agentId))
  const personality = AGENT_PERSONALITIES[agentId]
  const [menuOpen, setMenuOpen] = useState(false)

  if (!agent || !personality) return null

  const color = personality.color

  const moodEmoji = {
    focused: '🎯',
    hyped: '🔥',
    deep_focus: '🧠',
    grinding: '⚡',
    skeptical: '🤨',
    thinking: '💭',
    default: '💼',
  }

  return (
    <div className="relative">
      <motion.div
        className="glass-panel p-6 cursor-pointer select-none"
        style={{ borderColor: `${color}30` }}
        whileHover={{ scale: 1.01 }}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-xl opacity-10 pointer-events-none"
          style={{ background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)` }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-4 relative">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold"
              style={{ background: `${color}15`, border: `2px solid ${color}44`, color }}
            >
              {agent.avatar}
            </div>
            <div>
              <div className="text-xl font-display font-bold text-white">{agent.name}</div>
              <div className="text-xs font-mono mt-0.5" style={{ color }}>{agent.role}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl">{moodEmoji[agent.moodState] || moodEmoji.default}</div>
            <div className="text-[10px] text-white/30 font-mono mt-1">{agent.moodState}</div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-3 p-3 rounded-lg bg-white/5">
          <div className="hq-label mb-1">Currently Working On</div>
          <p className="text-sm text-white/80">{agent.currentTask}</p>
        </div>

        {/* Energy */}
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <div className="hq-label">Energy Level</div>
            <div className="text-xs font-mono" style={{ color }}>{agent.energyLevel}%</div>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
              initial={{ width: 0 }}
              animate={{ width: `${agent.energyLevel}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Stats */}
        {agent.stats && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: 'Completed', value: agent.stats.tasksCompleted },
              { label: 'Approval %', value: `${agent.stats.approvalRate}%` },
              { label: 'Avg Response', value: agent.stats.responseTime },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-2 rounded-lg bg-white/4">
                <div className="font-mono font-bold text-sm" style={{ color }}>{stat.value}</div>
                <div className="text-[9px] text-white/30 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Last action */}
        <div className="text-[11px] text-white/35 italic">
          Last: {agent.lastAction}
        </div>

        {/* Click hint */}
        <div className="mt-3 text-center text-[10px] text-white/20 font-mono">
          click to open menu
        </div>
      </motion.div>

      {/* Radial menu overlay */}
      {menuOpen && (
        <RadialMenu
          agentId={agentId}
          color={color}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </div>
  )
}
