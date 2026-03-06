import { motion } from 'framer-motion'
import healthData from '@mock/health.json'

export default function AppointmentIntel() {
  const { appointmentIntel } = healthData

  if (!appointmentIntel || appointmentIntel.length === 0) return null

  return (
    <div>
      <div className="hq-label mb-3">🩺 Appointment Intelligence</div>
      <div className="space-y-3">
        {appointmentIntel.map((appt, i) => (
          <motion.div
            key={appt.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-panel p-5"
            style={{ borderColor: 'rgba(255,107,107,0.12)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-medium text-white/90">{appt.appointment}</div>
                <div className="text-[10px] font-mono text-white/30 mt-0.5">{appt.date} at {appt.time}</div>
              </div>
              <span className="text-[9px] font-mono px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400/70 border border-amber-500/15">PREP BRIEF</span>
            </div>

            {/* Instructions */}
            <div className="mb-3">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1.5">Instructions</div>
              <ul className="space-y-1">
                {appt.prepBrief.instructions.map((inst, j) => (
                  <li key={j} className="text-xs text-white/50 leading-relaxed flex items-start gap-2">
                    <span className="text-white/20 mt-0.5">•</span>
                    {inst}
                  </li>
                ))}
              </ul>
            </div>

            {/* Bring data */}
            <div className="mb-3">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1.5">Data to Bring</div>
              <div className="flex flex-wrap gap-1.5">
                {appt.prepBrief.bringData.map((item, j) => (
                  <span key={j} className="text-[10px] px-2 py-1 rounded-lg bg-white/[0.04] text-white/50 border border-white/[0.06]">{item}</span>
                ))}
              </div>
            </div>

            {/* Questions */}
            <div className="mb-3">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1.5">Questions to Ask</div>
              <ol className="space-y-1">
                {appt.prepBrief.questionsToAsk.map((q, j) => (
                  <li key={j} className="text-xs text-white/50 leading-relaxed flex items-start gap-2">
                    <span className="text-smoke-blue/50 font-mono text-[10px] mt-0.5">{j+1}.</span>
                    {q}
                  </li>
                ))}
              </ol>
            </div>

            {/* Recent metrics */}
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-2">Recent Metrics to Share</div>
              <div className="flex gap-4">
                {Object.entries(appt.prepBrief.recentMetrics).map(([k, v]) => (
                  <div key={k} className="text-[10px] font-mono">
                    <span className="text-white/25 capitalize">{k.replace(/([A-Z])/g, ' $1')}: </span>
                    <span className="text-white/60">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
