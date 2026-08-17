import * as THREE from 'three'

function clamp255(v) {
  return Math.max(0, Math.min(255, v))
}

// A neutral grayscale grain texture (fiber streaks + noise) used as a
// roughness/bump map so any material color still reads as fibrous
// cardboard instead of a flat plastic-looking fill.
export function createGrainTexture() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, size, size)

  const image = ctx.getImageData(0, 0, size, size)
  for (let i = 0; i < image.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 40
    image.data[i] = clamp255(image.data[i] + n)
    image.data[i + 1] = clamp255(image.data[i + 1] + n)
    image.data[i + 2] = clamp255(image.data[i + 2] + n)
  }
  ctx.putImageData(image, 0, 0)

  ctx.globalAlpha = 0.12
  for (let y = 0; y < size; y += 3) {
    ctx.strokeStyle = Math.random() > 0.5 ? '#000000' : '#ffffff'
    ctx.beginPath()
    ctx.moveTo(0, y + Math.random() * 2)
    ctx.lineTo(size, y + Math.random() * 2 - 1)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(3, 3)
  return texture
}

// Striped texture representing the exposed corrugated layer visible at a
// cardboard box's cut edges — the detail that most reads as "real box."
export function createEdgeTexture() {
  const w = 64
  const h = 16
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#e4d5b7'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#b89a6d'
  for (let x = 0; x < w; x += 4) {
    ctx.fillRect(x, 0, 2, h)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  return texture
}
