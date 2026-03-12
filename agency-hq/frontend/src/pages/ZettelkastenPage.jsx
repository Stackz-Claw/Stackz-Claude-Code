import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSocketEvent } from '../lib/socket'
import { api } from '../lib/api'
import toast from '../lib/toast'
import { obsidianLink, useObsidianOpen } from '../lib/useObsidianLink'
import { Brain, Search, Clock, ExternalLink, FileText, Network, Sparkles } from 'lucide-react'

export default function ZettelkastenPage() {
  const [stats, setStats] = useState(null)
  const [mocs, setMocs] = useState([])
  const [recentNotes, setRecentNotes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const openObsidian = useObsidianOpen()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [statsData, mocsData, recentData] = await Promise.all([
        api.zettelkasten.stats(),
        api.zettelkasten.mocs(),
        api.zettelkasten.recent(20),
      ])
      setStats(statsData)
      setMocs(mocsData || [])
      setRecentNotes(recentData || [])
    } catch (error) {
      console.error('Error loading zettelkasten data:', error)
      toast.error('Failed to load knowledge base')
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch() {
    if (!searchQuery.trim()) {
      setSearchResults(null)
      return
    }
    try {
      const results = await api.zettelkasten.search(searchQuery)
      setSearchResults(results || [])
    } catch (error) {
      console.error('Search error:', error)
    }
  }

  useEffect(() => {
    const timer = setTimeout(handleSearch, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Listen for vault modifications
  useSocketEvent('vault:file_modified', (data) => {
    if (data.path?.includes('Zettelkasten')) {
      toast.info(`New note: ${data.path}`)
      loadData()
    }
  })

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-display font-semibold text-white">Knowledge Base</h1>
              <p className="text-sm text-white/40">Zettelkasten</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
          />
        </div>

        {/* Search Results */}
        {searchQuery && searchResults !== null && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-white/60 mb-3">Search Results ({searchResults.length})</h2>
            <div className="space-y-2">
              {searchResults.length === 0 ? (
                <div className="text-white/40 text-sm">No results found</div>
              ) : (
                searchResults.map((result, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                    onClick={() => openObsidian(result.path)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{result.title}</span>
                      <ExternalLink className="w-4 h-4 text-white/40" />
                    </div>
                    <p className="text-sm text-white/50 mt-1 line-clamp-2">{result.excerpt}</p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Stats Pulse */}
        {stats && !searchQuery && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-2xl font-bold text-white">{stats.total_notes || 0}</div>
              <div className="text-sm text-white/40">Total Notes</div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-2xl font-bold text-purple-400">{stats.this_week || 0}</div>
              <div className="text-sm text-white/40">This Week</div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-2xl font-bold text-pink-400">{stats.mocs || 0}</div>
              <div className="text-sm text-white/40">MOCs</div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-2xl font-bold text-sky-400">{stats.links || 0}</div>
              <div className="text-sm text-white/40">Total Links</div>
            </div>
          </div>
        )}

        {/* Maps of Content */}
        {!searchQuery && (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Network className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-medium text-white">Maps of Content</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mocs.length === 0 ? (
                  <div className="col-span-2 p-6 bg-white/5 border border-white/10 rounded-xl text-center text-white/40">
                    No MOCs found. Create index notes in your Zettelkasten.
                  </div>
                ) : (
                  mocs.map((moc, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white">MOC: {moc.title || 'Untitled'}</h3>
                        <span className="text-xs text-white/40">{moc.note_count || 0} notes</span>
                      </div>
                      <p className="text-sm text-white/50 mb-3 line-clamp-2">{moc.description || 'No description'}</p>
                      <button
                        onClick={() => openObsidian(moc.path)}
                        className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                      >
                        Open in Obsidian <ExternalLink className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Permanent Notes */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-sky-400" />
                <h2 className="text-lg font-medium text-white">Recent Notes</h2>
              </div>
              <div className="space-y-2">
                {recentNotes.length === 0 ? (
                  <div className="p-6 bg-white/5 border border-white/10 rounded-xl text-center text-white/40">
                    No recent notes
                  </div>
                ) : (
                  recentNotes.map((note, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => openObsidian(note.path)}
                    >
                      <FileText className="w-4 h-4 text-white/40" />
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">{note.title}</div>
                        {note.tags && (
                          <div className="flex gap-1 mt-1">
                            {note.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 bg-white/10 rounded text-white/50">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {note.link_count && (
                        <span className="text-xs text-white/40">{note.link_count} links</span>
                      )}
                      <ExternalLink className="w-4 h-4 text-white/30" />
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}