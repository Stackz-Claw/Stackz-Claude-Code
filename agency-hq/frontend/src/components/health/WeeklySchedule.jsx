import { motion } from 'framer-motion'
import healthData from '@mock/health.json'

const TYPE_STYLES = {
  workout:  { bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.2)', dot: '#00ff88' },
  medical:  { bg: 'rgba(255,107,107,0.08)', border: 'rgba(255,107,107,0.2)', dot: '#ff6b6b' },
  nutrition:{ bg: 'rgba(255,184,0,0.08)', border: 'rgba(255,184,0,0.2)', dot: '#ffb800' },
  mental:   { bg: 'rgba(157,78,221,0.08)', border: 'rgba(157,78,221,0.2)', dot: '#9d4edd' },
  recovery: { bg: 'rgba(0,212,255,0.08)', border: 'rgba(0,212,255,0.2)', dot: '#00d4ff' },
  rest:     { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)', dot: '#ffffff55' },
}

export default function WeeklySchedule() {
  const { weeklySchedule } = healthData

  return (
    <div>
      <div className="hq-label mb-3">This Week</div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {weeklySchedule.map((s, i) => {
          const style = TYPE_STYLES[s.type] || TYPE_STYLES.rest
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex-shrink-0 w-40 rounded-xl p-3 border"
              style={{ background: style.bg, borderColor: style.border }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: style.dot }} />
                <span className="text-xs font-mono font-bold text-white/60">{s.day}</span>
                <span className="text-[10px] text-white/25 font-mono">{s.time}</span>
              </div>
              <div className="text-xs text-white/80 font-medium mb-1.5 leading-snug">{s.event}</div>
              <div className="text-[10px] text-white/30 leading-relaxed">{s.sheldonNote}</div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
