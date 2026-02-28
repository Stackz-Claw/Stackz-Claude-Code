import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useAgentStore } from '../../../store/agentStore'

// Stackz — Chief of Biz Ops — sharp blazer, green, pacing energy
export default function StackzAgent({ onClick }) {
  const groupRef = useRef()
  const headRef = useRef()
  const armLRef = useRef()
  const armRRef = useRef()
  const legLRef = useRef()
  const legRRef = useRef()
  const [hovered, setHovered] = useState(false)
  const baseX = -5

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    // COO pacing energy
    groupRef.current.position.x = baseX + Math.sin(t * 1.8) * 0.35
    if (headRef.current) headRef.current.rotation.y = Math.sin(t * 1.4) * 0.3
    if (armLRef.current) armLRef.current.rotation.x = Math.sin(t * 1.8) * 0.35
    if (armRRef.current) armRRef.current.rotation.x = Math.sin(t * 1.8 + Math.PI) * 0.35
    if (legLRef.current) legLRef.current.rotation.x = Math.sin(t * 1.8) * 0.2
    if (legRRef.current) legRRef.current.rotation.x = Math.sin(t * 1.8 + Math.PI) * 0.2
    groupRef.current.scale.setScalar(hovered ? 1.05 : 1)
  })

  const GREEN = '#10B981'
  const SUIT = '#0d1f16'

  return (
    <group
      ref={groupRef}
      position={[baseX, 0, -7]}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Legs */}
      <mesh ref={legLRef} position={[-0.1, 0.35, 0]}>
        <boxGeometry args={[0.18, 0.7, 0.15]} />
        <meshStandardMaterial color={SUIT} />
      </mesh>
      <mesh ref={legRRef} position={[0.1, 0.35, 0]}>
        <boxGeometry args={[0.18, 0.7, 0.15]} />
        <meshStandardMaterial color={SUIT} />
      </mesh>
      {/* Body (sharp blazer) */}
      <mesh position={[0, 0.88, 0]}>
        <boxGeometry args={[0.46, 0.52, 0.22]} />
        <meshStandardMaterial color={SUIT} roughness={0.35} metalness={0.25} />
      </mesh>
      {/* Tie */}
      <mesh position={[0, 0.88, 0.12]}>
        <planeGeometry args={[0.04, 0.3]} />
        <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={0.4} />
      </mesh>
      {/* Head */}
      <mesh ref={headRef} position={[0, 1.24, 0]}>
        <sphereGeometry args={[0.15, 12, 10]} />
        <meshStandardMaterial color="#6B4A2A" roughness={0.75} />
      </mesh>
      {/* Eyes — intense */}
      {[[-0.05, 1.27, 0.13], [0.05, 1.27, 0.13]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={2} />
        </mesh>
      ))}
      {/* Arms */}
      <mesh ref={armLRef} position={[-0.28, 0.88, 0]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.12, 0.44, 0.12]} />
        <meshStandardMaterial color={SUIT} roughness={0.4} />
      </mesh>
      <mesh ref={armRRef} position={[0.28, 0.88, 0]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.12, 0.44, 0.12]} />
        <meshStandardMaterial color={SUIT} roughness={0.4} />
      </mesh>
      {/* Hover ring */}
      {hovered && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.4, 32]} />
          <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={2} transparent opacity={0.7} />
        </mesh>
      )}
      {hovered && (
        <Html position={[0, 2, 0]} center distanceFactor={5}>
          <div className="glass-panel px-3 py-1.5 text-center pointer-events-none whitespace-nowrap">
            <div className="text-xs font-mono font-bold" style={{ color: GREEN }}>STACKZ</div>
            <div className="text-[10px] text-white/50">Chief of Biz Ops</div>
          </div>
        </Html>
      )}
      <pointLight position={[0, 1, 0.5]} color={GREEN} intensity={hovered ? 2 : 0.6} distance={3} />
    </group>
  )
}
