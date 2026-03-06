import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import healthData from '@mock/health.json'

function Section({ title, items, color, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-t border-white/[0.04] pt-3 first:border-0 first:pt-0">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left group">
        <span className="text-xs font-mono font-medium" style={{ color }}>{title}</span>
        <span className="text-white/20 text-xs transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <ul className="mt-2 space-y-1.5">
              {items.map((item, i) => (
                <li key={i} className="text-xs text-white/60 leading-relaxed pl-3 relative before:absolute before:left-0 before:top-[7px] before:w-1.5 before:h-1.5 before:rounded-full" style={{ '--dot-color': color }}>
                  <span className="absolute left-0 top-[7px] w-1.5 h-1.5 rounded-full" style={{ background: color, opacity: 0.5 }} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SheldonBrief() {
  const { sheldonBrief } = healthData

  return (
    <div>
      <div className="hq-label mb-3">Sheldon's Weekly Brief</div>
      <div className="glass-panel p-5 space-y-3" style={{ borderColor: 'rgba(14, 165, 233, 0.15)' }}>
        {/* Sheldon header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-smoke-blue/10 border border-smoke-blue/25 flex items-center justify-center text-sm font-bold text-smoke-blue" style={{ boxShadow: '0 0 15px rgba(14, 165, 233, 0.12)' }}>S</div>
          <div>
            <div className="text-xs font-mono text-smoke-blue font-bold tracking-wider">SHELDON — WEEKLY HEALTH BRIEF</div>
            <div className="text-[10px] text-white/30 font-mono">{sheldonBrief.weekLabel}</div>
          </div>
        </div>

        <Section title="✅ What Went Well" items={sheldonBrief.wentWell} color="#00ff88" defaultOpen={true} />
        <Section title="⚠️ What Slipped" items={sheldonBrief.slipped} color="#ff6b6b" defaultOpen={true} />

        <div className="border-t border-white/[0.04] pt-3">
          <div className="text-xs font-mono font-medium text-amber-400 mb-1">🎯 This Week's Focus</div>
          <div className="text-xs text-white/60 leading-relaxed">{sheldonBrief.focusThisWeek}</div>
        </div>

        <div className="border-t border-white/[0.04] pt-3">
          <div className="text-xs font-mono font-medium text-smoke-blue mb-1">💡 Recommendation</div>
          <div className="text-xs text-white/70 leading-relaxed bg-smoke-blue/5 rounded-lg p-3 border border-smoke-blue/10">{sheldonBrief.recommendation}</div>
        </div>
      </div>
    </div>
  )
}
