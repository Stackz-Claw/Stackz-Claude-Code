import { motion } from 'framer-motion'
import { AGENT_PERSONALITIES } from '../../data/personalities'
import { formatTime } from '../../utils/formatters'

const BOSS_CONFIG = {
  name: 'The Boss',
  color: '#ffb800',
  avatar: '👑',
}

export default function ChatMessage({ message, isNew = false }) {
  const isBoss = message.agentId === 'boss'
  const personality = isBoss ? null : AGENT_PERSONALITIES[message.agentId]
  const color = isBoss ? BOSS_CONFIG.color : (personality?.color || '#00d4ff')
  const name = isBoss ? BOSS_CONFIG.name : (personality?.name || message.agentId)

  return (
    <motion.div
      initial={isNew ? { opacity: 0, x: -8, y: 8 } : false}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex gap-2.5 group ${isBoss ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
        style={{
          background: `${color}22`,
          border: `1px solid ${color}44`,
          color,
        }}
      >
        {isBoss ? '👑' : (personality?.avatar || name[0]?.toUpperCase())}
      </div>

      {/* Bubble */}
      <div className={`flex-1 max-w-[85%] ${isBoss ? 'flex flex-col items-end' : ''}`}>
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[11px] font-mono font-medium" style={{ color }}>
            {name}
          </span>
          <span className="text-[10px] text-white/20">
            {formatTime(message.timestamp)}
          </span>
          {message.type === 'health_update' && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 font-mono">
              HEALTH
            </span>
          )}
          {message.type === 'approval_trigger' && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-neon-amber/20 text-neon-amber font-mono">
              ACTION
            </span>
          )}
        </div>
        <div
          className={`
            px-3 py-2 rounded-xl text-sm text-white/85 leading-relaxed
            ${isBoss
              ? 'bg-neon-amber/10 border border-neon-amber/20 rounded-tr-sm'
              : 'bg-white/5 border border-white/8 rounded-tl-sm'}
          `}
        >
          {message.text}
        </div>
      </div>
    </motion.div>
  )
}
