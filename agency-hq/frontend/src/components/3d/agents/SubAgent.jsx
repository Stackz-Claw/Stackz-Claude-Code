import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { AGENT_PERSONALITIES } from '../../../data/personalities'

const ARCHETYPE_CONFIGS = {
  'The Enforcer': { idleType: 'clipboard', bobSpeed: 0.6 },
  'The Hype Machine': { idleType: 'energetic', bobSpeed: 2.2 },
  'The Engineer': { idleType: 'typing', bobSpeed: 0.8 },
  'The Scout': { idleType: 'scanning', bobSpeed: 1.2 },
  'The Perfectionist': { idleType: 'precise', bobSpeed: 0.5 },
  'The Paranoid CFO': { idleType: 'ledger', bobSpeed: 0.7 },
  'The Operator': { idleType: 'planning', bobSpeed: 1.0 },
  'The Nerd': { idleType: 'typing', bobSpeed: 0.8 },
  'The Hype Man': { idleType: 'energetic', bobSpeed: 2.5 },
  'The Skeptic': { idleType: 'armsCrossed', bobSpeed: 0.4 },
  'The Overachiever': { idleType: 'rapid', bobSpeed: 1.5 },
  'The Slacker Who Somehow Delivers': { idleType: 'chill', bobSpeed: 0.1 },
}

export default function SubAgent({ agentId, position, onClick }) {
  const groupRef = useRef()
  const headRef = useRef()
  const armLRef = useRef()
  const armRRef = useRef()
  const [hovered, setHovered] = useState(false)

  const personality = AGENT_PERSONALITIES[agentId]
  if (!personality) return null

  const config = ARCHETYPE_CONFIGS[personality.archetype] || { idleType: 'typing', bobSpeed: 1 }

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    switch (config.idleType) {
      case 'energetic':
        groupRef.current.position.y = Math.abs(Math.sin(t * config.bobSpeed)) * 0.1
        if (armLRef.current) armLRef.current.rotation.x = Math.sin(t * 3) * 0.55
        if (armRRef.current) armRRef.current.rotation.x = Math.sin(t * 3 + Math.PI) * 0.55
        break
      case 'typing':
        if (armLRef.current) armLRef.current.rotation.x = -0.6 + Math.sin(t * 4) * 0.05
        if (armRRef.current) armRRef.current.rotation.x = -0.6 + Math.sin(t * 4 + 0.5) * 0.05
        if (headRef.current) headRef.current.rotation.x = -0.1
        break
      case 'clipboard':
        if (armLRef.current) { armLRef.current.rotation.z = -0.4; armLRef.current.rotation.x = -0.5 }
        if (headRef.current) headRef.current.rotation.y = Math.sin(t * 0.6) * 0.15
        break
      case 'scanning':
        if (headRef.current) headRef.current.rotation.y = Math.sin(t * 1.2) * 0.4
        groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.2
        break
      case 'precise':
        if (armLRef.current) armLRef.current.rotation.x = -0.4
        if (armRRef.current) armRRef.current.rotation.x = -0.4
        if (headRef.current) headRef.current.rotation.x = -0.15
        break
      case 'ledger':
        if (armLRef.current) armLRef.current.rotation.x = -0.5 + Math.sin(t * 2) * 0.04
        if (armRRef.current) armRRef.current.rotation.x = -0.5 + Math.sin(t * 2 + 0.3) * 0.04
        if (headRef.current) headRef.current.rotation.y = Math.sin(t * 0.3) * 0.08
        break
      case 'planning':
        groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.15
        if (armRRef.current) armRRef.current.rotation.x = -0.3 + Math.sin(t * 1.5) * 0.2
        break
      case 'armsCrossed':
        if (armLRef.current) armLRef.current.rotation.z = 0.6
        if (armRRef.current) armRRef.current.rotation.z = -0.6
        if (headRef.current) headRef.current.rotation.y = Math.sin(t * 0.5) * 0.2
        break
      case 'rapid':
        if (armLRef.current) armLRef.current.rotation.x = Math.sin(t * 5) * 0.3
        if (armRRef.current) armRRef.current.rotation.x = Math.sin(t * 5 + 1) * 0.3
        groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.1
        break
      case 'chill':
        groupRef.current.rotation.z = Math.sin(t * 0.1) * 0.02
        if (headRef.current) headRef.current.rotation.x = 0.15
        break
      default:
        if (headRef.current) headRef.current.rotation.y = Math.sin(t * 0.4) * 0.2
    }
    groupRef.current.scale.setScalar(hovered ? 1.08 : 1)
  })

  const color = personality.color

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {[[-0.1, 0], [0.1, 0]].map(([x], i) => (
        <mesh key={i} position={[x, 0.35, 0]}>
          <boxGeometry args={[0.16, 0.68, 0.13]} />
          <meshStandardMaterial color="#0d1220" />
        </mesh>
      ))}
      <mesh position={[0, 0.88, 0]}>
        <boxGeometry args={[0.4, 0.52, 0.2]} />
        <meshStandardMaterial color={`${color}18`} emissive={color} emissiveIntensity={0.06} roughness={0.8} />
      </mesh>
      <mesh ref={headRef} position={[0, 1.23, 0]}>
        <sphereGeometry args={[0.14, 10, 8]} />
        <meshStandardMaterial color="#7A5A3A" roughness={0.8} />
      </mesh>
      {[[-0.04, 1.26, 0.13], [0.04, 1.26, 0.13]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.018, 6, 6]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
        </mesh>
      ))}
      <mesh ref={armLRef} position={[-0.25, 0.88, 0]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.11, 0.42, 0.11]} />
        <meshStandardMaterial color={`${color}12`} roughness={0.9} />
      </mesh>
      <mesh ref={armRRef} position={[0.25, 0.88, 0]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.11, 0.42, 0.11]} />
        <meshStandardMaterial color={`${color}12`} roughness={0.9} />
      </mesh>
      {hovered && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.34, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.6} />
        </mesh>
      )}
      {hovered && (
        <Html position={[0, 1.8, 0]} center distanceFactor={5}>
          <div className="glass-panel px-3 py-1.5 text-center pointer-events-none whitespace-nowrap">
            <div className="text-xs font-mono font-bold" style={{ color }}>{personality.name.toUpperCase()}</div>
            <div className="text-[10px] text-white/50">{personality.title}</div>
          </div>
        </Html>
      )}
      <pointLight position={[0, 1, 0.5]} color={color} intensity={hovered ? 1.2 : 0.3} distance={2.5} />
    </group>
  )
}
