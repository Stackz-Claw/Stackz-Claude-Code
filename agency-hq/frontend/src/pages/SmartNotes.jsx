import SmartNotesGraph from '../components/notes/SmartNotesGraph'

export default function SmartNotes() {
  return (
    <div className="h-full flex flex-col p-4 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-xl font-display font-bold text-white">
            Smart <span className="neon-text-amber">Notes Graph</span>
          </h2>
          <p className="text-xs text-white/30 font-mono mt-0.5">
            Agent knowledge network · Live connections
          </p>
        </div>
      </div>

      {/* Graph takes remaining space */}
      <div className="flex-1 min-h-0">
        <SmartNotesGraph />
      </div>
    </div>
  )
}
