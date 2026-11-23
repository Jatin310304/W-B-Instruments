import { useFrame } from '@react-three/fiber'
import type { RefObject } from 'react'
import type * as THREE from 'three'
import { useViewer } from './ViewerContext'

/**
 * Instrument displays glow brighter at night. Materials that use this are marked
 * userData.ownEmissive so part highlighting leaves their emissive alone.
 */
export function useDisplayGlow(ref: RefObject<THREE.Mesh>, day = 0.9, night = 2.2) {
  const v = useViewer()
  useFrame(() => {
    const m = ref.current?.material as THREE.MeshStandardMaterial | undefined
    if (m) m.emissiveIntensity = day + (night - day) * v.night.current
  })
}
