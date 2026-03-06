import { motion } from 'framer-motion'
import healthData from '@mock/health.json'

function ContributionGrid({ data, color = '#00ff88' }) {
  return (
    <div className="flex gap-[3px]">
      {data.map((val, i) => (
        <div
          key={i}
          className="w-[10px] h-[10px] rounded-[2px] transition-colors"
          style={{
            background: val ? `${color}` : 'rgba(255,255,255,0.04)',
            opacity: val ? 0.7 : 1,
          }}
          title={`Day ${i + 1}: ${val ? 'Done' : 'Missed'}`}
        />
      ))}
    </div>
  )
}

const STREAK_COLORS = {
  '🧘': '#9d4edd',
  '📵': '#ff6b6b',
  '💪': '#00ff88',
  '💧': '#00d4ff',
  '💊': '#ffb800',
}

export default function StreakTracker() {
  const { streaks } = healthData

  return (
    <div>
      <div className="hq-label mb-3">Streaks & Momentum</div>
      <div className="space-y-3">
        {streaks.map((s, i) => {
          const color = STREAK_COLORS[s.icon] || '#00d4ff'
          const isPerfect = s.current >= 20

          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-panel p-3"
              style={{ borderColor: isPerfect ? `${color}30` : undefined }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{s.icon}</span>
                  <span className="text-xs font-medium text-white/80">{s.habit}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-mono font-bold" style={{ color }}>{s.current}</div>
                    <div className="text-[9px] text-white/20 font-mono">day streak</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-white/30">{s.longest}</div>
                    <div className="text-[9px] text-white/15 font-mono">best</div>
                  </div>
                </div>
              </div>
              <ContributionGrid data={s.last30} color={color} />
              <div className="text-[10px] text-white/30 mt-2">{s.sheldonNote}</div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
