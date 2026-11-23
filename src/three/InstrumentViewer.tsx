import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type MutableRefObject, type PointerEvent as RPointerEvent, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { Boxes, ChevronLeft, ChevronRight, Expand, Info, Minus, Plus, RotateCcw, Shrink, X, Move3d } from 'lucide-react'
import { Scene, type Controls } from './Scene'
import { MODELS, type ModelKey } from './models/registry'
import { deviceProfile } from '@/lib/device'
import { cn } from '@/lib/cn'
import { useI18n } from '@/i18n/I18nProvider'

export interface InstrumentViewerProps {
  model: ModelKey
  className?: string
  /** Show the floating toolbar (rotate hint, zoom, reset, explode, full screen). */
  toolbar?: boolean
  /** Controlled exploded state (hero buttons live outside the viewer). */
  exploded?: boolean
  onExplodedChange?: (v: boolean) => void
  autoRotate?: boolean
  drift?: boolean
  scroll?: MutableRefObject<number>
  stage?: 'grid' | 'plain' | 'none'
  measureSpot?: boolean
  pose?: [number, number, number]
  demo?: boolean
  /** Let the visitor drag, click parts and zoom. Story sections keep this off so scrolling stays smooth. */
  interactive?: boolean
  /** Shown until the 3D scene is ready, and instead of it when WebGL is unavailable. */
  poster?: ReactNode
  /** Where the info panel and labels sit relative to the canvas. */
  panelSide?: 'left' | 'right'
  ariaLabel?: string
  /** Starting camera distance multiplier (above 1 pulls back). */
  initialZoom?: number
  /** Controlled selected component (optional). */
  selected?: string | null
  onPartSelect?: (id: string | null) => void
}

const ZOOM_MIN = 0.55
const ZOOM_MAX = 1.8

