import { profile } from '../data/profile'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <span className="footer-mark">{profile.initials}</span>
        <span className="footer-role">{profile.role}</span>
      </div>
      <p className="footer-stack">React &middot; PHP &middot; WordPress &middot; 3D</p>
      <p className="footer-copyright">&copy; {new Date().getFullYear()} All rights reserved</p>
    </footer>
  )
}

export default Footer
