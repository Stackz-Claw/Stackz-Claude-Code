import { motion } from 'framer-motion'
import healthData from '@mock/health.json'

const IMPACT_STYLES = {
  positive: { dot: '#00ff88', bg: 'rgba(0,255,136,0.06)' },
  negative: { dot: '#ff6b6b', bg: 'rgba(255,107,107,0.06)' },
  neutral:  { dot: '#ffb800', bg: 'rgba(255,184,0,0.04)' },
}

const TYPE_ICONS = {
  biometric: '🫀',
  weight: '⚖️',
  sleep: '😴',
  workout: '💪',
  mental: '🧘',
  nutrition: '🥗',
}

export default function DataLog() {
  const { dataLog } = healthData

  return (
    <div>
      <div className="hq-label mb-3">📊 Data Log & History</div>
      <div className="glass-panel overflow-hidden">
        {dataLog.map((entry, i) => {
          const impact = IMPACT_STYLES[entry.impact] || IMPACT_STYLES.neutral
          const icon = TYPE_ICONS[entry.type] || '📋'

          return (
            <motion.div
              key={`${entry.date}-${entry.label}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-start gap-3 px-4 py-3 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors"
            >
              {/* Date column */}
              <div className="w-16 flex-shrink-0">
                <div className="text-[10px] font-mono text-white/25">{entry.date.slice(5)}</div>
              </div>

              {/* Icon + impact dot */}
              <div className="relative flex-shrink-0">
                <span className="text-sm">{icon}</span>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#0a0a12]" style={{ background: impact.dot }} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/80 font-medium">{entry.label}</span>
                  <span className="text-xs font-mono text-white/50">{entry.value}</span>
                  <span className="text-[10px] font-mono" style={{ color: impact.dot }}>{entry.change}</span>
                </div>
                <div className="text-[10px] text-white/30 mt-0.5 leading-relaxed">{entry.sheldonNote}</div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
