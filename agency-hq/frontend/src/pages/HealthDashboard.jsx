import PageHeader from '../components/layout/PageHeader'
import HealthMetrics from '../components/health/HealthMetrics'
import SuggestionCard from '../components/health/SuggestionCard'
import SmokeInsights from '../components/health/SmokeInsights'
import LifeTimeline from '../components/health/LifeTimeline'
import healthData from '@mock/health.json'

// Smoke character reactor — aligned to design system (smoke-blue, not purple)
function SmokeReactor({ avgScore }) {
  const isGood = avgScore >= 75
  return (
    <div className="relative flex items-center gap-3 p-4 rounded-xl bg-smoke-blue/4 border border-smoke-blue/15 overflow-hidden" style={{ boxShadow: '0 0 30px rgba(14, 165, 233, 0.06)' }}>
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 20% 50%, rgba(14, 165, 233, 0.06), transparent 70%)',
        }}
      />
      <div className="relative w-12 h-12 rounded-xl bg-smoke-blue/8 border border-smoke-blue/25 flex items-center justify-center text-lg font-bold text-smoke-blue" style={{ boxShadow: '0 0 15px rgba(14, 165, 233, 0.15)' }}>
        S
      </div>
      <div className="relative">
        <div className="text-xs font-mono text-smoke-blue font-bold tracking-wider">SMOKE IS MONITORING</div>
        <div className="text-xs text-white/50 mt-0.5">
          {isGood
            ? '"Metrics are solid this week. Keep the consistency."'
            : '"Some things need attention. I\'ve already queued solutions for your review."'}
        </div>
      </div>
    </div>
  )
}

export default function HealthDashboard() {
  const { suggestions, metrics } = healthData
  const avgScore = Math.round(
    (metrics.sleep.score + metrics.activity.score + metrics.recovery.score + metrics.hrv.score) / 4
  )

  return (
    <div className="h-full overflow-y-auto p-6 space-y-5">
      <PageHeader
        title="Smoke"
        accent="Life & Health"
        accentColor="neon-text-smoke"
        subtitle={<>Overall score: <span className="text-smoke-blue">{avgScore}/100</span></>}
      />

      {/* Smoke reactor */}
      <SmokeReactor avgScore={avgScore} />

      {/* Insights */}
      <SmokeInsights />

      {/* Health metrics */}
      <HealthMetrics />

      {/* Suggestions */}
      <div>
        <div className="hq-label mb-3">Smoke's Action Queue</div>
        <div className="space-y-3">
          {suggestions.map((s) => (
            <SuggestionCard key={s.id} suggestion={s} />
          ))}
        </div>
      </div>

      {/* Timeline */}
      <LifeTimeline />
    </div>
  )
}
