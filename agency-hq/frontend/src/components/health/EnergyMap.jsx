import { motion } from 'framer-motion'
import healthData from '@mock/health.json'

function HeatmapCell({ value, max = 10 }) {
  const intensity = value / max
  const bg = intensity > 0.7 ? 'rgba(0,255,136,0.6)'
    : intensity > 0.5 ? 'rgba(0,255,136,0.35)'
    : intensity > 0.3 ? 'rgba(255,184,0,0.3)'
    : 'rgba(255,107,107,0.2)'

  return (
    <div
      className="rounded-[3px] w-full aspect-square"
      style={{ background: bg }}
      title={`Energy: ${value}/10`}
    />
  )
}

export default function EnergyMap() {
  const { energyMap } = healthData
  const hours = Array.from({ length: 18 }, (_, i) => i + 6) // 6am - 11pm

  return (
    <div>
      <div className="hq-label mb-3">⚡ Energy Map — Last 30 Days</div>
      <div className="glass-panel p-5" style={{ borderColor: 'rgba(0,255,136,0.1)' }}>
        {/* Hour labels */}
        <div className="grid gap-[3px] mb-1" style={{ gridTemplateColumns: '40px repeat(18, 1fr)' }}>
          <div />
          {hours.map(h => (
            <div key={h} className="text-[8px] text-white/20 font-mono text-center">
              {h > 12 ? `${h-12}p` : h === 12 ? '12p' : `${h}a`}
            </div>
          ))}
        </div>

        {/* Heatmap rows */}
        {energyMap.data.map((row, i) => (
          <motion.div
            key={row.day}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="grid gap-[3px] mb-[3px]"
            style={{ gridTemplateColumns: '40px repeat(18, 1fr)' }}
          >
            <div className="text-[10px] text-white/30 font-mono flex items-center">{row.day}</div>
            {row.hours.map((val, j) => (
              <HeatmapCell key={j} value={val} />
            ))}
          </motion.div>
        ))}

        {/* Legend */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/[0.04]">
          <span className="text-[10px] text-white/25">Low</span>
          {[0.2, 0.35, 0.5, 0.7, 0.9].map((v, i) => (
            <div key={i} className="w-3 h-3 rounded-[2px]" style={{ background: v > 0.7 ? 'rgba(0,255,136,0.6)' : v > 0.5 ? 'rgba(0,255,136,0.35)' : v > 0.3 ? 'rgba(255,184,0,0.3)' : 'rgba(255,107,107,0.2)' }} />
          ))}
          <span className="text-[10px] text-white/25">High</span>
        </div>

        {/* Peak hours highlight */}
        <div className="mt-3 p-3 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/15">
          <div className="text-xs font-mono text-emerald-400/80 mb-1">Peak Window: {energyMap.peakHours.map(h => `${h}${h >= 12 ? 'pm' : 'am'}`).join('–')}</div>
          <div className="text-[11px] text-white/50 leading-relaxed">{energyMap.insight}</div>
        </div>
      </div>
    </div>
  )
}
