import Reveal from './Reveal'
import { about } from '../data/profile'

function Intro() {
  return (
    <section id="intro" className="section intro">
      <Reveal>
        <p className="eyebrow">02 / Intro</p>
        <h2 className="intro-statement">{about.statement}</h2>
      </Reveal>
    </section>
  )
}

export default Intro
