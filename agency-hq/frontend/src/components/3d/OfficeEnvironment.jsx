import { Grid, RoundedBox } from '@react-three/drei'

function Desk({ position, rotation = [0, 0, 0], color = '#1a2035', screenColor = '#0EA5E9' }) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[1.8, 0.08, 0.9]} position={[0, 0.38, 0]} radius={0.02}>
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
      </RoundedBox>
      {[[-0.8, 0, -0.4], [0.8, 0, -0.4], [-0.8, 0, 0.4], [0.8, 0, 0.4]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.025, 0.025, 0.38, 8]} />
          <meshStandardMaterial color="#0d1520" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      <RoundedBox args={[0.8, 0.5, 0.03]} position={[0, 0.67, -0.35]} radius={0.01}>
        <meshStandardMaterial color="#080b14" roughness={0.1} metalness={0.9} />
      </RoundedBox>
      <mesh position={[0, 0.45, -0.34]}>
        <planeGeometry args={[0.74, 0.44]} />
        <meshStandardMaterial color={screenColor} emissive={screenColor} emissiveIntensity={0.6} transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

function ZoneMarker({ position, size, color }) {
  return (
    <mesh position={[position[0], 0.001, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} transparent opacity={0.05} />
    </mesh>
  )
}

function Whiteboard({ position, rotation = [0, 0, 0], color = '#10B981' }) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[3, 2, 0.05]} radius={0.02}>
        <meshStandardMaterial color="#e8e8f0" roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[3.1, 2.1, 0.03]} position={[0, 0, -0.02]} radius={0.02}>
        <meshStandardMaterial color="#1a2035" metalness={0.6} />
      </RoundedBox>
      <mesh position={[-0.5, 0.3, 0.03]}>
        <planeGeometry args={[1.5, 0.02]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
      <mesh position={[-0.3, 0, 0.03]}>
        <planeGeometry args={[1, 0.02]} />
        <meshStandardMaterial color="#0EA5E9" emissive="#0EA5E9" emissiveIntensity={2} />
      </mesh>
    </group>
  )
}

