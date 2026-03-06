import PageHeader from '../components/layout/PageHeader'
import { useApprovalStore } from '../store/approvalStore'
import ApprovalBoard from '../components/approvals/ApprovalBoard'
import IdeaSubmit from '../components/approvals/IdeaSubmit'

export default function ApprovalsPage() {
  const smokeCount = useApprovalStore((s) => s.smokeApprovals.length)
  const stackzCount = useApprovalStore((s) => s.stackzApprovals.length)

  return (
    <div className="h-full overflow-y-auto p-6 space-y-5">
      <PageHeader
        title="Approval"
        accent="Board"
        accentColor="neon-text-smoke"
        subtitle="Personal requests · Business decisions · Decision history"
        actions={
          <>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span className="text-[11px] font-mono text-sky-400">{smokeCount} smoke</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-mono text-emerald-400">{stackzCount} stackz</span>
            </div>
          </>
        }
      />

      {/* Idea submission */}
      <IdeaSubmit />

      {/* Dual stream approval board */}
      <ApprovalBoard />
    </div>
  )
}
