import { lazy, Suspense } from 'react'
import { profile } from '../data/profile'

const HeroScene = lazy(() => import('../three/HeroScene'))

function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero-copy">
        <p className="eyebrow">01 / Hero</p>
        <h1>
          Web developer
          <br />
          building
          <br />
          digital systems.
        </h1>
        <p className="hero-tagline">{profile.tagline}</p>
        <a className="button button-primary" href="#work">
          Explore work
          <span aria-hidden="true"> &rarr;</span>
        </a>
      </div>

      <div className="hero-scene">
        <Suspense fallback={<div className="scene-fallback" aria-hidden="true" />}>
          <HeroScene />
        </Suspense>
      </div>

      <a className="hero-scroll" href="#intro">
        <span aria-hidden="true">&darr;</span> Scroll
      </a>
    </section>
  )
}

export default Hero
