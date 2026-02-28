import { motion } from 'framer-motion'

const PHASE_LABELS = ['Validate', 'Launch', 'Scale GTM', 'Product-Market Fit', 'Growth', 'Expand']

const STATUS_CONFIG = {
  complete: { color: '#10B981', label: 'Complete' },
  in_progress: { color: '#F59E0B', label: 'In Progress' },
  pending: { color: '#374151', label: 'Pending' },
}

export default function PhaseTracker({ phases, currentPhase, compact = false }) {
  if (!phases?.length) return null

  if (compact) {
    const current = phases.find((p) => p.status === 'in_progress') || phases[currentPhase - 1]
    const doneSteps = current?.steps?.filter((s) => s.done).length || 0
    const totalSteps = current?.steps?.length || 1
    const pct = Math.round((doneSteps / totalSteps) * 100)
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono text-white/40">Phase {current?.phase} — {current?.name}</span>
          <span className="text-[10px] font-mono text-amber-400">{pct}%</span>
        </div>
        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: '#F59E0B' }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Phase timeline */}
      <div className="flex items-center gap-0 mb-4">
        {phases.map((phase, i) => {
          const cfg = STATUS_CONFIG[phase.status] || STATUS_CONFIG.pending
          const isLast = i === phases.length - 1
          return (
            <div key={phase.phase} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 relative z-10"
                  style={{
                    background: `${cfg.color}18`,
                    borderColor: cfg.color,
                    color: cfg.color,
                  }}
                >
                  {phase.status === 'complete' ? '✓' : phase.phase}
                </motion.div>
                <div className="text-[9px] text-white/35 mt-1 text-center leading-tight w-14">
                  {phase.name}
                </div>
              </div>
              {!isLast && (
                <div className="flex-1 h-0.5 mx-1 -mt-4 relative">
                  <div className="absolute inset-0 bg-white/8 rounded-full" />
                  {phase.status === 'complete' && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: '#10B981' }}
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.5, delay: i * 0.1 + 0.3 }}
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Current phase steps */}
      {phases.filter((p) => p.status === 'in_progress').map((phase) => {
        const doneCount = phase.steps.filter((s) => s.done).length
        const totalCount = phase.steps.length
        const pct = Math.round((doneCount / totalCount) * 100)
        return (
          <div key={phase.phase} className="rounded-lg p-3 bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-amber-400">Phase {phase.phase}: {phase.name}</span>
              <span className="text-[10px] font-mono text-amber-400">{doneCount}/{totalCount} steps</span>
            </div>
            <div className="h-1.5 bg-white/8 rounded-full overflow-hidden mb-2.5">
              <motion.div
                className="h-full rounded-full bg-amber-500"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <div className="space-y-1">
              {phase.steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className="w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[8px] flex-shrink-0"
                    style={{
                      background: step.done ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${step.done ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'}`,
                      color: step.done ? '#10B981' : 'transparent',
                    }}
                  >
                    ✓
                  </div>
                  <span
                    className={`text-[11px] ${step.done ? 'text-white/50 line-through' : 'text-white/70'}`}
                  >
                    {step.step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
