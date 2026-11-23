import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { MODELS, type ModelKey } from './models/registry'
import { ViewerContext, type ViewerState } from './ViewerContext'
import { StudioLighting } from './StudioLighting'
import { Stage } from './Stage'
import { themeSignal } from './signal'

export interface Controls {
  rotX: number
  rotY: number
  targetRotX: number
  targetRotY: number
  dragging: boolean
  hovering: boolean
  zoom: number
  pointerX: number
  pointerY: number
  lastInput: number
}

export interface SceneProps {
  model: ModelKey
  controls: MutableRefObject<Controls>
  exploded: boolean
  selected: string | null
  hovered: string | null
  onSelect: (id: string | null) => void
  onHover: (id: string | null) => void
  interactive: boolean
  autoRotate: boolean
  reducedMotion: boolean
  quality: 'high' | 'medium' | 'low'
  /** Scroll progress 0–1 from a pinned story section. */
  scroll?: MutableRefObject<number>
  /** Gentle camera drift that reveals the instrument's depth (hero). */
  drift?: boolean
  /** Localised component names, from the viewer (React context does not cross into the canvas). */
  partNames?: Record<string, string>
  stage?: 'grid' | 'plain' | 'none'
  /** Aim a measurement beam at the floor (pyrometer stories). */
  measureSpot?: boolean
  /** Extra resting rotation added to the model's default orientation. */
  pose?: [number, number, number]
  demo?: boolean
  onReady?: () => void
}

const damp = (a: number, b: number, lambda: number, dt: number) => THREE.MathUtils.damp(a, b, lambda, dt)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

