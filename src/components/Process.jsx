import { motion } from 'framer-motion'
import Reveal from './Reveal'
import { process } from '../data/profile'

function Process() {
  return (
    <section className="section">
      <Reveal as="p" className="eyebrow">
        06 / How I build
      </Reveal>
      <div className="process">
        <motion.div
          className="process-line"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        <ol className="process-steps">
          {process.map((item, index) => (
            <Reveal as="li" key={item.step} delay={index * 0.08}>
              <span className="process-step">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default Process
