import * as THREE from 'three'

function clamp255(v) {
  return Math.max(0, Math.min(255, v))
}

// Soft radial falloff used for additive-blended "glow" planes — a cheap,
// universally-supported stand-in for a real bloom post-process pass.
export function createGlowTexture() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,0.9)')
  gradient.addColorStop(0.35, 'rgba(255,255,255,0.35)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  return new THREE.CanvasTexture(canvas)
}

// Warm horizontal wood grain for the desk surface — used as both the base
// color map and a roughness/bump map so the streaks actually catch light.
export function createDeskGrainTexture() {
  const w = 512
  const h = 320
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#c9b28c'
  ctx.fillRect(0, 0, w, h)

  for (let i = 0; i < 90; i++) {
    const y = Math.random() * h
    const shade = Math.random() > 0.5 ? 'rgba(90,64,38,' : 'rgba(232,210,171,'
    ctx.strokeStyle = `${shade}${(0.05 + Math.random() * 0.1).toFixed(2)})`
    ctx.lineWidth = 0.5 + Math.random() * 1.8
    ctx.beginPath()
    ctx.moveTo(0, y)
    let cx = 0
    let cy = y
    while (cx < w) {
      cx += 24 + Math.random() * 40
      cy += (Math.random() - 0.5) * 10
      ctx.lineTo(cx, cy)
    }
    ctx.stroke()
  }

  const image = ctx.getImageData(0, 0, w, h)
  for (let i = 0; i < image.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 14
    image.data[i] = clamp255(image.data[i] + n)
    image.data[i + 1] = clamp255(image.data[i + 1] + n)
    image.data[i + 2] = clamp255(image.data[i + 2] + n)
  }
  ctx.putImageData(image, 0, 0)

  // Stretched once across the desk rather than tiled — the streaks are
  // random, not seamless, so any repeat > 1 leaves a visible tile seam.
  return new THREE.CanvasTexture(canvas)
}

const SYNTAX = {
  key: '#c586c0', // import / export / return / const / function
  fn: '#dcdcaa', // component + function names
  str: '#ce9178', // string literals
  tag: '#569cd6', // JSX tags
  plain: '#d4d4d4',
  comment: '#6a9955',
}

// The actual App.jsx shape, hand-tokenised into colored segments — a small
// wink for anyone who looks closely, since it mirrors this file for real.
const CODE_LINES = [
  [{ t: '// App.jsx', c: SYNTAX.comment }],
  [{ t: 'import ', c: SYNTAX.key }, { t: '{ useLenis }', c: SYNTAX.plain }, { t: ' from ', c: SYNTAX.key }, { t: "'./hooks'", c: SYNTAX.str }],
  [{ t: 'import ', c: SYNTAX.key }, { t: 'Hero', c: SYNTAX.fn }, { t: ' from ', c: SYNTAX.key }, { t: "'./Hero'", c: SYNTAX.str }],
  [],
  [{ t: 'export default function ', c: SYNTAX.key }, { t: 'App', c: SYNTAX.fn }, { t: '() {', c: SYNTAX.plain }],
  [{ t: '  useLenis()', c: SYNTAX.plain }],
  [],
  [{ t: '  return (', c: SYNTAX.key }],
  [{ t: '    <main>', c: SYNTAX.tag }],
  [{ t: '      <Hero ', c: SYNTAX.tag }, { t: '/>', c: SYNTAX.tag }],
  [{ t: '      <Work ', c: SYNTAX.tag }, { t: '/>', c: SYNTAX.tag }],
  [{ t: '    </main>', c: SYNTAX.tag }],
  [{ t: '  )', c: SYNTAX.plain }],
  [{ t: '}', c: SYNTAX.plain }],
]

const HIGHLIGHT_LINE = 5

