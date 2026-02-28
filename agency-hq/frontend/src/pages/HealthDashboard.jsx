import HealthMetrics from '../components/health/HealthMetrics'
import SuggestionCard from '../components/health/SuggestionCard'
import SmokeInsights from '../components/health/SmokeInsights'
import LifeTimeline from '../components/health/LifeTimeline'
import healthData from '@mock/health.json'

// Smoke character reactor
function SmokeReactor({ avgScore }) {
  const isGood = avgScore >= 75
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-lg font-bold text-purple-400">
        S
      </div>
      <div>
        <div className="text-xs font-mono text-purple-400 font-bold">SMOKE IS MONITORING</div>
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
    (metrics.sleep.score + metrics.activity.score + metrics.nutrition.score + metrics.mentalWellness.score) / 4
  )

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-white">
            Smoke <span style={{ color: '#9d4edd' }}>Life & Health</span>
          </h2>
          <p className="text-xs text-white/30 font-mono mt-0.5">
            Overall score: <span style={{ color: '#9d4edd' }}>{avgScore}/100</span>
          </p>
        </div>
      </div>

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
