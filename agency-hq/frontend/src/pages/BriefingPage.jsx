import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import GlassPanel from '../components/layout/GlassPanel'
import { api } from '../lib/api'
import { useSocketEvent } from '../lib/socket'
import toast from '../lib/toast'

// Fallback mock data structure
const mockData = {
  generated_at: new Date().toISOString(),
  highest_leverage_action: 'Loading briefing data...',
  overnight_activity: { count: 0, highlights: [] },
  active_blockers: [],
  decisions_needed: { count: 0, urgent: [] },
  radar_found: [],
  financial_pulse: { revenue_mtd: '$0', burn_mtd: '$0', runway: 'N/A' },
}

function Section({ title, defaultOpen = false, children, accent }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-white/5 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-3 group">
        <span className="text-sm font-display font-semibold text-white/80 group-hover:text-white transition-colors">{title}</span>
        <span className="text-white/20 text-xs group-hover:text-white/40 transition-colors">{open ? '▾' : '▸'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function BriefingPage() {
  const [data, setData] = useState(mockData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBriefing()
  }, [])

  async function loadBriefing() {
    try {
      const briefing = await api.briefings.latest()
      if (briefing) {
        setData(briefing)
      }
    } catch (error) {
      console.error('Error loading briefing:', error)
      // Keep using mock data on error
    } finally {
      setLoading(false)
    }
  }

  async function handleRegenerate() {
    try {
      toast.info('Regenerating briefing...')
      // Would POST to create new briefing
      await loadBriefing()
      toast.success('Briefing updated')
    } catch (error) {
      toast.error('Failed to regenerate')
    }
  }

  // Listen for briefing updates
  useSocketEvent('briefing:updated', (update) => {
    loadBriefing()
    toast.info('New briefing available')
  })

  useSocketEvent('briefing:event', (event) => {
    toast.show(`${event.agent}: ${event.title}`, 'info')
  })

  const date = new Date(data.generated_at)
  const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-5">
      <PageHeader
        title="The"
        accent="Briefing"
        accentColor="neon-text-blue"
        actions={
          <button
            onClick={handleRegenerate}
            className="px-3 py-1.5 rounded-lg bg-white/4 border border-white/8 text-white/30 text-xs font-mono hover:bg-white/6 hover:text-white/50 transition-colors"
          >
            ↻ Regenerate
          </button>
        }
      />

      {/* Premium briefing card */}
      <GlassPanel className="relative overflow-hidden" neonAccent="blue">
        {/* Top glow border */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{
          background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.4) 30%, rgba(124,58,237,0.3) 60%, transparent)',
        }} />

        <div className="p-6">
          {/* Timestamp */}
          <div className="mb-6">
            <div className="text-lg font-display font-bold text-white/90">
              Briefing for {dateStr}
            </div>
            <div className="text-[10px] font-mono text-white/25 mt-1">Generated {timeStr}</div>
          </div>

          {/* Highest-Leverage Action — always visible */}
          <div className="p-4 rounded-xl bg-smoke-blue/5 border border-smoke-blue/15 mb-6" style={{ boxShadow: '0 0 30px rgba(14,165,233,0.05)' }}>
            <div className="text-[9px] font-mono text-smoke-blue/60 tracking-wider mb-1.5">TODAY'S HIGHEST-LEVERAGE ACTION</div>
            <p className="text-sm text-white/80 font-display leading-relaxed">{data.highest_leverage_action}</p>
          </div>

          {/* Sections */}
          <Section title={`📦 Overnight Activity (${data.overnight_activity?.count || 0} items)`} defaultOpen>
            <div className="space-y-2">
              {(data.overnight_activity?.highlights || []).map((h, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-smoke-blue/40 mt-1.5 flex-shrink-0" />
                  <span className="text-xs text-white/50 leading-relaxed">{h}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title={`🚨 Active Blockers (${data.active_blockers?.length || 0})`} defaultOpen>
            <div className="space-y-2">
              {(data.active_blockers || []).map((b, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-red-500/4 border border-red-500/12">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[8px] font-mono px-1.5 py-px rounded ${b.severity === 'critical' ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-400'}`}>
                      {(b.severity || 'normal').toUpperCase()}
                    </span>
                    <span className="text-[9px] font-mono text-white/25">{b.agent} · {b.team}</span>
                  </div>
                  <p className="text-xs text-white/50">{b.summary}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title={`🗳 Decisions Needed (${data.decisions_needed?.count || 0})`}>
            <div className="space-y-1.5">
              {(data.decisions_needed?.urgent || []).map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-amber-400/50 flex-shrink-0" />
                  <span className="text-xs text-white/50">{d}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title={`📡 Radar Found (${data.radar_found?.length || 0} signals)`}>
            <div className="space-y-2">
              {(data.radar_found || []).map((r, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/2">
                  <span className="text-xs text-white/50">{r.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-white/20">{r.source}</span>
                    <span className="text-[9px] font-mono text-teal-400">{r.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="💰 Financial Pulse">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-[9px] font-mono text-white/25 mb-1">Revenue MTD</div>
                <div className="text-lg font-display font-bold text-stackz-green">{data.financial_pulse?.revenue_mtd || '$0'}</div>
              </div>
              <div>
                <div className="text-[9px] font-mono text-white/25 mb-1">Burn MTD</div>
                <div className="text-lg font-display font-bold text-amber-400">{data.financial_pulse?.burn_mtd || '$0'}</div>
              </div>
              <div>
                <div className="text-[9px] font-mono text-white/25 mb-1">Runway</div>
                <div className="text-lg font-display font-bold text-white/70">{data.financial_pulse?.runway || 'N/A'}</div>
              </div>
            </div>
          </Section>
        </div>
      </GlassPanel>
    </div>
  )
}