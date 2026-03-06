/**
 * ConfidenceArc — SVG arc progress indicator (0–100).
 * Colors: teal ≥60, amber 40–59, red <40.
 */
export default function ConfidenceArc({ value = 0, size = 48 }) {
  const radius = (size - 6) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.max(0, Math.min(100, value))
  const offset = circumference - (progress / 100) * circumference

  const color = progress >= 60 ? '#14B8A6' : progress >= 40 ? '#F59E0B' : '#EF4444'
  const glowColor = progress >= 60 ? 'rgba(20,184,166,0.3)' : progress >= 40 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 4px ${glowColor})`, transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span className="absolute text-[10px] font-mono font-bold" style={{ color }}>
        {progress}
      </span>
    </div>
  )
}
