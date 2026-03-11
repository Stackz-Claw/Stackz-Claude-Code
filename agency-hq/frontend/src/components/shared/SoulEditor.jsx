import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useSoul from '../hooks/useSoul'
import { AGENT_PERSONALITIES } from '../data/personalities'

/**
 * SoulEditor - Markdown editor for agent soul files
 * Features two-way sync with Obsidian vault
 */
export default function SoulEditor({ agentId, isOpen, onClose }) {
  const {
    soul,
    versionStatus,
    isLoading,
    isSaving,
    error,
    fetchSoul,
    saveSoul,
    pullFromVault,
    pushToVault
  } = useSoul(agentId)

  const [localBody, setLocalBody] = useState('')
  const [localFrontmatter, setLocalFrontmatter] = useState({})
  const [activeTab, setActiveTab] = useState('edit')
  const [showPreview, setShowPreview] = useState(true)

  // Sync local state when soul loads
  useEffect(() => {
    if (soul) {
      setLocalBody(soul.body || '')
      setLocalFrontmatter(soul.frontmatter || {})
    }
  }, [soul])

  // Handle save
  const handleSave = useCallback(async () => {
    await saveSoul(agentId, {
      frontmatter: localFrontmatter,
      body: localBody
    })
  }, [agentId, localFrontmatter, localBody, saveSoul])

  // Handle pull from vault
  const handlePull = useCallback(async () => {
    await pullFromVault(agentId)
  }, [agentId, pullFromVault])

  // Handle push to vault
  const handlePush = useCallback(async () => {
    await pushToVault(agentId)
  }, [agentId, pushToVault])

  // Get agent personality for display
  const personality = AGENT_PERSONALITIES[agentId]
  const agentName = personality?.name || personality?.codename || agentId

  // Status indicator
  const getSyncIndicator = () => {
    switch (versionStatus) {
      case 'local':
        return { icon: '✓', text: 'In sync', color: 'text-emerald-400' }
      case 'vault':
        return { icon: '↓', text: 'Vault has newer version', color: 'text-amber-400' }
      case 'equal':
        return { icon: '=', text: 'Identical', color: 'text-white/40' }
      default:
        return { icon: '?', text: 'Unknown', color: 'text-white/40' }
    }
  }

  const syncIndicator = getSyncIndicator()

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-4xl h-[80vh] bg-[#0a0e1a] rounded-2xl border border-white/10 overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                style={{ backgroundColor: personality?.color || '#6366F1' }}
              >
                {personality?.avatar || agentId[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-display font-semibold text-white">
                  Soul Editor
                </h2>
                <p className="text-xs text-white/40">
                  {agentName} • {localFrontmatter.archetype || 'No archetype'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Sync indicator */}
              <div className={`flex items-center gap-1.5 text-xs ${syncIndicator.color}`}>
                <span>{syncIndicator.icon}</span>
                <span>{syncIndicator.text}</span>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'edit'
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => setActiveTab('frontmatter')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'frontmatter'
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                Frontmatter
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  showPreview
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {isLoading && !soul ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-white/40">Loading soul...</div>
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-red-400">Error: {error}</div>
              </div>
            ) : (
              <>
                {/* Editor */}
                <div className={`flex-1 flex flex-col ${showPreview ? 'border-r border-white/5' : ''}`}>
                  {activeTab === 'edit' ? (
                    <textarea
                      value={localBody}
                      onChange={e => setLocalBody(e.target.value)}
                      className="flex-1 w-full p-4 bg-transparent text-white/80 text-sm font-mono resize-none focus:outline-none"
                      placeholder="Write the soul content in markdown..."
                    />
                  ) : (
                    <div className="flex-1 p-4 overflow-y-auto">
                      <div className="space-y-4">
                        {Object.entries(localFrontmatter).map(([key, value]) => (
                          <div key={key}>
                            <label className="block text-xs text-white/40 mb-1 uppercase">
                              {key}
                            </label>
                            {Array.isArray(value) ? (
                              <input
                                type="text"
                                value={value.join(', ')}
                                onChange={e => setLocalFrontmatter(prev => ({
                                  ...prev,
                                  [key]: e.target.value.split(',').map(v => v.trim())
                                }))}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white/20"
                              />
                            ) : (
                              <input
                                type="text"
                                value={value}
                                onChange={e => setLocalFrontmatter(prev => ({
                                  ...prev,
                                  [key]: e.target.value
                                }))}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white/20"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Preview */}
                {showPreview && activeTab === 'edit' && (
                  <div className="flex-1 p-4 overflow-y-auto bg-black/20">
                    <div className="prose prose-invert prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-white/70 text-sm font-mono">
                        {localBody || 'No content yet...'}
                      </pre>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePull}
                disabled={isLoading}
                className="px-3 py-2 rounded-lg text-xs font-medium bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
              >
                Pull from Obsidian
              </button>
              <button
                onClick={handlePush}
                disabled={isSaving || versionStatus === 'equal'}
                className="px-3 py-2 rounded-lg text-xs font-medium bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
              >
                Push to Vault
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchSoul(agentId)}
                disabled={isLoading}
                className="px-3 py-2 rounded-lg text-xs font-medium text-white/40 hover:text-white transition-colors disabled:opacity-50"
              >
                Refresh
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save & Push to Obsidian'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}