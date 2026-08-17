import { lazy, Suspense } from 'react'
import Reveal from './Reveal'
import { systems } from '../data/profile'

const SystemScene = lazy(() => import('../three/SystemScene'))

function Systems() {
  return (
    <section className="section systems">
      <Reveal as="p" className="eyebrow">
        07 / PHP / Systems
      </Reveal>
      <div className="systems-grid">
        <Reveal className="systems-copy">
          <p className="systems-kicker">PHP</p>
          <h2 className="section-heading">{systems.title}</h2>
          <ul className="systems-list">
            {systems.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="systems-diagram-panel">
          <Suspense fallback={<div className="scene-fallback" aria-hidden="true" />}>
            <SystemScene />
          </Suspense>
          <span className="work-drag-hint work-drag-hint-dark">Hover a node, drag to explore</span>
        </Reveal>
      </div>
    </section>
  )
}

export default Systems
