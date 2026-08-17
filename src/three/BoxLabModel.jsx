import { useMemo } from 'react'
import { createEdgeTexture, createGrainTexture } from './cardboardTextures'

const SIDE_FLAP_ANGLE = 1.92 // ~110deg — side flaps stand up and lean back
const END_FLAP_ANGLE = 1.1 // ~63deg — front/back flaps rest lower/flatter

function Flap({ side, width, height, depth, thickness, materialProps }) {
  let pivotPosition
  let rotation
  let flapPosition
  let geometryArgs

  if (side === 'left' || side === 'right') {
    const sign = side === 'left' ? -1 : 1
    const length = width * 0.56
    pivotPosition = [(sign * width) / 2, height / 2, 0]
    rotation = [0, 0, sign * SIDE_FLAP_ANGLE]
    flapPosition = [(sign * length) / 2, 0, 0]
    geometryArgs = [length, thickness, depth * 0.98]
  } else {
    const sign = side === 'front' ? 1 : -1
    const length = depth * 0.52
    pivotPosition = [0, height / 2, (sign * depth) / 2]
    rotation = [-sign * END_FLAP_ANGLE, 0, 0]
    flapPosition = [0, 0, (sign * length) / 2]
    geometryArgs = [width * 0.98, thickness, length]
  }

  return (
    <group position={pivotPosition} rotation={rotation}>
      <mesh position={flapPosition} castShadow>
        <boxGeometry args={geometryArgs} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
    </group>
  )
}

function BoxLabModel({ width, height, depth, color, roughness, metalness }) {
  const grain = useMemo(() => createGrainTexture(), [])
  const edgeMap = useMemo(() => createEdgeTexture(), [])

  const materialProps = {
    color,
    roughness,
    metalness,
    roughnessMap: grain,
    bumpMap: grain,
    bumpScale: 0.004,
  }

  const thickness = Math.max(Math.min(width, height, depth) * 0.025, 0.015)
  const edgeHeight = thickness * 1.6

  return (
    <group position={[0, -height * 0.05, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Exposed corrugated edge along the open top rim of each wall */}
      <mesh position={[0, height / 2 + edgeHeight / 2, depth / 2]}>
        <boxGeometry args={[width * 0.985, edgeHeight, 0.008]} />
        <meshStandardMaterial map={edgeMap} roughness={0.8} />
      </mesh>
      <mesh position={[0, height / 2 + edgeHeight / 2, -depth / 2]}>
        <boxGeometry args={[width * 0.985, edgeHeight, 0.008]} />
        <meshStandardMaterial map={edgeMap} roughness={0.8} />
      </mesh>
      <mesh position={[width / 2, height / 2 + edgeHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[depth * 0.985, edgeHeight, 0.008]} />
        <meshStandardMaterial map={edgeMap} roughness={0.8} />
      </mesh>
      <mesh position={[-width / 2, height / 2 + edgeHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[depth * 0.985, edgeHeight, 0.008]} />
        <meshStandardMaterial map={edgeMap} roughness={0.8} />
      </mesh>

      <Flap side="left" width={width} height={height} depth={depth} thickness={thickness} materialProps={materialProps} />
      <Flap side="right" width={width} height={height} depth={depth} thickness={thickness} materialProps={materialProps} />
      <Flap side="front" width={width} height={height} depth={depth} thickness={thickness} materialProps={materialProps} />
      <Flap side="back" width={width} height={height} depth={depth} thickness={thickness} materialProps={materialProps} />
    </group>
  )
}

export default BoxLabModel
