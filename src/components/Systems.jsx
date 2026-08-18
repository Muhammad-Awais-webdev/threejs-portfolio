import Reveal from './Reveal'
import SystemDiagram2D from './SystemDiagram2D'
import { systems } from '../data/profile'

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
          <SystemDiagram2D />
        </Reveal>
      </div>
    </section>
  )
}

export default Systems
