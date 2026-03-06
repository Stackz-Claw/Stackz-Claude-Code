import { motion } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import GlassPanel from '../components/layout/GlassPanel'
import tokenData from '@mock/token-economy.json'

function KPICard({ label, value, sub, accent = '#0EA5E9', delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <GlassPanel className="p-4" neonAccent="blue" hover>
        <div className="hq-label mb-1">{label}</div>
        <div className="text-2xl font-display font-bold" style={{ color: accent }}>{value}</div>
        {sub && <div className="text-[10px] font-mono text-white/25 mt-1">{sub}</div>}
      </GlassPanel>
    </motion.div>
  )
}

function TeamBar({ teams }) {
  const maxBudget = Math.max(...teams.map(t => t.budget))
  return (
    <div className="space-y-2">
      {teams.map(team => {
        const pct = (team.spent / team.budget) * 100
        const barColor = pct > 95 ? '#EF4444' : pct > 80 ? '#F59E0B' : team.color
        return (
          <div key={team.id} className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-white/40 w-20 truncate">{team.name}</span>
            <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden relative">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: barColor, boxShadow: `0 0 8px ${barColor}30` }}
              />
              <div
                className="absolute right-0 top-0 h-full border-r-2 border-dashed opacity-20"
                style={{ borderColor: team.color, left: `${(team.budget / Math.max(...teams.map(t => t.budget))) * 100}%` }}
              />
            </div>
            <span className="text-[9px] font-mono text-white/30 w-16 text-right">${team.spent} / ${team.budget}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function TokenEconomyPage() {
  const { overview, teams, agents, warnings } = tokenData
  const overBudget = overview.projected_month_end > overview.total_budget

  return (
    <div className="h-full overflow-y-auto p-6 space-y-5">
      <PageHeader
        title="Token"
        accent="Economy"
        accentColor="neon-text-purple"
        subtitle={`Month to date · Day ${overview.days_elapsed} of 31 · ${overview.days_remaining} days remaining`}
      />

      {/* Warnings */}
      {warnings.map((w, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[11px] font-mono text-amber-400/80"
          style={{ boxShadow: '0 0 20px rgba(245,158,11,0.05)' }}
        >
          ⚠ {w.message}
        </motion.div>
      ))}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Spent" value={`$${overview.total_spent.toFixed(2)}`} sub={`of $${overview.total_budget} budget`} accent="#0EA5E9" delay={0} />
        <KPICard label="Budget Remaining" value={`$${(overview.total_budget - overview.total_spent).toFixed(2)}`} sub={`${Math.round(((overview.total_budget - overview.total_spent) / overview.total_budget) * 100)}% remaining`} accent="#10B981" delay={0.05} />
        <KPICard label="Projected Month-End" value={`$${overview.projected_month_end.toFixed(2)}`} sub={overBudget ? '⚠ Over budget' : 'On track'} accent={overBudget ? '#EF4444' : '#14B8A6'} delay={0.1} />
        <KPICard label="Top Spender" value={overview.most_expensive_agent.id} sub={`$${overview.most_expensive_agent.spend.toFixed(2)} this month`} accent="#F59E0B" delay={0.15} />
      </div>

      {/* Team spend bar */}
      <GlassPanel className="p-4" neonAccent="purple" hover>
        <div className="hq-label mb-3">Spend by Team</div>
        <TeamBar teams={teams} />
      </GlassPanel>

      {/* Agent table */}
      <GlassPanel className="p-4 overflow-x-auto" neonAccent="blue">
        <div className="hq-label mb-3">Agent Breakdown</div>
        <table className="w-full text-[11px] font-mono">
          <thead>
            <tr className="text-white/25 border-b border-white/5">
              <th className="text-left py-2 pr-4">Agent</th>
              <th className="text-left py-2 pr-4">Team</th>
              <th className="text-right py-2 pr-4">Tasks</th>
              <th className="text-right py-2 pr-4">Tokens</th>
              <th className="text-right py-2 pr-4">Spend</th>
              <th className="text-right py-2">Avg/Task</th>
            </tr>
          </thead>
          <tbody>
            {agents.map(agent => (
              <tr key={agent.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                <td className="py-2 pr-4 text-white/70 capitalize">{agent.id}</td>
                <td className="py-2 pr-4 text-white/35">{agent.team}</td>
                <td className="py-2 pr-4 text-right text-white/50">{agent.tasks}</td>
                <td className="py-2 pr-4 text-right text-white/50">{agent.tokens.toLocaleString()}</td>
                <td className="py-2 pr-4 text-right text-white/60">${agent.spend.toFixed(2)}</td>
                <td className="py-2 text-right text-white/35">${agent.avg_per_task.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassPanel>
    </div>
  )
}
