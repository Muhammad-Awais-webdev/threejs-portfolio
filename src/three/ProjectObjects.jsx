import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import { COLORS } from './colors'
import BoxLabModel from './BoxLabModel'
import { createGlowTexture } from './workstationTextures'

// Static camera-facing glow — the same additive-blend technique used on the
// hero workstation. Real post-processing bloom blanked the canvas on some
// WebGL setups, so this cheaper, universally-supported stand-in is used
// everywhere a "glow" is needed instead.
function Glow({ position = [0, 0, 0], size = [1, 1], color, opacity = 0.4 }) {
  const glowTex = useMemo(() => createGlowTexture(), [])
  return (
    <Billboard position={position}>
      <mesh>
        <planeGeometry args={size} />
        <meshBasicMaterial map={glowTex} color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </Billboard>
  )
}

// Small glowing motes that drift from yFrom to yTo on a loop, fading in and
// out at the ends — used for rising embers and engine sparks. Position/scale
// are driven imperatively on a plain group (not the Billboard itself) so the
// animation never depends on a drei internal forwarding its ref.
function DriftParticles({ count = 8, radius = 0.85, yFrom = -0.8, yTo = 0.8, color, size = 0.09 }) {
  const glowTex = useMemo(() => createGlowTexture(), [])
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        angle: Math.random() * Math.PI * 2,
        r: 0.1 + Math.random() * radius,
        speed: 0.22 + Math.random() * 0.28,
        offset: Math.random(),
        size: size * (0.7 + Math.random() * 0.6),
      })),
    [count, radius, size],
  )
  const refs = useRef([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    seeds.forEach((seed, i) => {
      const group = refs.current[i]
      if (!group) return
      const cycle = (t * seed.speed + seed.offset) % 1
      const y = yFrom + cycle * (yTo - yFrom)
      group.position.set(Math.cos(seed.angle) * seed.r, y, Math.sin(seed.angle) * seed.r)
      const fade = Math.sin(cycle * Math.PI)
      const s = seed.size * (0.4 + fade * 0.8)
      group.scale.set(s, s, s)
    })
  })

  return (
    <>
      {seeds.map((_, i) => (
        <group key={i} ref={(el) => (refs.current[i] = el)}>
          <Billboard>
            <mesh>
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial map={glowTex} color={color} transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
          </Billboard>
        </group>
      ))}
    </>
  )
}

export function BoxObject() {
  return (
    <group position={[0, -0.2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1.6, 1.2, 1.4]} />
        <meshStandardMaterial color={COLORS.kraft} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.75, -0.55]} rotation={[-0.9, 0, 0]} castShadow>
        <boxGeometry args={[1.56, 1.36, 0.04]} />
        <meshStandardMaterial color={COLORS.kraftDark} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0, 0.705]}>
        <planeGeometry args={[0.9, 0.5]} />
        <meshStandardMaterial color="#f4f2ed" roughness={0.9} />
      </mesh>
    </group>
  )
}

export function BrowserObject() {
  return (
    <group position={[0, 0, 0]} rotation={[0.05, -0.15, 0]}>
      <mesh castShadow>
        <boxGeometry args={[2.0, 1.3, 0.06]} />
        <meshStandardMaterial color={COLORS.dark} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.02, 0.04]}>
        <planeGeometry args={[1.86, 1.0]} />
        <meshStandardMaterial color="#f4f2ed" roughness={0.9} />
      </mesh>
      <mesh position={[-0.65, 0.52, 0.045]}>
        <planeGeometry args={[1.5, 0.14]} />
        <meshStandardMaterial color={COLORS.muted} roughness={0.8} />
      </mesh>
      <mesh position={[-0.5, 0.15, 0.05]}>
        <planeGeometry args={[0.7, 0.35]} />
        <meshStandardMaterial color={COLORS.accent} roughness={0.7} />
      </mesh>
      <mesh position={[0.35, 0.1, 0.05]}>
        <planeGeometry args={[0.55, 0.45]} />
        <meshStandardMaterial color={COLORS.muted} roughness={0.7} />
      </mesh>
      <mesh position={[-0.5, -0.35, 0.05]}>
        <planeGeometry args={[1.5, 0.14]} />
        <meshStandardMaterial color={COLORS.body} roughness={0.8} />
      </mesh>
    </group>
  )
}

export function AbstractObject() {
  return (
    <group>
      <mesh castShadow>
        <icosahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial color={COLORS.body} roughness={0.5} flatShading />
      </mesh>
      <mesh scale={1.35}>
        <icosahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial color={COLORS.accent} wireframe />
      </mesh>
    </group>
  )
}

// A flickering ember core — emissive intensity drifts with layered sine
// waves so it reads as smouldering rather than a flat glowing solid.
function EmberCore() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.material.emissiveIntensity = 0.8 + Math.sin(t * 2.4) * 0.15 + Math.sin(t * 5.3) * 0.08
  })
  return (
    <mesh ref={ref} castShadow>
      <icosahedronGeometry args={[0.55, 1]} />
      <meshStandardMaterial color={COLORS.accent} emissive={COLORS.accent} emissiveIntensity={0.85} roughness={0.35} />
    </mesh>
  )
}

