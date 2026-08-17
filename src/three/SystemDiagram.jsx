import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

const ACCENT = '#d96c45'
const NODE_COLOR = '#26242c'

const NODES = [
  { id: 'react', label: 'React', sub: 'Frontend', position: [-1.7, 0.35, 0.2] },
  { id: 'php', label: 'PHP', sub: 'Backend', position: [-0.5, -0.15, 0] },
  { id: 'api', label: 'API', sub: '', position: [0.8, 0.15, -0.25] },
  { id: 'mysql', label: 'MySQL', sub: 'Database', position: [2.0, -0.5, 0.15] },
]

const EDGES = [
  ['react', 'php'],
  ['php', 'api'],
  ['api', 'mysql'],
]

function nodePosition(id) {
  return NODES.find((n) => n.id === id).position
}

function buildCurve(a, b) {
  const start = new THREE.Vector3(...a)
  const end = new THREE.Vector3(...b)
  const mid = start.clone().lerp(end, 0.5)
  mid.y -= 0.35
  return new THREE.QuadraticBezierCurve3(start, mid, end)
}

function FlowParticles({ curve, active }) {
  const refs = [useRef(null), useRef(null), useRef(null)]

  useFrame((state) => {
    const t = state.clock.elapsedTime
    refs.forEach((ref, i) => {
      if (!ref.current) return
      const phase = (t * 0.35 + i / refs.length) % 1
      ref.current.position.copy(curve.getPointAt(phase))
    })
  })

  return (
    <>
      {refs.map((ref, i) => (
        <mesh ref={ref} key={i}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshBasicMaterial color={ACCENT} transparent opacity={active ? 1 : 0.5} />
        </mesh>
      ))}
    </>
  )
}

function Edge({ from, to, hovered }) {
  const curve = useMemo(() => buildCurve(nodePosition(from), nodePosition(to)), [from, to])
  const tubeGeometry = useMemo(() => new THREE.TubeGeometry(curve, 32, 0.014, 8, false), [curve])

  return (
    <group>
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color={hovered ? ACCENT : '#4a4640'}
          emissive={ACCENT}
          emissiveIntensity={hovered ? 0.9 : 0.12}
          roughness={0.5}
        />
      </mesh>
      <FlowParticles curve={curve} active={hovered} />
    </group>
  )
}

function Node({ node, hovered, onHover, onUnhover }) {
  return (
    <group position={node.position}>
      <RoundedBox
        args={[0.62, 0.5, 0.28]}
        radius={0.05}
        smoothness={4}
        castShadow
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover(node.id)
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          onUnhover(node.id)
        }}
      >
        <meshStandardMaterial
          color={NODE_COLOR}
          roughness={0.35}
          metalness={0.4}
          emissive={hovered ? ACCENT : '#000000'}
          emissiveIntensity={hovered ? 0.4 : 0}
        />
      </RoundedBox>
      <Html position={[0, 0, 0.15]} center distanceFactor={2.6} style={{ pointerEvents: 'none' }}>
        <div className="system-node-label">
          <span className="system-node-title">{node.label}</span>
          {node.sub && <span className="system-node-sub">{node.sub}</span>}
        </div>
      </Html>
    </group>
  )
}

function SystemDiagram() {
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <group rotation={[0, 0.3, 0]}>
      {EDGES.map(([from, to]) => (
        <Edge key={`${from}-${to}`} from={from} to={to} hovered={hoveredId === from || hoveredId === to} />
      ))}
      {NODES.map((node) => (
        <Node
          key={node.id}
          node={node}
          hovered={hoveredId === node.id}
          onHover={setHoveredId}
          onUnhover={(id) => setHoveredId((current) => (current === id ? null : current))}
        />
      ))}
    </group>
  )
}

export default SystemDiagram
