import Reveal from './Reveal'
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

        <Reveal delay={0.1} className="systems-diagram" aria-hidden="true">
          <div className="diagram-node">Frontend</div>
          <div className="diagram-connector" />
          <div className="diagram-node diagram-node-accent">PHP</div>
          <div className="diagram-branches">
            <div className="diagram-branch">
              <div className="diagram-connector diagram-connector-branch" />
              <div className="diagram-node diagram-node-small">Database</div>
            </div>
            <div className="diagram-branch">
              <div className="diagram-connector diagram-connector-branch" />
              <div className="diagram-node diagram-node-small">API</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default Systems
