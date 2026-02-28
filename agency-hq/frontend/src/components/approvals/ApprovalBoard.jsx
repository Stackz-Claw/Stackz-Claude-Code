import { AnimatePresence } from 'framer-motion'
import { useApprovalStore } from '../../store/approvalStore'
import SmokeApprovalCard from './SmokeApprovalCard'
import StackzApprovalCard from './StackzApprovalCard'
import { timeAgo } from '../../utils/formatters'

function EmptyState({ color, label }) {
  return (
    <div
      className="rounded-xl border p-6 text-center"
      style={{ background: `${color}05`, borderColor: `${color}18` }}
    >
      <div className="text-2xl mb-2">✓</div>
      <div className="text-xs font-mono text-white/30">{label} — all clear</div>
    </div>
  )
}

function StreamHeader({ color, label, count, subtitle }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="font-display text-sm font-semibold text-white/90">{label}</span>
        </div>
        <div className="text-[10px] text-white/35 font-mono mt-0.5 ml-4">{subtitle}</div>
      </div>
      {count > 0 && (
        <span
          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
          style={{ color, background: `${color}18`, border: `1px solid ${color}35` }}
        >
          {count} pending
        </span>
      )}
    </div>
  )
}

export default function ApprovalBoard({ compact = false }) {
  const smokeApprovals = useApprovalStore((s) => s.smokeApprovals)
  const stackzApprovals = useApprovalStore((s) => s.stackzApprovals)
  const history = useApprovalStore((s) => s.history)

  if (compact) {
    const all = [...smokeApprovals.slice(0, 2), ...stackzApprovals.slice(0, 2)].slice(0, 4)
    return (
      <div className="space-y-2">
        {all.map((item) =>
          item.stream === 'smoke'
            ? <SmokeApprovalCard key={item.id} item={item} />
            : <StackzApprovalCard key={item.id} item={item} />
        )}
        {all.length === 0 && (
          <div className="text-center py-6 text-white/20 text-sm font-mono">
            All clear — no pending approvals
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Dual stream columns */}
      <div className="grid grid-cols-2 gap-4">
        {/* Smoke stream — personal/health */}
        <div>
          <StreamHeader
            color="#0EA5E9"
            label="Smoke Stream"
            subtitle="Personal · Health · Calendar"
            count={smokeApprovals.length}
          />
          <AnimatePresence>
            <div className="space-y-2.5">
              {smokeApprovals.map((item) => (
                <SmokeApprovalCard key={item.id} item={item} />
              ))}
            </div>
          </AnimatePresence>
          {smokeApprovals.length === 0 && (
            <EmptyState color="#0EA5E9" label="Smoke" />
          )}
        </div>

        {/* Stackz stream — business */}
        <div>
          <StreamHeader
            color="#10B981"
            label="Stackz Stream"
            subtitle="Business · Teams · Ops"
            count={stackzApprovals.length}
          />
          <AnimatePresence>
            <div className="space-y-2.5">
              {stackzApprovals.map((item) => (
                <StackzApprovalCard key={item.id} item={item} />
              ))}
            </div>
          </AnimatePresence>
          {stackzApprovals.length === 0 && (
            <EmptyState color="#10B981" label="Stackz" />
          )}
        </div>
      </div>

      {/* Decision history */}
      {history.length > 0 && (
        <div>
          <div className="hq-label mb-3">Recent Decisions</div>
          <div className="space-y-1.5">
            {history.slice(0, 6).map((item) => {
              const isSmoke = item.stream === 'smoke'
              const streamColor = isSmoke ? '#0EA5E9' : '#10B981'
              const statusColor =
                item.status === 'approved' ? '#10B981'
                : item.status === 'reschedule' ? '#0EA5E9'
                : '#EF4444'
              const statusLabel =
                item.status === 'approved' ? '✓'
                : item.status === 'reschedule' ? '↺'
                : '✕'
              return (
                <div
                  key={item.id}
                  className="rounded-lg border px-3 py-2 flex items-center gap-3"
                  style={{ background: `${streamColor}04`, borderColor: `${streamColor}15` }}
                >
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                    style={{ background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30` }}
                  >
                    {statusLabel}
                  </div>
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: streamColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white/65 truncate">{item.title}</div>
                    {item.note && (
                      <div className="text-[10px] text-white/30 truncate">{item.note}</div>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-[10px] font-mono" style={{ color: statusColor }}>{item.status}</div>
                    {item.resolvedAt && (
                      <div className="text-[9px] text-white/20">{timeAgo(item.resolvedAt)}</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
