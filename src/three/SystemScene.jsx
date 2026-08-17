import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import DragRotate from './DragRotate'
import SystemDiagram from './SystemDiagram'
import WebglGate from './WebglGate'

function SystemScene() {
  return (
    <WebglGate fallback={<div className="scene-fallback" aria-hidden="true" />}>
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.05, 6], fov: 34 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 3, 2]} intensity={0.8} />
        <pointLight position={[-1, -1, 2]} intensity={0.7} color="#d96c45" />
        <Suspense fallback={null}>
          <DragRotate autoRotateSpeed={0.05}>
            <SystemDiagram />
          </DragRotate>
        </Suspense>
      </Canvas>
    </WebglGate>
  )
}

export default SystemScene
