import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import healthData from '@mock/health.json'

const PRIORITY_STYLES = {
  high:   { bg: 'rgba(255,107,107,0.06)', border: 'rgba(255,107,107,0.2)', dot: '#ff6b6b' },
  medium: { bg: 'rgba(255,184,0,0.06)', border: 'rgba(255,184,0,0.2)', dot: '#ffb800' },
  low:    { bg: 'rgba(0,212,255,0.06)', border: 'rgba(0,212,255,0.2)', dot: '#00d4ff' },
}

export default function SuggestionQueue() {
  const { suggestionQueue } = healthData
  const [dismissed, setDismissed] = useState({})
  const [scheduled, setScheduled] = useState({})

  const visible = suggestionQueue.filter(s => !dismissed[s.id])

  if (visible.length === 0) return null

  return (
    <div>
      <div className="hq-label mb-3">💡 Sheldon's Suggestion Queue</div>
      <div className="space-y-3">
        <AnimatePresence>
          {visible.map((s, i) => {
            const style = PRIORITY_STYLES[s.priority] || PRIORITY_STYLES.medium
            const isScheduled = scheduled[s.id]

            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl p-4 border"
                style={{ background: style.bg, borderColor: style.border }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: style.dot }} />
                      <span className="text-sm font-medium text-white/90">{s.title}</span>
                    </div>
                    <div className="text-xs text-white/45 leading-relaxed mb-3">{s.description}</div>
                  </div>
                  <span className="text-[9px] text-white/20 font-mono whitespace-nowrap">{s.category}</span>
                </div>

                {isScheduled ? (
                  <div className="text-xs text-emerald-400/70 font-mono">✓ Scheduled</div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setScheduled(prev => ({ ...prev, [s.id]: true }))}
                      className="text-[10px] font-mono px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-400/80 hover:bg-emerald-500/25 transition-all active:scale-95"
                    >
                      📅 Schedule It
                    </button>
                    <button
                      onClick={() => setDismissed(prev => ({ ...prev, [s.id]: true }))}
                      className="text-[10px] font-mono px-3 py-1.5 rounded-lg border border-white/10 text-white/30 hover:bg-white/[0.04] hover:text-white/50 transition-all active:scale-95"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