export function Scene(p: SceneProps) {
  const { camera } = useThree()
  const meta = MODELS[p.model]
  const [shown, setShown] = useState<ModelKey>(p.model)
  const shownMeta = MODELS[shown]
  const leaving = useRef(false)
  const pivot = useRef<THREE.Group>(null)
  const inner = useRef<THREE.Group>(null)
  const explode = useRef(0)
  const night = useRef(themeSignal.target)
  const clock = useRef(0)
  const target = useRef(new THREE.Vector3(...meta.camera.target))
  const dist = useRef(meta.camera.distance * 1.25)
  const spot = useRef<THREE.Vector3 | null>(null)
  const tmp = useMemo(() => ({ v: new THREE.Vector3(), box: new THREE.Box3(), dir: new THREE.Vector3(), q: new THREE.Quaternion() }), [])
  const readyFired = useRef(false)
  const beamFrom = useRef(new THREE.Vector3())

  // Model switching: shrink the current instrument away, then bring the next one in.
  useEffect(() => {
    if (p.model !== shown) leaving.current = true
  }, [p.model, shown])

  const partIndex = useMemo(() => Object.fromEntries(shownMeta.parts.map((x, i) => [x.id, i + 1])), [shownMeta])
  const fallbackNames = useMemo(() => Object.fromEntries(shownMeta.parts.map((x) => [x.id, x.name])), [shownMeta])
  const partNames = p.partNames && shown === p.model ? p.partNames : fallbackNames

  const ctx: ViewerState = useMemo(
    () => ({
      explode,
      night,
      clock,
      selected: p.selected,
      hovered: p.hovered,
      interactive: p.interactive,
      showLabels: shownMeta.explodable,
      partIndex,
      partNames,
      select: p.onSelect,
      hover: p.onHover,
    }),
    [p.selected, p.hovered, p.interactive, shownMeta, partIndex, partNames, p.onSelect, p.onHover],
  )

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20)
    const c = p.controls.current
    const reduced = p.reducedMotion

    // Day/night lighting eases over ~1 s, matching the CSS transition.
    if (themeSignal.snap) {
      night.current = themeSignal.target
      themeSignal.snap = false
    } else night.current = damp(night.current, themeSignal.target, 4.2, dt)

    clock.current += dt
    const entrance = reduced ? 1 : easeOut(Math.min(clock.current / 1.6, 1))

    // Explode / reassemble.
    explode.current = damp(explode.current, p.exploded && shownMeta.explodable ? 1 : 0, reduced ? 50 : 2.6, dt)

    // Rotation: slow turntable, slower on hover, paused while dragging or inspecting a part.
    const idleFor = performance.now() / 1000 - c.lastInput
    const speed = !p.autoRotate || reduced || c.dragging || p.selected ? 0 : c.hovering ? 0.05 : idleFor < 1.5 ? 0.08 : 0.22
    c.targetRotY += speed * dt
    c.rotY = damp(c.rotY, c.targetRotY, 6, dt)
    c.rotX = damp(c.rotX, c.targetRotX, 6, dt)

    const s = p.scroll?.current ?? 0
    const g = pivot.current
    if (g) {
      const [bx, by, bz] = shownMeta.rotation
      const [px, py, pz] = p.pose ?? [0, 0, 0]
      const entranceTurn = (1 - entrance) * -1.3
      g.rotation.set(bx + px + c.rotX + s * 0.25, by + py + c.rotY + entranceTurn + s * Math.PI * 0.9, bz + pz)
      let scale = 0.82 + entrance * 0.18
      if (leaving.current) {
        const k = g.scale.x - dt * 3.2
        scale = Math.max(k, 0)
        if (k <= 0.02) {
          leaving.current = false
          clock.current = 0
          explode.current = 0
          setShown(p.model)
        }
      }
      g.scale.setScalar(scale)
      g.position.y = (1 - entrance) * -0.6 + (reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.8) * 0.04)
    }

    // Camera: orbit distance from zoom, exploded state and part focus; gentle parallax and drift.
    const focusOn = p.selected && inner.current ? findPart(inner.current, p.selected) : null
    const goal = tmp.v.set(...shownMeta.camera.target)
    if (shownMeta.camera.explodedTarget) goal.lerp(tmp.dir.set(...shownMeta.camera.explodedTarget), explode.current)
    if (focusOn) {
      tmp.box.setFromObject(focusOn)
      tmp.box.getCenter(goal)
    }
    target.current.lerp(goal, 1 - Math.exp(-4 * dt))
    const baseD = shownMeta.camera.distance * (p.exploded && shownMeta.explodable ? 1.32 : 1) * (focusOn ? 0.6 : 1)
    dist.current = damp(dist.current, baseD * c.zoom * (1 + (1 - entrance) * 0.25), 3.2, dt)

    const t = state.clock.elapsedTime
    const drift = p.drift && !reduced ? Math.sin(t * 0.18) * 0.22 : 0
    const az = 0 /* no pointer parallax: the brief rules out cursor-following effects */ + drift + s * -0.35
    const pol = Math.PI / 2 - 0.16 - s * 0.12 + (p.drift && !reduced ? Math.sin(t * 0.13) * 0.05 : 0)
    camera.position.set(
      target.current.x + dist.current * Math.sin(pol) * Math.sin(az),
      target.current.y + dist.current * Math.cos(pol),
      target.current.z + dist.current * Math.sin(pol) * Math.cos(az),
    )
    camera.lookAt(target.current)

    // Measurement beam target: where the instrument's optical axis meets the floor.
    if (p.measureSpot && shown === 'pyrometer' && inner.current && explode.current < 0.2) {
      inner.current.getWorldPosition(tmp.v)
      tmp.dir.set(0, 0, 1).applyQuaternion(inner.current.getWorldQuaternion(tmp.q))
      const floorY = -1.6
      if (tmp.dir.y < -0.05) {
        const front = tmp.v.clone().addScaledVector(tmp.dir, 2.6 * (pivot.current?.scale.x ?? 1))
        const k = (floorY - front.y) / tmp.dir.y
        spot.current = front.addScaledVector(tmp.dir, k)
        beamFrom.current.copy(tmp.v).addScaledVector(tmp.dir, 2.6 * (pivot.current?.scale.x ?? 1))
      } else spot.current = null
    } else spot.current = null

    if (!readyFired.current && clock.current > 0.05) {
      readyFired.current = true
      p.onReady?.()
    }
  })

  const Model = shownMeta.Component

  return (
    <ViewerContext.Provider value={ctx}>
      <StudioLighting night={night} quality={p.quality} />
      <group ref={pivot}>
        <group ref={inner}>
          <Suspense fallback={null}>
            <Model modelKey={shown} demo={p.demo} />
          </Suspense>
        </group>
      </group>
      {p.stage !== 'none' && <Stage night={night} quality={p.quality} grid={p.stage !== 'plain'} spot={p.measureSpot ? spot : undefined} />}
      {p.measureSpot && <Beam from={beamFrom} to={spot} night={night} />}
    </ViewerContext.Provider>
  )
}

function findPart(root: THREE.Object3D, id: string) {
  let found: THREE.Object3D | null = null
  root.traverse((o) => {
    if (!found && o.userData.partRoot === id) found = o
  })
  return found as THREE.Object3D | null
}

/** Thin aiming beam from the pyrometer optics to the measurement spot. */
function Beam({ from, to, night }: { from: MutableRefObject<THREE.Vector3>; to: MutableRefObject<THREE.Vector3 | null>; night: MutableRefObject<number> }) {
  const mesh = useRef<THREE.Mesh>(null)
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#2b44cc', transparent: true, opacity: 0.5, depthWrite: false }), [])
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), [])
  const v = useMemo(() => new THREE.Vector3(), [])
  useFrame(() => {
    const m = mesh.current
    if (!m) return
    const end = to.current
    m.visible = !!end
    if (!end) return
    v.copy(end).sub(from.current)
    const len = v.length()
    m.position.copy(from.current).addScaledVector(v, 0.5)
    m.quaternion.setFromUnitVectors(up, v.normalize())
    m.scale.set(1, len, 1)
    mat.color.set('#2b44cc').lerp(new THREE.Color('#5fd0ff'), night.current)
    mat.opacity = THREE.MathUtils.lerp(0.45, 0.8, night.current)
  })
  return (
    <mesh ref={mesh} material={mat}>
      <cylinderGeometry args={[0.012, 0.012, 1, 8, 1, true]} />
    </mesh>
  )
}
