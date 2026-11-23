import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Part } from '../Part'
import { materials } from '../materials'
import { lathe } from '../geometry'
import { displayTexture } from '../textures'
import { useDisplayGlow } from '../useGlow'
import type { ModelProps } from './registry'

/** Conceptual loop-powered field indicator: round stainless housing, display facing +Z. */
export default function LoopIndicator(_: ModelProps) {
  const m = materials()
  const lcd = useRef<THREE.Mesh>(null)
  useDisplayGlow(lcd, 0.25, 1.4)
  const g = useMemo(() => {
    const lcdTex = displayTexture({ key: 'loop-lcd', text: '8.8.8.8', fg: '#1d2b33', bg: '#b9d0d6', w: 512, h: 220 })
    const lcdMat = new THREE.MeshStandardMaterial({ map: lcdTex, emissiveMap: lcdTex, emissive: '#7fd8ff', emissiveIntensity: 0.3, roughness: 0.6 })
    lcdMat.userData.ownEmissive = true
    // Housing revolved around Y, then turned so its axis faces the viewer.
    const housing = lathe([
      [1.0, 0.55],
      [1.22, 0.55],
      [1.3, 0.48],
      [1.3, -0.35],
      [1.26, -0.5],
      [1.1, -0.6],
      [0.2, -0.62],
      [0, -0.62],
    ])
    const bezel = lathe([
      [0.92, 0.55],
      [1.3, 0.55],
      [1.32, 0.6],
      [1.3, 0.78],
      [1.2, 0.84],
      [0.95, 0.84],
      [0.92, 0.8],
      [0.92, 0.55],
    ])
    return {
      housing,
      bezel,
      glass: new THREE.CylinderGeometry(0.95, 0.95, 0.04, 72),
      lcdBody: new THREE.CylinderGeometry(0.86, 0.86, 0.12, 64),
      lcdFace: new THREE.PlaneGeometry(1.3, 0.56),
      lcdMat,
      board: new THREE.CylinderGeometry(0.9, 0.9, 0.05, 64),
      chip: new THREE.BoxGeometry(0.3, 0.05, 0.3),
      boss: new THREE.CylinderGeometry(0.34, 0.38, 0.5, 6),
      gland: new THREE.CylinderGeometry(0.24, 0.24, 0.42, 32),
      glandNut: new THREE.CylinderGeometry(0.3, 0.3, 0.16, 6),
      cable: new THREE.CylinderGeometry(0.12, 0.12, 1.2, 16),
    }
  }, [])

  return (
    <group position={[0, 0.2, 0]}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <Part id="window" offset={[0, 1.6, 0]} anchor={[0, 0.9, -1.5]}>
          <mesh geometry={g.bezel} material={m.stainlessPolished} />
          <mesh geometry={g.glass} material={m.glass} position={[0, 0.76, 0]} />
        </Part>
        <Part id="display" offset={[0, 1.0, 0]} anchor={[0, 0.6, -1.1]} delay={0.06}>
          <mesh geometry={g.lcdBody} material={m.chip} position={[0, 0.52, 0]} />
          <mesh ref={lcd} geometry={g.lcdFace} material={g.lcdMat} position={[0, 0.585, 0]} rotation={[-Math.PI / 2, 0, 0]} />
        </Part>
        <Part id="electronics" offset={[0, 0.45, 0]} anchor={[0, 0.2, -1.2]} delay={0.12}>
          <mesh geometry={g.board} material={m.pcb} position={[0, 0.2, 0]} />
          <mesh geometry={g.chip} material={m.chip} position={[0.3, 0.25, 0.2]} />
          <mesh geometry={g.chip} material={m.chip} position={[-0.35, 0.25, -0.1]} />
        </Part>
        <Part id="housing" offset={[0, -1.0, 0]} anchor={[0, -0.2, -1.6]} delay={0.04}>
          <mesh geometry={g.housing} material={m.stainless} />
        </Part>
      </group>
      <Part id="entry" offset={[0, -1.3, 0]} anchor={[0.6, -1.9, 0]} delay={0.18}>
        <group position={[0, -1.45, -0.05]}>
          <mesh geometry={g.boss} material={m.stainless} position={[0, 0.2, 0]} />
          <mesh geometry={g.glandNut} material={m.stainlessPolished} position={[0, -0.12, 0]} />
          <mesh geometry={g.gland} material={m.plasticBlack} position={[0, -0.35, 0]} />
          <mesh geometry={g.cable} material={m.cableGrey} position={[0, -1.0, 0]} />
        </group>
      </Part>
    </group>
  )
}
