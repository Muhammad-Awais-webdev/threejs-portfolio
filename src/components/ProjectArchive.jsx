import Reveal from './Reveal'
import { projects } from '../data/projects'

function ProjectArchive() {
  return (
    <section className="section">
      <div className="archive-header">
        <p className="eyebrow">08 / All projects</p>
        <span className="archive-count">{projects.length} projects</span>
      </div>
      <ul className="archive-list">
        {projects.map((project, index) => (
          <Reveal as="li" key={project.slug} delay={index * 0.03}>
            <a className="archive-row" href={project.url}>
              <span className="archive-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="archive-title">
                {project.title}
                <span className="archive-category">{project.category}</span>
              </span>
              <span className="archive-tech">{project.tech.join(' / ')}</span>
              <span className="archive-year">{project.year}</span>
              <span className="archive-arrow" aria-hidden="true">&rarr;</span>
            </a>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

export default ProjectArchive
