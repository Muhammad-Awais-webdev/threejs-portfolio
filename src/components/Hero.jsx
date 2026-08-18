import { lazy, Suspense } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { profile } from '../data/profile'

const HeroScene = lazy(() => import('../three/HeroScene'))

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="top" className="hero">
      <motion.div
        className="hero-copy"
        variants={reduceMotion ? undefined : container}
        initial={reduceMotion ? false : 'hidden'}
        animate="show"
      >
        <motion.p className="eyebrow" variants={reduceMotion ? undefined : item}>
          01 / Hero
        </motion.p>
        <motion.h1 variants={reduceMotion ? undefined : item}>
          Web developer
          <br />
          building
          <br />
          digital systems.
        </motion.h1>
        <motion.p className="hero-tagline" variants={reduceMotion ? undefined : item}>
          {profile.tagline}
        </motion.p>
        <motion.a className="button button-primary" href="#work" variants={reduceMotion ? undefined : item}>
          Explore work
          <span aria-hidden="true"> &rarr;</span>
        </motion.a>
      </motion.div>

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
