import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useBox, useSphere } from '@react-three/cannon'
import * as THREE from 'three'

const COLORS = ['#1c1a17', '#f4f2ed', '#8f8577', '#d96c45', '#3a3630']
const KINDS = ['box', 'sphere', 'octa', 'torus']
const FORCE_RADIUS = 1.1
const FORCE_STRENGTH = 10
const DRAG_BOUNDS = { x: 2.05, yMin: -1.1, yMax: 2.6, z: 1.15 }

export function buildShapes(count) {
  const shapes = []
  for (let i = 0; i < count; i++) {
    shapes.push({
      id: i,
      kind: KINDS[i % KINDS.length],
      size: 0.16 + Math.random() * 0.13,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      startPosition: [(Math.random() - 0.5) * 3.4, 1.2 + Math.random() * 2.2, (Math.random() - 0.5) * 1.6],
    })
  }
  return shapes
}

function PhysicsShape({ shape, pointerRef, resetSignal, dragRef }) {
  const isBox = shape.kind === 'box'
  const bodyArgs = {
    mass: 1,
    position: shape.startPosition,
    material: { restitution: 0.55, friction: 0.4 },
    linearDamping: 0.35,
    angularDamping: 0.5,
  }

  const [ref, api] = isBox
    ? useBox(() => ({ ...bodyArgs, args: [shape.size, shape.size, shape.size] }))
    : useSphere(() => ({ ...bodyArgs, args: [shape.size * 0.62] }))

  const livePos = useRef(new THREE.Vector3(...shape.startPosition))

  useEffect(() => api.position.subscribe((p) => livePos.current.set(p[0], p[1], p[2])), [api])

  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    api.position.set(
      shape.startPosition[0] + (Math.random() - 0.5) * 0.6,
      shape.startPosition[1] + Math.random() * 1.2,
      shape.startPosition[2] + (Math.random() - 0.5) * 0.4,
    )
    api.velocity.set(0, 0, 0)
    api.angularVelocity.set(0, 0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal])

  const dragOffset = useRef(new THREE.Vector3())
  const prevDragPos = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    const p = pointerRef.current
    const drag = dragRef.current

    if (drag.id === shape.id) {
      const targetX = THREE.MathUtils.clamp(p.x + dragOffset.current.x, -DRAG_BOUNDS.x, DRAG_BOUNDS.x)
      const targetY = THREE.MathUtils.clamp(p.y + dragOffset.current.y, DRAG_BOUNDS.yMin, DRAG_BOUNDS.yMax)
      const targetZ = THREE.MathUtils.clamp(dragOffset.current.z, -DRAG_BOUNDS.z, DRAG_BOUNDS.z)

      const dt = Math.max(delta, 0.001)
      drag.velocity[0] = (targetX - prevDragPos.current.x) / dt
      drag.velocity[1] = (targetY - prevDragPos.current.y) / dt
      drag.velocity[2] = (targetZ - prevDragPos.current.z) / dt
      prevDragPos.current.set(targetX, targetY, targetZ)

      api.position.set(targetX, targetY, targetZ)
      api.velocity.set(0, 0, 0)
      api.angularVelocity.set(0, 0, 0)
      return
    }

    if (!p.active) return
    const dx = livePos.current.x - p.x
    const dy = livePos.current.y - p.y
    const dz = livePos.current.z - p.z
    const distSq = dx * dx + dy * dy + dz * dz
    if (distSq > FORCE_RADIUS * FORCE_RADIUS || distSq < 0.0001) return
    const dist = Math.sqrt(distSq)
    const strength = (1 - dist / FORCE_RADIUS) * FORCE_STRENGTH
    api.applyForce([(dx / dist) * strength, (dy / dist) * strength + strength * 0.25, (dz / dist) * strength], [0, 0, 0])
  })

  const onPointerDown = (e) => {
    e.stopPropagation()
    const p = pointerRef.current
    dragOffset.current.set(livePos.current.x - p.x, livePos.current.y - p.y, livePos.current.z)
    prevDragPos.current.copy(livePos.current)
    dragRef.current = { id: shape.id, velocity: [0, 0, 0] }
    api.velocity.set(0, 0, 0)
    api.angularVelocity.set(0, 0, 0)
    e.target.setPointerCapture?.(e.pointerId)
    document.body.style.cursor = 'grabbing'
  }

  const onPointerUp = (e) => {
    if (dragRef.current.id !== shape.id) return
    const [vx, vy, vz] = dragRef.current.velocity
    dragRef.current = { id: null, velocity: [0, 0, 0] }
    api.velocity.set(
      THREE.MathUtils.clamp(vx, -6, 6),
      THREE.MathUtils.clamp(vy, -6, 6),
      THREE.MathUtils.clamp(vz, -6, 6),
    )
    e.target.releasePointerCapture?.(e.pointerId)
    document.body.style.cursor = 'auto'
  }

  return (
    <mesh
      ref={ref}
      castShadow
      receiveShadow
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerOver={(e) => {
        e.stopPropagation()
        if (!dragRef.current.id) document.body.style.cursor = 'grab'
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        if (!dragRef.current.id) document.body.style.cursor = 'auto'
      }}
    >
      {shape.kind === 'box' && <boxGeometry args={[shape.size, shape.size, shape.size]} />}
      {shape.kind === 'sphere' && <sphereGeometry args={[shape.size * 0.62, 16, 16]} />}
      {shape.kind === 'octa' && <octahedronGeometry args={[shape.size * 0.72, 0]} />}
      {shape.kind === 'torus' && <torusGeometry args={[shape.size * 0.5, shape.size * 0.2, 10, 20]} />}
      <meshStandardMaterial color={shape.color} roughness={0.45} metalness={0.15} />
    </mesh>
  )
}

export function PhysicsObjects({ shapes, pointerRef, resetSignal, dragRef }) {
  return (
    <>
      {shapes.map((shape) => (
        <PhysicsShape key={shape.id} shape={shape} pointerRef={pointerRef} resetSignal={resetSignal} dragRef={dragRef} />
      ))}
    </>
  )
}

export function Ground() {
  const [ref] = useBox(() => ({ mass: 0, position: [0, -1.35, 0], args: [8, 0.2, 4] }))
  return (
    <mesh ref={ref} receiveShadow>
      <boxGeometry args={[8, 0.2, 4]} />
      <meshStandardMaterial color="#f6f5f1" roughness={0.95} />
    </mesh>
  )
}

export function Walls() {
  useBox(() => ({ mass: 0, position: [-2.3, 0, 0], args: [0.2, 4, 4] }))
  useBox(() => ({ mass: 0, position: [2.3, 0, 0], args: [0.2, 4, 4] }))
  useBox(() => ({ mass: 0, position: [0, 0, -1.35], args: [8, 4, 0.2] }))
  useBox(() => ({ mass: 0, position: [0, 0, 1.35], args: [8, 4, 0.2] }))
  return null
}
