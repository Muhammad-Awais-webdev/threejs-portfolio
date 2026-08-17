import { COLORS } from './colors'

export function BoxObject() {
  return (
    <group position={[0, -0.2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1.6, 1.2, 1.4]} />
        <meshStandardMaterial color={COLORS.kraft} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.75, -0.55]} rotation={[-0.9, 0, 0]} castShadow>
        <boxGeometry args={[1.56, 1.36, 0.04]} />
        <meshStandardMaterial color={COLORS.kraftDark} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0, 0.705]}>
        <planeGeometry args={[0.9, 0.5]} />
        <meshStandardMaterial color="#f4f2ed" roughness={0.9} />
      </mesh>
    </group>
  )
}

export function BrowserObject() {
  return (
    <group position={[0, 0, 0]} rotation={[0.05, -0.15, 0]}>
      <mesh castShadow>
        <boxGeometry args={[2.0, 1.3, 0.06]} />
        <meshStandardMaterial color={COLORS.dark} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.02, 0.04]}>
        <planeGeometry args={[1.86, 1.0]} />
        <meshStandardMaterial color="#f4f2ed" roughness={0.9} />
      </mesh>
      <mesh position={[-0.65, 0.52, 0.045]}>
        <planeGeometry args={[1.5, 0.14]} />
        <meshStandardMaterial color={COLORS.muted} roughness={0.8} />
      </mesh>
      <mesh position={[-0.5, 0.15, 0.05]}>
        <planeGeometry args={[0.7, 0.35]} />
        <meshStandardMaterial color={COLORS.accent} roughness={0.7} />
      </mesh>
      <mesh position={[0.35, 0.1, 0.05]}>
        <planeGeometry args={[0.55, 0.45]} />
        <meshStandardMaterial color={COLORS.muted} roughness={0.7} />
      </mesh>
      <mesh position={[-0.5, -0.35, 0.05]}>
        <planeGeometry args={[1.5, 0.14]} />
        <meshStandardMaterial color={COLORS.body} roughness={0.8} />
      </mesh>
    </group>
  )
}

export function AbstractObject() {
  return (
    <group>
      <mesh castShadow>
        <icosahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial color={COLORS.body} roughness={0.5} flatShading />
      </mesh>
      <mesh scale={1.35}>
        <icosahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial color={COLORS.accent} wireframe />
      </mesh>
    </group>
  )
}

export const OBJECTS = {
  box: BoxObject,
  browser: BrowserObject,
  abstract: AbstractObject,
}
