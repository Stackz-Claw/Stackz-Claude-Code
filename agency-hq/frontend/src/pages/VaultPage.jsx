import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSocketEvent } from '../lib/socket'
import { api } from '../lib/api'
import toast from '../lib/toast'
import { useObsidianOpen } from '../lib/useObsidianLink'
import { FolderOpen, FileText, Search, Clock, ChevronRight, ExternalLink, X, Copy } from 'lucide-react'

export default function VaultPage() {
  const [recentFiles, setRecentFiles] = useState([])
  const [folderContents, setFolderContents] = useState([])
  const [currentPath, setCurrentPath] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(true)
  const openObsidian = useObsidianOpen()

  useEffect(() => {
    loadRecentFiles()
  }, [])

  async function loadRecentFiles() {
    try {
      const data = await api.vault.recentFiles()
      setRecentFiles(data || [])
    } catch (error) {
      console.error('Error loading recent files:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadFolder(path) {
    try {
      const data = await api.vault.folder(path)
      setFolderContents(data || [])
      setCurrentPath(path)
    } catch (error) {
      console.error('Error loading folder:', error)
    }
  }

  async function loadFile(path) {
    try {
      const data = await api.vault.file(path)
      setSelectedFile(data)
    } catch (error) {
      console.error('Error loading file:', error)
      toast.error('Failed to load file')
    }
  }

  async function handleSearch() {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    try {
      const results = await api.vault.search(searchQuery)
      setSearchResults(results || [])
    } catch (error) {
      console.error('Search error:', error)
    }
  }

  useEffect(() => {
    const timer = setTimeout(handleSearch, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Listen for vault changes
  useSocketEvent('vault:file_modified', (data) => {
    toast.info(`Modified: ${data.path}`)
    loadRecentFiles()
  })

  function navigateToFolder(path) {
    loadFolder(path)
    setSelectedFile(null)
  }

  function goBack() {
    if (!currentPath) return
    const parts = currentPath.split('/')
    parts.pop()
    const parentPath = parts.join('/')
    loadFolder(parentPath)
  }

  function handleCopyLink(path) {
    const link = `obsidian://open?vault=Agency%20HQ&file=${encodeURIComponent(path)}`
    navigator.clipboard.writeText(link)
    toast.success('Link copied!')
  }

  function formatTime(isoString) {
    const date = new Date(isoString)
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="h-full flex">
      {/* Left Panel - Browser */}
      <div className="w-80 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search vault..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          {/* Path breadcrumb */}
          {currentPath && (
            <div className="flex items-center gap-1 text-sm text-white/60 mb-2 overflow-x-auto">
              <button onClick={() => { setCurrentPath(''); setFolderContents([]); }} className="hover:text-white">Vault</button>
              {currentPath.split('/').filter(Boolean).map((part, idx, arr) => (
                <span key={idx} className="flex items-center">
                  <ChevronRight className="w-3 h-3 mx-1" />
                  <button
                    onClick={() => navigateToFolder(arr.slice(0, idx + 1).join('/'))}
                    className="hover:text-white whitespace-nowrap"
                  >
                    {part}
                  </button>
                </span>
              ))}
            </div>
          )}

          {currentPath && (
            <button
              onClick={goBack}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              ← Back
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {/* Search Results */}
          {searchQuery && (
            <div className="mb-4">
              <div className="text-xs text-white/40 px-2 mb-2">Search Results ({searchResults.length})</div>
              <div className="space-y-1">
                {searchResults.map((result, idx) => (
                  <div
                    key={idx}
                    onClick={() => loadFile(result.path)}
                    className="p-2 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer"
                  >
                    <div className="text-sm text-white font-medium truncate">{result.title}</div>
                    <div className="text-xs text-white/40 truncate">{result.path}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!searchQuery && (
            <>
              {/* Recent Files */}
              {!currentPath && recentFiles.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 px-2 mb-2">
                    <Clock className="w-4 h-4 text-white/40" />
                    <span className="text-xs text-white/40">Recently Modified</span>
                  </div>
                  <div className="space-y-1">
                    {recentFiles.slice(0, 10).map((file, idx) => (
                      <div
                        key={idx}
                        onClick={() => loadFile(file.path)}
                        className="p-2 hover:bg-white/5 rounded-lg cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-white/40" />
                          <span className="text-sm text-white truncate flex-1">{file.title}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-white/40">{formatTime(file.modified_at)}</span>
                          {file.agent && (
                            <span className="text-xs px-1.5 py-0.5 bg-white/10 rounded text-white/50">
                              {file.agent}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Folder Contents */}
              {currentPath && folderContents.length > 0 && (
                <div className="space-y-1">
                  {folderContents.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => item.type === 'folder' ? navigateToFolder(item.path) : loadFile(item.path)}
                      className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg cursor-pointer"
                    >
                      {item.type === 'folder' ? (
                        <FolderOpen className="w-4 h-4 text-amber-400" />
                      ) : (
                        <FileText className="w-4 h-4 text-blue-400" />
                      )}
                      <span className="text-sm text-white truncate">{item.name}</span>
                      {item.type === 'folder' && (
                        <span className="ml-auto text-xs text-white/30">→</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Panel - File Reader */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col h-full"
            >
              {/* File Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-white">{selectedFile.path.split('/').pop()}</h2>
                  <div className="text-xs text-white/40">{selectedFile.path}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyLink(selectedFile.path)}
                    className="p-2 text-white/40 hover:text-white transition-colors"
                    title="Copy link"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openObsidian(selectedFile.path)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                  >
                    Open in Obsidian
                    <ExternalLink className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="p-2 text-white/40 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Frontmatter */}
              {selectedFile.frontmatter && Object.keys(selectedFile.frontmatter).length > 0 && (
                <div className="p-4 border-b border-white/10 bg-white/5">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(selectedFile.frontmatter).slice(0, 6).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="text-white/40">{key}:</span>{' '}
                        <span className="text-white/70">{String(value).slice(0, 30)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-white/80 font-sans">
                    {selectedFile.content}
                  </pre>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center text-white/30"
            >
              <div className="text-center">
                <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Select a file to preview</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}