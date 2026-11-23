/**
 * A tiny shared value the 3D scenes read every frame: 0 = day lighting, 1 = night lighting.
 * Scenes ease towards `target` over about a second, matching the CSS theme transition.
 */
export const themeSignal = {
  target: typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark' ? 1 : 0,
  /** When true, scenes jump straight to the target (first paint). */
  snap: true,
  set(v: number, snap = false) {
    this.target = v
    this.snap = snap
  },
}
