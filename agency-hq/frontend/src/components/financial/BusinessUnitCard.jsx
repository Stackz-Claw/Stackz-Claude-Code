import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UnitBarChart } from './RevenueChart'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { AGENT_PERSONALITIES } from '../../data/personalities'

const TREND_ICONS = { up: '↑', down: '↓', steady: '→' }
const TREND_COLORS = { up: '#00ff88', down: '#ff6b6b', steady: '#ffb800' }

export default function BusinessUnitCard({ unit }) {
  const [expanded, setExpanded] = useState(false)
  const personality = AGENT_PERSONALITIES[unit.agentLead]
  const trendColor = TREND_COLORS[unit.trend]

  return (
    <motion.div layout className="glass-panel p-4">
      <div
        className="flex items-start justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <div className="text-sm font-medium text-white/90">{unit.name}</div>
          <div className="text-xs text-white/40 mt-0.5 font-mono">Lead: {personality?.name || unit.agentLead}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-mono font-bold text-neon-green">
            {formatCurrency(unit.revenue, true)}
          </div>
          <div className="flex items-center gap-1 justify-end">
            <span style={{ color: trendColor }} className="text-sm">{TREND_ICONS[unit.trend]}</span>
            <span className="text-xs font-mono" style={{ color: trendColor }}>
              {formatPercent(unit.margin)} margin
            </span>
          </div>
        </div>
      </div>

      {/* Profit/expense mini row */}
      <div className="flex gap-3 mt-3">
        <div className="flex-1 p-2 rounded-lg bg-neon-green/5 border border-neon-green/10">
          <div className="text-[10px] text-white/30 mb-0.5">Profit</div>
          <div className="text-xs font-mono text-neon-green">{formatCurrency(unit.profit)}</div>
        </div>
        <div className="flex-1 p-2 rounded-lg bg-red-500/5 border border-red-500/10">
          <div className="text-[10px] text-white/30 mb-0.5">Expenses</div>
          <div className="text-xs font-mono text-red-400">{formatCurrency(unit.expenses)}</div>
        </div>
        <div className="flex-1 p-2 rounded-lg bg-white/5">
          <div className="text-[10px] text-white/30 mb-0.5">Target</div>
          <div className="text-[10px] font-mono text-white/50 truncate">{unit.nextMilestone}</div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="mt-2 text-[11px] text-white/40 italic">"{unit.recentActivity}"</div>

      {/* Expanded chart */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 150, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-3"
          >
            <UnitBarChart data={unit.chart} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
