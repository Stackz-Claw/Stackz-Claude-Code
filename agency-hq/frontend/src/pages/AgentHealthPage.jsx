import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import GlassPanel from '../components/layout/GlassPanel'
import AgentAvatar from '../components/AgentAvatar'
import StatusChip from '../components/shared/StatusChip'
import { AGENT_PERSONALITIES } from '../data/personalities'
import healthData from '@mock/agent-health.json'

function formatTime(ms) {
  const m = Math.floor(ms / 60000)
  if (m >= 60) return `${Math.floor(m / 60)}h ${m % 60}m`
  return `${m}m`
}

const STATUS_CONFIG = {
  active: { label: 'ACTIVE', color: '#10B981', pulse: true },
  idle: { label: 'IDLE', color: '#94A3B8', pulse: false },
  error: { label: 'ERROR', color: '#EF4444', pulse: true },
  offline: { label: 'OFFLINE', color: '#334155', pulse: false },
}

function AgentHealthCard({ agent, isLead, teamColor }) {
  const p = AGENT_PERSONALITIES[agent.id]
  const status = STATUS_CONFIG[agent.status] || STATUS_CONFIG.idle
  const name = p?.name || p?.codename || agent.id

  return (
    <div
      className={`rounded-xl p-3 backdrop-blur-xl transition-all duration-300 hover:translate-y-[-1px] ${isLead ? 'col-span-full' : ''}`}
      style={{
        background: 'rgba(10, 14, 26, 0.5)',
        border: `1px solid ${isLead ? teamColor + '25' : 'rgba(148,163,184,0.06)'}`,
        boxShadow: isLead ? `0 0 20px ${teamColor}08` : 'none',
      }}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <AgentAvatar agentId={agent.id} size={isLead ? '9' : '7'} />
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-black ${status.pulse ? 'animate-pulse' : ''}`}
            style={{ backgroundColor: status.color, boxShadow: `0 0 6px ${status.color}60` }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-display font-semibold text-white/90 ${isLead ? 'text-sm' : 'text-xs'}`}>{name}</span>
            <StatusChip label={status.label} color={status.color} small />
          </div>
          {p?.title && <div className="text-[10px] text-white/25 font-mono mb-2">{p.title}</div>}

          {/* Metrics grid */}
          <div className={`grid gap-x-4 gap-y-1 text-[10px] font-mono ${isLead ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <div><span className="text-white/25">Uptime</span> <span className="text-white/60 ml-1">{agent.uptime}%</span></div>
            <div><span className="text-white/25">Tasks 7d</span> <span className="text-white/60 ml-1">{agent.tasks_7d}</span></div>
            <div><span className="text-white/25">Avg Time</span> <span className="text-white/60 ml-1">{formatTime(agent.avg_completion_ms)}</span></div>
            <div><span className="text-white/25">Errors</span> <span className={`ml-1 ${agent.error_rate > 2 ? 'text-red-400' : 'text-white/60'}`}>{agent.error_rate}%</span></div>
            <div><span className="text-white/25">Efficiency</span> <span className={`ml-1 ${agent.token_efficiency >= 85 ? 'text-emerald-400' : agent.token_efficiency >= 70 ? 'text-white/60' : 'text-amber-400'}`}>{agent.token_efficiency}</span></div>
            <div><span className="text-white/25">Last Active</span> <span className="text-white/40 ml-1">{new Date(agent.last_active).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BudgetBar({ used, allocated, color }) {
  const pct = Math.min(100, (used / allocated) * 100)
  const barColor = pct > 95 ? '#EF4444' : pct > 80 ? '#F59E0B' : color

  return (
    <div className="mt-2">
      <div className="flex justify-between text-[9px] font-mono text-white/30 mb-1">
        <span>Token Budget</span>
        <span>${used.toFixed(2)} / ${allocated}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: barColor, boxShadow: `0 0 8px ${barColor}40` }}
        />
      </div>
    </div>
  )
}

export default function AgentHealthPage() {
  const [collapsed, setCollapsed] = useState({})
  const teams = Object.entries(healthData.teams)

  const toggle = (key) => setCollapsed(s => ({ ...s, [key]: !s[key] }))

  return (
    <div className="h-full overflow-y-auto p-6 space-y-5">
      <PageHeader
        title="Agent"
        accent="Health Monitor"
        accentColor="neon-text-blue"
        subtitle={`${teams.length} teams · ${teams.reduce((sum, [, t]) => sum + t.agents.length, 0)} agents online`}
      />

      {teams.map(([teamKey, team]) => {
        const isCollapsed = collapsed[teamKey]
        const lead = team.agents[0]
        const subAgents = team.agents.slice(1)

        return (
          <GlassPanel key={teamKey} className="p-4" neonAccent="blue" animate>
            {/* Team header */}
            <button
              onClick={() => toggle(teamKey)}
              className="w-full flex items-center justify-between mb-3 group"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: team.color, boxShadow: `0 0 8px ${team.color}40` }} />
                <span className="text-sm font-display font-semibold text-white/90">{team.name}</span>
                <span className="text-[10px] font-mono text-white/25">{team.agents.length} agents</span>
              </div>
              <span className="text-white/20 text-xs group-hover:text-white/40 transition-colors">
                {isCollapsed ? '▸' : '▾'}
              </span>
            </button>

            <AnimatePresence>
              {!isCollapsed && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  {/* Lead card + budget */}
                  <AgentHealthCard agent={lead} isLead teamColor={team.color} />
                  <BudgetBar used={team.budget.used} allocated={team.budget.allocated} color={team.color} />

                  {/* Sub-agents grid */}
                  {subAgents.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                      {subAgents.map(agent => (
                        <AgentHealthCard key={agent.id} agent={agent} teamColor={team.color} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </GlassPanel>
        )
      })}
    </div>
  )
}
