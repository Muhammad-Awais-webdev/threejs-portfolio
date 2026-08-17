import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const RADIUS = 1.3
const SEGMENTS = 90
const IDLE_BEFORE_WAVE = 4
const IDLE_JITTER = 1
const WAVE_ANGULAR_SPEED = Math.PI / 1.3
const WAVE_BAND = 0.55
const WAVE_AMPLITUDE = 0.16
const ROTATE_SPEED = 0.06

// Displacement is computed for the true vertex position and two tangent-
// offset samples each frame, then the three resulting points are used to
// derive a real (not approximated) normal — otherwise the lit surface
// looks flat/wrong wherever it bulges.
const DISPLACEMENT_FN = /* glsl */ `
  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
  }

  float valueNoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n000 = hash(i);
    float n100 = hash(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash(i + vec3(1.0, 1.0, 1.0));
    float nx00 = mix(n000, n100, f.x);
    float nx10 = mix(n010, n110, f.x);
    float nx01 = mix(n001, n101, f.x);
    float nx11 = mix(n011, n111, f.x);
    float nxy0 = mix(nx00, nx10, f.y);
    float nxy1 = mix(nx01, nx11, f.y);
    return mix(nxy0, nxy1, f.z);
  }

  uniform float uTime;
  uniform vec3 uPointer;
  uniform float uPointerActive;
  uniform float uPointerRadius;
  uniform float uPointerStrength;
  uniform float uWaveTime;
  uniform float uWaveSpeed;
  uniform float uWaveBand;
  uniform float uWaveAmplitude;

  float calcDisplacement(vec3 p) {
    float ambient = valueNoise(p * 1.5 + uTime * 0.12) * 0.045;

    float distToPointer = distance(p, uPointer);
    float pointerInfluence = (1.0 - smoothstep(0.0, uPointerRadius, distToPointer)) * uPointerActive;
    float bump = pointerInfluence * uPointerStrength;

    float angle = acos(clamp(dot(normalize(p), vec3(0.0, 1.0, 0.0)), -1.0, 1.0));
    float arrival = angle / uWaveSpeed;
    float local = (uWaveTime - arrival) / uWaveBand;
    float wave = 0.0;
    if (uWaveTime >= 0.0 && local >= 0.0 && local <= 1.0) {
      wave = sin(local * 3.14159265) * uWaveAmplitude;
    }

    return ambient + bump + wave;
  }
`

const VERTEX_SHADER = /* glsl */ `
  ${DISPLACEMENT_FN}

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vDisplacement;

  void main() {
    vec3 n = normalize(normal);
    vec3 up = abs(n.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
    vec3 tangent1 = normalize(cross(n, up));
    vec3 tangent2 = normalize(cross(n, tangent1));
    float eps = 0.03;

    float dCenter = calcDisplacement(position);
    float dTangent1 = calcDisplacement(position + tangent1 * eps);
    float dTangent2 = calcDisplacement(position + tangent2 * eps);

    vec3 p0 = position + n * dCenter;
    vec3 p1 = position + tangent1 * eps + n * dTangent1;
    vec3 p2 = position + tangent2 * eps + n * dTangent2;

    vec3 displacedNormal = normalize(cross(p1 - p0, p2 - p0));
    vDisplacement = dCenter;
    vNormal = normalize(normalMatrix * displacedNormal);

    vec4 mvPosition = modelViewMatrix * vec4(p0, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform vec3 uLightDir;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vDisplacement;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPosition);
    vec3 L = normalize(uLightDir);
    vec3 H = normalize(L + V);

    float diff = max(dot(N, L), 0.0);
    float spec = pow(max(dot(N, H), 0.0), 24.0) * 0.35;
    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.6);

    vec3 base = uColor + vec3(vDisplacement * 0.5);
    vec3 color = base * (0.5 + diff * 0.6) + spec + uAccent * fresnel * 0.6;

    gl_FragColor = vec4(color, 1.0);
  }
`

