import { useState } from 'react'
import { motion } from 'framer-motion'
import { useChatStore } from '../../store/chatStore'

export default function BossInput() {
  const [text, setText] = useState('')
  const { addBossMessage, toggleAutoPlay, isAutoPlay } = useChatStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    addBossMessage(text.trim())
    setText('')
  }

  return (
    <div className="p-3 border-t border-white/5">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="w-6 h-6 rounded-lg bg-neon-amber/10 border border-neon-amber/30 flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-neon-amber text-[10px]">👑</span>
        </div>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Drop a message as The Boss..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/30
                     focus:outline-none focus:border-neon-amber/50 focus:bg-white/8 transition-all"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-3 py-1.5 bg-neon-amber/10 border border-neon-amber/30 text-neon-amber rounded-lg
                     hover:bg-neon-amber/20 disabled:opacity-30 transition-colors text-sm"
        >
          Send
        </button>
      </form>
      <div className="flex items-center justify-between mt-2 px-1">
        <span className="text-[10px] text-white/20 font-mono">Read-only observer mode</span>
        <button
          onClick={toggleAutoPlay}
          className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors
            ${isAutoPlay ? 'text-neon-green/60 hover:text-neon-green' : 'text-white/20 hover:text-white/40'}`}
        >
          {isAutoPlay ? '⏸ Pause agents' : '▶ Resume agents'}
        </button>
      </div>
    </div>
  )
}
