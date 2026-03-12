import { motion } from 'framer-motion'
import { useUIStore } from '../../store/uiStore'
import { useAgentStore } from '../../store/agentStore'
import AgentAvatar from '../AgentAvatar'
import { useApprovalStore } from '../../store/approvalStore'
import { AGENT_PERSONALITIES } from '../../data/personalities'

const NAV_ITEMS = [
  // — Command —
  { id: 'briefing', label: 'The Briefing', icon: '📋', shortcut: '1' },
  { id: 'approval-inbox', label: 'Approval Inbox', icon: '🛡️', shortcut: '2', badge: true },
  { id: 'lanes', label: 'Lane Queue', icon: '📥', shortcut: '3' },
  // — Monitor —
  { id: 'agents', label: 'Agents', icon: '🤖', shortcut: '4' },
  { id: 'tokens', label: 'Token Economy', icon: '⚡', shortcut: '5' },
  { id: 'radar', label: 'Radar', icon: '📡', shortcut: '6' },
  // — Data —
  { id: 'financial', label: 'Financial', icon: '💰', shortcut: '7' },
  { id: 'health', label: 'Health & Life', icon: '🧬', shortcut: '8' },
  { id: 'notes', label: 'Smart Notes', icon: '🔗', shortcut: '9' },
  { id: 'timeline', label: 'Timeline', icon: '🕐', shortcut: '0' },
  { id: 'workflows', label: 'Workflows', icon: '⚙️', shortcut: '-' },
  // — Knowledge —
  { id: 'zettelkasten', label: 'Knowledge', icon: '🧠', shortcut: '=' },
  { id: 'ideas', label: 'Ideas', icon: '💡', shortcut: '[' },
  { id: 'vault', label: 'Vault', icon: '📚', shortcut: ']' },
  // — System —
  { id: 'settings', label: 'Settings', icon: '⚙️', shortcut: '\\' },
]

const DOMAIN_LEADS = [
  { id: 'smoke', label: 'Personal', color: '#0EA5E9' },
  { id: 'stackz', label: 'Business', color: '#10B981' },
]

export default function Sidebar() {
  const { activeView, setActiveView } = useUIStore()
  const agents = useAgentStore((s) => s.agents)
  const smokeCount = useApprovalStore((s) => s.smokeApprovals.length)
  const stackzCount = useApprovalStore((s) => s.stackzApprovals.length)

  const leads = agents.filter((a) => ['smoke', 'stackz'].includes(a.id))
  const teamLeads = agents.filter((a) => !['smoke', 'stackz'].includes(a.id))

  return (
    <div className="w-60 bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col flex-shrink-0 h-full relative">
      {/* Navigation */}
      <nav className="p-3 space-y-0.5">
        <div className="hq-label px-2 py-2">Navigation</div>
        {NAV_ITEMS.map((item, i) => {
          const isApprovals = item.id === 'approvals'
          const totalPending = smokeCount + stackzCount
          const isActive = activeView === item.id
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveView(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left
                transition-all duration-200 group relative overflow-hidden
                ${isActive
                  ? 'text-white border border-smoke-blue/20'
                  : 'hover:bg-white/4 text-white/45 hover:text-white/80 border border-transparent hover:translate-x-0.5'}
              `}
              style={isActive ? {
                background: 'linear-gradient(90deg, rgba(14, 165, 233, 0.08), transparent)',
              } : undefined}
            >
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                  style={{
                    background: 'linear-gradient(180deg, #0EA5E9, #7C3AED)',
                    boxShadow: '0 0 12px rgba(14, 165, 233, 0.5), 0 0 24px rgba(124, 58, 237, 0.2)',
                  }}
                />
              )}
              <span className="text-sm">{item.icon}</span>
              <span className="font-display text-sm font-medium flex-1">{item.label}</span>
              {isApprovals && totalPending > 0 && (
                <span className="flex items-center gap-1">
                  {smokeCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-smoke-blue/15 border border-smoke-blue/30 text-sky-400 text-[9px] font-bold flex items-center justify-center">
                      {smokeCount}
                    </span>
                  )}
                  {stackzCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-stackz-green/15 border border-stackz-green/30 text-emerald-400 text-[9px] font-bold flex items-center justify-center">
                      {stackzCount}
                    </span>
                  )}
                </span>
              )}
              {!isApprovals && (
                <span className="text-[10px] font-mono text-white/15 group-hover:text-white/30 transition-colors">{item.shortcut}</span>
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* Gradient divider */}
      <div className="mx-4 h-px my-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />

      {/* Executive Suite leads */}
      <div className="px-3 pb-1">
        <div className="hq-label px-2 py-2">Executive Suite</div>
        {leads.map((agent) => {
          const p = AGENT_PERSONALITIES[agent.id]
          return (
            <div
              key={agent.id}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/4 cursor-pointer transition-all duration-200 group"
            >
              <div className="relative">
                <AgentAvatar agentId={agent.id} size="7" />
                {/* Glow ring */}
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: `0 0 10px ${p?.color || '#0EA5E9'}40` }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white/80 truncate">{agent.name}</div>
                <div className="text-[10px] truncate" style={{ color: `${p?.color}80` }}>{agent.title}</div>
              </div>
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-emerald-400"
                style={{ boxShadow: '0 0 6px rgba(16, 185, 129, 0.4)' }}
              />
            </div>
          )
        })}
      </div>

      {/* Gradient divider */}
      <div className="mx-4 h-px my-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />

      {/* Team Leads */}
      <div className="flex-1 overflow-y-auto px-3 pb-2 relative">
        <div className="hq-label px-2 py-2">Team Leads</div>
        <div className="space-y-0.5">
          {teamLeads.map((agent) => {
            const p = AGENT_PERSONALITIES[agent.id]
            return (
              <div
                key={agent.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/4 cursor-pointer transition-all duration-200"
              >
                <AgentAvatar agentId={agent.id} size="6" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white/65 truncate">{agent.name}</div>
                  <div className="text-[10px] text-white/20 truncate">{agent.title}</div>
                </div>
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: agent.status === 'active' ? '#10B981' : '#F59E0B',
                    boxShadow: agent.status === 'active'
                      ? '0 0 6px rgba(16, 185, 129, 0.3)'
                      : '0 0 6px rgba(245, 158, 11, 0.3)',
                  }}
                />
              </div>
            )
          })}
        </div>
        <div className="sticky bottom-0 h-8 pointer-events-none" style={{ background: 'linear-gradient(transparent, rgba(6, 9, 16, 0.95))' }} />
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div
            className="w-7 h-7 rounded-lg bg-warden-amber/8 border border-warden-amber/25 flex items-center justify-center"
            style={{ boxShadow: '0 0 10px rgba(245, 158, 11, 0.1)' }}
          >
            <span className="text-warden-amber text-xs font-bold">B</span>
          </div>
          <div>
            <div className="text-xs font-medium text-white/80">The Boss</div>
            <div className="text-[10px] text-warden-amber/50">You</div>
          </div>
          <div
            className="ml-auto w-1.5 h-1.5 rounded-full bg-stackz-green"
            style={{ boxShadow: '0 0 6px rgba(16, 185, 129, 0.4)' }}
          />
        </div>
      </div>
    </div>
  )
}
