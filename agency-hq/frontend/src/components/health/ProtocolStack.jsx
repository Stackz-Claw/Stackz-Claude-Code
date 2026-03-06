import { motion } from 'framer-motion'
import healthData from '@mock/health.json'

const STATUS_STYLES = {
  active:     { color: '#00ff88', label: 'Active', bg: 'rgba(0,255,136,0.08)' },
  struggling: { color: '#ff6b6b', label: 'Struggling', bg: 'rgba(255,107,107,0.08)' },
  paused:     { color: '#ffb800', label: 'Paused', bg: 'rgba(255,184,0,0.08)' },
}

export default function ProtocolStack() {
  const { protocolStack } = healthData

  return (
    <div>
      <div className="hq-label mb-3">📋 Protocol Stack</div>
      <div className="space-y-3">
        {protocolStack.map((p, i) => {
          const status = STATUS_STYLES[p.status] || STATUS_STYLES.active
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-panel p-4"
              style={{ borderColor: `${status.color}18` }}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-medium text-white/90">{p.name}</div>
                  <div className="text-[10px] text-white/25 font-mono mt-0.5">{p.category} · Started {p.startDate}</div>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full" style={{ background: status.bg, color: status.color }}>{status.label}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-2">
                <div>
                  <span className="text-[10px] text-white/25 block">Phase</span>
                  <span className="text-xs text-white/60 font-mono">{p.phase}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/25 block">Next Milestone</span>
                  <span className="text-xs text-white/60 font-mono">{p.nextMilestone}</span>
                </div>
              </div>

              <div className="text-[10px] text-white/35 leading-relaxed">{p.sheldonNote}</div>

              {p.conflict && (
                <div className="mt-2 p-2 rounded-lg bg-amber-500/[0.06] border border-amber-500/15">
                  <div className="text-[10px] text-amber-400/70">⚠ {p.conflict}</div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
