import { motion } from 'framer-motion'
import healthData from '@mock/health.json'

const TREND_MAP = {
  improving: { icon: '↑', color: '#00ff88', label: 'Improving' },
  declining: { icon: '↓', color: '#ff6b6b', label: 'Declining' },
  stalled:   { icon: '→', color: '#ffb800', label: 'Stalled' },
}

export default function GoalsTracker() {
  const { goals } = healthData

  return (
    <div>
      <div className="hq-label mb-3">Active Goals</div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {goals.map((g, i) => {
          const trend = TREND_MAP[g.trend] || TREND_MAP.stalled
          const isStalled = g.trend === 'stalled' || g.trend === 'declining'

          return (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className="glass-panel p-4"
              style={{ borderColor: isStalled ? 'rgba(255, 184, 0, 0.2)' : 'rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{g.icon}</span>
                  <span className="text-sm font-medium text-white/90">{g.name}</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono" style={{ background: `${trend.color}15`, color: trend.color }}>
                  {trend.icon} {trend.label}
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-xl font-mono font-bold text-white">{g.current}</span>
                <span className="text-xs text-white/30 font-mono">/ {g.target} {g.unit}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-2">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: trend.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(g.progress, 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.06 }}
                />
              </div>

              <div className="text-[10px] text-white/35 leading-relaxed">{g.sheldonNote}</div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
