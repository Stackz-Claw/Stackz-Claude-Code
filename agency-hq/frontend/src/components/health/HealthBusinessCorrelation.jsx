import { motion } from 'framer-motion'
import healthData from '@mock/health.json'

const QUALITY_COLORS = {
  strong:   '#00ff88',
  good:     '#00d4ff',
  weak:     '#ffb800',
  critical: '#ff6b6b',
}

export default function HealthBusinessCorrelation() {
  const { healthBusinessCorrelation: hbc } = healthData

  return (
    <div>
      <div className="hq-label mb-3">🔗 Health ↔ Business Correlation</div>
      <div className="glass-panel p-5" style={{ borderColor: 'rgba(0,212,255,0.1)' }}>
        {/* Insight callout */}
        <div className="p-3 rounded-lg bg-smoke-blue/[0.06] border border-smoke-blue/15 mb-4">
          <div className="text-xs text-white/60 leading-relaxed">{hbc.insight}</div>
        </div>

        {/* Correlation badges */}
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/30 font-mono">Sleep ↔ Output:</span>
            <span className="text-xs font-mono font-bold text-emerald-400">{hbc.correlationSleep}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/30 font-mono">Workouts ↔ Output:</span>
            <span className="text-xs font-mono font-bold text-sky-400">{hbc.correlationWorkouts}</span>
          </div>
        </div>

        {/* Weekly data */}
        <div className="space-y-2">
          {hbc.dataPoints.map((dp, i) => {
            const color = QUALITY_COLORS[dp.quality]
            return (
              <motion.div
                key={dp.week}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/[0.02]"
              >
                <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                <span className="text-xs font-mono text-white/40 w-16">{dp.week}</span>
                <div className="flex-1 grid grid-cols-4 gap-3 text-[10px] font-mono">
                  <div>
                    <span className="text-white/25">Sleep </span>
                    <span className="text-white/60">{dp.sleepAvg}hr</span>
                  </div>
                  <div>
                    <span className="text-white/25">Workouts </span>
                    <span className="text-white/60">{dp.workouts}</span>
                  </div>
                  <div>
                    <span className="text-white/25">Decisions </span>
                    <span className="text-white/60">{dp.decisionsCompleted}</span>
                  </div>
                  <div>
                    <span className="text-white/25">Revenue </span>
                    <span style={{ color }}>{dp.revenueIndex}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
