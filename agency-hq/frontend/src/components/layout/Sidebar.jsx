import { motion } from 'framer-motion'
import { useUIStore } from '../../store/uiStore'
import { useAgentStore } from '../../store/agentStore'
import { useApprovalStore } from '../../store/approvalStore'
import { AGENT_PERSONALITIES } from '../../data/personalities'

const NAV_ITEMS = [
  { id: 'office', label: 'Office World', icon: '🏢', shortcut: '1' },
  { id: 'executive', label: 'Executive View', icon: '⚡', shortcut: '2' },
  { id: 'financial', label: 'Financial', icon: '💰', shortcut: '3' },
  { id: 'health', label: 'Health & Life', icon: '🧬', shortcut: '4' },
  { id: 'notes', label: 'Smart Notes', icon: '🔗', shortcut: '5' },
  { id: 'approvals', label: 'Approvals', icon: '✅', shortcut: '6' },
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
    <div className="w-60 bg-hq-dark/80 backdrop-blur-md border-r border-white/5 flex flex-col flex-shrink-0 h-full">
      {/* Navigation */}
      <nav className="p-3 space-y-0.5">
        <div className="hq-label px-2 py-2">Navigation</div>
        {NAV_ITEMS.map((item, i) => {
          const isApprovals = item.id === 'approvals'
          const totalPending = smokeCount + stackzCount
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveView(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left
                transition-all duration-200 group relative
                ${activeView === item.id
                  ? 'bg-smoke-blue/10 border border-smoke-blue/30 text-white'
                  : 'hover:bg-white/5 text-white/50 hover:text-white/80 border border-transparent'}
              `}
            >
              <span className="text-sm">{item.icon}</span>
              <span className="font-display text-sm font-medium flex-1">{item.label}</span>
              {isApprovals && totalPending > 0 && (
                <span className="flex items-center gap-1">
                  {smokeCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-smoke-blue/20 border border-smoke-blue/40 text-sky-400 text-[9px] font-bold flex items-center justify-center">
                      {smokeCount}
                    </span>
                  )}
                  {stackzCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-stackz-green/20 border border-stackz-green/40 text-emerald-400 text-[9px] font-bold flex items-center justify-center">
                      {stackzCount}
                    </span>
                  )}
                </span>
              )}
              {!isApprovals && (
                <span className="text-[10px] font-mono text-white/20 group-hover:text-white/40">{item.shortcut}</span>
              )}
            </motion.button>
          )
        })}
      </nav>

      <div className="mx-3 border-t border-white/5 my-1" />

      {/* Executive Suite leads */}
      <div className="px-3 pb-1">
        <div className="hq-label px-2 py-2">Executive Suite</div>
        {leads.map((agent) => {
          const p = AGENT_PERSONALITIES[agent.id]
          return (
            <div key={agent.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: `${p?.color}22`, border: `1px solid ${p?.color}44`, color: p?.color }}
              >
                {agent.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white/80 truncate">{agent.name}</div>
                <div className="text-[10px] truncate" style={{ color: `${p?.color}99` }}>{agent.title}</div>
              </div>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-emerald-400" />
            </div>
          )
        })}
      </div>

      <div className="mx-3 border-t border-white/5 my-1" />

      {/* Team Leads */}
      <div className="flex-1 overflow-y-auto px-3 pb-2">
        <div className="hq-label px-2 py-2">Team Leads</div>
        <div className="space-y-0.5">
          {teamLeads.map((agent) => {
            const p = AGENT_PERSONALITIES[agent.id]
            return (
              <div
                key={agent.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
              >
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: `${p?.color}22`, border: `1px solid ${p?.color}44`, color: p?.color }}
                >
                  {agent.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white/70 truncate">{agent.name}</div>
                  <div className="text-[10px] text-white/25 truncate">{agent.title}</div>
                </div>
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: agent.status === 'active' ? '#10B981' : '#F59E0B' }}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="w-7 h-7 rounded-lg bg-warden-amber/10 border border-warden-amber/30 flex items-center justify-center">
            <span className="text-warden-amber text-xs font-bold">B</span>
          </div>
          <div>
            <div className="text-xs font-medium text-white/80">The Boss</div>
            <div className="text-[10px] text-warden-amber/60">You</div>
          </div>
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-stackz-green" />
        </div>
      </div>
    </div>
  )
}
