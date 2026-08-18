import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment } from '@react-three/drei'
import DragRotate from './DragRotate'
import Workstation from './Workstation'
import WebglGate from './WebglGate'

function HeroScene() {
  return (
    <WebglGate fallback={<div className="scene-fallback" aria-hidden="true" />}>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [3.5, 1.4, 7], fov: 30 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#f4f2ed']} />
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[3, 4, 2]}
          intensity={1.3}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-1.2, 0.6, 1.4]} intensity={0.5} color="#d96c45" distance={4} />
        <pointLight position={[0.4, 1.4, 1.1]} intensity={0.35} color="#ffffff" distance={3} />
        <Suspense fallback={null}>
          <DragRotate autoRotateSpeed={0.1}>
            <Workstation />
          </DragRotate>
          <ContactShadows position={[0, -0.4, 0]} opacity={0.4} scale={5} blur={2.4} far={1.2} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </WebglGate>
  )
}

export default HeroScene
