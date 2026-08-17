import Reveal from './Reveal'
import { stack } from '../data/profile'

function Stack() {
  return (
    <section id="stack" className="section">
      <Reveal as="p" className="eyebrow">
        05 / Stack
      </Reveal>
      <h2 className="section-heading">What I work with</h2>
      <div className="stack-grid">
        {stack.map((group, index) => (
          <Reveal key={group.group} delay={index * 0.05} className="stack-group">
            <h3>{group.group}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default Stack
