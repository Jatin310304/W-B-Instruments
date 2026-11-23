import { useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Floor for the instrument: a fading technical grid, soft contact shadows and an optional
 * measurement spot (used when a pyrometer is aimed at the floor in the MEASURE story).
 */
export function Stage({
  night,
  y = -1.6,
  quality,
  grid = true,
  spot,
}: {
  night: MutableRefObject<number>
  y?: number
  quality: 'high' | 'medium' | 'low'
  grid?: boolean
  spot?: MutableRefObject<THREE.Vector3 | null>
}) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uNight: { value: 0 },
          uTime: { value: 0 },
          uSpot: { value: new THREE.Vector3(0, 0, 999) },
          uSpotOn: { value: 0 },
        },
        vertexShader: /* glsl */ `
          varying vec2 vXZ;
          void main() {
            vec4 w = modelMatrix * vec4(position, 1.0);
            vXZ = w.xz;
            gl_Position = projectionMatrix * viewMatrix * w;
          }`,
        fragmentShader: /* glsl */ `
          uniform float uNight; uniform float uTime; uniform vec3 uSpot; uniform float uSpotOn;
          varying vec2 vXZ;
          float line(vec2 p, float s, float w) {
            vec2 g = abs(fract(p / s - 0.5) - 0.5) * s;
            vec2 fw = fwidth(p) * w;
            vec2 l = 1.0 - smoothstep(vec2(0.0), fw, g);
            return max(l.x, l.y);
          }
          void main() {
            float r = length(vXZ);
            float fade = smoothstep(9.0, 2.0, r);
            float minor = line(vXZ, 0.5, 1.0) * 0.45;
            float major = line(vXZ, 2.5, 1.4);
            float g = max(minor, major) * fade;
            vec3 dayCol = vec3(0.10, 0.14, 0.30);
            vec3 nightCol = vec3(0.35, 0.55, 1.0);
            vec3 col = mix(dayCol, nightCol, uNight);
            float alpha = g * mix(0.16, 0.34, uNight);
            // Measurement spot: target rings and a soft heat bloom.
            float d = distance(vXZ, uSpot.xz);
            float rings = (1.0 - smoothstep(0.0, 0.03, abs(d - 0.28))) + (1.0 - smoothstep(0.0, 0.025, abs(d - 0.55))) * 0.7;
            float pulse = (1.0 - smoothstep(0.0, 0.05, abs(d - fract(uTime * 0.6) * 1.3))) * (1.0 - fract(uTime * 0.6));
            float bloom = exp(-d * d * 9.0);
            vec3 spotCol = mix(vec3(0.17, 0.27, 0.8), vec3(0.3, 0.85, 1.0), uNight);
            vec3 heat = vec3(1.0, 0.45, 0.12);
            col = mix(col, spotCol, clamp((rings + pulse) * uSpotOn, 0.0, 1.0));
            col = mix(col, heat, bloom * uSpotOn * 0.7);
            alpha = max(alpha, (rings * 0.8 + pulse * 0.6 + bloom * 0.55) * uSpotOn);
            gl_FragColor = vec4(col, alpha);
          }`,
      }),
    [],
  )
  const shadows = useRef<THREE.Group>(null)

  useFrame((s) => {
    mat.uniforms.uNight.value = night.current
    mat.uniforms.uTime.value = s.clock.elapsedTime
    const p = spot?.current
    mat.uniforms.uSpotOn.value += ((p ? 1 : 0) - mat.uniforms.uSpotOn.value) * 0.08
    if (p) mat.uniforms.uSpot.value.copy(p)
    // Shadows are a touch deeper at night (cinematic) and softer by day.
    shadows.current?.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.MeshBasicMaterial | undefined
      if (m && 'opacity' in m && (o as THREE.Mesh).isMesh) m.opacity = THREE.MathUtils.lerp(0.42, 0.7, night.current)
    })
  })

  return (
    <group position={[0, y, 0]}>
      {grid && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={mat} renderOrder={-1}>
          <planeGeometry args={[22, 22]} />
        </mesh>
      )}
      {quality !== 'low' && (
        <ContactShadows ref={shadows} position={[0, 0.002, 0]} scale={12} blur={2.6} far={5} resolution={quality === 'high' ? 512 : 256} opacity={0.45} color="#0b1020" />
      )}
    </group>
  )
}