function LiquidOrb({ interaction }) {
  const meshRef = useRef(null)
  const groupRef = useRef(null)
  const { camera } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector3(1e5, 1e5, 1e5) },
      uPointerActive: { value: 0 },
      uPointerRadius: { value: 0.95 },
      uPointerStrength: { value: 0.45 },
      uWaveTime: { value: -1 },
      uWaveSpeed: { value: WAVE_ANGULAR_SPEED },
      uWaveBand: { value: WAVE_BAND },
      uWaveAmplitude: { value: WAVE_AMPLITUDE },
      uColor: { value: new THREE.Color('#22201c') },
      uAccent: { value: new THREE.Color('#d96c45') },
      uLightDir: { value: new THREE.Vector3(0.6, 0.8, 0.5).normalize() },
    }),
    [],
  )

  window.__dbgUniforms = uniforms

  const sim = useRef(null)
  if (!sim.current) {
    sim.current = {
      raycaster: new THREE.Raycaster(),
      pointerTarget: new THREE.Vector3(1e5, 1e5, 1e5),
      pointerSmoothed: new THREE.Vector3(1e5, 1e5, 1e5),
      pointerActive: 0,
      idleTime: 0,
      waveTime: -1,
      nextIdleThreshold: IDLE_BEFORE_WAVE,
    }
  }

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    const s = sim.current
    const hovering = interaction?.current?.hovering

    if (hovering) {
      s.idleTime = 0
      s.raycaster.setFromCamera(state.pointer, camera)
      const hits = meshRef.current ? s.raycaster.intersectObject(meshRef.current) : []
      window.__dbg3 = (window.__dbg3 || 0) + 1
      if (window.__dbg3 % 20 === 0) {
        console.log('DBG3 hits', hits.length, hits[0] ? hits[0].point.toArray().map((n) => n.toFixed(2)) : null)
      }
      if (hits.length > 0 && meshRef.current) {
        meshRef.current.worldToLocal(s.pointerTarget.copy(hits[0].point))
      }
    } else {
      s.idleTime += delta
      if (s.idleTime >= s.nextIdleThreshold && s.waveTime < 0) {
        s.waveTime = 0
      }
    }

    // Smoothly trail toward the cursor's hit point and fade influence in/out
    // rather than snapping — this is what gives the "glide, then ease back"
    // feel instead of an abrupt bump. Framerate-independent: a fixed
    // per-frame lerp factor would glide slower on slower devices.
    s.pointerSmoothed.lerp(s.pointerTarget, 1 - Math.exp(-delta / 0.12))
    const activeTarget = hovering ? 1 : 0
    s.pointerActive += (activeTarget - s.pointerActive) * (1 - Math.exp(-delta / 0.25))

    if (s.waveTime >= 0) {
      s.waveTime += delta
      const duration = Math.PI / WAVE_ANGULAR_SPEED + WAVE_BAND
      if (s.waveTime >= duration) {
        s.waveTime = -1
        s.idleTime = 0
        s.nextIdleThreshold = IDLE_BEFORE_WAVE + Math.random() * IDLE_JITTER
      }
    }

    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uPointer.value.copy(s.pointerSmoothed)
    uniforms.uPointerActive.value = s.pointerActive
    uniforms.uWaveTime.value = s.waveTime

    window.__dbg2 = (window.__dbg2 || 0) + 1
    if (window.__dbg2 % 20 === 0) {
      console.log(
        'DBG2 active', s.pointerActive.toFixed(3),
        'pointer', s.pointerSmoothed.x.toFixed(2), s.pointerSmoothed.y.toFixed(2), s.pointerSmoothed.z.toFixed(2),
        'radius', uniforms.uPointerRadius.value, 'strength', uniforms.uPointerStrength.value,
      )
    }

    if (groupRef.current) groupRef.current.rotation.y += delta * ROTATE_SPEED
  })

  return (
    <group ref={groupRef} rotation={[-0.25, 0.4, 0]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[RADIUS, SEGMENTS, SEGMENTS]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={VERTEX_SHADER}
          fragmentShader={FRAGMENT_SHADER}
        />
      </mesh>
    </group>
  )
}

export default LiquidOrb
