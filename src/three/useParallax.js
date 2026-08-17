import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

// Smoothly rotates a group toward the pointer position, relative to the canvas.
export function useParallax(strength = 0.25) {
  const ref = useRef(null)
  const { pointer } = useThree()

  useFrame(() => {
    if (!ref.current) return
    const targetY = pointer.x * strength
    const targetX = -pointer.y * strength * 0.6
    ref.current.rotation.y += (targetY - ref.current.rotation.y) * 0.05
    ref.current.rotation.x += (targetX - ref.current.rotation.x) * 0.05
  })

  return ref
}
