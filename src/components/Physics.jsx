import { lazy, Suspense, useState } from 'react'
import Reveal from './Reveal'

const PhysicsScene = lazy(() => import('../three/PhysicsScene'))

const FEATURES = ['Cursor force', 'Gravity', 'Bounce']

function Physics() {
  const [resetSignal, setResetSignal] = useState(0)

  return (
    <section id="playground" className="section physics">
      <div className="boxlab-header">
        <Reveal as="p" className="eyebrow">
          10 / Playground
        </Reveal>
        <span className="boxlab-tag">3D / Interaction / WebGL</span>
      </div>

      <div className="physics-grid">
        <Reveal className="physics-copy">
          <h2>Physics</h2>
          <p>Move your cursor and watch the objects react.</p>
          <ul className="boxlab-list">
            {FEATURES.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
            <li>
              <button type="button" onClick={() => setResetSignal((v) => v + 1)}>
                Reset <span aria-hidden="true">&rarr;</span>
              </button>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.08} className="physics-canvas">
          <Suspense fallback={<div className="scene-fallback" aria-hidden="true" />}>
            <PhysicsScene resetSignal={resetSignal} />
          </Suspense>
          <span className="work-drag-hint">Move your cursor through the objects</span>
        </Reveal>
      </div>
    </section>
  )
}

export default Physics
