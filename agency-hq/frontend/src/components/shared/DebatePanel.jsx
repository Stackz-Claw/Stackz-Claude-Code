/**
 * DebatePanel — Two-column split for agent conflicts.
 * Agent A vs Agent B with Stackz synthesis.
 */
import AgentAvatar from '../AgentAvatar'
import ConfidenceArc from './ConfidenceArc'

export default function DebatePanel({ debate }) {
  if (!debate) return null
  const { agent_a, agent_b, stackz_synthesis } = debate

  return (
    <div className="rounded-xl bg-black/30 border border-amber-500/15 overflow-hidden">
      <div className="grid grid-cols-[1fr_auto_1fr]">
        {/* Agent A */}
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            <AgentAvatar agentId={agent_a.agent_id} size="6" />
            <span className="text-xs font-display font-medium text-white/80 capitalize">{agent_a.agent_id}</span>
          </div>
          <p className="text-[10px] text-white/50 leading-relaxed">{agent_a.position}</p>
          <div className="flex items-center gap-2">
            <ConfidenceArc value={agent_a.confidence} size={32} />
            <span className="text-[9px] font-mono text-white/25">{agent_a.action}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center px-2">
          <div className="w-px h-full bg-amber-500/15 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center">
              <span className="text-amber-400 text-[10px]">⚡</span>
            </div>
          </div>
        </div>

        {/* Agent B */}
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            <AgentAvatar agentId={agent_b.agent_id} size="6" />
            <span className="text-xs font-display font-medium text-white/80 capitalize">{agent_b.agent_id}</span>
          </div>
          <p className="text-[10px] text-white/50 leading-relaxed">{agent_b.position}</p>
          <div className="flex items-center gap-2">
            <ConfidenceArc value={agent_b.confidence} size={32} />
            <span className="text-[9px] font-mono text-white/25">{agent_b.action}</span>
          </div>
        </div>
      </div>

      {/* Stackz synthesis */}
      <div className="p-3 border-t border-amber-500/10 bg-stackz-green/3">
        <div className="text-[9px] font-mono text-stackz-green/60 tracking-wider mb-1">STACKZ'S TAKE</div>
        <p className="text-[11px] text-white/50 italic leading-relaxed">"{stackz_synthesis}"</p>
      </div>

      <div className="px-3 pb-2">
        <p className="text-[8px] font-mono text-white/15">Your decision overrides both agents and will be logged.</p>
      </div>
    </div>
  )
}
