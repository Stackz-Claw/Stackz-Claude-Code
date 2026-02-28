import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PhaseTracker from './PhaseTracker'

const SECTIONS = [
  { id: 'section1_vision', label: 'Vision', shortLabel: '1. Vision', icon: '🎯' },
  { id: 'section2_market', label: 'Market', shortLabel: '2. Market', icon: '📊' },
  { id: 'section3_model', label: 'Model', shortLabel: '3. Model', icon: '💰' },
  { id: 'section4_execution', label: 'Execution', shortLabel: '4. Execution', icon: '🛠' },
  { id: 'section5_winStrategy', label: 'Win', shortLabel: '5. Win', icon: '⚔️' },
  { id: 'section6_selfImprovement', label: 'Log', shortLabel: '6. Log', icon: '📝' },
]

function Section1({ data }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4 bg-emerald-500/6 border border-emerald-500/18">
        <div className="text-[10px] font-mono text-emerald-400/70 mb-1">ONE LINER</div>
        <div className="text-base font-medium text-white/90 leading-relaxed">"{data.oneLiner}"</div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <InfoBlock label="The Problem" value={data.problem} />
        <InfoBlock label="The Solution" value={data.solution} />
        <InfoBlock label="Why Now" value={data.whyNow} />
      </div>
    </div>
  )
}

