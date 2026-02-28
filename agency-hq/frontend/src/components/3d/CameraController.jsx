import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

export default function CameraController() {
  const controlsRef = useRef()
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 12, 16)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.2}
      minDistance={6}
      maxDistance={30}
      panSpeed={0.5}
      rotateSpeed={0.4}
      zoomSpeed={0.8}
      target={[0, 0, 0]}
      makeDefault
    />
  )
}
