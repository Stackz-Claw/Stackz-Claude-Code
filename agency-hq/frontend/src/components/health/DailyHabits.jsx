import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import healthData from '@mock/health.json'

function CheckAnimation({ checked }) {
  return (
    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
      checked
        ? 'bg-emerald-500/20 border-emerald-400/60'
        : 'border-white/15 hover:border-white/30'
    }`}>
      <AnimatePresence>
        {checked && (
          <motion.svg
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            width="12" height="12" viewBox="0 0 12 12"
          >
            <motion.path
              d="M2 6L5 9L10 3"
              fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.25 }}
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function DailyHabits() {
  const { dailyHabits } = healthData
  const [checked, setChecked] = useState(() => {
    const map = {}
    ;[...dailyHabits.yesterdayIncomplete, ...dailyHabits.today].forEach(h => { map[h.id] = h.done })
    return map
  })

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  const total = dailyHabits.today.length
  const done = dailyHabits.today.filter(h => checked[h.id]).length

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="hq-label">Daily Habits</div>
        <span className="text-xs font-mono text-white/30">{done}/{total} complete</span>
      </div>

      <div className="glass-panel p-4 space-y-1">
        {/* Yesterday's incomplete */}
        {dailyHabits.yesterdayIncomplete.length > 0 && (
          <div className="mb-3">
            <div className="text-[10px] font-mono text-amber-400/70 uppercase tracking-wider mb-2">⚠ Incomplete from yesterday</div>
            {dailyHabits.yesterdayIncomplete.map(h => (
              <div key={h.id} onClick={() => toggle(h.id)} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-white/[0.03] cursor-pointer transition-colors border-l-2 border-amber-400/30">
                <CheckAnimation checked={checked[h.id]} />
                <div className="flex-1">
                  <span className={`text-sm ${checked[h.id] ? 'line-through text-white/25' : 'text-white/70'}`}>{h.label}</span>
                  <span className="text-[10px] text-white/20 ml-2">{h.source}</span>
                </div>
              </div>
            ))}
            <div className="border-t border-white/[0.04] mt-2" />
          </div>
        )}

        {/* Today's habits */}
        {dailyHabits.today.map((h, i) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => toggle(h.id)}
            className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-white/[0.03] cursor-pointer transition-colors"
          >
            <CheckAnimation checked={checked[h.id]} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-sm transition-all duration-300 ${checked[h.id] ? 'line-through text-white/25' : 'text-white/80'}`}>{h.label}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-white/20 font-mono">{h.time}</span>
                <span className="text-[10px] text-white/15">·</span>
                <span className="text-[10px] text-white/20">{h.source}</span>
              </div>
              {h.sheldonNote && !checked[h.id] && (
                <div className="text-[10px] text-amber-400/50 mt-0.5">💡 {h.sheldonNote}</div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Progress bar at bottom */}
        <div className="pt-3 mt-2 border-t border-white/[0.04]">
          <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-emerald-400/60"
              animate={{ width: `${(done / total) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