// Ember-currency core for Echo — a glowing, flickering crystal orbited by
// rings, loose shards and rising embers, matching the bot's Embers /
// Whispers / Relics flavor text.
export function EmberObject() {
  const shards = [
    [0.9, 0.5, 0.2, 0.2, true],
    [-0.85, 0.62, -0.28, 0.16, false],
    [0.5, -0.62, 0.58, 0.15, true],
    [-0.6, -0.42, -0.48, 0.18, false],
    [0.12, 0.95, -0.5, 0.13, true],
  ]

  return (
    <group>
      <Glow size={[2, 2]} color={COLORS.accent} opacity={0.5} />
      <EmberCore />
      <DriftParticles count={7} radius={0.55} yFrom={-0.65} yTo={0.75} color={COLORS.accent} size={0.2} />
      <DriftParticles count={6} radius={0.9} yFrom={-0.9} yTo={0.95} color={COLORS.accent} size={0.11} />
      <mesh rotation={[Math.PI / 2.3, 0.3, 0]}>
        <torusGeometry args={[1.05, 0.012, 8, 64]} />
        <meshStandardMaterial color={COLORS.accent} emissive={COLORS.accent} emissiveIntensity={0.5} roughness={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2.6, -0.4, 0.6]}>
        <torusGeometry args={[0.85, 0.01, 8, 64]} />
        <meshStandardMaterial color={COLORS.body} roughness={0.6} />
      </mesh>
      {shards.map(([x, y, z, s, lit], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <octahedronGeometry args={[s, 0]} />
          <meshStandardMaterial
            color={lit ? COLORS.accent : COLORS.dark}
            emissive={lit ? COLORS.accent : '#000000'}
            emissiveIntensity={lit ? 0.5 : 0}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  )
}

// A flickering two-layer flame (orange outer, hot yellow-white core) with a
// glow bleed and a few downward-drifting sparks — the engine "burning".
function RocketFlame() {
  const outerRef = useRef()
  const innerRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (outerRef.current) {
      const s = 1 + Math.sin(t * 9) * 0.08 + Math.sin(t * 17) * 0.05
      outerRef.current.scale.set(1, s, 1)
      outerRef.current.material.emissiveIntensity = 0.55 + Math.sin(t * 11) * 0.15
    }
    if (innerRef.current) {
      const s = 1 + Math.sin(t * 13 + 1.3) * 0.1 + Math.sin(t * 21) * 0.06
      innerRef.current.scale.set(1, s, 1)
      innerRef.current.material.emissiveIntensity = 0.85 + Math.sin(t * 15 + 0.6) * 0.2
    }
  })

  return (
    <group position={[0, -0.32, 0]}>
      <Glow size={[0.75, 0.95]} color={COLORS.accent} opacity={0.5} position={[0, -0.05, 0]} />
      <mesh ref={outerRef} castShadow>
        <coneGeometry args={[0.2, 0.32, 16]} />
        <meshStandardMaterial color={COLORS.accent} emissive={COLORS.accent} emissiveIntensity={0.6} roughness={0.4} />
      </mesh>
      <mesh ref={innerRef} position={[0, -0.03, 0]}>
        <coneGeometry args={[0.11, 0.2, 16]} />
        <meshStandardMaterial color="#ffd8a8" emissive="#ffd8a8" emissiveIntensity={0.9} roughness={0.3} />
      </mesh>
      <DriftParticles count={6} radius={0.1} yFrom={-0.05} yTo={-0.55} color={COLORS.accent} size={0.05} />
    </group>
  )
}

// A small boost rocket for BYS (a Discord server-"bump" bot) — nose, body,
// accent stripe, fins and a lit engine flame.
export function RocketObject() {
  const finAngles = [0, 120, 240]

  return (
    <group position={[0, -0.15, 0]}>
      <mesh position={[0, 1.05, 0]} castShadow>
        <coneGeometry args={[0.34, 0.6, 20]} />
        <meshStandardMaterial color={COLORS.body} roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.34, 1.2, 20]} />
        <meshStandardMaterial color={COLORS.body} roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.345, 0.345, 0.14, 20]} />
        <meshStandardMaterial color={COLORS.accent} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.78, 0.3]}>
        <circleGeometry args={[0.12, 20]} />
        <meshStandardMaterial color={COLORS.dark} roughness={0.25} metalness={0.4} />
      </mesh>
      {finAngles.map((deg) => {
        const rad = (deg * Math.PI) / 180
        return (
          <mesh
            key={deg}
            position={[Math.cos(rad) * 0.34, -0.25, Math.sin(rad) * 0.34]}
            rotation={[0, Math.PI / 2 - rad, 0]}
            castShadow
          >
            <boxGeometry args={[0.03, 0.4, 0.32]} />
            <meshStandardMaterial color={COLORS.dark} roughness={0.5} />
          </mesh>
        )
      })}
      <RocketFlame />
    </group>
  )
}

// A real box-configurator model for PMT — the same realistic geometry as
// the Box Lab section, since PMT literally is a 3D box mockup tool.
export function BoxConfiguratorObject() {
  return (
    <group position={[0, -0.35, 0]} rotation={[0, 0.4, 0]}>
      <BoxLabModel width={1.3} height={1.0} depth={0.9} color={COLORS.kraft} roughness={0.55} metalness={0.08} />
    </group>
  )
}

export const OBJECTS = {
  box: BoxObject,
  browser: BrowserObject,
  abstract: AbstractObject,
  ember: EmberObject,
  rocket: RocketObject,
  boxConfigurator: BoxConfiguratorObject,
}
