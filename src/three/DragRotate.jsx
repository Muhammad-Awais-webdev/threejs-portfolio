import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

// Wraps children in a group that can be dragged (pointer) to rotate,
// and slowly auto-rotates on the Y axis when idle.
function DragRotate({ children, autoRotateSpeed = 0.15, resetKey }) {
  const group = useRef(null)
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })
  const velocity = useRef(0)

  useFrame((_, delta) => {
    if (!group.current) return
    if (dragging.current) return
    velocity.current += (autoRotateSpeed - velocity.current) * 0.02
    group.current.rotation.y += delta * velocity.current
  })

  const onPointerDown = (e) => {
    e.stopPropagation()
    dragging.current = true
    last.current = { x: e.clientX, y: e.clientY }
    e.target.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!dragging.current || !group.current) return
    const dx = e.clientX - last.current.x
    const dy = e.clientY - last.current.y
    group.current.rotation.y += dx * 0.008
    group.current.rotation.x = Math.max(
      -0.6,
      Math.min(0.6, group.current.rotation.x + dy * 0.006),
    )
    last.current = { x: e.clientX, y: e.clientY }
  }

  const stopDragging = (e) => {
    dragging.current = false
    e.target?.releasePointerCapture?.(e.pointerId)
  }

  return (
    <group
      key={resetKey}
      ref={group}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerOut={stopDragging}
    >
      {children}
      <mesh visible={false}>
        <boxGeometry args={[3.4, 3.4, 3.4]} />
      </mesh>
    </group>
  )
}

export default DragRotate
