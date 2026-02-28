import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotesStore } from '../../store/notesStore'

const CATEGORIES = ['Strategy', 'Research', 'Revenue', 'Operations', 'Health', 'Marketing', 'Risk']

export default function StickyNoteInput({ onClose }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Strategy')
  const { addNote } = useNotesStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    addNote({
      title: title.trim(),
      content: content.trim(),
      agentId: 'boss',
      agentName: 'The Boss',
      category,
      color: '#ffb800',
    })
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-panel p-5 w-80"
      style={{ borderColor: 'rgba(255, 184, 0, 0.3)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-neon-amber">📌 Add Sticky Note</div>
        <button onClick={onClose} className="p-1 rounded hover:bg-white/10 transition-colors">
          <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white
                     placeholder-white/25 focus:outline-none focus:border-neon-amber/40 transition-all"
          autoFocus
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your thought..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white
                     placeholder-white/25 focus:outline-none focus:border-neon-amber/40 resize-none transition-all"
          rows={3}
        />
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`text-[10px] font-mono px-2 py-1 rounded transition-all ${
                category === cat
                  ? 'bg-neon-amber/20 border border-neon-amber/40 text-neon-amber'
                  : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          type="submit"
          disabled={!title.trim()}
          className="w-full py-2 bg-neon-amber/10 border border-neon-amber/30 text-neon-amber rounded-lg
                     hover:bg-neon-amber/20 disabled:opacity-30 transition-all text-sm font-mono"
        >
          Drop Note into Graph
        </button>
      </form>
    </motion.div>
  )
}
