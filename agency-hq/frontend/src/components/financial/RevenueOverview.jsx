import { motion } from 'framer-motion'
import MoneyCounter from './MoneyCounter'
import { formatPercent } from '../../utils/formatters'
import financialData from '@mock/financial.json'

const KPI_CARDS = [
  {
    label: 'Total Revenue',
    key: 'totalRevenue',
    prefix: '$',
    color: '#00ff88',
    icon: '💰',
  },
  {
    label: 'Total Profit',
    key: 'totalProfit',
    prefix: '$',
    color: '#00d4ff',
    icon: '📈',
  },
  {
    label: 'Active Streams',
    key: 'activeStreams',
    prefix: '',
    color: '#ffb800',
    icon: '⚡',
  },
  {
    label: 'MoM Growth',
    key: 'momGrowth',
    prefix: '+',
    suffix: '%',
    color: '#9d4edd',
    icon: '🚀',
  },
]

export default function RevenueOverview() {
  const { overview } = financialData

  return (
    <div className="space-y-4">
      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {KPI_CARDS.map((kpi, i) => (
          <motion.div
            key={kpi.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass-panel p-4"
            style={{ borderColor: `${kpi.color}22` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="hq-label">{kpi.label}</span>
              <span className="text-base">{kpi.icon}</span>
            </div>
            <div className="font-mono font-bold text-2xl" style={{ color: kpi.color }}>
              <MoneyCounter
                target={overview[kpi.key]}
                prefix={kpi.prefix}
                suffix={kpi.suffix || ''}
                duration={1500}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Weekly target progress */}
      <div className="glass-panel p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="hq-label">Weekly Target Progress</div>
          <div className={`text-xs font-mono ${overview.targetHit ? 'text-neon-green' : 'text-neon-amber'}`}>
            {overview.targetHit ? '✓ TARGET HIT' : 'In Progress'}
          </div>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-1">
          <motion.div
            className="h-full rounded-full"
            style={{ background: overview.targetHit ? '#00ff88' : '#ffb800' }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((overview.weeklyActual / overview.weeklyTarget) * 100, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-white/30">
          <span>${overview.weeklyActual.toLocaleString()} actual</span>
          <span>${overview.weeklyTarget.toLocaleString()} target</span>
        </div>
      </div>
    </div>
  )
}
