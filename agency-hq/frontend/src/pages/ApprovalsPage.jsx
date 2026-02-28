import { useApprovalStore } from '../store/approvalStore'
import ApprovalBoard from '../components/approvals/ApprovalBoard'
import IdeaSubmit from '../components/approvals/IdeaSubmit'

export default function ApprovalsPage() {
  const smokeCount = useApprovalStore((s) => s.smokeApprovals.length)
  const stackzCount = useApprovalStore((s) => s.stackzApprovals.length)

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-white">
            Approval <span className="neon-text-smoke">Board</span>
          </h2>
          <p className="text-xs text-white/30 font-mono mt-0.5">
            Personal requests · Business decisions · Decision history
          </p>
        </div>
        <div className="flex items-center gap-3 pb-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span className="text-[11px] font-mono text-sky-400">{smokeCount} smoke</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-mono text-emerald-400">{stackzCount} stackz</span>
          </div>
        </div>
      </div>

      {/* Idea submission */}
      <IdeaSubmit />

      {/* Dual stream approval board */}
      <ApprovalBoard />
    </div>
  )
}
