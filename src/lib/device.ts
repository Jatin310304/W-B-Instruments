/** Rendering budget for the 3D scenes, decided once per visit from what the device reports. */
export type QualityTier = 'high' | 'medium' | 'low'

export interface DeviceProfile {
  tier: QualityTier
  coarsePointer: boolean
  reducedMotion: boolean
  saveData: boolean
  webgl: boolean
}

let cached: DeviceProfile | null = null

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export function deviceProfile(): DeviceProfile {
  if (cached) return cached
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  const coarsePointer = matchMedia('(pointer: coarse)').matches
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  const saveData = !!nav.connection?.saveData
  const cores = nav.hardwareConcurrency || 4
  const memory = nav.deviceMemory || 4
  const small = Math.min(screen.width, screen.height) < 600
  let tier: QualityTier = 'high'
  if (coarsePointer || small || cores <= 4 || memory <= 4) tier = 'medium'
  if ((small && (cores <= 4 || memory <= 2)) || saveData) tier = 'low'
  cached = { tier, coarsePointer, reducedMotion, saveData, webgl: hasWebGL() }
  return cached
}
