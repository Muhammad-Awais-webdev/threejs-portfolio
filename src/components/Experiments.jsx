import { lazy, Suspense, useState } from 'react'
import Reveal from './Reveal'

const BoxLabScene = lazy(() => import('../three/BoxLabScene'))

const MATERIALS = [
  { id: 'kraft', label: 'Kraft', color: '#b98e5e' },
  { id: 'white', label: 'White', color: '#eae7df' },
  { id: 'black', label: 'Black', color: '#1c1a17' },
  { id: 'recycled', label: 'Recycled', color: '#8f8577' },
]

const RANGES = {
  width: { min: 120, max: 400, default: 240 },
  height: { min: 80, max: 300, default: 180 },
  depth: { min: 60, max: 250, default: 120 },
}

function randomInRange({ min, max }) {
  return Math.round((min + Math.random() * (max - min)) / 5) * 5
}

function Experiments() {
  const [width, setWidth] = useState(RANGES.width.default)
  const [height, setHeight] = useState(RANGES.height.default)
  const [depth, setDepth] = useState(RANGES.depth.default)
  const [materialId, setMaterialId] = useState('kraft')
  const [finish, setFinish] = useState('matte')

  const material = MATERIALS.find((m) => m.id === materialId) ?? MATERIALS[0]
  const roughness = finish === 'matte' ? 0.85 : 0.2
  const metalness = finish === 'matte' ? 0.05 : 0.18

  const reset = () => {
    setWidth(RANGES.width.default)
    setHeight(RANGES.height.default)
    setDepth(RANGES.depth.default)
    setMaterialId('kraft')
    setFinish('matte')
  }

  const randomize = () => {
    setWidth(randomInRange(RANGES.width))
    setHeight(randomInRange(RANGES.height))
    setDepth(randomInRange(RANGES.depth))
    setMaterialId(MATERIALS[Math.floor(Math.random() * MATERIALS.length)].id)
    setFinish(Math.random() > 0.5 ? 'glossy' : 'matte')
  }

  return (
    <section id="experiments" className="section boxlab">
      <div className="boxlab-header">
        <Reveal as="p" className="eyebrow">
          09 / Experiments
        </Reveal>
        <span className="boxlab-tag">3D / Interaction / WebGL</span>
      </div>

      <div className="boxlab-grid">
        <Reveal className="boxlab-copy">
          <h2>Box Lab</h2>
          <p>Interactive 3D packaging configurator. Adjust dimensions, materials and finishes in real time.</p>
          <ul className="boxlab-list">
            <li>
              Dimensions <span aria-hidden="true">&rarr;</span>
            </li>
            <li>
              Material <span aria-hidden="true">&rarr;</span>
            </li>
            <li>
              Finish <span aria-hidden="true">&rarr;</span>
            </li>
            <li>
              <button type="button" onClick={reset}>
                Reset <span aria-hidden="true">&rarr;</span>
              </button>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.08} className="boxlab-canvas">
          <Suspense fallback={<div className="scene-fallback" aria-hidden="true" />}>
            <BoxLabScene
              width={width / 150}
              height={height / 150}
              depth={depth / 150}
              color={material.color}
              roughness={roughness}
              metalness={metalness}
            />
          </Suspense>
          <span className="work-drag-hint">Drag to rotate</span>
        </Reveal>

        <Reveal delay={0.14} className="boxlab-controls">
          <div className="control-group">
            <p className="control-label">Dimensions (mm)</p>
            <label className="slider-row">
              <span>Width</span>
              <input
                type="range"
                min={RANGES.width.min}
                max={RANGES.width.max}
                step={5}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
              />
              <span className="slider-value">{width}</span>
            </label>
            <label className="slider-row">
              <span>Height</span>
              <input
                type="range"
                min={RANGES.height.min}
                max={RANGES.height.max}
                step={5}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
              />
              <span className="slider-value">{height}</span>
            </label>
            <label className="slider-row">
              <span>Depth</span>
              <input
                type="range"
                min={RANGES.depth.min}
                max={RANGES.depth.max}
                step={5}
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
              />
              <span className="slider-value">{depth}</span>
            </label>
          </div>

          <div className="control-group">
            <p className="control-label">Material</p>
            <div className="swatches">
              {MATERIALS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`swatch ${materialId === m.id ? 'is-active' : ''}`}
                  style={{ background: m.color }}
                  aria-label={m.label}
                  aria-pressed={materialId === m.id}
                  onClick={() => setMaterialId(m.id)}
                />
              ))}
            </div>
            <p className="swatch-label">{material.label}</p>
          </div>

          <div className="control-group">
            <p className="control-label">Finish</p>
            <div className="finish-toggle">
              <button
                type="button"
                className={finish === 'matte' ? 'is-active' : ''}
                onClick={() => setFinish('matte')}
              >
                Matte
              </button>
              <button
                type="button"
                className={finish === 'glossy' ? 'is-active' : ''}
                onClick={() => setFinish('glossy')}
              >
                Glossy
              </button>
            </div>
          </div>

          <button type="button" className="randomize-button" onClick={randomize}>
            <span aria-hidden="true">&#8635;</span> Randomize
          </button>
        </Reveal>
      </div>
    </section>
  )
}

export default Experiments
