/**
 * StatusChip — Generic status/type badge.
 * Pass a color string and label.
 */
export default function StatusChip({ label, color = '#0EA5E9', small = false }) {
  return (
    <span
      className={`inline-flex items-center rounded font-mono font-bold tracking-wider ${small ? 'px-1.5 py-px text-[8px]' : 'px-2 py-0.5 text-[9px]'}`}
      style={{
        background: `${color}18`,
        border: `1px solid ${color}40`,
        color: color,
      }}
    >
      {label}
    </span>
  )
}
