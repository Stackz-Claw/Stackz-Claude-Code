import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUIStore } from '../../store/uiStore'
import { useApprovalStore } from '../../store/approvalStore'
import { useSyncBusStore } from '../../store/syncBusStore'

export default function TopBar() {
  const [time, setTime] = useState(new Date())
  const toggleSound = useUIStore((s) => s.toggleSound)
  const soundEnabled = useUIStore((s) => s.soundEnabled)
  const toggleApprovals = useUIStore((s) => s.toggleApprovals)
  const setActiveView = useUIStore((s) => s.setActiveView)
  const smokeCount = useApprovalStore((s) => s.smokeApprovals.length)
  const stackzCount = useApprovalStore((s) => s.stackzApprovals.length)
  const syncMessages = useSyncBusStore((s) => s.messages)
  const unresolvedSync = syncMessages.filter((m) => !m.resolved).length

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  const totalPending = smokeCount + stackzCount

  return (
    <div className="relative h-14 bg-black/50 backdrop-blur-xl flex items-center justify-between px-5 flex-shrink-0">
      {/* Gradient accent line — bottom edge with shimmer */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px shimmer-overlay"
        style={{
          background: 'linear-gradient(90deg, transparent 2%, rgba(14, 165, 233, 0.5) 25%, rgba(124, 58, 237, 0.3) 50%, rgba(16, 185, 129, 0.4) 75%, transparent 98%)',
        }}
      />

      {/* Logo */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="w-8 h-8 rounded-lg flex items-center justify-center relative"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          style={{
            background: 'linear-gradient(135deg, #0EA5E9, #10B981)',
            boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)',
          }}
        >
          <span className="text-black font-bold text-xs tracking-tight">HQ</span>
        </motion.div>
        <div>
          <div className="text-white font-display font-semibold text-sm tracking-wide">
            The Agency <span className="neon-text-smoke">HQ</span>
          </div>
          <div className="text-white/25 font-mono text-[10px] tracking-widest uppercase">Operations Center</div>
        </div>
      </motion.div>

      {/* Center — domain streams */}
      <div className="hidden md:flex items-center gap-3">
        {/* Smoke stream */}
        <button
          onClick={() => setActiveView('approvals')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-smoke-blue/5 border border-smoke-blue/12 hover:bg-smoke-blue/10 hover:border-smoke-blue/25 transition-all duration-200"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          <span className="text-xs font-mono text-sky-400/90">Smoke</span>
          {smokeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-sky-500 text-black text-[9px] font-bold flex items-center justify-center">
              {smokeCount}
            </span>
          )}
        </button>

        <div className="w-px h-4 bg-white/8" />

        {/* Stackz stream */}
        <button
          onClick={() => setActiveView('approvals')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stackz-green/5 border border-stackz-green/12 hover:bg-stackz-green/10 hover:border-stackz-green/25 transition-all duration-200"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-emerald-400/90">Stackz</span>
          {stackzCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-black text-[9px] font-bold flex items-center justify-center">
              {stackzCount}
            </span>
          )}
        </button>

        {unresolvedSync > 0 && (
          <>
            <div className="w-px h-4 bg-white/8" />
            <button
              onClick={() => setActiveView('executive')}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/4 border border-white/8 hover:bg-white/6 transition-all duration-200"
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-amber-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <span className="text-xs font-mono text-amber-400/80">Sync Bus</span>
              <span className="text-xs font-mono text-white/25">{unresolvedSync}</span>
            </button>
          </>
        )}
      </div>

      {/* Right — controls */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <div className="font-mono text-smoke-blue text-sm font-medium" style={{ textShadow: '0 0 10px rgba(14, 165, 233, 0.3)' }}>{timeStr}</div>
          <div className="font-mono text-white/25 text-[10px]">{dateStr}</div>
        </div>

        {/* Approval bell */}
        <button
          onClick={toggleApprovals}
          className="relative p-2 rounded-lg bg-white/4 hover:bg-white/8 border border-transparent hover:border-white/8 transition-all duration-200"
        >
          <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {totalPending > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-warden-amber rounded-full text-black text-[10px] font-bold flex items-center justify-center"
              style={{ boxShadow: '0 0 8px rgba(245, 158, 11, 0.4)' }}
            >
              {totalPending}
            </motion.span>
          )}
        </button>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-lg bg-white/4 hover:bg-white/8 border border-transparent hover:border-white/8 transition-all duration-200"
          title={soundEnabled ? 'Mute' : 'Enable ambient sounds'}
        >
          {soundEnabled ? (
            <svg className="w-4 h-4 text-smoke-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-3.536-9.536a5 5 0 000 7.072" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
