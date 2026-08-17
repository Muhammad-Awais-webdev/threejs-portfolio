import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Float } from '@react-three/drei'
import DragRotate from './DragRotate'
import { OBJECTS } from './ProjectObjects'
import WebglGate from './WebglGate'

function ProjectViewerScene({ type, projectKey }) {
  const ObjectComponent = OBJECTS[type] ?? OBJECTS.box

  return (
    <WebglGate fallback={<div className="scene-fallback" aria-hidden="true" />}>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [2.4, 1.3, 3.6], fov: 34 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 4, 2]} intensity={1.2} castShadow />
        <Suspense fallback={null}>
          <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.5}>
            <DragRotate resetKey={projectKey} autoRotateSpeed={0.18}>
              <ObjectComponent />
            </DragRotate>
          </Float>
          <ContactShadows position={[0, -0.95, 0]} opacity={0.3} scale={5} blur={2} far={2} />
        </Suspense>
      </Canvas>
    </WebglGate>
  )
}

export default ProjectViewerScene
