import { lazy, Suspense } from 'react'
import Reveal from './Reveal'

const ExperimentsScene = lazy(() => import('../three/ExperimentsScene'))

function Experiments() {
  return (
    <section className="section experiments">
      <Reveal as="p" className="eyebrow">
        09 / Experiments
      </Reveal>
      <h2 className="section-heading">3D / Interaction / WebGL</h2>
      <Reveal delay={0.1} className="experiments-canvas">
        <Suspense fallback={<div className="scene-fallback" aria-hidden="true" />}>
          <ExperimentsScene />
        </Suspense>
      </Reveal>
      <p className="experiments-caption">Move your cursor across it.</p>
    </section>
  )
}

export default Experiments
