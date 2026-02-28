import { motion } from 'framer-motion'
import healthData from '@mock/health.json'
import { formatDate } from '../../utils/formatters'

const CATEGORY_COLORS = {
  Fitness: '#00ff88',
  Nutrition: '#ffb800',
  Sleep: '#9d4edd',
  Medical: '#00d4ff',
  'Mental Health': '#a29bfe',
}

export default function LifeTimeline() {
  const { timeline } = healthData

  return (
    <div className="glass-panel p-4">
      <div className="hq-label mb-4">Life Optimization Timeline</div>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10" />

        <div className="space-y-4">
          {timeline.map((item, i) => {
            const color = CATEGORY_COLORS[item.category] || '#00d4ff'
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4 relative pl-8"
              >
                {/* Dot */}
                <div
                  className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full border-2"
                  style={{
                    borderColor: color,
                    background: item.impact === 'positive' ? color : 'transparent',
                    boxShadow: `0 0 8px ${color}66`,
                  }}
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
                      style={{ color, borderColor: `${color}44`, background: `${color}11` }}
                    >
                      {item.category}
                    </span>
                    <span className="text-[10px] text-white/25 font-mono">{formatDate(item.date)}</span>
                  </div>
                  <div className="text-xs text-white/70">{item.event}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