function PhaseBoard({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[2.5, 1.8, 0.05]} radius={0.02}>
        <meshStandardMaterial color="#1a2035" roughness={0.6} />
      </RoundedBox>
      {[[-0.8, 0.5], [0, 0.5], [0.8, 0.5], [-0.8, -0.2], [0, -0.2]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.04]}>
          <planeGeometry args={[0.5, 0.3]} />
          <meshStandardMaterial
            color={i < 3 ? '#F97316' : '#334155'}
            emissive={i < 3 ? '#F97316' : '#0a0a0a'}
            emissiveIntensity={i < 3 ? 0.3 : 0}
            transparent opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function OfficeEnvironment() {
  return (
    <group>
      {/* Main floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0F172A" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Floor grid */}
      <Grid
        position={[0, 0.001, 0]}
        args={[40, 40]}
        cellSize={1}
        cellThickness={0.3}
        cellColor="#0EA5E9"
        sectionSize={5}
        sectionThickness={0.5}
        sectionColor="#0EA5E9"
        fadeDistance={28}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
      />

      {/* Ceiling */}
      <mesh position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#050810" roughness={1} />
      </mesh>

      {/* Walls */}
      {[
        { pos: [0, 3, -14], rot: [0, 0, 0], size: [28, 6] },
        { pos: [0, 3, 14], rot: [0, Math.PI, 0], size: [28, 6] },
        { pos: [-14, 3, 0], rot: [0, Math.PI / 2, 0], size: [28, 6] },
        { pos: [14, 3, 0], rot: [0, -Math.PI / 2, 0], size: [28, 6] },
      ].map((w, i) => (
        <mesh key={i} position={w.pos} rotation={w.rot}>
          <planeGeometry args={w.size} />
          <meshStandardMaterial color="#0a0d1a" roughness={0.9} />
        </mesh>
      ))}

      {/* EXECUTIVE SUITE — Smoke + Stackz */}
      <ZoneMarker position={[-6, 0, -7]} size={[6, 5]} color="#0EA5E9" />
      <Desk position={[-7.2, 0, -7.5]} color="#0a1a25" screenColor="#0EA5E9" />
      <Desk position={[-4.8, 0, -7.5]} color="#0d1f16" screenColor="#10B981" />
      <Whiteboard position={[-12, 2.5, -7]} rotation={[0, Math.PI / 2, 0]} color="#10B981" />

      {/* HR WING — Warden */}
      <ZoneMarker position={[-9, 0, 2]} size={[3.5, 3.5]} color="#F59E0B" />
      <Desk position={[-9, 0, 2]} color="#1a1500" screenColor="#F59E0B" />

      {/* MARKETING FLOOR — Megaphone */}
      <ZoneMarker position={[-2, 0, 5]} size={[5, 4]} color="#EC4899" />
      <Desk position={[-3, 0, 5]} color="#1a0a14" screenColor="#EC4899" />
      <Desk position={[-1, 0, 5.5]} color="#1a0a14" screenColor="#EC4899" />
      {/* Ring light prop */}
      <mesh position={[-2, 1.5, 6.5]}>
        <torusGeometry args={[0.4, 0.04, 8, 32]} />
        <meshStandardMaterial color="#EC4899" emissive="#EC4899" emissiveIntensity={2} />
      </mesh>
      <pointLight position={[-2, 1.5, 6]} color="#EC4899" intensity={0.5} distance={3} />

      {/* DEV FLOOR — Forge */}
      <ZoneMarker position={[5, 0, -2]} size={[5, 5]} color="#6366F1" />
      {[[3.5, 0, -3], [5, 0, -3], [6.5, 0, -3], [4, 0, -1], [6, 0, -1]].map((pos, i) => (
        <Desk key={i} position={pos} color="#100a1a" screenColor="#6366F1" />
      ))}

      {/* STRATEGY ZONE — Radar */}
      <ZoneMarker position={[0, 0, -2]} size={[3.5, 3.5]} color="#14B8A6" />
      <Desk position={[0, 0, -2.5]} color="#0a1a18" screenColor="#14B8A6" />
      <Whiteboard position={[1.5, 2.5, -3.8]} rotation={[0, 0, 0]} color="#14B8A6" />

      {/* DESIGN STUDIO — Canvas */}
      <ZoneMarker position={[-4, 0, -2]} size={[3.5, 3.5]} color="#A78BFA" />
      <Desk position={[-4, 0, -2.5]} color="#130a1a" screenColor="#A78BFA" />
      <mesh position={[-4, 0.6, -1.8]}>
        <boxGeometry args={[1.4, 0.05, 0.7]} />
        <meshStandardMaterial color="#1a1030" metalness={0.5} />
      </mesh>

      {/* FINANCE WAR ROOM — Cashflow */}
      <ZoneMarker position={[8, 0, -7]} size={[5, 4]} color="#22C55E" />
      <Desk position={[7, 0, -7.5]} color="#0a1a10" screenColor="#22C55E" />
      <Desk position={[9, 0, -7.5]} color="#0a1a10" screenColor="#22C55E" />
      <Whiteboard position={[12, 2.5, -7]} rotation={[0, -Math.PI / 2, 0]} color="#22C55E" />

      {/* STARTUP WAR ROOM — Founder */}
      <ZoneMarker position={[8, 0, 5]} size={[5, 4]} color="#F97316" />
      <Desk position={[7, 0, 5]} color="#1a0a00" screenColor="#F97316" />
      <PhaseBoard position={[12, 2.5, 5]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Ceiling lights */}
      {[[-6, -7], [-5, -7], [8, -7], [-9, 2], [-2, 5], [5, -2], [0, -2], [-4, -2], [8, 5]].map(([x, z], i) => (
        <group key={i} position={[x, 5.9, z]}>
          <RoundedBox args={[1.2, 0.02, 0.4]} radius={0.01}>
            <meshStandardMaterial color="#1a2035" roughness={0.5} />
          </RoundedBox>
          <rectAreaLight
            position={[0, -0.1, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            width={1.2}
            height={0.4}
            intensity={3}
            color="#e0f0ff"
          />
        </group>
      ))}
    </group>
  )
}
