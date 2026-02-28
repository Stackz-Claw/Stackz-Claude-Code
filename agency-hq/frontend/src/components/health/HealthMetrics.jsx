import { motion } from 'framer-motion'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import healthData from '@mock/health.json'

const METRIC_CONFIG = {
  sleep: { label: 'Sleep', icon: '😴', color: '#9d4edd' },
  activity: { label: 'Activity', icon: '⚡', color: '#00ff88' },
  nutrition: { label: 'Nutrition', icon: '🥗', color: '#ffb800' },
  mentalWellness: { label: 'Mental', icon: '🧘', color: '#00d4ff' },
}

function ScoreRing({ score, color, size = 80 }) {
  const r = (size / 2) - 8
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ filter: `drop-shadow(0 0 4px ${color}88)` }}
      />
    </svg>
  )
}

export default function HealthMetrics() {
  const { metrics } = healthData

  const radarData = Object.entries(METRIC_CONFIG).map(([key, cfg]) => ({
    subject: cfg.label,
    score: metrics[key]?.score || 0,
    fullMark: 100,
  }))

  return (
    <div className="space-y-4">
      {/* Score rings grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(METRIC_CONFIG).map(([key, cfg], i) => {
          const metric = metrics[key]
          const trendColor = metric.trend === 'up' ? '#00ff88' : metric.trend === 'down' ? '#ff6b6b' : '#ffb800'
          const trendIcon = metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="glass-panel p-4 flex flex-col items-center"
              style={{ borderColor: `${cfg.color}22` }}
            >
              <div className="relative">
                <ScoreRing score={metric.score} color={cfg.color} size={72} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-mono font-bold" style={{ color: cfg.color }}>
                    {metric.score}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-center">
                <div className="text-xs font-medium text-white/80">{cfg.icon} {cfg.label}</div>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                  <span style={{ color: trendColor }} className="text-xs">{trendIcon}</span>
                  <span className="text-[10px] text-white/30 font-mono">
                    {metric.weeklyChange > 0 ? '+' : ''}{metric.weeklyChange}
                    {metric.unit ? ` ${metric.unit}` : ''}
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Radar overview */}
      <div className="glass-panel p-4">
        <div className="hq-label mb-3">Weekly Health Radar</div>
        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace' }}
              />
              <Radar
                name="Health"
                dataKey="score"
                stroke="#9d4edd"
                fill="#9d4edd"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
