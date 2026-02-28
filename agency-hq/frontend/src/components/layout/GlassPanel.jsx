import { motion } from 'framer-motion'

export default function GlassPanel({
  children,
  className = '',
  animate = true,
  delay = 0,
  neonAccent = 'blue',  // blue | green | amber | purple
  onClick,
}) {
  const accentClasses = {
    blue: 'border-neon-blue/20 hover:border-neon-blue/40',
    green: 'border-neon-green/20 hover:border-neon-green/40',
    amber: 'border-neon-amber/20 hover:border-neon-amber/40',
    purple: 'border-[#9d4edd]/20 hover:border-[#9d4edd]/40',
  }

  const panel = (
    <div
      className={`
        relative bg-black/40 backdrop-blur-md border rounded-xl shadow-glass
        transition-all duration-300
        ${accentClasses[neonAccent] || accentClasses.blue}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
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
