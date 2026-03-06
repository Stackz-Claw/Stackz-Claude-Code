import { useState } from 'react'
import { motion } from 'framer-motion'
import healthData from '@mock/health.json'

const SEV_STYLES = {
  high:   { bg: 'rgba(255,107,107,0.06)', border: 'rgba(255,107,107,0.2)', badge: '#ff6b6b', label: 'HIGH' },
  medium: { bg: 'rgba(255,184,0,0.06)', border: 'rgba(255,184,0,0.2)', badge: '#ffb800', label: 'MED' },
  low:    { bg: 'rgba(0,212,255,0.06)', border: 'rgba(0,212,255,0.2)', badge: '#00d4ff', label: 'LOW' },
}

export default function ConflictDetector() {
  const { conflicts } = healthData
  const [resolved, setResolved] = useState({})

  if (conflicts.length === 0) return null

  return (
    <div>
      <div className="hq-label mb-3">⚡ Conflict Detector</div>
      <div className="space-y-3">
        {conflicts.map((c, i) => {
          const sev = SEV_STYLES[c.severity] || SEV_STYLES.medium
          const isResolved = resolved[c.id]

          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: isResolved ? 0.4 : 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl p-4 border"
              style={{ background: sev.bg, borderColor: sev.border }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white/90">{c.title}</span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full" style={{ background: `${sev.badge}20`, color: sev.badge }}>{sev.label}</span>
              </div>
              <div className="text-xs text-white/50 leading-relaxed mb-3">{c.description}</div>

              {!isResolved && (
                <>
                  <div className="text-[10px] text-white/30 mb-2">Sheldon recommends: <span className="text-white/50">{c.sheldonRecommendation}</span></div>
                  <div className="flex flex-wrap gap-2">
                    {c.options.map((opt, j) => (
                      <button
                        key={j}
                        onClick={() => setResolved(prev => ({ ...prev, [c.id]: opt }))}
                        className="text-[10px] font-mono px-3 py-1.5 rounded-lg border border-white/10 text-white/50 hover:bg-white/[0.06] hover:text-white/80 transition-all active:scale-95"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {isResolved && (
                <div className="text-xs text-emerald-400/60 font-mono">✓ Resolved: {resolved[c.id]}</div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
