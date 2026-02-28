import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import healthData from '@mock/health.json'

export default function SmokeInsights() {
  const [activeIndex, setActiveIndex] = useState(0)
  const insights = healthData.smokeInsights

  useEffect(() => {
    const t = setInterval(() => {
      setActiveIndex((i) => (i + 1) % insights.length)
    }, 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="glass-panel p-4" style={{ borderColor: 'rgba(157, 78, 221, 0.25)' }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
          <span className="text-purple-400 text-[10px] font-bold">S</span>
        </div>
        <div className="hq-label">Smoke's Insights</div>
        <div className="ml-auto flex gap-1">
          {insights.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === activeIndex ? 'bg-purple-400' : 'bg-white/15'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-white/80 italic leading-relaxed"
          style={{ borderLeft: '2px solid rgba(157, 78, 221, 0.5)', paddingLeft: '12px' }}
        >
          "{insights[activeIndex]}"
        </motion.div>
      </AnimatePresence>

      <div className="mt-3 text-[10px] text-white/20 font-mono">
        Smoke · updated just now
      </div>
    </div>
  )
}
