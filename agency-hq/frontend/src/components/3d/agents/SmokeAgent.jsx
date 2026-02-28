import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useAgentStore } from '../../../store/agentStore'

// Sheldon — Chief of Staff — slim turtleneck, teal, analytical and still
export default function SmokeAgent({ onClick }) {
  const groupRef = useRef()
  const bodyRef = useRef()
  const headRef = useRef()
  const armLRef = useRef()
  const armRRef = useRef()
  const [hovered, setHovered] = useState(false)
  const agent = useAgentStore((s) => s.agents.find((a) => a.id === 'smoke'))

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    // Very still — data monitor check motion
    groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.02
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.15) * 0.12
      headRef.current.rotation.x = -0.08 + Math.sin(t * 0.18) * 0.03
    }
    if (bodyRef.current) {
      bodyRef.current.position.y = 0.85 + Math.sin(t * 0.35) * 0.008
    }
    if (armLRef.current) armLRef.current.rotation.x = -0.25 + Math.sin(t * 0.3) * 0.04
    if (armRRef.current) armRRef.current.rotation.x = -0.25 + Math.sin(t * 0.3 + 0.8) * 0.04
    groupRef.current.scale.setScalar(hovered ? 1.05 : 1)
  })

  const TEAL = '#0EA5E9'
  const DARK = '#0a1a25'

  return (
    <group
      ref={groupRef}
      position={[-7, 0, -7]}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Legs */}
      {[[-0.1, 0], [0.1, 0]].map(([x], i) => (
        <mesh key={i} position={[x, 0.35, 0]}>
          <boxGeometry args={[0.18, 0.7, 0.15]} />
          <meshStandardMaterial color="#0d1a25" />
        </mesh>
      ))}
      {/* Body (slim turtleneck) */}
      <mesh ref={bodyRef} position={[0, 0.85, 0]}>
        <boxGeometry args={[0.4, 0.5, 0.2]} />
        <meshStandardMaterial color="#0a2035" emissive="#0a2035" roughness={0.7} />
      </mesh>
      {/* Turtleneck collar */}
      <mesh position={[0, 1.12, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.12, 8]} />
        <meshStandardMaterial color="#0a2035" roughness={0.6} />
      </mesh>
      {/* Head */}
      <mesh ref={headRef} position={[0, 1.26, 0]}>
        <sphereGeometry args={[0.14, 12, 10]} />
        <meshStandardMaterial color="#8B6B4A" roughness={0.75} />
      </mesh>
      {/* Eyes — calm, direct */}
      {[[-0.045, 1.29, 0.13], [0.045, 1.29, 0.13]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.018, 6, 6]} />
          <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={1.2} />
        </mesh>
      ))}
      {/* Arms */}
      <mesh ref={armLRef} position={[-0.26, 0.85, 0]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.11, 0.43, 0.11]} />
        <meshStandardMaterial color="#0a2035" roughness={0.7} />
      </mesh>
      <mesh ref={armRRef} position={[0.26, 0.85, 0]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.11, 0.43, 0.11]} />
        <meshStandardMaterial color="#0a2035" roughness={0.7} />
      </mesh>
      {/* Hover ring */}
      {hovered && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.4, 32]} />
          <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={2} transparent opacity={0.7} />
        </mesh>
      )}
      {/* Name tag */}
      {hovered && (
        <Html position={[0, 1.9, 0]} center distanceFactor={5}>
          <div className="glass-panel px-3 py-1.5 text-center pointer-events-none whitespace-nowrap">
            <div className="text-xs font-mono font-bold" style={{ color: TEAL }}>SHELDON</div>
            <div className="text-[10px] text-white/50">Chief of Staff</div>
          </div>
        </Html>
      )}
      <pointLight position={[0, 1, 0.5]} color={TEAL} intensity={hovered ? 1.5 : 0.5} distance={3} />
    </group>
  )
}
