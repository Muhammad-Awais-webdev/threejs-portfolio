import Reveal from './Reveal'
import { about } from '../data/profile'

function Capabilities() {
  return (
    <section id="about" className="section">
      <Reveal as="p" className="eyebrow">
        04 / About
      </Reveal>
      <div className="capabilities-grid">
        <Reveal className="capabilities-copy">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Reveal>
        <Reveal delay={0.1} as="ul" className="capabilities-stats">
          {about.stats.map((stat) => (
            <li key={stat.label}>
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default Capabilities