// A real (if hand-tokenised) IDE mockup — tab bar, line numbers, syntax
// colors, a file sidebar and a status bar — used as an emissive map so the
// monitor reads as an actual editor rather than a flat panel of bars.
export function createScreenTexture() {
  const w = 640
  const h = 400
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  const sidebarW = 58
  const tabBarY = 40
  const tabBarH = 30
  const statusBarH = 20
  const codeTop = tabBarY + tabBarH
  const lineNumW = 34
  const lineH = 21
  const fontSize = 13

  ctx.fillStyle = '#1e1e1e'
  ctx.fillRect(0, 0, w, h)

  // Traffic lights
  const dots = [['#e0604a', 22], ['#d9b64a', 42], ['#5c9e5c', 62]]
  dots.forEach(([color, x]) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, 20, 6, 0, Math.PI * 2)
    ctx.fill()
  })

  // Sidebar (activity bar + file list)
  ctx.fillStyle = '#252526'
  ctx.fillRect(0, tabBarY, sidebarW, h - tabBarY - statusBarH)
  const files = ['#569cd6', '#d96c45', '#dcdcaa', '#4ec9b0', '#c586c0']
  files.forEach((color, i) => {
    ctx.fillStyle = color
    ctx.globalAlpha = i === 1 ? 0.9 : 0.45
    ctx.fillRect(16, codeTop + 14 + i * 24, 8, 8)
  })
  ctx.globalAlpha = 1

  // Tab bar
  ctx.fillStyle = '#252526'
  ctx.fillRect(sidebarW, tabBarY, w - sidebarW, tabBarH)
  ctx.fillStyle = '#1e1e1e'
  ctx.fillRect(sidebarW, tabBarY, 118, tabBarH)
  ctx.fillStyle = '#d96c45'
  ctx.fillRect(sidebarW, tabBarY, 118, 2)
  ctx.fillStyle = '#569cd6'
  ctx.fillRect(sidebarW + 12, tabBarY + 11, 8, 8)
  ctx.fillStyle = '#d4d4d4'
  ctx.font = `12px "Segoe UI", sans-serif`
  ctx.textBaseline = 'middle'
  ctx.fillText('App.jsx', sidebarW + 28, tabBarY + tabBarH / 2 + 1)

  // Current-line highlight
  ctx.fillStyle = 'rgba(217, 108, 69, 0.12)'
  ctx.fillRect(sidebarW, codeTop + HIGHLIGHT_LINE * lineH, w - sidebarW, lineH)

  // Code: line numbers + syntax-colored tokens
  ctx.font = `${fontSize}px "Consolas", "Menlo", monospace`
  CODE_LINES.forEach((segments, row) => {
    const y = codeTop + row * lineH + lineH / 2 + 1
    ctx.fillStyle = 'rgba(212, 212, 212, 0.35)'
    ctx.textAlign = 'right'
    ctx.fillText(String(row + 1), sidebarW + lineNumW, y)

    ctx.textAlign = 'left'
    let x = sidebarW + lineNumW + 14
    segments.forEach(({ t, c }) => {
      ctx.fillStyle = c
      ctx.fillText(t, x, y)
      x += ctx.measureText(t).width
    })
  })

  // Blinking cursor at end of the highlighted line
  const cursorLine = CODE_LINES[HIGHLIGHT_LINE]
  const cursorText = cursorLine.map((s) => s.t).join('')
  const cursorX = sidebarW + lineNumW + 14 + ctx.measureText(cursorText).width + 3
  ctx.fillStyle = '#d96c45'
  ctx.fillRect(cursorX, codeTop + HIGHLIGHT_LINE * lineH + 3, 2, lineH - 6)

  // Status bar
  ctx.fillStyle = '#d96c45'
  ctx.fillRect(0, h - statusBarH, w, statusBarH)
  ctx.fillStyle = '#1e1e1e'
  ctx.font = `11px "Segoe UI", sans-serif`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('⌥ main', 12, h - statusBarH / 2 + 1)
  ctx.textAlign = 'right'
  ctx.fillText('JSX', w - 12, h - statusBarH / 2 + 1)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// A grid of keycaps rendered as a repeating texture (bevel highlight + gap
// shadow per key) so the keyboard reads as individual keys without paying
// for dozens of extra meshes.
export function createKeycapTexture() {
  const cols = 14
  const rows = 5
  const cell = 24
  const w = cols * cell
  const h = rows * cell
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#2c2a26'
  ctx.fillRect(0, 0, w, h)

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cell + 2
      const y = r * cell + 2
      const size = cell - 4
      ctx.fillStyle = '#e7e3d8'
      ctx.fillRect(x, y, size, size)
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.fillRect(x, y, size, 3)
      ctx.fillStyle = 'rgba(0,0,0,0.18)'
      ctx.fillRect(x, y + size - 3, size, 3)
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}
