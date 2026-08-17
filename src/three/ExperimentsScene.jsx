import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import LiquidOrb from './LiquidOrb'
import WebglGate from './WebglGate'

function ExperimentsScene() {
  const interaction = useRef({ hovering: false })

  return (
    <WebglGate fallback={<div className="scene-fallback" aria-hidden="true" />}>
      <div
        style={{ width: '100%', height: '100%' }}
        onPointerEnter={() => {
          interaction.current.hovering = true
        }}
        onPointerLeave={() => {
          interaction.current.hovering = false
        }}
      >
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4.4], fov: 40 }} gl={{ alpha: true }}>
          <Suspense fallback={null}>
            <LiquidOrb interaction={interaction} />
          </Suspense>
        </Canvas>
      </div>
    </WebglGate>
  )
}

export default ExperimentsScene
