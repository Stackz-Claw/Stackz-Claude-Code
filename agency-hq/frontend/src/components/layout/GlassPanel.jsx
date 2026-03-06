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
    blue: { border: 'rgba(14, 165, 233, 0.2)', hoverBorder: 'rgba(14, 165, 233, 0.4)', glow: 'rgba(14, 165, 233, 0.15)' },
    green: { border: 'rgba(16, 185, 129, 0.2)', hoverBorder: 'rgba(16, 185, 129, 0.4)', glow: 'rgba(16, 185, 129, 0.15)' },
    amber: { border: 'rgba(245, 158, 11, 0.2)', hoverBorder: 'rgba(245, 158, 11, 0.4)', glow: 'rgba(245, 158, 11, 0.15)' },
    purple: { border: 'rgba(157, 78, 221, 0.2)', hoverBorder: 'rgba(157, 78, 221, 0.4)', glow: 'rgba(157, 78, 221, 0.15)' },
  }

  const accent = accentColors[neonAccent] || accentColors.blue

  const panel = (
    <div
      className={`
        relative bg-black/40 backdrop-blur-md rounded-xl
        transition-all duration-300 group/glass
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        border: `1px solid ${accent.border}`,
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)`,
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hover || onClick) {
          e.currentTarget.style.borderColor = accent.hoverBorder
          e.currentTarget.style.boxShadow = `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 24px ${accent.glow}, inset 0 1px 0 rgba(255, 255, 255, 0.08)`
        }
      }}
      onMouseLeave={(e) => {
        if (hover || onClick) {
          e.currentTarget.style.borderColor = accent.border
          e.currentTarget.style.boxShadow = `0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)`
        }
      }}
    >
      {/* Subtle inner highlight */}
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
