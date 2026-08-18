import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const reduceMotion = useReducedMotion()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.2 })

  return <motion.div className="scroll-progress" style={{ scaleX: reduceMotion ? scrollYProgress : scaleX }} />
}

export default ScrollProgress
