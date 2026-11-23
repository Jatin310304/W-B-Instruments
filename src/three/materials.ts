import * as THREE from 'three'
import { brushedTexture, knurlTexture, pcbTexture } from './textures'

/**
 * Physically based materials shared by every conceptual instrument model.
 * Each Part clones what it uses, so highlighting one component never affects another.
 */
let shared: ReturnType<typeof build> | null = null

function build() {
  const brushed = brushedTexture()
  const knurl = knurlTexture()
  const stainless = new THREE.MeshPhysicalMaterial({
    color: '#c9ccd1',
    metalness: 1,
    roughness: 0.28,
    roughnessMap: brushed,
    anisotropy: 0.65,
    clearcoat: 0.15,
    clearcoatRoughness: 0.35,
    envMapIntensity: 1.15,
  })
  const stainlessPolished = new THREE.MeshPhysicalMaterial({ color: '#dfe2e6', metalness: 1, roughness: 0.12, envMapIntensity: 1.3 })
  const knurled = new THREE.MeshPhysicalMaterial({ color: '#b9bcc2', metalness: 1, roughness: 0.38, bumpMap: knurl, bumpScale: 3 })
  knurl.repeat.set(10, 1)
  const anodisedDark = new THREE.MeshPhysicalMaterial({ color: '#2a2f3a', metalness: 0.75, roughness: 0.36, clearcoat: 0.4, clearcoatRoughness: 0.4 })
  const anodisedBlue = new THREE.MeshPhysicalMaterial({ color: '#23356f', metalness: 0.6, roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.35 })
  const plasticBlack = new THREE.MeshPhysicalMaterial({ color: '#16181d', metalness: 0, roughness: 0.55, clearcoat: 0.15, clearcoatRoughness: 0.6, side: THREE.DoubleSide })
  const plasticGrey = new THREE.MeshPhysicalMaterial({ color: '#d9dbe0', metalness: 0, roughness: 0.48, clearcoat: 0.2 })
  const plasticNavy = new THREE.MeshPhysicalMaterial({ color: '#2b3448', metalness: 0, roughness: 0.5, clearcoat: 0.2 })
  const rubber = new THREE.MeshStandardMaterial({ color: '#2b2e33', metalness: 0, roughness: 0.82 })
  const cableGrey = new THREE.MeshStandardMaterial({ color: '#8c929c', metalness: 0, roughness: 0.6 })
  /** Infrared optics look dark with violet-green coating reflections. */
  const irLens = new THREE.MeshPhysicalMaterial({
    color: '#1b2236',
    metalness: 0.2,
    roughness: 0.04,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    iridescence: 0.85,
    iridescenceIOR: 1.7,
    iridescenceThicknessRange: [250, 650],
    envMapIntensity: 2.2,
  })
  const glass = new THREE.MeshPhysicalMaterial({
    color: '#e8f0ff',
    metalness: 0,
    roughness: 0.03,
    transmission: 0.92,
    thickness: 0.08,
    ior: 1.5,
    transparent: true,
    opacity: 0.55,
    envMapIntensity: 1.6,
  })
  const pcb = new THREE.MeshStandardMaterial({ map: pcbTexture(), metalness: 0.25, roughness: 0.55 })
  const chip = new THREE.MeshStandardMaterial({ color: '#202227', metalness: 0.3, roughness: 0.45 })
  const gold = new THREE.MeshPhysicalMaterial({ color: '#e0b864', metalness: 1, roughness: 0.25 })
  const copper = new THREE.MeshPhysicalMaterial({ color: '#c47c4a', metalness: 1, roughness: 0.3 })
  const terminalGreen = new THREE.MeshStandardMaterial({ color: '#1f7a46', metalness: 0, roughness: 0.55 })
  const foam = new THREE.MeshStandardMaterial({ color: '#2a2c31', metalness: 0, roughness: 1 })
  return {
    stainless,
    stainlessPolished,
    knurled,
    anodisedDark,
    anodisedBlue,
    plasticBlack,
    plasticGrey,
    plasticNavy,
    rubber,
    cableGrey,
    irLens,
    glass,
    pcb,
    chip,
    gold,
    copper,
    terminalGreen,
    foam,
  }
}

export type MaterialSet = ReturnType<typeof build>
export const materials = (): MaterialSet => (shared ??= build())
