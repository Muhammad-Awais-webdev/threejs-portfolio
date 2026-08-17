import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment } from '@react-three/drei'
import DragRotate from './DragRotate'
import BoxLabModel from './BoxLabModel'
import WebglGate from './WebglGate'

function BoxLabScene({ width, height, depth, color, roughness, metalness }) {
  return (
    <WebglGate fallback={<div className="scene-fallback" aria-hidden="true" />}>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [2.6, 1.6, 5.4], fov: 30 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 4, 2]} intensity={1.2} castShadow />
        <Suspense fallback={null}>
          <DragRotate autoRotateSpeed={0.08}>
            <BoxLabModel
              width={width}
              height={height}
              depth={depth}
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </DragRotate>
          <ContactShadows position={[0, -1.55, 0]} opacity={0.32} scale={8} blur={2.2} far={2.5} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </WebglGate>
  )
}

export default BoxLabScene
