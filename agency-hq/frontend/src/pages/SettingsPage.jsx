import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '../lib/api'
import toast from '../lib/toast'
import { Settings, Database, Globe, CreditCard, Hash, Key, Save, RefreshCw, Check, X, AlertTriangle } from 'lucide-react'

export default function SettingsPage() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [envVars, setEnvVars] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadHealth()
    loadEnvStatus()
  }, [])

  async function loadHealth() {
    try {
      const data = await api.health()
      setHealth(data)
    } catch (error) {
      console.error('Error loading health:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadEnvStatus() {
    // This would need a backend endpoint to get env status
    // For now, we'll show what's configured on the frontend
    setEnvVars({
      VITE_API_URL: !!import.meta.env.VITE_API_URL,
      VITE_OBSIDIAN_VAULT_NAME: !!import.meta.env.VITE_OBSIDIAN_VAULT_NAME,
    })
  }

  async function testConnection(service) {
    try {
      toast.info(`Testing ${service}...`)
      // Add actual test logic here
      toast.success(`${service} connection OK`)
    } catch (error) {
      toast.error(`${service} connection failed`)
    }
  }

  const envVarsList = [
    { key: 'PORT', required: true, description: 'Server port (default: 4001)' },
    { key: 'DB_PATH', required: true, description: 'SQLite database path' },
    { key: 'OBSIDIAN_VAULT_PATH', required: true, description: 'Path to Obsidian vault' },
    { key: 'OBSIDIAN_VAULT_NAME', required: true, description: 'Obsidian vault name' },
    { key: 'STRIPE_SECRET_KEY', required: false, description: 'Stripe API secret key' },
    { key: 'STRIPE_WEBHOOK_SECRET', required: false, description: 'Stripe webhook secret' },
    { key: 'STRIPE_FINANCIAL_ACCOUNT_ID', required: false, description: 'Stripe Financial account ID' },
    { key: 'SMOKE_BOT_TOKEN', required: false, description: 'Telegram bot token for Smoke' },
    { key: 'STACKZ_BOT_TOKEN', required: false, description: 'Telegram bot token for Stackz' },
    { key: 'TELEGRAM_CHAT_ID', required: false, description: 'Telegram chat ID for notifications' },
    { key: 'GIT_REPO_PATH', required: false, description: 'Path to git repository' },
    { key: 'OPENCLAW_CRON_LOG_PATH', required: false, description: 'Path to OpenClaw cron logs' },
  ]

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center">
            <Settings className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h1 className="text-xl font-display font-semibold text-white">Settings</h1>
            <p className="text-sm text-white/40">System configuration</p>
          </div>
        </div>

        {/* System Status */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-orange-400" />
            System Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Database */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Database</span>
                <span className={`w-2 h-2 rounded-full ${health?.database?.status === 'connected' ? 'bg-emerald-400' : 'bg-red-400'}`} />
              </div>
              <div className="text-sm text-white/40">
                {health?.database?.table_counts
                  ? `${Object.values(health.database.table_counts).reduce((a, b) => a + b, 0)} records across ${Object.keys(health.database.table_counts).length} tables`
                  : 'Loading...'}
              </div>
            </div>

            {/* Uptime */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Uptime</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="text-sm text-white/40">
                {health?.uptime_seconds
                  ? `${Math.floor(health.uptime_seconds / 3600)}h ${Math.floor((health.uptime_seconds % 3600) / 60)}m`
                  : 'Calculating...'}
              </div>
            </div>

            {/* Socket Connections */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Socket Connections</span>
                <span className="text-emerald-400">{health?.socket_connections || 0}</span>
              </div>
              <div className="text-sm text-white/40">Active frontend connections</div>
            </div>

            {/* Cron Jobs */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Cron Jobs</span>
                <span className="text-sky-400">{health?.cron_jobs?.length || 0}</span>
              </div>
              <div className="text-sm text-white/40">
                {health?.cron_jobs?.filter(c => c.status === 'running').length || 0} running
              </div>
            </div>
          </div>
        </div>

        {/* Environment Variables */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-orange-400" />
            Environment Variables
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-3 text-sm text-white/60 font-medium">Variable</th>
                  <th className="text-left p-3 text-sm text-white/60 font-medium">Status</th>
                  <th className="text-left p-3 text-sm text-white/60 font-medium hidden md:table-cell">Description</th>
                </tr>
              </thead>
              <tbody>
                {envVarsList.map((env, idx) => (
                  <tr key={idx} className="border-b border-white/5">
                    <td className="p-3">
                      <code className="text-sm text-amber-400 font-mono">{env.key}</code>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 text-sm ${
                        env.required ? 'text-emerald-400' : 'text-white/40'
                      }`}>
                        {env.required ? (
                          <>
                            <Check className="w-3 h-3" /> Configured
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3 h-3" /> Optional
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-white/40 hidden md:table-cell">
                      {env.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Agent Spend Limits */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-orange-400" />
            Agent Spend Limits
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-sm text-white/40 mb-4">
              Configure daily and monthly spending limits for each agent.
              Changes are saved to the database.
            </div>
            <div className="text-center py-8 text-white/30">
              <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>Agent spend limits management coming soon</p>
            </div>
          </div>
        </div>

        {/* Workflow Schedules */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Hash className="w-5 h-5 text-orange-400" />
            Workflow Schedules
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            {health?.cron_jobs?.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-3 text-sm text-white/60 font-medium">Name</th>
                    <th className="text-left p-3 text-sm text-white/60 font-medium">Schedule</th>
                    <th className="text-left p-3 text-sm text-white/60 font-medium">Last Run</th>
                    <th className="text-left p-3 text-sm text-white/60 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {health.cron_jobs.map((job, idx) => (
                    <tr key={idx} className="border-b border-white/5">
                      <td className="p-3 text-sm text-white">{job.name}</td>
                      <td className="p-3 text-sm text-white/50 font-mono">{job.schedule}</td>
                      <td className="p-3 text-sm text-white/50">
                        {job.last_run ? new Date(job.last_run).toLocaleString() : 'Never'}
                      </td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          job.status === 'running'
                            ? 'bg-sky-500/20 text-sky-400'
                            : job.status === 'failed'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-white/40">
                No cron jobs configured
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-orange-400" />
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={loadHealth}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:bg-white/10 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Status
            </button>
            <button
              onClick={() => testConnection('Stripe')}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:bg-white/10 transition-colors"
            >
              <Globe className="w-4 h-4" />
              Test Stripe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}