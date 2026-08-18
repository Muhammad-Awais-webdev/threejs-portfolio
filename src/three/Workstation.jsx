import { useMemo } from 'react'
import * as THREE from 'three'
import { Billboard, Float, RoundedBox } from '@react-three/drei'
import { createDeskGrainTexture, createGlowTexture, createKeycapTexture, createScreenTexture } from './workstationTextures'

const BODY = '#dedad1'
const DARK = '#211f1a'
const SCREEN_BEZEL = '#18160f'
const ACCENT = '#d96c45'
const PLANT = '#6b7455'
const PLANT_DARK = '#565f45'
const MUG = '#3a3630'

const DESK_Y = -1.22

// Camera-facing soft glow, always upright regardless of the model's own
// rotation — a cheap stand-in for a real bloom pass that renders reliably
// on every GPU (unlike full post-processing, which blanked the canvas on
// some WebGL setups).
function Glow({ position = [0, 0, 0], size, color, opacity = 0.4 }) {
  const glowTex = useMemo(() => createGlowTexture(), [])
  return (
    <Billboard position={position}>
      <mesh>
        <planeGeometry args={size} />
        <meshBasicMaterial
          map={glowTex}
          color={color}
          transparent
          opacity={opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </Billboard>
  )
}

function Desk() {
  const grain = useMemo(() => createDeskGrainTexture(), [])
  return (
    <mesh position={[0, DESK_Y - 0.04, 0.35]} receiveShadow>
      <boxGeometry args={[4.4, 0.08, 2.3]} />
      <meshStandardMaterial map={grain} roughnessMap={grain} bumpMap={grain} bumpScale={0.006} roughness={0.6} />
    </mesh>
  )
}

function Monitor() {
  const screenTex = useMemo(() => createScreenTexture(), [])
  const footH = 0.05
  const neckH = 0.4
  const bodyH = 1.3
  const bodyW = 2.1
  const bodyD = 0.08
  const footY = DESK_Y + footH / 2
  const neckY = DESK_Y + footH + neckH / 2
  const bodyY = DESK_Y + footH + neckH + bodyH / 2

  return (
    <group>
      <mesh position={[0, footY, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.36, footH, 32]} />
        <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, neckY, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.05, neckH, 16]} />
        <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.2} />
      </mesh>
      <RoundedBox args={[bodyW, bodyH, bodyD]} radius={0.04} smoothness={4} position={[0, bodyY, 0]} castShadow>
        <meshStandardMaterial color={SCREEN_BEZEL} roughness={0.45} metalness={0.25} />
      </RoundedBox>
      <mesh position={[0, bodyY, bodyD / 2 + 0.004]}>
        <planeGeometry args={[bodyW - 0.14, bodyH - 0.14]} />
        <meshStandardMaterial
          map={screenTex}
          emissive="#ffffff"
          emissiveMap={screenTex}
          emissiveIntensity={0.85}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      <Glow position={[0, bodyY, bodyD / 2 + 0.06]} size={[bodyW * 1.5, bodyH * 1.6]} color="#f3c9a0" opacity={0.4} />
    </group>
  )
}

function Keyboard() {
  const keycapTex = useMemo(() => createKeycapTexture(), [])
  const width = 1.6
  const depth = 0.55
  const height = 0.045
  const y = DESK_Y + height / 2
  return (
    <group position={[0, y, 0.85]} rotation={[-0.05, 0, 0]}>
      <RoundedBox args={[width, height, depth]} radius={0.02} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color={DARK} roughness={0.6} />
      </RoundedBox>
      <mesh position={[0, height / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width - 0.06, depth - 0.06]} />
        <meshStandardMaterial map={keycapTex} roughnessMap={keycapTex} bumpMap={keycapTex} bumpScale={0.003} roughness={0.7} />
      </mesh>
    </group>
  )
}

