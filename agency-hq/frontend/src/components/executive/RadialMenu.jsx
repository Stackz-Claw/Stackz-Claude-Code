import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '../../store/uiStore'

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', angle: -90 },
  { id: 'requests', label: 'Requests', icon: '📋', angle: 0 },
  { id: 'memo', label: 'Latest Memo', icon: '📄', angle: 90 },
  { id: 'talk', label: 'Talk', icon: '💬', angle: 180 },
]

export default function RadialMenu({ agentId, color, onSelect, onClose }) {
  const setActiveView = useUIStore((s) => s.setActiveView)

  const handleSelect = (item) => {
    if (item.id === 'dashboard') {
      setActiveView(agentId === 'smoke' ? 'health' : 'financial')
    } else if (item.id === 'requests') {
      setActiveView('approvals')
    }
    onSelect?.(item)
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="absolute inset-0 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div className="relative">
          {/* Center button */}
          <div
            className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-sm"
            style={{ borderColor: color, background: `${color}22`, color }}
          >
            {agentId === 'smoke' ? 'S' : '$'}
          </div>

          {/* Radial items */}
          {MENU_ITEMS.map((item) => {
            const rad = (item.angle * Math.PI) / 180
            const x = Math.cos(rad) * 70
            const y = Math.sin(rad) * 70

            return (
              <motion.button
                key={item.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: MENU_ITEMS.indexOf(item) * 0.05 }}
                onClick={(e) => { e.stopPropagation(); handleSelect(item) }}
                className="absolute glass-panel px-3 py-2 flex flex-col items-center gap-0.5 -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, borderColor: `${color}33` }}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-[9px] font-mono text-white/60 whitespace-nowrap">{item.label}</span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
