import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment } from '@react-three/drei'
import Workstation from './Workstation'
import WebglGate from './WebglGate'

function HeroScene() {
  return (
    <WebglGate fallback={<div className="scene-fallback" aria-hidden="true" />}>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [2.7, 1.1, 5.4], fov: 30 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[3, 4, 2]}
          intensity={1.1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <Suspense fallback={null}>
          <Workstation />
          <ContactShadows position={[0, -0.4, 0]} opacity={0.4} scale={5} blur={2.4} far={1.2} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </WebglGate>
  )
}

export default HeroScene
