import { motion } from 'framer-motion'
import healthData from '@mock/health.json'

const SEV_STYLES = {
  warning:  { bg: 'rgba(255,184,0,0.06)', border: 'rgba(255,184,0,0.2)', icon: '⚠️', color: '#ffb800' },
  critical: { bg: 'rgba(255,107,107,0.06)', border: 'rgba(255,107,107,0.2)', icon: '🔴', color: '#ff6b6b' },
  info:     { bg: 'rgba(0,212,255,0.06)', border: 'rgba(0,212,255,0.2)', icon: 'ℹ️', color: '#00d4ff' },
}

export default function RecoveryAlert() {
  const { recoveryAlerts } = healthData

  if (!recoveryAlerts || recoveryAlerts.length === 0) return null

  return (
    <div>
      <div className="hq-label mb-3">🛡 Recovery Awareness</div>
      <div className="space-y-3">
        {recoveryAlerts.map((a, i) => {
          const sev = SEV_STYLES[a.severity] || SEV_STYLES.info
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl p-4 border"
              style={{ background: sev.bg, borderColor: sev.border }}
            >
              <div className="flex items-start gap-3">
                <span className="text-base mt-0.5">{sev.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white/90 mb-1">{a.title}</div>
                  <div className="text-xs text-white/50 leading-relaxed mb-2">{a.message}</div>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(a.metrics).map(([k, v]) => (
                      <div key={k} className="text-[10px] font-mono">
                        <span className="text-white/25">{k.replace(/([A-Z])/g, ' $1').trim()}: </span>
                        <span style={{ color: sev.color }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