function Mouse() {
  const r = 0.075
  const y = DESK_Y + r * 0.7
  return (
    <group position={[1.15, y, 0.8]} rotation={[0, 0.32, 0]}>
      <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.72]}>
        <capsuleGeometry args={[r, 0.1, 4, 16]} />
        <meshStandardMaterial color={BODY} roughness={0.35} />
      </mesh>
      <mesh position={[0, r * 0.95, 0.09]}>
        <boxGeometry args={[0.012, 0.01, 0.05]} />
        <meshStandardMaterial color="#8f8577" roughness={0.5} />
      </mesh>
    </group>
  )
}

function leafPositions(count) {
  const arr = []
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
    arr.push({
      angle,
      tilt: 0.1 + Math.random() * 0.12,
      height: 0.4 + Math.random() * 0.18,
      color: Math.random() > 0.5 ? PLANT : PLANT_DARK,
    })
  }
  return arr
}

// Upright tapered blades (snake-plant style) fanned around the pot centre —
// reads clearly as foliage at small scale, unlike a clustered sphere blob.
function Plant() {
  const leaves = useMemo(() => leafPositions(5), [])
  const potH = 0.4
  const potY = DESK_Y + potH / 2

  return (
    <group position={[-1.65, 0, 0.35]}>
      <mesh position={[0, potY, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.17, potH, 16]} />
        <meshStandardMaterial color={ACCENT} roughness={0.75} />
      </mesh>
      <mesh position={[0, potY + potH / 2 + 0.01, 0]}>
        <cylinderGeometry args={[0.225, 0.225, 0.02, 16]} />
        <meshStandardMaterial color="#4a3a2c" roughness={0.9} />
      </mesh>
      {leaves.map((leaf, i) => (
        <group
          key={i}
          position={[Math.cos(leaf.angle) * 0.07, potY + potH / 2, Math.sin(leaf.angle) * 0.07]}
          rotation={[Math.sin(leaf.angle) * leaf.tilt, leaf.angle, Math.cos(leaf.angle) * -leaf.tilt]}
        >
          <mesh position={[0, leaf.height / 2, 0]} castShadow scale={[0.34, 1, 0.62]}>
            <coneGeometry args={[0.055, leaf.height, 6]} />
            <meshStandardMaterial color={leaf.color} roughness={0.75} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Books() {
  const b1H = 0.075
  const b2H = 0.07
  const b1Y = DESK_Y + b1H / 2
  const b2Y = DESK_Y + b1H + b2H / 2

  return (
    <group position={[1.7, 0, 0.1]} rotation={[0, -0.12, 0]}>
      <mesh position={[0, b1Y, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.72, b1H, 0.5]} />
        <meshStandardMaterial color={BODY} roughness={0.6} />
      </mesh>
      <mesh position={[0.03, b2Y, -0.02]} rotation={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.62, b2H, 0.44]} />
        <meshStandardMaterial color={DARK} roughness={0.6} />
      </mesh>
    </group>
  )
}

function Mug() {
  const r = 0.11
  const h = 0.22
  const y = DESK_Y + h / 2
  return (
    <group position={[1.32, 0, 0.55]}>
      <mesh position={[0, y, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[r, r * 0.92, h, 20]} />
        <meshStandardMaterial color={MUG} roughness={0.4} />
      </mesh>
      <mesh position={[r + 0.02, y, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.05, 0.014, 8, 16, Math.PI]} />
        <meshStandardMaterial color={MUG} roughness={0.4} />
      </mesh>
    </group>
  )
}

function FloatingIcosahedron() {
  return (
    <Float speed={1.6} rotationIntensity={1.1} floatIntensity={1.4}>
      <group position={[1.85, 0.65, -0.55]}>
        <Glow size={[0.85, 0.85]} color={ACCENT} opacity={0.35} />
        <mesh>
          <icosahedronGeometry args={[0.2, 0]} />
          <meshBasicMaterial color={ACCENT} wireframe />
        </mesh>
      </group>
    </Float>
  )
}

function Workstation() {
  return (
    <group position={[0, 0.55, 0]} scale={0.72}>
      <Desk />
      <Monitor />
      <Keyboard />
      <Mouse />
      <Plant />
      <Books />
      <Mug />
      <FloatingIcosahedron />
    </group>
  )
}

export default Workstation
