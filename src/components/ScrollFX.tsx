import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Selectors that animate in automatically on every page. */
const TARGETS = 'main section h2, main .card, main .reading, main [data-fx], main ul > li > .card-hover'
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Site-wide motion: scroll progress bar, a --scroll variable for parallax, and scroll reveals.
 * Elements already on screen are left alone, so nothing flashes and content never depends on JS.
 */
export function ScrollFX() {
  const { pathname } = useLocation()

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - innerHeight
      document.documentElement.style.setProperty('--progress', String(max > 0 ? scrollY / max : 0))
      document.documentElement.style.setProperty('--scroll', String(Math.round(scrollY)))
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', on, { passive: true })
    addEventListener('resize', on)
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [])

  useEffect(() => {
    if (reduced() || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('fx-in')
          io.unobserve(e.target)
        }
      }),
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )
    const t = setTimeout(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>(TARGETS))
      const seen = new Set<Element>()
      els.forEach((el) => {
        if (seen.has(el) || el.closest('.fx') || el.closest('[role=dialog]')) return
        seen.add(el)
        const r = el.getBoundingClientRect()
        if (r.top < innerHeight * 0.95) return
        // stagger siblings in the same list
        const li = el.closest('li')
        const idx = li?.parentElement ? Array.from(li.parentElement.children).indexOf(li) % 4 : 0
        el.style.setProperty('--fx-delay', `${idx * 90}ms`)
        el.classList.add('fx')
        io.observe(el)
      })
    }, 60)
    return () => { clearTimeout(t); io.disconnect() }
  }, [pathname])

  return <div className="scroll-progress" aria-hidden />
}
