import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../../lib/api'

const STATUS_COLORS = {
  healthy: 'text-green-400',
  warning: 'text-yellow-400',
  error: 'text-red-400'
}

const STATUS_ICONS = {
  healthy: '✅',
  warning: '⚠️',
  error: '❌'
}

export default function McpServerStatus() {
  const [servers, setServers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        setLoading(true)
        const data = await api.heartbeat.status()
        setServers(data.servers || [])
        setLastUpdated(new Date(data.timestamp))
        setError(null)
      } catch (err) {
        setError(err.message)
        setServers([])
      } finally {
        setLoading(false)
      }
    }

    // Fetch immediately on mount
    fetchServerStatus()

    // Refresh every 30 seconds
    const interval = setInterval(fetchServerStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  if (loading && servers.length === 0) {
    return (
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">MCP Server Status</h3>
          <div className="text-xs text-white/40">Loading...</div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-white/10 animate-pulse"></div>
                <div className="h-4 w-24 bg-white/10 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-16 bg-white/10 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">MCP Server Status</h3>
          <div className="text-xs text-red-400">Error</div>
        </div>
        <div className="text-sm text-red-400/80 p-3 rounded-lg bg-red-400/5 border border-red-400/10">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">MCP Server Status</h3>
        {lastUpdated && (
          <div className="text-xs text-white/40">
            Updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {servers.map((server, index) => (
          <motion.div
            key={server.server}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{STATUS_ICONS[server.status] || '❓'}</span>
              <div>
                <div className="font-medium text-white">{server.server}</div>
                <div className="text-xs text-white/50">{server.message}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${STATUS_COLORS[server.status] || 'text-white/50'}`}>
                {server.status.toUpperCase()}
              </div>
              {server.responseTime && (
                <div className="text-xs text-white/40">
                  {server.responseTime}ms
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {servers.length === 0 && (
          <div className="text-center py-8 text-white/30">
            No MCP servers configured
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 text-xs text-white/30">
        Heartbeat monitoring runs every 30 minutes
      </div>
    </div>
  )
}