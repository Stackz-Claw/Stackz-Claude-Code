import { motion } from 'framer-motion'
import healthData from '@mock/health.json'

const KPI_CONFIG = [
  { key: 'weight', label: 'Weight', icon: '⚖️', color: '#00d4ff' },
  { key: 'activeMinutes', label: 'Active Min', icon: '⚡', color: '#00ff88' },
  { key: 'sleepScore', label: 'Sleep Score', icon: '😴', color: '#9d4edd' },
  { key: 'healthScore', label: 'Health Score', icon: '🧬', color: '#0ea5e9' },
]

function MiniRing({ value, max, color, size = 48 }) {
  const r = (size / 2) - 5
  const circ = 2 * Math.PI * r
  const pct = Math.min(value / max, 1)
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
      <motion.circle
        cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - pct * circ }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ filter: `drop-shadow(0 0 4px ${color}66)` }}
      />
    </svg>
  )
}

export default function HealthKPIStrip() {
  const { kpiOverview } = healthData

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {KPI_CONFIG.map((cfg, i) => {
        const d = kpiOverview[cfg.key]
        const trendIcon = d.trend === 'down' ? '↓' : d.trend === 'up' ? '↑' : '→'
        const trendColor = cfg.key === 'weight'
          ? (d.trend === 'down' ? '#00ff88' : '#ff6b6b')
          : (d.trend === 'up' ? '#00ff88' : d.trend === 'down' ? '#ff6b6b' : '#ffb800')

        return (
          <motion.div
            key={cfg.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-panel p-4"
            style={{ borderColor: `${cfg.color}18` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-white/40 uppercase tracking-wider">{cfg.icon} {cfg.label}</span>
              <MiniRing value={d.current} max={d.target * 1.2} color={cfg.color} />
            </div>
            <div className="text-2xl font-mono font-bold text-white">{d.current}<span className="text-sm text-white/30 ml-1">{d.unit}</span></div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono" style={{ color: trendColor }}>{trendIcon} {d.change > 0 ? '+' : ''}{d.change}</span>
              <span className="text-[10px] text-white/25">target: {d.target}</span>
            </div>
            <div className="text-[10px] text-white/30 mt-2 leading-relaxed">{d.sheldonNote}</div>
          </motion.div>
        )
      })}
    </div>
  )
}
