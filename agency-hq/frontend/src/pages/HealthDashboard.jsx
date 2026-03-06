import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import healthData from '@mock/health.json'

// Overview tab
import HealthKPIStrip from '../components/health/HealthKPIStrip'
import GoalsTracker from '../components/health/GoalsTracker'
import DailyHabits from '../components/health/DailyHabits'
import WeeklySchedule from '../components/health/WeeklySchedule'
import StreakTracker from '../components/health/StreakTracker'

// Intelligence tab
import SheldonBrief from '../components/health/SheldonBrief'
import ConflictDetector from '../components/health/ConflictDetector'
import RecoveryAlert from '../components/health/RecoveryAlert'
import EnergyMap from '../components/health/EnergyMap'
import HealthBusinessCorrelation from '../components/health/HealthBusinessCorrelation'
import SuggestionQueue from '../components/health/SuggestionQueue'

// Data tab
import ProtocolStack from '../components/health/ProtocolStack'
import ResourcesLibrary from '../components/health/ResourcesLibrary'
import DataLog from '../components/health/DataLog'
import AppointmentIntel from '../components/health/AppointmentIntel'

const TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'intelligence', label: 'Intelligence', icon: '🧠' },
  { id: 'data', label: 'Data', icon: '📋' },
]

function SheldonReactor() {
  const { kpiOverview } = healthData
  const score = kpiOverview.healthScore.current
  const isGood = score >= 75

  return (
    <div
      className="relative flex items-center gap-3 p-4 rounded-xl bg-smoke-blue/4 border border-smoke-blue/15 overflow-hidden"
      style={{ boxShadow: '0 0 30px rgba(14, 165, 233, 0.06)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(14, 165, 233, 0.06), transparent 70%)' }}
      />
      <div
        className="relative w-12 h-12 rounded-xl bg-smoke-blue/8 border border-smoke-blue/25 flex items-center justify-center text-lg font-bold text-smoke-blue"
        style={{ boxShadow: '0 0 15px rgba(14, 165, 233, 0.15)' }}
      >
        S
      </div>
      <div className="relative">
        <div className="text-xs font-mono text-smoke-blue font-bold tracking-wider">SHELDON IS MONITORING</div>
        <div className="text-xs text-white/50 mt-0.5">
          {isGood
            ? '"Metrics are solid this week. Keep the consistency."'
            : '"Some things need attention. I\'ve already queued solutions for your review."'}
        </div>
      </div>
      <div className="relative ml-auto text-right">
        <div className="text-2xl font-mono font-bold text-smoke-blue">{score}</div>
        <div className="text-[9px] text-white/20 font-mono">/100</div>
      </div>
    </div>
  )
}

export default function HealthDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="h-full overflow-y-auto p-6 space-y-5">
      <PageHeader
        title="Sheldon"
        accent="Health & Life"
        accentColor="neon-text-smoke"
        subtitle={<>Chief of Staff — Health Intelligence</>}
      />

      {/* Sheldon reactor */}
      <SheldonReactor />

      {/* Tab navigation */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-mono transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-white/[0.08] text-white/90 shadow-sm'
                : 'text-white/35 hover:text-white/55 hover:bg-white/[0.03]'}`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <HealthKPIStrip />
            <GoalsTracker />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <DailyHabits />
              <WeeklySchedule />
            </div>
            <StreakTracker />
          </motion.div>
        )}

        {activeTab === 'intelligence' && (
          <motion.div
            key="intelligence"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <SheldonBrief />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <ConflictDetector />
              <RecoveryAlert />
            </div>
            <EnergyMap />
            <HealthBusinessCorrelation />
            <SuggestionQueue />
          </motion.div>
        )}

        {activeTab === 'data' && (
          <motion.div
            key="data"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <ProtocolStack />
            <ResourcesLibrary />
            <DataLog />
            <AppointmentIntel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
