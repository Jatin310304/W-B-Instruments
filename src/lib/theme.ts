import { themeSignal } from '@/three/signal'

/** Light and dark mode. Follows the visitor's device setting until they choose with the toggle; the choice is remembered. */
export type Theme = 'light' | 'dark'
const KEY = 'wb-theme'

const stored = (): Theme | null => {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}
const system = (): Theme => (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

export const currentTheme = (): Theme => (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light')

export function applyTheme(t: Theme, snap = false) {
  document.documentElement.setAttribute('data-theme', t)
  document.documentElement.style.colorScheme = t
  themeSignal.set(t === 'dark' ? 1 : 0, snap)
  window.dispatchEvent(new CustomEvent('wb-theme', { detail: t }))
}

export function setTheme(t: Theme) {
  const html = document.documentElement
  html.classList.add('theme-anim')
  window.setTimeout(() => html.classList.remove('theme-anim'), 400)
  try {
    localStorage.setItem(KEY, t)
  } catch {
    /* storage unavailable: the choice lasts for this visit only */
  }
  applyTheme(t)
}

/** Called once at start-up: applies the saved or device theme and follows device changes while no choice is saved. */
export function initTheme() {
  applyTheme(stored() ?? system(), true)
  window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', (e) => {
    if (!stored()) applyTheme(e.matches ? 'dark' : 'light')
  })
}
