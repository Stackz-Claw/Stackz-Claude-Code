import { AnimatePresence, motion } from 'framer-motion'
import { useUIStore } from './store/uiStore'
import TopBar from './components/layout/TopBar'
import Sidebar from './components/layout/Sidebar'
import Atmosphere from './components/layout/Atmosphere'
import LoadScreen from './pages/LoadScreen'
import OfficeWorld from './pages/OfficeWorld'
import ExecutiveOverview from './pages/ExecutiveOverview'
import FinancialDashboard from './pages/FinancialDashboard'
import HealthDashboard from './pages/HealthDashboard'
import SmartNotes from './pages/SmartNotes'
import ApprovalsPage from './pages/ApprovalsPage'

const PAGE_MAP = {
  office: OfficeWorld,
  executive: ExecutiveOverview,
  financial: FinancialDashboard,
  health: HealthDashboard,
  notes: SmartNotes,
  approvals: ApprovalsPage,
}

function MainApp() {
  const activeView = useUIStore((s) => s.activeView)
  const ActivePage = PAGE_MAP[activeView] || OfficeWorld

  return (
    <div className="flex flex-col h-screen bg-hq-dark overflow-hidden">
      <Atmosphere />
      <TopBar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <ActivePage />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const isLoading = useUIStore((s) => s.isLoading)

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loadscreen"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LoadScreen />
          </motion.div>
        )}
      </AnimatePresence>
      {!isLoading && <MainApp />}
    </>
  )
}
