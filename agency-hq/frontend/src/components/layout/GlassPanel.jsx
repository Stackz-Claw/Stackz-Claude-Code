import { motion } from 'framer-motion'

export default function GlassPanel({
  children,
  className = '',
  animate = true,
  delay = 0,
  neonAccent = 'blue',  // blue | green | amber | purple
  hover = false,
  onClick,
}) {
  const accentColors = {
    blue:   { border: 'rgba(14, 165, 233, 0.12)', hoverBorder: 'rgba(14, 165, 233, 0.35)', glow: 'rgba(14, 165, 233, 0.12)', innerGlow: 'rgba(14, 165, 233, 0.04)' },
    green:  { border: 'rgba(16, 185, 129, 0.12)', hoverBorder: 'rgba(16, 185, 129, 0.35)', glow: 'rgba(16, 185, 129, 0.12)', innerGlow: 'rgba(16, 185, 129, 0.04)' },
    amber:  { border: 'rgba(245, 158, 11, 0.12)', hoverBorder: 'rgba(245, 158, 11, 0.35)', glow: 'rgba(245, 158, 11, 0.12)', innerGlow: 'rgba(245, 158, 11, 0.04)' },
    purple: { border: 'rgba(124, 58, 237, 0.12)', hoverBorder: 'rgba(124, 58, 237, 0.35)', glow: 'rgba(124, 58, 237, 0.12)', innerGlow: 'rgba(124, 58, 237, 0.04)' },
  }

  const accent = accentColors[neonAccent] || accentColors.blue

  const panel = (
    <div
      className={`
        relative backdrop-blur-xl rounded-xl
        transition-all duration-300 group/glass
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        background: `linear-gradient(135deg, rgba(10, 14, 26, 0.7), rgba(10, 14, 26, 0.5))`,
        border: `1px solid ${accent.border}`,
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06)`,
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hover || onClick) {
          e.currentTarget.style.borderColor = accent.hoverBorder
          e.currentTarget.style.boxShadow = `0 8px 32px rgba(0, 0, 0, 0.5), 0 0 30px ${accent.glow}, inset 0 1px 0 rgba(255, 255, 255, 0.08)`
        }
      }}
      onMouseLeave={(e) => {
        if (hover || onClick) {
          e.currentTarget.style.borderColor = accent.border
          e.currentTarget.style.boxShadow = `0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06)`
        }
      }}
    >
      {/* Top edge highlight gradient */}
      <div
        className="absolute inset-x-0 top-0 h-px rounded-t-xl"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent.innerGlow}, transparent)`,
        }}
      />
      {/* Subtle inner fill gradient */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  )

  if (!animate) return panel

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      {panel}
    </motion.div>
  )
}
