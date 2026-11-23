import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { materials } from '../materials'
import { lathe, roundedBox, tube } from '../geometry'
import { displayTexture } from '../textures'
import { useDisplayGlow } from '../useGlow'
import type { ModelKey, ModelProps } from './registry'

/** Units shown on the conceptual display. Dashes stand in for a reading; no values are implied. */
const VARIANT: Partial<Record<ModelKey, { text: string; unit: string }>> = {
  'handheld-humidity': { text: '--.-', unit: '%RH' },
  'handheld-air': { text: '--.-', unit: 'm/s' },
  'handheld-sound': { text: '--.-', unit: 'dB' },
  'handheld-light': { text: '----', unit: 'lx' },
  'handheld-water': { text: '-.--', unit: 'pH' },
}

/** Conceptual portable meter with a probe that changes with the measurement. */
export default function Handheld({ modelKey }: ModelProps) {
  const m = materials()
  const lcd = useRef<THREE.Mesh>(null)
  useDisplayGlow(lcd, 0.25, 1.3)
  const variant = VARIANT[modelKey] ?? VARIANT['handheld-humidity']!
  const sound = modelKey === 'handheld-sound'

  const g = useMemo(() => {
    const tex = displayTexture({ key: `hh-${modelKey}`, text: variant.text, unit: variant.unit, fg: '#14232b', bg: '#b6cfd4', w: 512, h: 300 })
    const lcdMat = new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: '#8fe0ff', emissiveIntensity: 0.3, roughness: 0.6 })
    lcdMat.userData.ownEmissive = true
    return {
      body: roundedBox(1.5, 3.1, 0.5, 0.3, 0.06),
      grip: roundedBox(1.62, 1.5, 0.42, 0.28, 0.05),
      bezel: roundedBox(1.18, 0.95, 0.04, 0.08, 0.01),
      lcdFace: new THREE.PlaneGeometry(1.06, 0.8),
      lcdMat,
      key: roundedBox(0.28, 0.16, 0.06, 0.05, 0.015),
      socket: new THREE.CylinderGeometry(0.11, 0.11, 0.16, 24),
      cable: tube([[-0.45, 1.68, 0], [-0.45, 2.15, 0.05], [0.1, 2.5, 0.2], [0.8, 2.2, 0.25], [1.25, 1.2, 0.2], [1.35, 0.1, 0.1]], 0.04, 80, 10),
      stick: new THREE.CylinderGeometry(0.13, 0.13, 2.4, 32),
      grille: new THREE.CylinderGeometry(0.135, 0.135, 0.45, 32, 1, true),
      tele: [0.11, 0.09, 0.07, 0.05].map((r, i) => new THREE.CylinderGeometry(r, r, 0.75, 24).translate(0, i * 0.7, 0)),
      tip: new THREE.SphereGeometry(0.09, 20, 12),
      micShaft: lathe([[0, 0], [0.32, 0], [0.18, 0.55], [0.1, 0.9], [0, 0.9]], 48),
      foam: new THREE.SphereGeometry(0.42, 32, 20),
      disc: lathe([[0, 0], [0.48, 0], [0.5, 0.06], [0.5, 0.18], [0, 0.18]], 64),
      dome: new THREE.SphereGeometry(0.3, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      electrode: new THREE.CylinderGeometry(0.11, 0.11, 2.0, 32),
      bulb: new THREE.SphereGeometry(0.1, 24, 16),
      cage: new THREE.CylinderGeometry(0.15, 0.15, 0.35, 12, 1, true),
    }
  }, [modelKey, variant.text, variant.unit])

  return (
    <group position={[sound ? 0 : -0.55, -0.2, 0]} rotation={[0, 0, 0]}>
      {/* Meter body */}
      <mesh geometry={g.body} material={m.plasticNavy} />
      <mesh geometry={g.grip} material={m.plasticGrey} position={[0, -0.75, -0.02]} />
      <mesh geometry={g.bezel} material={m.plasticBlack} position={[0, 0.72, 0.25]} />
      <mesh ref={lcd} geometry={g.lcdFace} material={g.lcdMat} position={[0, 0.72, 0.275]} />
      {[...Array(9)].map((_, i) => (
        <mesh key={i} geometry={g.key} material={i === 4 ? m.anodisedBlue : m.plasticGrey} position={[-0.38 + (i % 3) * 0.38, -0.12 - Math.floor(i / 3) * 0.3, 0.26]} />
      ))}

      {sound ? (
        <group position={[0, 1.55, 0]}>
          <mesh geometry={g.micShaft} material={m.plasticNavy} />
          <mesh geometry={g.foam} material={m.foam} position={[0, 1.2, 0]} />
        </group>
      ) : (
        <>
          <mesh geometry={g.socket} material={m.stainlessPolished} position={[-0.45, 1.6, 0]} />
          <mesh geometry={g.cable} material={m.rubber} />
          <group position={[1.4, -0.3, 0.1]}>
            {modelKey === 'handheld-humidity' && (
              <>
                <mesh geometry={g.stick} material={m.plasticGrey} />
                <mesh geometry={g.grille} material={m.stainlessPolished} position={[0, 1.42, 0]} />
              </>
            )}
            {modelKey === 'handheld-air' && (
              <group position={[0, -0.7, 0]}>
                <mesh geometry={g.stick} material={m.plasticBlack} scale={[0.9, 0.5, 0.9]} />
                {g.tele.map((geo, i) => (
                  <mesh key={i} geometry={geo} material={m.stainlessPolished} position={[0, 0.9, 0]} />
                ))}
                <mesh geometry={g.tip} material={m.plasticBlack} position={[0, 3.35, 0]} />
              </group>
            )}
            {modelKey === 'handheld-light' && (
              <group position={[0, 0.2, 0]} rotation={[0.35, 0, 0]}>
                <mesh geometry={g.disc} material={m.anodisedDark} />
                <mesh geometry={g.dome} material={m.plasticGrey} position={[0, 0.18, 0]} />
              </group>
            )}
            {modelKey === 'handheld-water' && (
              <>
                <mesh geometry={g.electrode} material={m.plasticBlack} position={[0, 0.3, 0]} />
                <mesh geometry={g.cage} material={m.plasticGrey} position={[0, -0.85, 0]} />
                <mesh geometry={g.bulb} material={m.glass} position={[0, -0.9, 0]} />
              </>
            )}
          </group>
        </>
      )}
    </group>
  )
}
