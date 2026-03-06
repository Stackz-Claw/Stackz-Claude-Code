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
    <div className="fixed inset-0 bg-[#060910] flex items-center justify-center z-50 overflow-hidden">
      {/* Fluid blob background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Blob 1 — Blue */}
        <div
          className="absolute animate-fluid-1"
          style={{
            width: '600px',
            height: '600px',
            left: '10%',
            top: '20%',
            borderRadius: '40% 60% 55% 45% / 55% 40% 60% 45%',
            background: 'radial-gradient(circle at 40% 40%, rgba(14, 165, 233, 0.2), transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Blob 2 — Purple */}
        <div
          className="absolute animate-fluid-2"
          style={{
            width: '500px',
            height: '500px',
            right: '10%',
            top: '10%',
            borderRadius: '55% 45% 40% 60% / 45% 55% 45% 55%',
            background: 'radial-gradient(circle at 60% 40%, rgba(124, 58, 237, 0.18), transparent 70%)',
            filter: 'blur(90px)',
            animationDelay: '-5s',
          }}
        />
        {/* Blob 3 — Emerald */}
        <div
          className="absolute animate-fluid-3"
          style={{
            width: '450px',
            height: '450px',
            left: '35%',
            bottom: '0%',
            borderRadius: '45% 55% 60% 40% / 60% 45% 55% 45%',
            background: 'radial-gradient(circle at 50% 60%, rgba(16, 185, 129, 0.15), transparent 70%)',
            filter: 'blur(80px)',
            animationDelay: '-10s',
          }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(14,165,233,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Noise grain */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
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
            {/* Spinning conic gradient border */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'conic-gradient(from 0deg, #0EA5E9, #7C3AED, #10B981, #A78BFA, #0EA5E9)',
                padding: '2px',
              }}
            >
              <div className="w-full h-full rounded-2xl bg-[#060910]" />
            </motion.div>
            {/* Logo glow halo */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                boxShadow: '0 0 60px rgba(14, 165, 233, 0.2), 0 0 120px rgba(124, 58, 237, 0.1)',
              }}
            />
            <div className="relative w-24 h-24 rounded-2xl bg-[#060910] flex items-center justify-center border border-smoke-blue/20">
              <div className="text-center">
                <div
                  className="text-4xl font-display font-black text-transparent bg-clip-text"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #0EA5E9, #7C3AED, #10B981)',
                  }}
                >
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
            The Agency <span className="neon-text-smoke">HQ</span>
          </h1>
          <p className="text-white/25 font-mono text-xs mt-2 tracking-widest uppercase">
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
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-smoke-blue/8 border border-smoke-blue/20 text-sky-400/90">
            Sheldon — Chief of Staff
          </span>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-stackz-green/8 border border-stackz-green/20 text-emerald-400/90">
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
          <div className="h-px bg-white/8 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full shimmer-overlay"
              style={{ background: 'linear-gradient(90deg, #0EA5E9, #7C3AED, #10B981)' }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.9 }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <motion.span
              className="font-mono text-[10px] text-white/25"
              animate={{ opacity: [0.25, 0.7, 0.25] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Initializing agents...
            </motion.span>
            <span className="font-mono text-[10px] text-smoke-blue/80">9 online</span>
          </div>
        </motion.div>

        {/* Agent dots with connection effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center items-center gap-2 mt-4"
        >
          {AGENT_COLORS.map((color, i) => (
            <div key={i} className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: color, boxShadow: `0 0 8px ${color}55` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.3 + i * 0.08, type: 'spring' }}
              />
              {/* Connection line between dots */}
              {i < AGENT_COLORS.length - 1 && (
                <motion.div
                  className="w-3 h-px"
                  style={{ background: `linear-gradient(90deg, ${color}33, ${AGENT_COLORS[i + 1]}33)` }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 1.5 + i * 0.08, duration: 0.3 }}
                />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
