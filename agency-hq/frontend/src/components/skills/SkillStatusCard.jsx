import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const API_BASE = 'http://localhost:3001'

function SkillBadge({ winRate }) {
  let color = '#EF4444' // red
  let label = 'Low'
  if (winRate >= 70) {
    color = '#10B981' // green
    label = 'High'
  } else if (winRate >= 40) {
    color = '#F59E0B' // yellow
    label = 'Med'
  }

  return (
    <span
      className="text-[9px] font-mono px-1.5 py-0.5 rounded"
      style={{
        backgroundColor: color + '20',
        color: color,
        border: `1px solid ${color}40`
      }}
    >
      {label} ({winRate}%)
    </span>
  )
}

function TrendIndicator({ wins, losses }) {
  const diff = wins - losses
  if (diff > 0) {
    return <span className="text-emerald-400 text-xs">↑ Improving</span>
  }
  if (diff < 0) {
    return <span className="text-red-400 text-xs">↓ Degrading</span>
  }
  return <span className="text-white/30 text-xs">— Stable</span>
}

function EvalHistoryDrawer({ agentId, isOpen, onClose }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && agentId) {
      setLoading(true)
      fetch(`${API_BASE}/api/skills/eval/history/${agentId}`)
        .then(r => r.json())
        .then(data => setHistory(data.history || []))
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [isOpen, agentId])

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0a0e1a] border border-white/10 rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-display font-semibold text-white">Eval History</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white/60">✕</button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="text-white/30 text-center py-8">Loading...</div>
          ) : history.length === 0 ? (
            <div className="text-white/30 text-center py-8">No evaluations yet</div>
          ) : (
            <div className="space-y-3">
              {history.map((item, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-white/80">{item.skillName}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      item.winner === 'with_skill' ? 'bg-emerald-500/20 text-emerald-400' :
                      item.winner === 'without_skill' ? 'bg-red-500/20 text-red-400' :
                      'bg-white/10 text-white/40'
                    }`}>
                      {item.winner || 'N/A'}
                    </span>
                  </div>
                  <div className="text-[10px] text-white/30">
                    {new Date(item.testedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function SkillStatusCard({ agentId, teamColor }) {
  const [skills, setSkills] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [evalLoading, setEvalLoading] = useState({})
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    // Load available skills and agent stats
    Promise.all([
      fetch(`${API_BASE}/api/skills/list`).then(r => r.json()),
      agentId ? fetch(`${API_BASE}/api/skills/eval/stats/${agentId}`).then(r => r.json()) : Promise.resolve({ skills: [] })
    ])
      .then(([skillsData, statsData]) => {
        setSkills(skillsData.skills || [])

        // Map stats by skill name
        const statsMap = {}
        ;(statsData.skills || []).forEach(s => {
          statsMap[s.skillName] = s
        })
        setStats(statsMap)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [agentId])

  const handleRunEval = async (skillPath, skillName) => {
    setEvalLoading(prev => ({ ...prev, [skillName]: true }))

    try {
      const response = await fetch(`${API_BASE}/api/skills/eval`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillPath,
          agentId,
          testPrompts: [
            'Help me write a function to process data efficiently.',
            'Explain how to optimize a database query.'
          ]
        })
      })

      const data = await response.json()
      console.log('Eval result:', data)

      // Refresh stats
      const statsRes = await fetch(`${API_BASE}/api/skills/eval/stats/${agentId}`)
      const statsData = await statsRes.json()
      const statsMap = {}
      ;(statsData.skills || []).forEach(s => {
        statsMap[s.skillName] = s
      })
      setStats(statsMap)
    } catch (error) {
      console.error('Eval error:', error)
    } finally {
      setEvalLoading(prev => ({ ...prev, [skillName]: false }))
    }
  }

  const handleExportToObsidian = async (evalId) => {
    try {
      await fetch(`${API_BASE}/api/skills/eval/export-to-obsidian`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evalId })
      })
    } catch (error) {
      console.error('Export error:', error)
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl p-4 bg-white/5 border border-white/5">
        <div className="text-white/30 text-xs">Loading skills...</div>
      </div>
    )
  }

  if (skills.length === 0) {
    return (
      <div className="rounded-xl p-4 bg-white/5 border border-white/5">
        <div className="text-white/30 text-xs">No skills configured</div>
        <div className="text-white/20 text-[10px] mt-1">Add skills to .agent/skills/</div>
      </div>
    )
  }

  // Filter skills for this agent
  const agentSkills = skills.filter(s => !s.agents.length || s.agents.includes(agentId))

  return (
    <div className="rounded-xl p-4 bg-white/[0.02] border border-white/5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-display font-semibold text-white/60 uppercase tracking-wider">Skills</h3>
        <button
          onClick={() => setDrawerOpen(true)}
          className="text-[10px] text-white/30 hover:text-white/60 transition-colors"
        >
          View History →
        </button>
      </div>

      <div className="space-y-2">
        {agentSkills.map(skill => {
          const stat = stats[skill.name]
          const winRate = stat?.winRate || 0

          return (
            <div key={skill.path} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/80">{skill.name}</span>
                {stat && <SkillBadge winRate={winRate} />}
              </div>

              <div className="flex items-center gap-2">
                {stat && <TrendIndicator wins={stat.wins} losses={stat.losses} />}

                <button
                  onClick={() => handleRunEval(skill.path, skill.name)}
                  disabled={evalLoading[skill.name]}
                  className="text-[10px] px-2 py-1 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 disabled:opacity-50"
                >
                  {evalLoading[skill.name] ? 'Running...' : 'Run Eval'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <EvalHistoryDrawer agentId={agentId} isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}