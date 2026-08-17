import * as THREE from 'three'

function clamp255(v) {
  return Math.max(0, Math.min(255, v))
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

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2.4, 1.4)
  return texture
}

// Stylised code-editor screen — traffic-light dots, a thin sidebar, and a
// handful of "text" lines with one accent-colored highlight — used as an
// emissive map so the monitor reads as powered on rather than a flat panel.
export function createScreenTexture() {
  const w = 512
  const h = 320
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#14130f'
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = '#1c1a15'
  ctx.fillRect(0, 0, 46, h)

  const dots = [['#e0604a', 22], ['#d9b64a', 42], ['#5c9e5c', 62]]
  dots.forEach(([color, x]) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, 22, 6, 0, Math.PI * 2)
    ctx.fill()
  })

  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = 'rgba(244, 242, 237, 0.14)'
    ctx.fillRect(14, 60 + i * 26, 22, 4)
  }

  const lineY = 64
  const lineX = 74
  const widths = [220, 160, 260, 120, 200, 90, 240, 150, 180, 60]
  widths.forEach((lw, i) => {
    const y = lineY + i * 22
    ctx.fillStyle = i === 3 ? '#d96c45' : 'rgba(244, 242, 237, 0.55)'
    ctx.fillRect(lineX, y, lw, 8)
  })

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
