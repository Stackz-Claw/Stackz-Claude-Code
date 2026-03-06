import { motion } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import GlassPanel from '../components/layout/GlassPanel'
import ConfidenceArc from '../components/shared/ConfidenceArc'
import StatusChip from '../components/shared/StatusChip'
import radarData from '@mock/radar-signals.json'

const STAGES = [
  { key: 'raw_signal', label: 'Raw Signal', color: '#94A3B8' },
  { key: 'validated', label: 'Validated', color: '#0EA5E9' },
  { key: 'proposal_built', label: 'Proposal Built', color: '#6366F1' },
  { key: 'awaiting_approval', label: 'Awaiting Approval', color: '#F59E0B' },
  { key: 'active_project', label: 'Active Project', color: '#10B981' },
  { key: 'compounding', label: 'Compounding', color: '#F59E0B' },
]

const SOURCE_COLORS = {
  'GitHub Trending': '#6366F1',
  'X Signal': '#0EA5E9',
  'ProductHunt': '#EC4899',
  'Manual': '#94A3B8',
}

function SignalCard({ signal, isCompounding, isAwaiting }) {
  return (
    <div
      className={`rounded-xl p-3 backdrop-blur-xl transition-all duration-300 hover:translate-y-[-1px] ${isCompounding ? 'shimmer-overlay' : ''}`}
      style={{
        background: isCompounding ? 'rgba(245, 158, 11, 0.04)' : 'rgba(10, 14, 26, 0.5)',
        border: `1px solid ${isCompounding ? 'rgba(245, 158, 11, 0.2)' : 'rgba(148,163,184,0.06)'}`,
        boxShadow: isCompounding ? '0 0 20px rgba(245, 158, 11, 0.06)' : 'none',
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="text-xs font-display font-semibold text-white/90 leading-snug flex-1">{signal.title}</div>
        <ConfidenceArc value={signal.confidence} size={36} />
      </div>

      <div className="text-lg font-display font-bold text-white/70 mb-2">{signal.tam}</div>

      <p className="text-[10px] text-white/35 leading-relaxed mb-2">{signal.thesis}</p>

      <div className="flex items-center flex-wrap gap-1.5 mb-2">
        <StatusChip label={signal.source} color={SOURCE_COLORS[signal.source] || '#94A3B8'} small />
        <StatusChip label={signal.agent} color="#14B8A6" small />
        <span className="text-[8px] font-mono text-white/15">{signal.date}</span>
      </div>

      {isAwaiting && (
        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          <button className="btn-gradient-green text-[10px] py-1 px-2.5">✓ Approve</button>
          <button className="px-2.5 py-1 rounded-lg bg-red-500/8 border border-red-500/20 text-red-400 text-[10px] font-mono hover:bg-red-500/15 transition-colors">✗ Reject</button>
        </div>
      )}
    </div>
  )
}

export default function RadarPage() {
  const signals = radarData.signals

  return (
    <div className="h-full flex flex-col p-6 gap-5">
      <PageHeader
        title="Radar"
        accent="Signal Board"
        accentColor="neon-text-blue"
        subtitle={`${signals.length} signals tracked · Pipeline active`}
      />

      <div className="flex-1 min-h-0 overflow-x-auto">
        <div className="flex gap-4 h-full min-w-[1200px]">
          {STAGES.map(stage => {
            const stageSignals = signals.filter(s => s.stage === stage.key)
            const isCompounding = stage.key === 'compounding'
            const isAwaiting = stage.key === 'awaiting_approval'

            return (
              <div key={stage.key} className="flex-1 min-w-[180px] flex flex-col">
                <GlassPanel className="p-3 flex flex-col h-full min-h-0" neonAccent={isCompounding ? 'amber' : 'blue'} animate>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stage.color, boxShadow: `0 0 6px ${stage.color}40` }} />
                      <span className="hq-label">{stage.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-white/20">{stageSignals.length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {stageSignals.map(signal => (
                      <SignalCard key={signal.id} signal={signal} isCompounding={isCompounding} isAwaiting={isAwaiting} />
                    ))}
                    {stageSignals.length === 0 && (
                      <div className="text-center text-white/10 text-[10px] font-mono py-6">Empty</div>
                    )}
                  </div>
                </GlassPanel>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
