import { lazy, Suspense, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { projects } from '../data/projects'
import BrowserFrame from './BrowserFrame'
import Reveal from './Reveal'

const ProjectViewerScene = lazy(() => import('../three/ProjectViewerScene'))

function SelectedWork() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = projects[activeIndex]

  return (
    <section id="work" className="section selected-work">
      <Reveal as="p" className="eyebrow">
        03 / Selected work
      </Reveal>

      <div className="work-grid">
        <div className="work-viewer">
          <div className="work-canvas">
            {active.preview.type === 'browser' ? (
              <>
                <BrowserFrame image={active.preview.image} domain={active.preview.domain} />
                <span className="work-drag-hint">Scroll to explore</span>
              </>
            ) : (
              <>
                <Suspense fallback={<div className="scene-fallback" aria-hidden="true" />}>
                  <ProjectViewerScene type={active.preview.object} projectKey={active.slug} />
                </Suspense>
                <span className="work-drag-hint">Drag to rotate</span>
              </>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug}
              className="work-details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3>{active.title}</h3>
              <p className="work-category">
                {active.category} &middot; {active.year}
              </p>
              <p className="work-description">{active.description}</p>
              <ul className="work-tags">
                {active.tech.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <a className="work-link" href={active.url}>
                View project <span aria-hidden="true">&rarr;</span>
              </a>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="work-list">
          <p className="work-list-label">All projects</p>
          <ul>
            {projects.map((project, index) => (
              <li key={project.slug}>
                <button
                  className={`work-list-item ${index === activeIndex ? 'is-active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="work-list-title">{project.title}</span>
                  <span className="work-list-meta">{project.category}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default SelectedWork
