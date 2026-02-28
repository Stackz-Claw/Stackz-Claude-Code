import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApprovalStore } from '../../store/approvalStore'
import { useChatStore } from '../../store/chatStore'

// Route to Smoke stream (personal domain)
const SMOKE_PATTERNS = /health|sleep|fitness|wellness|nutrition|diet|workout|recovery|hrv|calendar|schedule|appointment|medical|doctor|stress|mental|mood|energy/i

// Route to Stackz stream by team
function routeToStackz(text) {
  const lower = text.toLowerCase()
  if (lower.match(/market|brand|content|social|campaign|post|viral|audience|launch/)) return { team: 'marketing', agentId: 'megaphone', agentName: 'Megaphone' }
  if (lower.match(/dev|code|bug|feature|api|deploy|build|ship|product|tech/)) return { team: 'dev', agentId: 'forge', agentName: 'Forge' }
  if (lower.match(/design|ui|ux|brand|visual|logo|layout|color|aesthetic/)) return { team: 'design', agentId: 'canvas', agentName: 'Canvas' }
  if (lower.match(/finance|revenue|cost|budget|spend|cash|profit|invoice|billing/)) return { team: 'finance', agentId: 'cashflow', agentName: 'Cashflow' }
  if (lower.match(/startup|venture|portfolio|pitch|pivot|phase|investor|raise/)) return { team: 'startup', agentId: 'founder', agentName: 'Founder' }
  if (lower.match(/hire|recruit|hr|compliance|onboard|team|contractor/)) return { team: 'hr', agentId: 'warden', agentName: 'Warden' }
  if (lower.match(/strategy|research|market|competitor|data|analysis|opportunity/)) return { team: 'strategy', agentId: 'radar', agentName: 'Radar' }
  return { team: 'ops', agentId: 'stackz', agentName: 'Stackz' } // default to Stackz
}

function getRoutePreview(text) {
  if (!text.trim()) return null
  if (SMOKE_PATTERNS.test(text)) return { stream: 'smoke', color: '#0EA5E9', label: 'Smoke', sublabel: 'personal domain' }
  const stackzRoute = routeToStackz(text)
  return { stream: 'stackz', color: '#10B981', label: stackzRoute.agentName, sublabel: stackzRoute.team }
}

export default function IdeaSubmit() {
  const [idea, setIdea] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [routed, setRouted] = useState(null)
  const { addSmokeApproval, addStackzApproval } = useApprovalStore()
  const { addBossMessage } = useChatStore()

  const routePreview = getRoutePreview(idea)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!idea.trim()) return

    const now = new Date().toISOString()
    const id = `boss_${Date.now()}`

    if (SMOKE_PATTERNS.test(idea)) {
      addSmokeApproval({
        id,
        stream: 'smoke',
        domain: 'Calendar',
        title: `Boss Request: ${idea.slice(0, 60)}${idea.length > 60 ? '...' : ''}`,
        description: `Direct request from The Boss: "${idea}"\n\nRouted to Smoke for personal domain evaluation.`,
        confidence: 80,
        calendarImpact: 'TBD — pending Smoke analysis',
        dataSource: 'Boss direct input',
        sheldonNote: 'Evaluating. Stand by.',
        syncBusConflict: false,
        status: 'pending',
        createdAt: now,
      })
      setRouted({ stream: 'smoke', label: 'Smoke', color: '#0EA5E9' })
      addBossMessage(`New request → @Smoke: "${idea}"`)
    } else {
      const route = routeToStackz(idea)
      addStackzApproval({
        id,
        stream: 'stackz',
        team: route.team,
        agentId: route.agentId,
        title: `Boss Idea: ${idea.slice(0, 60)}${idea.length > 60 ? '...' : ''}`,
        description: `Direct idea from The Boss: "${idea}"\n\nRouted to ${route.agentName} for evaluation and execution planning.`,
        riskLevel: 'low',
        estimatedImpact: 'TBD — pending agent analysis',
        cost: 'TBD',
        confidence: 75,
        status: 'pending',
        createdAt: now,
      })
      setRouted({ stream: 'stackz', label: route.agentName, color: '#10B981' })
      addBossMessage(`New idea → @${route.agentName}: "${idea}"`)
    }

    setSubmitted(true)
    setIdea('')
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="glass-panel p-4">
      <div className="hq-label mb-3">Submit Idea / Request</div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Type a raw idea or request — auto-routed to Smoke (personal) or Stackz teams (business)..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white
                     placeholder-white/20 focus:outline-none resize-none transition-all leading-relaxed"
          style={{ '--tw-border-opacity': 1 }}
          onFocus={(e) => {
            const c = routePreview?.color || '#ffffff'
            e.currentTarget.style.borderColor = `${c}35`
          }}
          onBlur={(e) => e.currentTarget.style.borderColor = ''}
          rows={3}
        />
        <div className="flex items-center justify-between mt-2">
          {routePreview ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-white/40">
              Routes to:{' '}
              <span className="font-mono font-medium" style={{ color: routePreview.color }}>
                @{routePreview.label}
              </span>
              <span className="text-white/25"> · {routePreview.sublabel}</span>
            </motion.div>
          ) : (
            <div />
          )}
          <button
            type="submit"
            disabled={!idea.trim()}
            className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Submit →
          </button>
        </div>
      </form>

      {submitted && routed && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-3 p-2.5 rounded-lg text-xs font-mono"
          style={{
            background: `${routed.color}10`,
            border: `1px solid ${routed.color}25`,
            color: routed.color,
          }}
        >
          Routed to @{routed.label} — added to {routed.stream === 'smoke' ? 'Smoke' : 'Stackz'} approval queue
        </motion.div>
      )}
    </div>
  )
}
