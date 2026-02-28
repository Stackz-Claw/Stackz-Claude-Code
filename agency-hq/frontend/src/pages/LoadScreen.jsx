import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUIStore } from '../store/uiStore'

const AGENT_COLORS = [
  '#0EA5E9', '#10B981', '#F59E0B', '#EC4899',
  '#6366F1', '#14B8A6', '#A78BFA', '#22C55E', '#F97316',
]

export default function LoadScreen() {
  const setLoading = useUIStore((s) => s.setLoading)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="fixed inset-0 bg-hq-dark flex items-center justify-center z-50 scanlines">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(14,165,233,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative text-center">
        {/* Logo animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="mb-6"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'conic-gradient(from 0deg, #0EA5E9, #10B981, #A78BFA, #F97316, #0EA5E9)',
                padding: '2px',
              }}
            >
              <div className="w-full h-full rounded-2xl bg-hq-dark" />
            </motion.div>
            <div className="relative w-24 h-24 rounded-2xl bg-hq-dark flex items-center justify-center border border-smoke-blue/30">
              <div className="text-center">
                <div className="text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-br from-smoke-blue to-stackz-green">
                  HQ
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h1 className="text-3xl font-display font-bold tracking-tight">
            The Agency <span className="neon-text-smoke animate-glow">HQ</span>
          </h1>
          <p className="text-white/30 font-mono text-xs mt-2 tracking-widest uppercase">
            AI Operations Center — v2.0
          </p>
        </motion.div>

        {/* Executive tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center gap-3 mt-4"
        >
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-smoke-blue/10 border border-smoke-blue/20 text-sky-400">
            Sheldon — Chief of Staff
          </span>
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-stackz-green/10 border border-stackz-green/20 text-emerald-400">
            Stackz — Chief of Biz Ops
          </span>
        </motion.div>

        {/* Loading bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 w-64 mx-auto"
        >
          <div className="h-px bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #0EA5E9, #10B981)' }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.9 }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <motion.span
              className="font-mono text-[10px] text-white/30"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Initializing agents...
            </motion.span>
            <span className="font-mono text-[10px] text-smoke-blue">9 online</span>
          </div>
        </motion.div>

        {/* Agent dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center gap-2 mt-4"
        >
          {AGENT_COLORS.map((color, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: color }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.3 + i * 0.08, type: 'spring' }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
