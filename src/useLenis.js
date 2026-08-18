import { useEffect } from 'react'
import Lenis from 'lenis'

const NAV_OFFSET = -80

// Smooth scrolling, skipped entirely for users who prefer reduced motion.
export function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })

    let frame
    function raf(time) {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    // Route in-page anchor links (nav, hero CTA, scroll hint) through Lenis
    // instead of the browser's instant jump-to-hash.
    function handleAnchorClick(e) {
      const anchor = e.target.closest('a[href^="#"]')
      if (!anchor) return
      const id = anchor.getAttribute('href').slice(1)
      if (!id) return
      const target = document.getElementById(id)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: NAV_OFFSET, duration: 1.2 })
    }
    document.addEventListener('click', handleAnchorClick)

    return () => {
      document.removeEventListener('click', handleAnchorClick)
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])
}
