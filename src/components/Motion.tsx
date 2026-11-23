import { useEffect, useRef, useState, type ReactNode } from 'react'
import { LazyViewer } from '@/three/LazyViewer'
import type { ModelKey } from '@/three/models/registry'
import { cn } from '@/lib/cn'
import { useI18n } from '@/i18n/I18nProvider'
import { Img } from './ui'

const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Fades and lifts content in once as it enters the viewport. Content is visible without JS and with reduced motion. */
export function Reveal({ children, className, delay = 0, as: Tag = 'div' }: { children: ReactNode; className?: string; delay?: number; as?: 'div' | 'li' | 'section' }) {
  const ref = useRef<HTMLElement>(null)
  const [state, setState] = useState<'idle' | 'hidden' | 'shown'>('idle')
  useEffect(() => {
    const el = ref.current
    if (!el || reduced() || !('IntersectionObserver' in window)) return
    const r = el.getBoundingClientRect()
    if (r.top < innerHeight * 0.92) return // already on screen: no animation
    setState('hidden')
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setState('shown')
        io.disconnect()
      }
    }, { rootMargin: '0px 0px -8% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={cn('reveal', state === 'hidden' && 'reveal-hidden', className)} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  )
}

/** Counts a number up once when it scrolls into view, then shows the exact value. */
export function Counter({ value, className }: { value: string; className?: string }) {
  const { formatNumber } = useI18n()
  const m = value.match(/^(\d+)(.*)$/)
  const target = m ? parseInt(m[1], 10) : 0
  const suffix = m ? m[2] : ''
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState<number | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!m || !el || reduced() || target > 5000) return
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / 1100)
        setN(Math.round(target * (1 - Math.pow(1 - k, 3))))
        if (k < 1) raf = requestAnimationFrame(tick)
        else setN(null)
      }
      setN(0)
      raf = requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [target]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!m) return <span className={className}>{value}</span>
  return (
    <span ref={ref} className={className}>
      <span aria-hidden={n !== null}>{n === null ? (target >= 1000 ? String(target) : formatNumber(target)) + suffix : n + suffix}</span>
      {n !== null && <span className="sr-only">{value}</span>}
    </span>
  )
}

/**
 * Interactive conceptual 3D instrument for hero areas: drag to rotate, zoom, exploded view and full screen.
 * three.js loads only when a page shows one; the poster image shows until it is ready, or instead of it without WebGL.
 */
export function HeroModel({ model, poster, className, stage = 'none', initialZoom = 1.18, demo = false }: { model: ModelKey; poster?: string; className?: string; stage?: 'grid' | 'plain' | 'none'; initialZoom?: number; demo?: boolean }) {
  // Self-demonstrating exploded view: opens and closes on a loop until the visitor takes over.
  const [exploded, setExploded] = useState(false)
  const [manual, setManual] = useState(false)
  useEffect(() => {
    if (!demo || manual) return
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setExploded((v) => !v), 3800)
    return () => window.clearInterval(id)
  }, [demo, manual])
  return (
    <div className={cn('relative overflow-hidden rounded-md', className)} onPointerDown={() => setManual(true)}>
      <LazyViewer
        model={model}
        className="h-full w-full"
        stage={stage}
        drift
        autoRotate
        initialZoom={initialZoom}
        {...(demo ? { exploded, onExplodedChange: (v: boolean) => { setManual(true); setExploded(v) } } : {})}
        poster={poster ? <Img name={poster} alt="" fit="contain" className="h-full w-full" imgClassName="p-10" /> : <span className="block h-full w-full" />}
      />
    </div>
  )
}
