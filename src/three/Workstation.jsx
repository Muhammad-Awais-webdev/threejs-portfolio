import { Float } from '@react-three/drei'
import { useParallax } from './useParallax'

const BODY = '#dedad1'
const DARK = '#26241f'
const SCREEN = '#171717'
const ACCENT = '#d96c45'
const PLANT = '#6b7455'

function Monitor() {
  return (
    <group position={[0, 0.35, 0]}>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.2, 1.4, 0.08]} />
        <meshStandardMaterial color={DARK} roughness={0.55} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[2.0, 1.2]} />
        <meshStandardMaterial color={SCREEN} roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[-0.6, 0.28, 0.05]}>
        <planeGeometry args={[1.0, 0.16]} />
        <meshStandardMaterial color={BODY} roughness={0.4} />
      </mesh>
      <mesh position={[-0.75, -0.05, 0.05]}>
        <planeGeometry args={[0.55, 0.4]} />
        <meshStandardMaterial color="#3a3830" roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.85, -0.1]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.55, 12]} />
        <meshStandardMaterial color={DARK} roughness={0.5} />
      </mesh>
      <mesh position={[0, -1.14, -0.1]} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.04, 24]} />
        <meshStandardMaterial color={DARK} roughness={0.5} />
      </mesh>
    </group>
  )
}

function Keyboard() {
  return (
    <mesh position={[0, -1.16, 0.9]} rotation={[-0.15, 0, 0]} castShadow>
      <boxGeometry args={[1.5, 0.06, 0.55]} />
      <meshStandardMaterial color={BODY} roughness={0.6} />
    </mesh>
  )
}

function Mouse() {
  return (
    <mesh position={[1.05, -1.14, 0.85]} rotation={[0, 0.3, 0]} castShadow>
      <capsuleGeometry args={[0.09, 0.14, 4, 12]} />
      <meshStandardMaterial color={BODY} roughness={0.5} />
    </mesh>
  )
}

function Plant() {
  return (
    <group position={[-1.55, -0.85, 0.4]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.22, 0.17, 0.4, 16]} />
        <meshStandardMaterial color={ACCENT} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.24, 12, 12]} />
        <meshStandardMaterial color={PLANT} roughness={0.8} />
      </mesh>
    </group>
  )
}

function Books() {
  return (
    <group position={[1.6, -1.1, 0.15]}>
      <mesh castShadow>
        <boxGeometry args={[0.7, 0.08, 0.5]} />
        <meshStandardMaterial color={BODY} roughness={0.6} />
      </mesh>
      <mesh position={[0.02, 0.14, 0]} castShadow>
        <boxGeometry args={[0.62, 0.08, 0.45]} />
        <meshStandardMaterial color={DARK} roughness={0.6} />
      </mesh>
    </group>
  )
}

function FloatingCube() {
  return (
    <Float speed={1.6} rotationIntensity={1.1} floatIntensity={1.4}>
      <mesh position={[1.9, 0.9, -0.6]} castShadow>
        <boxGeometry args={[0.32, 0.32, 0.32]} />
        <meshStandardMaterial color={BODY} roughness={0.4} />
      </mesh>
    </Float>
  )
}

function Workstation() {
  const ref = useParallax(0.2)
  return (
    <group ref={ref}>
      <group position={[0, 0.55, 0]} scale={0.72}>
        <Monitor />
        <Keyboard />
        <Mouse />
        <Plant />
        <Books />
        <FloatingCube />
      </group>
    </group>
  )
}

export default Workstation
