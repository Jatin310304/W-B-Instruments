import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Part } from '../Part'
import { materials } from '../materials'
import { roundedBox } from '../geometry'
import { displayTexture } from '../textures'
import { useDisplayGlow } from '../useGlow'
import type { ModelProps } from './registry'

/** Conceptual panel-mount digital indicator (front faces +Z). Illustrative proportions only. */
export default function PanelMeter(_: ModelProps) {
  const m = materials()
  const led = useRef<THREE.Mesh>(null)
  useDisplayGlow(led, 1.1, 2.6)
  const g = useMemo(() => {
    const ledTex = displayTexture({ key: 'panel-led', text: '8.8.8.8', fg: '#ff3b2f', bg: '#140606', w: 512, h: 160 })
    const ledMat = new THREE.MeshStandardMaterial({ map: ledTex, emissiveMap: ledTex, emissive: '#ffffff', emissiveIntensity: 1.2, roughness: 0.4 })
    ledMat.userData.ownEmissive = true
    return {
      bezel: roundedBox(3.84, 1.92, 0.24, 0.1, 0.03),
      window: new THREE.PlaneGeometry(2.62, 0.8),
      key: roundedBox(0.42, 0.2, 0.08, 0.06, 0.015),
      displayBody: new THREE.BoxGeometry(2.5, 0.72, 0.3),
      ledFace: new THREE.PlaneGeometry(2.4, 0.64),
      ledMat,
      board: new THREE.BoxGeometry(3.3, 0.05, 2.2),
      chip: new THREE.BoxGeometry(0.4, 0.06, 0.4),
      relay: new THREE.BoxGeometry(0.45, 0.35, 0.3),
      caseBody: roundedBox(3.56, 1.7, 2.5, 0.06, 0.02),
      rib: new THREE.BoxGeometry(0.04, 1.71, 2.1),
      terminal: new THREE.BoxGeometry(0.46, 0.38, 0.42),
      screw: new THREE.CylinderGeometry(0.07, 0.07, 0.05, 16),
      clamp: new THREE.BoxGeometry(0.14, 0.5, 1.1),
      clampScrew: new THREE.CylinderGeometry(0.05, 0.05, 1.6, 12),
    }
  }, [])

  return (
    <group position={[0, 0.1, 0.9]}>
      <Part id="bezel" offset={[0, 0, 1.7]} anchor={[0, 1.2, 0]}>
        <mesh geometry={g.bezel} material={m.plasticBlack} />
        <mesh geometry={g.window} material={m.glass} position={[0, 0.22, 0.125]} />
        {[-0.6, 0, 0.6].map((x) => (
          <mesh key={x} geometry={g.key} material={m.plasticGrey} position={[x, -0.58, 0.13]} />
        ))}
      </Part>

      <Part id="display" offset={[0, 0, 1.0]} anchor={[0, 0.75, -0.2]} delay={0.05}>
        <mesh geometry={g.displayBody} material={m.chip} position={[0, 0.22, -0.2]} />
        <mesh ref={led} geometry={g.ledFace} material={g.ledMat} position={[0, 0.22, -0.045]} />
      </Part>

      <Part id="pcb" offset={[0, 1.55, -0.3]} anchor={[0, 0.5, -1.4]} delay={0.15}>
        <group position={[0, -0.2, -1.4]}>
          <mesh geometry={g.board} material={m.pcb} />
          <mesh geometry={g.chip} material={m.chip} position={[-0.6, 0.06, 0.3]} />
          <mesh geometry={g.chip} material={m.chip} position={[0.5, 0.06, -0.4]} />
          <mesh geometry={g.relay} material={m.anodisedBlue} position={[1.2, 0.2, 0.5]} />
          <mesh geometry={g.relay} material={m.anodisedBlue} position={[1.2, 0.2, -0.1]} />
        </group>
      </Part>

      <Part id="case" offset={[0, 0, -0.9]} anchor={[0, 1.1, -1.5]} delay={0.08}>
        <mesh geometry={g.caseBody} material={m.plasticBlack} position={[0, 0, -1.37]} />
        {[-1.2, -0.4, 0.4, 1.2].map((x) => (
          <mesh key={x} geometry={g.rib} material={m.chip} position={[x, 0, -1.45]} />
        ))}
      </Part>

      <Part id="terminals" offset={[0, 0, -2.1]} anchor={[0, 0.75, -2.8]} delay={0.2}>
        {[-1.2, -0.6, 0, 0.6, 1.2].map((x) => (
          <group key={x} position={[x, 0, -2.83]}>
            <mesh geometry={g.terminal} material={m.terminalGreen} />
            <mesh geometry={g.screw} material={m.stainlessPolished} position={[0, 0.2, 0.05]} />
          </group>
        ))}
      </Part>

      <Part id="clamps" offset={[0, -1.45, -1.1]} anchor={[0, -1.1, -1.2]} delay={0.25}>
        {[-1.86, 1.86].map((x) => (
          <group key={x} position={[x, 0, -0.9]}>
            <mesh geometry={g.clamp} material={m.plasticGrey} />
            <mesh geometry={g.clampScrew} material={m.stainlessPolished} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.5]} />
          </group>
        ))}
      </Part>
    </group>
  )
}
