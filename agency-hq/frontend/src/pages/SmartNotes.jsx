import PageHeader from '../components/layout/PageHeader'
import SmartNotesGraph from '../components/notes/SmartNotesGraph'

export default function SmartNotes() {
  return (
    <div className="h-full flex flex-col p-6 gap-5">
      <PageHeader
        title="Smart"
        accent="Notes Graph"
        accentColor="neon-text-amber"
        subtitle="Agent knowledge network · Live connections"
      />

      {/* Graph takes remaining space */}
      <div className="flex-1 min-h-0">
        <SmartNotesGraph />
      </div>
    </div>
  )
}
