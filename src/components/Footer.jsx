import Reveal from './Reveal'
import { profile } from '../data/profile'

function Footer() {
  return (
    <footer className="footer">
      <Reveal className="footer-inner">
        <div className="footer-top">
          <span className="footer-mark">{profile.initials}</span>
          <span className="footer-role">{profile.role}</span>
        </div>
        <p className="footer-stack">React &middot; Node &middot; PHP &middot; 3D</p>
        <p className="footer-copyright">&copy; {new Date().getFullYear()} All rights reserved</p>
      </Reveal>
    </footer>
  )
}

export default Footer
