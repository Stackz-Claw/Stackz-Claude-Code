import { useEffect } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import RevenueOverview from '../components/financial/RevenueOverview'
import BusinessUnitCard from '../components/financial/BusinessUnitCard'
import { RevenueAreaChart } from '../components/financial/RevenueChart'
import GlassPanel from '../components/layout/GlassPanel'
import { useFinancialStore } from '../store/financialStore'
import financialData from '@mock/financial.json'

// Stackz character reactor
function StackzReactor({ isPositive, connected }) {
  return (
    <div className="relative flex items-center gap-3 p-4 rounded-xl bg-neon-green/4 border border-neon-green/15 overflow-hidden" style={{ boxShadow: '0 0 30px rgba(16, 185, 129, 0.06)' }}>
      {/* Ambient glow behind reactor */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 20% 50%, rgba(16, 185, 129, 0.08), transparent 70%)',
        }}
      />
      <div className="relative w-12 h-12 rounded-xl bg-neon-green/8 border border-neon-green/25 flex items-center justify-center text-2xl font-bold text-neon-green" style={{ boxShadow: '0 0 15px rgba(16, 185, 129, 0.15)' }}>
        {connected ? '$' : '⚠'}
      </div>
      <div className="relative flex-1">
        <div className="text-xs font-mono text-neon-green font-bold tracking-wider">
          {connected ? 'STRIPE CONNECTED' : 'OFFLINE MODE'}
        </div>
        <div className="text-xs text-white/50 mt-0.5">
          {connected
            ? isPositive
              ? '"Revenue trending up. WE EAT. 📈 Keep this energy."'
              : '"Numbers dipped. Not acceptable. Pivoting NOW. Watch me fix this."'
            : 'Add STRIPE_SECRET_KEY to .env for live data'}
        </div>
      </div>
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative ml-auto text-2xl"
      >
        {connected ? (isPositive ? '💰' : '😤') : '📴'}
      </motion.div>
    </div>
  )
}

// Live balance display
function StripeBalanceCard({ balance }) {
  if (!balance) return null

  return (
    <div className="p-3 rounded-lg bg-gradient-to-br from-smoke-blue/8 to-purple-500/8 border border-smoke-blue/20">
      <div className="text-[10px] font-mono text-smoke-blue/60 uppercase tracking-wider mb-1">Stripe Balance</div>
      <div className="text-2xl font-bold text-white">
        ${balance.available?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </div>
      <div className="text-xs text-white/40">
        {balance.pending > 0 && `+ $${balance.pending.toLocaleString()} pending`}
      </div>
    </div>
  )
}

export default function FinancialDashboard() {
  const { financialData, fetchFinancialData, stripeConnected, balance, isLoading } = useFinancialStore()

  useEffect(() => {
    fetchFinancialData()
    // Refresh every 30 seconds
    const interval = setInterval(fetchFinancialData, 30000)
    return () => clearInterval(interval)
  }, [fetchFinancialData])

  // Merge live data with mock data for display
  const { businessUnits, revenueTimeline, overview } = {
    ...financialData,
    ...financialData,
    businessUnits: financialData?.businessUnits || financialData?.businessUnits || [],
    revenueTimeline: financialData?.revenueTimeline || financialData?.revenueTimeline || [],
    overview: financialData?.overview || { targetHit: true }
  }

  const isPositive = overview?.targetHit || (financialData?.stripe?.revenue || 0) > (financialData?.burn?.current || 0)

  return (
    <div className="h-full overflow-y-auto p-6 space-y-5">
      <PageHeader
        title="Stackz"
        accent="Financial HQ"
        accentColor="neon-text-green"
        subtitle={stripeConnected ? "Live Stripe data · Updated 30s" : "Mock data · Add Stripe for live"}
        actions={
          <button
            onClick={fetchFinancialData}
            className="btn-primary text-xs flex items-center gap-2"
          >
            {isLoading ? '⟳' : '↻'} Refresh
          </button>
        }
      />

      {/* Stackz reactor */}
      <StackzReactor isPositive={isPositive} connected={stripeConnected} />

      {/* Live Stripe balance if connected */}
      {stripeConnected && balance && (
        <StripeBalanceCard balance={balance} />
      )}

      {/* KPIs */}
      <RevenueOverview />

      {/* Revenue timeline chart */}
      <GlassPanel className="p-4" neonAccent="green" hover>
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
