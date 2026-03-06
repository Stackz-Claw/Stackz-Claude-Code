import { useState } from 'react'
import { motion } from 'framer-motion'
import healthData from '@mock/health.json'

const TYPE_ICONS = {
  document: '📄',
  protocol: '📋',
  tool: '🔧',
  app: '📱',
}

const CATEGORIES = ['All', 'Fitness', 'Sleep', 'Supplements', 'Nutrition', 'Recovery', 'Mental Health']

export default function ResourcesLibrary() {
  const { resources } = healthData
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? resources : resources.filter(r => r.category === filter)

  return (
    <div>
      <div className="hq-label mb-3">📚 Resources Library</div>

      {/* Category filters */}
      <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all
              ${filter === cat
                ? 'bg-white/[0.08] border-white/20 text-white/80'
                : 'border-white/[0.06] text-white/30 hover:text-white/50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            className="glass-panel p-3 flex items-start gap-3 hover:bg-white/[0.03] transition-colors cursor-pointer"
          >
            <span className="text-base mt-0.5">{TYPE_ICONS[r.type] || '📄'}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white/80">{r.name}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-white/25 font-mono">{r.category}</span>
                <span className="text-[10px] text-white/15">·</span>
                <span className="text-[10px] text-white/20">Added {r.addedAt}</span>
              </div>
              <div className="text-[10px] text-white/30 mt-1 leading-relaxed">{r.sheldonNote}</div>
            </div>
            {r.linkedGoals.length > 0 && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-smoke-blue/10 text-smoke-blue/60 whitespace-nowrap">{r.linkedGoals.length} goal{r.linkedGoals.length > 1 ? 's' : ''}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
