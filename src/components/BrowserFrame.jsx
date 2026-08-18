// Eagerly imports every screenshot so Vite can hash/optimize them as
// build assets, then looks them up by slug at render time.
const screenshots = import.meta.glob('../assets/screenshots/*.webp', { eager: true, import: 'default' })

function screenshotUrl(image) {
  const entry = Object.entries(screenshots).find(([path]) => path.endsWith(`/${image}.webp`))
  return entry?.[1]
}

function BrowserFrame({ image, domain }) {
  const src = screenshotUrl(image)

  return (
    <div className="browser-frame">
      <div className="browser-frame-bar">
        <span className="browser-frame-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="browser-frame-url">{domain}</span>
      </div>
      <div className="browser-frame-viewport" data-lenis-prevent>
        {src && <img src={src} alt={`Screenshot of ${domain}`} loading="lazy" />}
      </div>
    </div>
  )
}

export default BrowserFrame
