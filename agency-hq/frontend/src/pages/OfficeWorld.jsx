import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import OfficeScene from '../components/3d/OfficeScene'
import AgentClickModal from '../components/3d/agents/AgentClickModal'
import OfficeChatFeed from '../components/chat/OfficeChatFeed'
import ApprovalBoard from '../components/approvals/ApprovalBoard'
import { useUIStore } from '../store/uiStore'
import { useSocket } from '../hooks/useSocket'

export default function OfficeWorld() {
  const { isChatOpen, isApprovalOpen } = useUIStore()

  // Connect to socket for real-time updates
  useSocket()

  return (
    <div className="flex h-full gap-0 relative">
      {/* 3D World — main canvas */}
      <div className="flex-1 relative">
        <OfficeScene />
        <AgentClickModal />

        {/* Zone labels overlay */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
            3D Office World
          </div>
          <div className="text-[9px] text-white/10 font-mono mt-0.5">
            Click agents to inspect · Drag to pan · Scroll to zoom
          </div>
        </div>
      </div>

      {/* Right panel — Chat */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-80 h-full border-l border-white/5 flex-shrink-0"
          >
            <OfficeChatFeed className="h-full rounded-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approval overlay panel */}
      <AnimatePresence>
        {isApprovalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 right-4 w-96 max-h-[70vh] overflow-y-auto z-20"
          >
            <div className="glass-panel p-4">
              <div className="hq-label mb-3">Pending Approvals</div>
              <ApprovalBoard compact />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
