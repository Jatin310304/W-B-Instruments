import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { MutableRefObject } from 'react'

/**
 * Studio lighting that follows the day/night theme.
 * Day: bright architectural light, warm-white softboxes and gentle shadows.
 * Night: low ambient, cool blue rim light and narrow neon strips that read as reflections on metal.
 * The reflection environment is rendered from a tiny procedural "studio" scene and regenerated in
 * steps while the theme eases, so reflections change smoothly too.
 */

type Panel = { size: [number, number]; pos: [number, number, number]; rot?: [number, number, number]; day: [string, number]; night: [string, number] }

const ROOM = { day: ['#6b6964', 0.5] as [string, number], night: ['#04060d', 1] as [string, number] }
const PANELS: Panel[] = [
  { size: [14, 5], pos: [0, 9, 0], rot: [Math.PI / 2, 0, 0], day: ['#ffffff', 3.4], night: ['#5d74b8', 0.9] },
  { size: [1.4, 12], pos: [-8, 2, 2], rot: [0, Math.PI / 2, 0], day: ['#ffffff', 2.6], night: ['#3f6bff', 4.2] },
  { size: [1.1, 12], pos: [8, 1, -2], rot: [0, -Math.PI / 2, 0], day: ['#ffe8cc', 2.2], night: ['#22c4ff', 2.6] },
  { size: [12, 1.6], pos: [0, -1, -9], day: ['#dfe7ff', 1.4], night: ['#14204a', 0.8] },
  { size: [7, 7], pos: [0, 2, 10], rot: [0, Math.PI, 0], day: ['#fff7ee', 0.95], night: ['#18224a', 0.35] },
  // Dark studio floor gives metal a horizon line, which is what makes it read as polished steel.
  { size: [24, 24], pos: [0, -4, 0], rot: [-Math.PI / 2, 0, 0], day: ['#2f2e2c', 1], night: ['#020308', 1] },
]

const mixColor = (a: [string, number], b: [string, number], t: number, out: THREE.Color) => {
  const ca = new THREE.Color(a[0]).multiplyScalar(a[1])
  const cb = new THREE.Color(b[0]).multiplyScalar(b[1])
  return out.copy(ca).lerp(cb, t)
}

export function StudioLighting({ night, quality }: { night: MutableRefObject<number>; quality: 'high' | 'medium' | 'low' }) {
  const { gl, scene } = useThree()
  const hemi = useRef<THREE.HemisphereLight>(null)
  const key = useRef<THREE.DirectionalLight>(null)
  const rim = useRef<THREE.DirectionalLight>(null)
  const glow = useRef<THREE.PointLight>(null)
  const lastEnv = useRef(-1)

  const env = useMemo(() => {
    const s = new THREE.Scene()
    const roomMat = new THREE.MeshBasicMaterial({ side: THREE.BackSide })
    s.add(new THREE.Mesh(new THREE.BoxGeometry(24, 24, 24), roomMat))
    const panelMats = PANELS.map((p) => {
      const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(...p.size), mat)
      mesh.position.set(...p.pos)
      if (p.rot) mesh.rotation.set(...p.rot)
      s.add(mesh)
      return mat
    })
    const pmrem = new THREE.PMREMGenerator(gl)
    return { s, roomMat, panelMats, pmrem, target: null as THREE.WebGLRenderTarget | null }
  }, [gl])

  const regenerate = (t: number) => {
    mixColor(ROOM.day, ROOM.night, t, env.roomMat.color)
    PANELS.forEach((p, i) => mixColor(p.day, p.night, t, env.panelMats[i].color))
    const next = env.pmrem.fromScene(env.s, 0.035)
    scene.environment = next.texture
    env.target?.dispose()
    env.target = next
    lastEnv.current = t
  }

  useEffect(
    () => () => {
      env.target?.dispose()
      env.pmrem.dispose()
      env.s.traverse((o) => {
        const m = o as THREE.Mesh
        m.geometry?.dispose()
        ;(m.material as THREE.Material | undefined)?.dispose()
      })
      scene.environment = null
    },
    [env, scene],
  )

  const tmp = useMemo(() => new THREE.Color(), [])
  useFrame(() => {
    const t = night.current
    // Rebuild the reflection map in steps (cheap at this resolution) while the theme eases.
    const step = quality === 'low' ? 0.34 : 0.12
    if (lastEnv.current < 0 || Math.abs(t - lastEnv.current) >= step || ((t === 0 || t === 1) && lastEnv.current !== t)) regenerate(t)
    scene.environmentIntensity = THREE.MathUtils.lerp(1, 0.85, t)

    if (hemi.current) {
      hemi.current.color.copy(tmp.set('#ffffff')).lerp(new THREE.Color('#33457e'), t)
      hemi.current.groundColor.set('#cfc8bc').lerp(new THREE.Color('#05070d'), t)
      hemi.current.intensity = THREE.MathUtils.lerp(0.9, 0.35, t)
    }
    if (key.current) {
      key.current.color.set('#fff3e2').lerp(new THREE.Color('#a9b9ff'), t)
      key.current.intensity = THREE.MathUtils.lerp(2.6, 0.7, t)
    }
    if (rim.current) {
      rim.current.color.set('#d7e4ff').lerp(new THREE.Color('#3d6bff'), t)
      rim.current.intensity = THREE.MathUtils.lerp(0.9, 3.2, t)
    }
    if (glow.current) glow.current.intensity = THREE.MathUtils.lerp(0, 6, t)
  })

  return (
    <>
      <hemisphereLight ref={hemi} />
      <directionalLight ref={key} position={[5, 8, 6]} />
      <directionalLight ref={rim} position={[-6, 3, -6]} />
      {/* Night: a soft cyan glow from below, like an illuminated display nearby. */}
      <pointLight ref={glow} position={[2.5, -1.2, 3]} color="#38b6ff" distance={12} decay={2} />
    </>
  )
}
