import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSocketEvent } from '../lib/socket'
import { api } from '../lib/api'
import toast from '../lib/toast'
import { useObsidianOpen } from '../lib/useObsidianLink'
import { MessageSquare, Plus, Send, Clock, AlertCircle, ExternalLink, X } from 'lucide-react'

const STATUS_COLORS = {
  open: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  needs_clarification: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  in_progress: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  actioned: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  deferred: 'bg-white/10 text-white/40 border-white/20',
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState([])
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [showNewModal, setShowNewModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const openObsidian = useObsidianOpen()

  useEffect(() => {
    loadIdeas()
  }, [])

  async function loadIdeas() {
    try {
      const data = await api.ideas.list()
      setIdeas(data || [])
    } catch (error) {
      console.error('Error loading ideas:', error)
      toast.error('Failed to load ideas')
    } finally {
      setLoading(false)
    }
  }

  async function loadIdeaDetail(id) {
    try {
      const detail = await api.ideas.get(id)
      setSelectedIdea(detail)
    } catch (error) {
      console.error('Error loading idea:', error)
    }
  }

  async function handleReply() {
    if (!selectedIdea || !replyText.trim()) return

    try {
      await api.ideas.reply(selectedIdea.id, { message: replyText })
      toast.success('Reply added')
      setReplyText('')
      loadIdeaDetail(selectedIdea.id)
      loadIdeas()
    } catch (error) {
      console.error('Error sending reply:', error)
      toast.error('Failed to send reply')
    }
  }

  async function handleCreateIdea() {
    if (!newTitle.trim()) return

    try {
      await api.ideas.create({ title: newTitle, message: newMessage })
      toast.success('Idea created')
      setShowNewModal(false)
      setNewTitle('')
      setNewMessage('')
      loadIdeas()
    } catch (error) {
      console.error('Error creating idea:', error)
      toast.error('Failed to create idea')
    }
  }

  // Listen for new replies
  useSocketEvent('ideas:reply', (data) => {
    toast.info(`${data.speaker}: ${data.preview}`)
    loadIdeas()
    if (selectedIdea?.id === data.note_id) {
      loadIdeaDetail(data.note_id)
    }
  })

  useSocketEvent('ideas:created', (data) => {
    toast.success(`New idea: ${data.title}`)
    loadIdeas()
  })

  const needsReply = ideas.filter(i => i.reply_needed_from_jaleel)
  const activeIdeas = ideas.filter(i => !i.reply_needed_from_jaleel && i.status !== 'deferred')
  const deferredIdeas = ideas.filter(i => i.status === 'deferred')

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-sky-500/20 border border-emerald-500/30 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-display font-semibold text-white">Idea Threads</h1>
              <p className="text-sm text-white/40">Conversations with the swarm</p>
            </div>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Idea
          </button>
        </div>

        {/* Needs Your Reply */}
        {needsReply.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-medium text-white">Needs Your Reply ({needsReply.length})</h2>
            </div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {needsReply.map((idea, idx) => (
                <div
                  key={idea.id}
                  className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl hover:bg-amber-500/15 cursor-pointer transition-colors"
                  onClick={() => loadIdeaDetail(idea.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-white">"{idea.title}"</h3>
                    <span className={`text-xs px-2 py-1 rounded border ${STATUS_COLORS[idea.status] || STATUS_COLORS.open}`}>
                      {idea.status}
                    </span>
                  </div>
                  <div className="text-sm text-white/60 mb-2">
                    <span className="text-amber-400">{idea.last_speaker}:</span> {idea.last_message_preview}
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <span>Waiting for your reply</span>
                    <span className="flex items-center gap-1">
                      Open <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Active Threads */}
        {activeIdeas.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-medium text-white mb-3">Active Threads ({activeIdeas.length})</h2>
            <div className="space-y-3">
              {activeIdeas.map((idea, idx) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
                  onClick={() => loadIdeaDetail(idea.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-white">"{idea.title}"</h3>
                    <span className={`text-xs px-2 py-1 rounded border ${STATUS_COLORS[idea.status] || STATUS_COLORS.open}`}>
                      {idea.status}
                    </span>
                  </div>
                  {idea.last_message_preview && (
                    <div className="text-sm text-white/50">
                      <span className="text-emerald-400">{idea.last_speaker}:</span> {idea.last_message_preview}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Deferred */}
        {deferredIdeas.length > 0 && (
          <div className="mb-8">
            <details className="group">
              <summary className="cursor-pointer list-none flex items-center gap-2 text-white/60 hover:text-white mb-3">
                <span className="transform group-open:rotate-90 transition-transform">▶</span>
                <span>Deferred ({deferredIdeas.length})</span>
              </summary>
              <div className="space-y-2 ml-4">
                {deferredIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="p-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer opacity-50 hover:opacity-70 transition-opacity"
                    onClick={() => loadIdeaDetail(idea.id)}
                  >
                    <span className="text-white">{idea.title}</span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}

        {/* Empty state */}
        {ideas.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/40">No ideas yet. Start a conversation!</p>
          </div>
        )}
      </div>

      {/* Idea Detail Modal */}
      <AnimatePresence>
        {selectedIdea && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedIdea(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0D0F14] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-white">{selectedIdea.title}</h2>
                  <span className={`text-xs px-2 py-1 rounded border ${STATUS_COLORS[selectedIdea.status] || STATUS_COLORS.open}`}>
                    {selectedIdea.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openObsidian(selectedIdea.id)}
                    className="p-2 text-white/40 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedIdea(null)}
                    className="p-2 text-white/40 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="prose prose-invert max-w-none">
                  {selectedIdea.content && selectedIdea.content.split('\n## Thread').map((section, i) => (
                    <div key={i} className="mb-4">
                      {i > 0 && <h3 className="text-sm font-medium text-white/60 mb-2">Thread</h3>}
                      <pre className="whitespace-pre-wrap text-sm text-white/70 font-sans">{section}</pre>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50"
                  />
                  <button
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                    className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Idea Modal */}
      <AnimatePresence>
        {showNewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0D0F14] border border-white/10 rounded-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-lg font-medium text-white">New Idea</h2>
                <button
                  onClick={() => setShowNewModal(false)}
                  className="p-2 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Title</label>
                  <input
                    type="text"
                    placeholder="What's on your mind?"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Initial message</label>
                  <textarea
                    placeholder="Start the conversation..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 resize-none"
                  />
                </div>
                <button
                  onClick={handleCreateIdea}
                  disabled={!newTitle.trim()}
                  className="w-full py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Idea
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}