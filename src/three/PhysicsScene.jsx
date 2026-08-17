import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'
import * as THREE from 'three'
import { buildShapes, Ground, PhysicsObjects, Walls } from './PhysicsObjects'
import WebglGate from './WebglGate'

function PointerTracker({ pointerRef, active }) {
  const { camera } = useThree()
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const hit = useMemo(() => new THREE.Vector3(), [])

  useFrame((state) => {
    // Position keeps tracking even outside the hover bounds so an in-progress
    // drag (pointer-captured on the canvas) doesn't freeze mid-motion; only
    // the ambient repel force is gated on actually hovering the panel.
    pointerRef.current.active = active.current
    raycaster.setFromCamera(state.pointer, camera)
    if (raycaster.ray.intersectPlane(plane, hit)) {
      pointerRef.current.x = hit.x
      pointerRef.current.y = hit.y
      pointerRef.current.z = hit.z
    }
  })

  return null
}

function PhysicsScene({ resetSignal }) {
  const shapes = useMemo(() => buildShapes(22), [])
  const pointerRef = useRef({ x: 0, y: 0, z: 0, active: false })
  const hoveringRef = useRef(false)
  const dragRef = useRef({ id: null, velocity: [0, 0, 0] })

  return (
    <WebglGate fallback={<div className="scene-fallback" aria-hidden="true" />}>
      <div
        style={{ width: '100%', height: '100%' }}
        onPointerEnter={() => {
          hoveringRef.current = true
        }}
        onPointerLeave={() => {
          hoveringRef.current = false
        }}
      >
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 0.6, 5.6], fov: 34 }} gl={{ alpha: true }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[3, 4, 2]} intensity={1} castShadow />
          <Suspense fallback={null}>
            <PointerTracker pointerRef={pointerRef} active={hoveringRef} />
            <Physics gravity={[0, -9.8, 0]}>
              <Ground />
              <Walls />
              <PhysicsObjects shapes={shapes} pointerRef={pointerRef} resetSignal={resetSignal} dragRef={dragRef} />
            </Physics>
          </Suspense>
        </Canvas>
      </div>
    </WebglGate>
  )
}

export default PhysicsScene
