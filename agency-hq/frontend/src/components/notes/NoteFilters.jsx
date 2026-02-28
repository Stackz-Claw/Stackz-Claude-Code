import { useNotesStore } from '../../store/notesStore'
import { AGENT_PERSONALITIES } from '../../data/personalities'

const CATEGORIES = ['all', 'Research', 'Revenue', 'Marketing', 'Operations', 'Risk', 'Strategy', 'Health']

export default function NoteFilters({ onAddNote }) {
  const { filter, setFilter } = useNotesStore()

  return (
    <div className="glass-panel p-3 flex flex-wrap items-center gap-2">
      {/* Agent filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="hq-label">Agent:</span>
        {['all', ...Object.keys(AGENT_PERSONALITIES)].map((agentId) => {
          const p = AGENT_PERSONALITIES[agentId]
          return (
            <button
              key={agentId}
              onClick={() => setFilter({ agentId })}
              className={`text-[10px] font-mono px-2 py-1 rounded transition-all ${
                filter.agentId === agentId
                  ? 'text-white border'
                  : 'text-white/30 border border-transparent hover:text-white/60'
              }`}
              style={filter.agentId === agentId && p ? {
                background: `${p.color}15`,
                borderColor: `${p.color}44`,
                color: p.color,
              } : {}}
            >
              {agentId === 'all' ? 'All' : (p?.name || agentId)}
            </button>
          )
        })}
      </div>

      <div className="w-px h-4 bg-white/10" />

      {/* Category filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="hq-label">Category:</span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter({ category: cat })}
            className={`text-[10px] font-mono px-2 py-1 rounded transition-all ${
              filter.category === cat
                ? 'bg-neon-blue/20 border border-neon-blue/40 text-neon-blue'
                : 'text-white/30 border border-transparent hover:text-white/60'
            }`}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      <div className="ml-auto">
        <button onClick={onAddNote} className="btn-primary text-xs">
          + Add Note
        </button>
      </div>
    </div>
  )
}
