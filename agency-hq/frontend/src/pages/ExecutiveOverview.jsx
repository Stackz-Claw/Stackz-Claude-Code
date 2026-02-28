import AgentStatusCard from '../components/executive/AgentStatusCard'
import OfficeChatFeed from '../components/chat/OfficeChatFeed'

export default function ExecutiveOverview() {
  return (
    <div className="h-full flex flex-col p-4 gap-4">
      {/* Header */}
      <div className="flex-shrink-0">
        <h2 className="text-xl font-display font-bold text-white">
          Executive <span className="neon-text-blue">Overview</span>
        </h2>
        <p className="text-xs text-white/30 font-mono mt-0.5">
          Direct access to Smoke & Stackz · Click cards to open menu
        </p>
      </div>

      {/* Split layout */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Smoke + Stackz side by side */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
          <AgentStatusCard agentId="smoke" />
          <AgentStatusCard agentId="stackz" />
        </div>

        {/* Live chat feed */}
        <div className="min-h-0">
          <OfficeChatFeed className="h-full" />
        </div>
      </div>
    </div>
  )
}
