import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useDayNight } from '../../hooks/useDayNight'
import * as THREE from 'three'

export default function DayNightCycle() {
  const ambientRef = useRef()
  const dirLightRef = useRef()
  const { ambientIntensity, sunColor, sunIntensity } = useDayNight()

  useFrame(() => {
    if (ambientRef.current) {
      ambientRef.current.intensity += (ambientIntensity - ambientRef.current.intensity) * 0.01
    }
    if (dirLightRef.current) {
      dirLightRef.current.intensity += (sunIntensity - dirLightRef.current.intensity) * 0.01
    }
  })

  return (
    <>
      <ambientLight ref={ambientRef} color="#8090b0" intensity={ambientIntensity} />
      <directionalLight
        ref={dirLightRef}
        position={[10, 15, 5]}
        color={sunColor}
        intensity={sunIntensity}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Accent fill lights for neon atmosphere */}
      <pointLight position={[-8, 4, -8]} color="#9d4edd" intensity={0.8} distance={8} />
      <pointLight position={[8, 4, -8]} color="#00ff88" intensity={0.8} distance={8} />
      <pointLight position={[0, 4, 4]} color="#00d4ff" intensity={0.5} distance={8} />
    </>
  )
}