function Section2({ data }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <MetricBlock label="TAM" value={data.tam} color="#10B981" />
        <MetricBlock label="SAM" value={data.sam} color="#F59E0B" />
        <MetricBlock label="SOM" value={data.som} color="#0EA5E9" />
      </div>
      <div>
        <div className="text-[10px] font-mono text-white/35 mb-2">COMPETITIVE LANDSCAPE</div>
        <div className="space-y-2">
          {data.competitors?.map((c, i) => (
            <div key={i} className="rounded-lg p-2.5 bg-white/3 border border-white/8">
              <div className="text-xs font-medium text-white/75 mb-0.5">{c.name}</div>
              <div className="text-[11px] text-white/45 leading-relaxed">{c.gap}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Section3({ data }) {
  return (
    <div className="space-y-3">
      <InfoBlock label="Revenue Model" value={data.revenueModel} />
      {data.pricing && (
        <div>
          <div className="text-[10px] font-mono text-white/35 mb-2">PRICING TIERS</div>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(data.pricing).map(([tier, details]) => (
              <div key={tier} className="rounded-lg p-2.5 bg-white/3 border border-white/8 text-center">
                <div className="text-[10px] font-mono text-white/40 capitalize mb-1">{tier}</div>
                <div className="text-sm font-mono font-bold text-emerald-400">${details.price}<span className="text-[10px] text-white/35">/{details.period}</span></div>
                <div className="text-[10px] text-white/30 mt-0.5">{details.seats} seats</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {data.unitEconomics && (
        <div>
          <div className="text-[10px] font-mono text-white/35 mb-2">UNIT ECONOMICS</div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(data.unitEconomics).map(([k, v]) => (
              <div key={k} className="rounded-lg p-2 bg-white/3 border border-white/8">
                <div className="text-[9px] font-mono text-white/30 uppercase mb-0.5">{k.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div className="text-xs font-mono text-white/70">{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Section4({ data }) {
  return (
    <PhaseTracker phases={data.phases} />
  )
}

function Section5({ data }) {
  return (
    <div className="space-y-3">
      {data.moats && (
        <div>
          <div className="text-[10px] font-mono text-white/35 mb-2">MOATS</div>
          <div className="space-y-1.5">
            {data.moats.map((m, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-xs text-emerald-400 mt-0.5">⬡</span>
                <span className="text-xs text-white/65 leading-relaxed">{m}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {data.distribution && (
        <div>
          <div className="text-[10px] font-mono text-white/35 mb-2">DISTRIBUTION</div>
          <div className="space-y-1.5">
            {data.distribution.map((d, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-xs text-sky-400 mt-0.5">→</span>
                <span className="text-xs text-white/65 leading-relaxed">{d}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {data.unfairAdvantage && (
        <InfoBlock label="Unfair Advantage" value={data.unfairAdvantage} />
      )}
    </div>
  )
}

function Section6({ data }) {
  return (
    <div className="space-y-3">
      {data.revisions && (
        <div>
          <div className="text-[10px] font-mono text-white/35 mb-2">VERSION HISTORY</div>
          <div className="space-y-2">
            {data.revisions.map((r, i) => (
              <div key={i} className="rounded-lg p-2.5 bg-white/3 border border-white/8">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-white/50">{r.version}</span>
                  <span className="text-[10px] text-white/25">{r.date}</span>
                </div>
                <div className="text-[11px] text-white/60">{r.change}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {data.experiments && (
        <div>
          <div className="text-[10px] font-mono text-white/35 mb-2">EXPERIMENTS</div>
          <div className="space-y-1.5">
            {data.experiments.map((exp, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className={`text-[10px] mt-0.5 font-mono ${exp.result === 'win' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {exp.result === 'win' ? '✓' : '✕'}
                </span>
                <span className="text-[11px] text-white/60">{exp.name}: <span className="text-white/40">{exp.insight}</span></span>
              </div>
            ))}
          </div>
        </div>
      )}
      {data.lessons && (
        <div>
          <div className="text-[10px] font-mono text-white/35 mb-2">LESSONS LEARNED</div>
          <div className="space-y-1.5">
            {data.lessons.map((l, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-xs text-orange-400 mt-0.5">◆</span>
                <span className="text-[11px] text-white/60 leading-relaxed">{l}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function InfoBlock({ label, value }) {
  return (
    <div className="rounded-lg p-3 bg-white/3 border border-white/8">
      <div className="text-[10px] font-mono text-white/35 mb-1 uppercase">{label}</div>
      <div className="text-xs text-white/65 leading-relaxed">{value}</div>
    </div>
  )
}

function MetricBlock({ label, value, color }) {
  return (
    <div className="rounded-lg p-2.5 text-center" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
      <div className="text-[9px] font-mono mb-1" style={{ color: `${color}80` }}>{label}</div>
      <div className="text-[11px] font-mono font-medium leading-tight" style={{ color }}>{value}</div>
    </div>
  )
}

export default function BusinessPlanViewer({ startup, onClose }) {
  const { useStartupStore } = require('../../store/startupStore')
  const activePlanSection = useStartupStore((s) => s.activePlanSection)
  const setActivePlanSection = useStartupStore((s) => s.setActivePlanSection)

  if (!startup?.businessPlan) return null
  const plan = startup.businessPlan

  const SECTION_COMPONENTS = {
    section1_vision: <Section1 data={plan.section1_vision} />,
    section2_market: <Section2 data={plan.section2_market} />,
    section3_model: <Section3 data={plan.section3_model} />,
    section4_execution: <Section4 data={plan.section4_execution} />,
    section5_winStrategy: <Section5 data={plan.section5_winStrategy} />,
    section6_selfImprovement: <Section6 data={plan.section6_selfImprovement} />,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="rounded-2xl border overflow-hidden"
      style={{ background: 'rgba(16, 185, 129, 0.04)', borderColor: 'rgba(16, 185, 129, 0.2)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
        <div>
          <div className="text-sm font-medium text-white/90">{startup.name} — Business Plan</div>
          <div className="text-[10px] font-mono text-white/35">v{startup.planVersion} · Phase {startup.phase}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-md bg-white/5 border border-white/10 text-white/40
                       hover:bg-white/10 hover:text-white/70 transition-all text-xs flex items-center justify-center"
          >
            ✕
          </button>
        )}
      </div>

      {/* Section tabs */}
      <div className="flex gap-0 border-b border-white/8 overflow-x-auto">
        {SECTIONS.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActivePlanSection(sec.id)}
            className="flex-1 px-3 py-2.5 text-[11px] font-mono whitespace-nowrap transition-all relative"
            style={{
              color: activePlanSection === sec.id ? '#10B981' : 'rgba(255,255,255,0.35)',
              background: activePlanSection === sec.id ? 'rgba(16,185,129,0.08)' : 'transparent',
            }}
          >
            <span className="block">{sec.icon}</span>
            <span>{sec.label}</span>
            {activePlanSection === sec.id && (
              <motion.div
                layoutId="section-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ background: '#10B981' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Section content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePlanSection}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
          >
            {SECTION_COMPONENTS[activePlanSection] || (
              <div className="text-xs text-white/30 text-center py-6">Section not available</div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
