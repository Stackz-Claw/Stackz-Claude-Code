import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload, AdaptiveDpr } from '@react-three/drei'
import OfficeEnvironment from './OfficeEnvironment'
import DayNightCycle from './DayNightCycle'
import CameraController from './CameraController'
import SmokeAgent from './agents/SmokeAgent'
import StackzAgent from './agents/StackzAgent'
import SubAgent from './agents/SubAgent'
import SyncBusLine from './SyncBusLine'
import { useAgentStore } from '../../store/agentStore'

const TEAM_LEAD_POSITIONS = {
  warden: [-9, 0, 1.5],
  megaphone: [-2.5, 0, 4.5],
  forge: [4.5, 0, -2.5],
  radar: [0, 0, -2],
  canvas: [-4, 0, -2],
  cashflow: [7.5, 0, -7],
  founder: [7.5, 0, 4.5],
}

function SceneContent({ onAgentClick }) {
  const setSelectedAgent = useAgentStore((s) => s.setSelectedAgent)
  const getAgent = useAgentStore((s) => s.getAgent)

  const handleAgentClick = (agentId) => {
    const agent = getAgent(agentId)
    if (agent) {
      setSelectedAgent(agent)
      onAgentClick?.(agent)
    }
  }

  return (
    <>
      <DayNightCycle />
      <CameraController />
      <OfficeEnvironment />
      <SyncBusLine />
      <SmokeAgent onClick={() => handleAgentClick('smoke')} />
      <StackzAgent onClick={() => handleAgentClick('stackz')} />
      {Object.entries(TEAM_LEAD_POSITIONS).map(([id, pos]) => (
        <SubAgent
          key={id}
          agentId={id}
          position={pos}
          onClick={() => handleAgentClick(id)}
        />
      ))}
    </>
  )
}

export default function OfficeScene({ onAgentClick }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false }}
      style={{ background: '#0F172A' }}
    >
      <AdaptiveDpr pixelated />
      <Suspense fallback={null}>
        <SceneContent onAgentClick={onAgentClick} />
        <Preload all />
      </Suspense>
    </Canvas>
  )
}
