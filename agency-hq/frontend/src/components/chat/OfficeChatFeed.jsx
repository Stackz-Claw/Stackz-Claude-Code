import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatStore } from '../../store/chatStore'
import { useAgentActivity } from '../../hooks/useAgentActivity'
import ChatMessage from './ChatMessage'
import BossInput from './BossInput'
import GlassPanel from '../layout/GlassPanel'

export default function OfficeChatFeed({ className = '' }) {
  const messages = useChatStore((s) => s.messages)
  const bottomRef = useRef()
  const containerRef = useRef()

  // Start autonomous agent messaging
  useAgentActivity()

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <GlassPanel className={`flex flex-col h-full ${className}`} animate={false}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-sm font-mono font-medium text-white/80">Office Slack</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-white/30 font-mono">#{messages.length} messages</span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0"
        style={{ scrollbarWidth: 'thin' }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              isNew={i === messages.length - 1}
            />
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Boss input */}
      <BossInput />
    </GlassPanel>
  )
}
