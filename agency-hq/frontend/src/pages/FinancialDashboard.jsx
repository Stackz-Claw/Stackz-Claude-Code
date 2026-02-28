import { motion } from 'framer-motion'
import RevenueOverview from '../components/financial/RevenueOverview'
import BusinessUnitCard from '../components/financial/BusinessUnitCard'
import { RevenueAreaChart } from '../components/financial/RevenueChart'
import GlassPanel from '../components/layout/GlassPanel'
import financialData from '@mock/financial.json'

// Stackz character reactor
function StackzReactor({ isPositive }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-neon-green/5 border border-neon-green/20">
      <div className="w-12 h-12 rounded-xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center text-2xl font-bold text-neon-green">
        $
      </div>
      <div>
        <div className="text-xs font-mono text-neon-green font-bold">STACKZ IS WATCHING</div>
        <div className="text-xs text-white/50 mt-0.5">
          {isPositive
            ? '"Revenue trending up. WE EAT. 📈 Keep this energy."'
            : '"Numbers dipped. Not acceptable. Pivoting NOW. Watch me fix this."'}
        </div>
      </div>
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="ml-auto text-2xl"
      >
        {isPositive ? '💰' : '😤'}
      </motion.div>
    </div>
  )
}

export default function FinancialDashboard() {
  const { businessUnits, revenueTimeline, overview } = financialData

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-white">
            Stackz <span className="neon-text-green">Financial HQ</span>
          </h2>
          <p className="text-xs text-white/30 font-mono mt-0.5">Revenue intelligence · Updated live</p>
        </div>
        <button className="btn-primary text-xs">
          Export Report ↓
        </button>
      </div>

      {/* Stackz reactor */}
      <StackzReactor isPositive={overview.targetHit} />

      {/* KPIs */}
      <RevenueOverview />

      {/* Revenue timeline chart */}
      <GlassPanel className="p-4" neonAccent="green">
        <div className="hq-label mb-3">Revenue Timeline — 7 Months</div>
        <div style={{ height: 220 }}>
          <RevenueAreaChart data={revenueTimeline} />
        </div>
      </GlassPanel>

      {/* Business units */}
      <div>
        <div className="hq-label mb-3">Business Units</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {businessUnits.map((unit) => (
            <BusinessUnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      </div>
    </div>
  )
}
