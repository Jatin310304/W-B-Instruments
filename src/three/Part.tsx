import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useViewer } from './ViewerContext'

type V3 = [number, number, number]

interface PartProps {
  id: string
  /** Displacement when fully exploded, in the model's local units. */
  offset?: V3
  /** Extra rotation when fully exploded (radians). */
  turn?: V3
  /** Where the annotation attaches, relative to the part. */
  anchor?: V3
  /** Fraction of the explode timeline (0–1) at which this part starts moving, for a staggered sequence. */
  delay?: number
  children: ReactNode
}

const HIGHLIGHT = new THREE.Color('#3f63ff')
const smooth = (x: number) => x * x * (3 - 2 * x)

/**
 * One separable component of an instrument. Owns its own material copies so it can be highlighted,
 * moves along its explode path, and carries its numbered annotation.
 */
export function Part({ id, offset = [0, 0, 0], turn = [0, 0, 0], anchor = [0, 0, 0], delay = 0, children }: PartProps) {
  const v = useViewer()
  const group = useRef<THREE.Group>(null)
  const label = useRef<HTMLButtonElement>(null)
  const mats = useRef<{ m: THREE.MeshStandardMaterial; emissive: THREE.Color; ei: number; opacity: number; transparent: boolean }[]>([])
  const owned = useRef<{ mesh: THREE.Mesh; material: THREE.Material | THREE.Material[] }[]>([])
  const glow = useRef(0)
  const fade = useRef(1)

  // Clone materials once so highlight and fade stay local to this part.
  useLayoutEffect(() => {
    const list: typeof mats.current = []
    const meshes: typeof owned.current = []
    group.current?.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.castShadow = true
      mesh.receiveShadow = true
      const src = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      const cloned = src.map((m) => {
        const c = (m as THREE.MeshStandardMaterial).clone()
        list.push({ m: c, emissive: c.emissive?.clone() ?? new THREE.Color(0), ei: c.emissiveIntensity ?? 0, opacity: c.opacity, transparent: c.transparent })
        return c
      })
      mesh.material = Array.isArray(mesh.material) ? cloned : cloned[0]
      mesh.userData.partId = id
      meshes.push({ mesh, material: mesh.material })
    })
    mats.current = list
    owned.current = meshes
    return () => list.forEach(({ m }) => m.dispose())
  }, [id])

  useEffect(() => {
    if (label.current) label.current.setAttribute('aria-pressed', String(v.selected === id))
  }, [v.selected, id])

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const raw = THREE.MathUtils.clamp((v.explode.current - delay) / (1 - delay || 1), 0, 1)
    const e = smooth(raw)
    g.position.set(offset[0] * e, offset[1] * e, offset[2] * e)
    g.rotation.set(turn[0] * e, turn[1] * e, turn[2] * e)

    // A re-render of the model can hand a mesh its shared material back; keep our copy attached.
    for (const o of owned.current) if (o.mesh.material !== o.material) o.mesh.material = o.material

    const isSel = v.selected === id
    const isHover = v.hovered === id && v.interactive
    const targetGlow = isSel ? 1 : isHover ? 0.45 : 0
    const targetFade = v.selected && !isSel ? 0.28 : 1
    const k = 1 - Math.exp(-10 * dt)
    glow.current += (targetGlow - glow.current) * k
    fade.current += (targetFade - fade.current) * k
    for (const s of mats.current) {
      if (s.m.emissive && !s.m.userData.ownEmissive) {
        s.m.emissive.copy(s.emissive).lerp(HIGHLIGHT, glow.current * 0.85)
        s.m.emissiveIntensity = s.ei + glow.current * 0.55
      }
      const op = s.opacity * fade.current
      const needsT = s.transparent || op < 0.999
      if (s.m.transparent !== needsT) {
        s.m.transparent = needsT
        s.m.needsUpdate = true
      }
      s.m.opacity = op
      s.m.depthWrite = op > 0.6
    }

    const el = label.current
    if (el) {
      const show = v.showLabels && e > 0.6
      el.style.opacity = show ? String(Math.min(1, (e - 0.6) / 0.25) * (v.selected && !isSel ? 0.5 : 1)) : '0'
      el.style.pointerEvents = show ? 'auto' : 'none'
      el.tabIndex = show ? 0 : -1
    }
  })

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    if (!v.interactive) return
    e.stopPropagation()
    v.hover(id)
  }
  const onOut = () => v.interactive && v.hover(null)
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (!v.interactive || e.delta > 6) return
    e.stopPropagation()
    v.select(v.selected === id ? null : id)
  }

  return (
    <group ref={group} userData={{ partRoot: id }} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
      {children}
      {v.partIndex[id] !== undefined && (
        <Html position={anchor} center zIndexRange={[20, 10]} style={{ pointerEvents: 'none' }}>
          <button
            ref={label}
            type="button"
            className="part-label"
            style={{ opacity: 0 }}
            tabIndex={-1}
            aria-pressed={v.selected === id}
            onClick={(e) => {
              e.stopPropagation()
              v.select(v.selected === id ? null : id)
            }}
          >
            <b>{String(v.partIndex[id]).padStart(2, '0')}</b>
            {v.partNames[id]}
          </button>
        </Html>
      )}
    </group>
  )
}
