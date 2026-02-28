import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSyncBusStore } from '../../store/syncBusStore'

// Glowing data line between Smoke (executive suite) and Stackz positions
const SMOKE_POS = new THREE.Vector3(-7, 0.8, -7)
const STACKZ_POS = new THREE.Vector3(-5, 0.8, -7)

export default function SyncBusLine() {
  const lineRef = useRef()
  const particleRef = useRef()
  const isActive = useSyncBusStore((s) => s.isActive)

  useFrame((state) => {
    if (!lineRef.current || !particleRef.current) return
    const t = state.clock.elapsedTime

    // Pulse the line opacity
    const pulse = 0.3 + Math.abs(Math.sin(t * 1.5)) * 0.4
    lineRef.current.material.opacity = isActive ? pulse : 0.2

    // Animate particle along the line
    const progress = (Math.sin(t * 1.2) + 1) / 2
    particleRef.current.position.lerpVectors(SMOKE_POS, STACKZ_POS, progress)
    particleRef.current.material.opacity = isActive ? 0.8 : 0.3
    const scale = isActive ? 1 + Math.sin(t * 3) * 0.3 : 0.5
    particleRef.current.scale.setScalar(scale)
  })

  const points = [SMOKE_POS, STACKZ_POS]
  const lineGeom = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <group>
      {/* Main line */}
      <line ref={lineRef} geometry={lineGeom}>
        <lineBasicMaterial
          color="#0EA5E9"
          transparent
          opacity={0.4}
          linewidth={2}
        />
      </line>
      {/* Midpoint glow node */}
      <mesh position={[-6, 0.8, -7]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#0EA5E9" emissive="#0EA5E9" emissiveIntensity={isActive ? 3 : 1} />
      </mesh>
      {/* Moving particle */}
      <mesh ref={particleRef} position={[-6, 0.8, -7]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={isActive ? 4 : 1.5} transparent opacity={0.7} />
      </mesh>
      {/* End point glow — Smoke side */}
      <pointLight position={[-7, 1, -7]} color="#0EA5E9" intensity={isActive ? 0.8 : 0.2} distance={2} />
      {/* End point glow — Stackz side */}
      <pointLight position={[-5, 1, -7]} color="#10B981" intensity={isActive ? 0.8 : 0.2} distance={2} />
    </group>
  )
}