export default function InstrumentViewer({
  model,
  className,
  toolbar = true,
  exploded: explodedProp,
  onExplodedChange,
  autoRotate = true,
  drift,
  scroll,
  stage = 'grid',
  measureSpot,
  pose,
  demo,
  interactive = true,
  poster,
  panelSide = 'right',
  ariaLabel,
  selected: selectedProp,
  initialZoom = 1,
  onPartSelect,
}: InstrumentViewerProps) {
  const device = deviceProfile()
  const V = useI18n().m.viewer
  const base = MODELS[model]
  const tm = (V.models as Record<string, { name: string; parts: Record<string, { name: string; desc: string }> }>)[model]
  const meta = useMemo(() => ({ ...base, name: tm?.name ?? base.name, parts: base.parts.map((p) => ({ ...p, name: tm?.parts[p.id]?.name ?? p.name, desc: tm?.parts[p.id]?.desc ?? p.desc })) }), [base, tm])
  const partNames = useMemo(() => Object.fromEntries(meta.parts.map((x) => [x.id, x.name])), [meta])
  const wrap = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(!device.webgl)
  const [dpr, setDpr] = useState<number>(device.tier === 'high' ? 1.75 : device.tier === 'medium' ? 1.4 : 1)
  const [explodedLocal, setExplodedLocal] = useState(false)
  const exploded = explodedProp ?? explodedLocal
  const setExploded = useCallback(
    (v: boolean) => {
      setExplodedLocal(v)
      onExplodedChange?.(v)
    },
    [onExplodedChange],
  )
  const [selectedLocal, setSelectedLocal] = useState<string | null>(null)
  const selected = selectedProp !== undefined ? selectedProp : selectedLocal
  const setSelected = useCallback(
    (v: string | null) => {
      setSelectedLocal(v)
      onPartSelect?.(v)
    },
    [onPartSelect],
  )
  const [hovered, setHovered] = useState<string | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [showNote, setShowNote] = useState(false)
  const controls = useRef<Controls>({ rotX: 0, rotY: 0, targetRotX: 0, targetRotY: 0, dragging: false, hovering: false, zoom: initialZoom, pointerX: 0, pointerY: 0, lastInput: -10 })
  const drag = useRef<{ id: number; x: number; y: number; type: string; axis: 'x' | 'y' | null } | null>(null)
  const [zoomUi, setZoomUi] = useState(initialZoom)

  // Load the 3D scene only when it is about to be seen; render frames only while on screen.
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '300px 0px' })
    const vis = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '60px 0px' })
    io.observe(el)
    vis.observe(el)
    return () => {
      io.disconnect()
      vis.disconnect()
    }
  }, [])

  const [tabVisible, setTabVisible] = useState(true)
  useEffect(() => {
    const on = () => setTabVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', on)
    return () => document.removeEventListener('visibilitychange', on)
  }, [])

  // Reset inspection state when the instrument changes.
  useEffect(() => {
    setSelected(null)
    setHovered(null)
    if (!meta.explodable && exploded) setExploded(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model])

  useEffect(() => {
    if (!exploded) setSelected(null)
  }, [exploded])

  useEffect(() => {
    const on = () => setFullscreen(document.fullscreenElement === wrap.current)
    document.addEventListener('fullscreenchange', on)
    return () => document.removeEventListener('fullscreenchange', on)
  }, [])

  const setZoom = (z: number) => {
    const v = THREE.MathUtils.clamp(z, ZOOM_MIN, ZOOM_MAX)
    controls.current.zoom = v
    setZoomUi(v)
  }
  const reset = () => {
    const c = controls.current
    c.targetRotX = 0
    c.targetRotY = Math.round(c.targetRotY / (Math.PI * 2)) * Math.PI * 2
    setZoom(initialZoom)
    setSelected(null)
    setExploded(false)
  }
  const toggleFullscreen = () => {
    const el = wrap.current
    if (!el) return
    if (document.fullscreenElement) void document.exitFullscreen()
    else void el.requestFullscreen?.().catch(() => {})
  }

  // ── Pointer: mouse drags rotate on both axes; touch rotates only on clearly horizontal swipes,
  //    so vertical swipes keep scrolling the page (touch-action: pan-y on the wrapper).
  const onPointerDown = (e: RPointerEvent) => {
    if (!interactive || e.button !== 0) return
    if ((e.target as HTMLElement).closest('button, a')) return
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, type: e.pointerType, axis: e.pointerType === 'mouse' ? 'x' : null }
  }
  const onPointerMove = (e: RPointerEvent) => {
    const c = controls.current
    const r = wrap.current?.getBoundingClientRect()
    if (r && e.pointerType === 'mouse') {
      c.pointerX = ((e.clientX - r.left) / r.width) * 2 - 1
      c.pointerY = -(((e.clientY - r.top) / r.height) * 2 - 1)
    }
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (!d.axis) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
      if (Math.abs(dy) > Math.abs(dx)) {
        drag.current = null
        return
      }
      d.axis = 'x'
    }
    if (!c.dragging) {
      c.dragging = true
      wrap.current?.setPointerCapture(e.pointerId)
      wrap.current?.setAttribute('data-grabbing', 'true')
    }
    c.targetRotY += dx * 0.009
    if (d.type === 'mouse') c.targetRotX = THREE.MathUtils.clamp(c.targetRotX + dy * 0.006, -0.7, 0.7)
    c.lastInput = performance.now() / 1000
    d.x = e.clientX
    d.y = e.clientY
  }
  const endDrag = (e: RPointerEvent) => {
    if (drag.current?.id !== e.pointerId) return
    drag.current = null
    controls.current.dragging = false
    wrap.current?.removeAttribute('data-grabbing')
  }

  // Trackpad pinch (ctrl + wheel) zooms; plain wheel always scrolls the page, except in full screen.
  useEffect(() => {
    const el = wrap.current
    if (!el || !interactive) return
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !document.fullscreenElement) return
      e.preventDefault()
      setZoom(controls.current.zoom * (1 + e.deltaY * 0.0025))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [interactive])

  const onKey = (e: KeyboardEvent) => {
    if (!interactive || (e.target as HTMLElement) !== wrap.current) return
    const c = controls.current
    const k = e.key
    if (k === 'ArrowLeft' || k === 'ArrowRight') c.targetRotY += k === 'ArrowLeft' ? -0.35 : 0.35
    else if (k === 'ArrowUp' || k === 'ArrowDown') c.targetRotX = THREE.MathUtils.clamp(c.targetRotX + (k === 'ArrowUp' ? -0.2 : 0.2), -0.7, 0.7)
    else if (k === '+' || k === '=') setZoom(c.zoom * 0.85)
    else if (k === '-') setZoom(c.zoom / 0.85)
    else if ((k === 'e' || k === 'E') && meta.explodable) setExploded(!exploded)
    else if (k === 'r' || k === 'R') reset()
    else if (k === 'Escape' && selected) setSelected(null)
    else return
    e.preventDefault()
    c.lastInput = performance.now() / 1000
  }

  const parts = meta.parts
  const selIndex = parts.findIndex((p) => p.id === selected)
  const selPart = selIndex >= 0 ? parts[selIndex] : null
  const stepPart = (dir: number) => {
    if (!parts.length) return
    const i = selIndex < 0 ? 0 : (selIndex + dir + parts.length) % parts.length
    setSelected(parts[i].id)
  }

  const live = near && !failed
  return (
    <div
      ref={wrap}
      role="group"
      tabIndex={interactive ? 0 : -1}
      aria-roledescription={V.role}
      aria-label={ariaLabel ?? `${meta.name}, ${V.illustration}. ${interactive ? V.keys : ''}`}
      data-interactive={interactive}
      onKeyDown={onKey}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerEnter={() => (controls.current.hovering = true)}
      onPointerLeave={(e) => {
        controls.current.hovering = false
        controls.current.pointerX = 0
        controls.current.pointerY = 0
        endDrag(e)
      }}
      className={cn('viewer select-none overflow-hidden', fullscreen && 'stage-bg', className)}
    >
      {/* Poster: visible until the scene is ready, and permanently when WebGL is unavailable. */}
      {poster && <div className={cn('absolute inset-0 transition-opacity duration-700', ready && !failed ? 'pointer-events-none opacity-0' : 'opacity-100')}>{poster}</div>}

      {live && (
        <Canvas
          className="!absolute inset-0"
          frameloop={visible && tabVisible ? 'always' : 'never'}
          dpr={[1, dpr]}
          gl={{ antialias: device.tier !== 'low', alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
          camera={{ fov: meta.camera.fov ?? 30, near: 0.1, far: 80, position: [0, 0, meta.camera.distance] }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault()
              setFailed(true)
            })
          }}
          onPointerMissed={() => selected && setSelected(null)}
          aria-hidden
        >
          <PerformanceMonitor onDecline={() => setDpr((d) => Math.max(1, d - 0.35))} flipflops={3} onFallback={() => setDpr(1)} />
          <Scene
            model={model}
            controls={controls}
            exploded={exploded}
            selected={selected}
            hovered={hovered}
            onSelect={setSelected}
            onHover={setHovered}
            interactive={interactive}
            autoRotate={autoRotate}
            reducedMotion={device.reducedMotion}
            quality={device.tier}
            scroll={scroll}
            drift={drift}
            stage={stage}
            measureSpot={measureSpot}
            pose={pose}
            demo={demo}
            onReady={() => setReady(true)}
            partNames={partNames}
          />
        </Canvas>
      )}

      {/* Labelled as conceptual everywhere it appears. */}
      <div className={cn('pointer-events-none absolute top-3 z-10 flex flex-col gap-2', panelSide === 'right' ? 'left-3' : 'right-3 items-end')}>
        <button
          type="button"
          className="concept-tag pointer-events-auto"
          aria-expanded={showNote}
          onClick={() => setShowNote((v) => !v)}
        >
          <Info size={12} aria-hidden /> {V.tag}
        </button>
        {showNote && <p className="pointer-events-auto max-w-[19rem] rounded-sm border border-steel-line bg-paper/95 p-3 text-[0.8125rem] leading-snug text-ink-muted shadow-lift backdrop-blur">{V.note}</p>}
      </div>

      {toolbar && interactive && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 sm:gap-2" role="toolbar" aria-label={V.controls}>
          <span className="viewer-tool !w-auto gap-2 px-3 text-[0.75rem] font-semibold uppercase tracking-[0.08em] max-sm:hidden" aria-hidden>
            <Move3d size={15} /> {V.drag}
          </span>
          <button type="button" className="viewer-tool" onClick={() => setZoom(controls.current.zoom * 0.82)} disabled={zoomUi <= ZOOM_MIN + 0.01} aria-label={V.zoomIn}>
            <Plus size={18} aria-hidden />
          </button>
          <button type="button" className="viewer-tool" onClick={() => setZoom(controls.current.zoom / 0.82)} disabled={zoomUi >= ZOOM_MAX - 0.01} aria-label={V.zoomOut}>
            <Minus size={18} aria-hidden />
          </button>
          <button type="button" className="viewer-tool" onClick={reset} aria-label={V.reset}>
            <RotateCcw size={17} aria-hidden />
          </button>
          {meta.explodable && (
            <button type="button" className="viewer-tool" aria-pressed={exploded} onClick={() => setExploded(!exploded)} aria-label={exploded ? V.reassemble : V.explode}>
              <Boxes size={18} aria-hidden />
            </button>
          )}
          {typeof document !== 'undefined' && document.fullscreenEnabled && (
            <button type="button" className="viewer-tool" onClick={toggleFullscreen} aria-label={fullscreen ? V.exitFull : V.full}>
              {fullscreen ? <Shrink size={17} aria-hidden /> : <Expand size={17} aria-hidden />}
            </button>
          )}
        </div>
      )}

      {/* Component inspection panel */}
      {selPart && (
        <div
          role="dialog"
          aria-label={`${selPart.name}: ${V.details}`}
          className={cn(
            'absolute z-20 w-[min(22rem,calc(100%-1.5rem))] rounded-md border border-steel-line bg-paper/95 p-5 shadow-panel backdrop-blur-md',
            'bottom-16 left-1/2 -translate-x-1/2 sm:bottom-auto sm:top-14 sm:translate-x-0',
            panelSide === 'right' ? 'sm:left-auto sm:right-3' : 'sm:left-3',
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="readout text-blue">
              Component {String(selIndex + 1).padStart(2, '0')} / {String(parts.length).padStart(2, '0')}
            </p>
            <button type="button" onClick={() => setSelected(null)} className="-m-1 rounded p-1 text-ink-muted hover:text-navy" aria-label={V.closeDetails}>
              <X size={16} aria-hidden />
            </button>
          </div>
          <h3 className="mt-2 font-display text-[1.6rem] font-semibold uppercase leading-none text-navy">{selPart.name}</h3>
          <p className="mt-3 text-small text-ink">{selPart.desc}</p>
          <p className="mt-3 text-[0.75rem] leading-snug text-ink-muted">{V.typical}</p>
          <div className="mt-4 flex items-center justify-between border-t border-steel-line pt-3">
            <button type="button" className="inline-flex items-center gap-1 text-small font-semibold text-blue" onClick={() => stepPart(-1)}>
              <ChevronLeft size={16} aria-hidden /> Previous
            </button>
            <button type="button" className="inline-flex items-center gap-1 text-small font-semibold text-blue" onClick={() => stepPart(1)}>
              Next <ChevronRight size={16} aria-hidden />
            </button>
          </div>
        </div>
      )}

      {/* Screen-reader access to the component list while exploded */}
      {exploded && meta.explodable && (
        <ul className="sr-only" aria-label={V.components}>
          {parts.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => setSelected(p.id)}>
                {p.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
