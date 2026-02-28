import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { motion } from 'framer-motion'
import { timeAgo } from '../../utils/formatters'

const NoteNode = memo(({ data, selected }) => {
  const { title, content, agentName, category, votes, color, isRecent } = data
  const size = Math.max(180, 180 + votes * 8)  // votes drive node size

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, type: 'spring' }}
      className={`relative cursor-pointer transition-all duration-200 ${isRecent ? 'node-pulse' : ''}`}
      style={{
        width: size,
        background: 'rgba(10, 14, 26, 0.9)',
        border: `1px solid ${selected ? color : `${color}44`}`,
        borderRadius: '12px',
        boxShadow: selected
          ? `0 0 20px ${color}44, 0 8px 32px rgba(0,0,0,0.4)`
          : `0 4px 16px rgba(0,0,0,0.3)`,
        backdropFilter: 'blur(12px)',
        padding: '12px',
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[9px] font-mono px-1.5 py-0.5 rounded"
          style={{ background: `${color}22`, color, border: `1px solid ${color}33` }}
        >
          {category}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[10px]" style={{ color }}>▲</span>
          <span className="text-[10px] font-mono font-bold" style={{ color }}>{votes}</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-xs font-medium text-white/90 leading-snug mb-1.5">{title}</div>

      {/* Content preview */}
      <div className="text-[10px] text-white/50 leading-relaxed line-clamp-3">{content}</div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
        <span className="text-[9px] font-mono text-white/30">@{agentName}</span>
        {isRecent && (
          <span className="text-[9px] font-mono" style={{ color }}>● recent</span>
        )}
      </div>

      {/* Glow dot when recent */}
      {isRecent && (
        <div
          className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-black"
          style={{ background: color, boxShadow: `0 0 6px ${color}` }}
        />
      )}

      <Handle type="target" position={Position.Top} style={{ background: color, border: 'none', width: 6, height: 6 }} />
      <Handle type="source" position={Position.Bottom} style={{ background: color, border: 'none', width: 6, height: 6 }} />
      <Handle type="target" position={Position.Left} style={{ background: color, border: 'none', width: 6, height: 6 }} />
      <Handle type="source" position={Position.Right} style={{ background: color, border: 'none', width: 6, height: 6 }} />
    </motion.div>
  )
})

NoteNode.displayName = 'NoteNode'
export default NoteNode
