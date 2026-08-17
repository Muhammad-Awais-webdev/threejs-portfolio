import Reveal from './Reveal'
import { profile } from '../data/profile'

function Contact() {
  return (
    <section id="contact" className="section contact">
      <Reveal>
        <p className="eyebrow">10 / Contact</p>
        <h2 className="contact-heading">
          Let's build
          <br />
          something great.
        </h2>
        <p className="contact-prompt">Have a project in mind?</p>
        <a className="contact-email" href={`mailto:${profile.email}`}>
          {profile.email}
          <span aria-hidden="true"> &rarr;</span>
        </a>
        <ul className="contact-social">
          <li>
            <a href={profile.social.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={profile.social.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href={profile.social.behance} target="_blank" rel="noreferrer">
              Behance
            </a>
          </li>
        </ul>
      </Reveal>
    </section>
  )
}

export default Contact
