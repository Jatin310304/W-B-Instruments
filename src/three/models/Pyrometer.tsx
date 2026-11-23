import { useMemo } from 'react'
import * as THREE from 'three'
import { Part } from '../Part'
import { materials } from '../materials'
import { lathe, threadProfile, tube } from '../geometry'
import type { ModelProps } from './registry'

/**
 * Conceptual fixed infrared pyrometer. Built along the Y axis (front = +Y) and laid horizontal,
 * so "up" in the explode offsets is local −Z.
 * Dimensions are illustrative only.
 */
export default function Pyrometer(_: ModelProps) {
  const m = materials()
  const g = useMemo(() => {
    const housing = lathe([
      [0.5, 2.3],
      [0.6, 2.3],
      [0.62, 2.27],
      [0.62, 1.98],
      [0.6, 1.96],
      [0.6, 1.88],
      [0.62, 1.86],
      [0.62, -0.35],
      ...threadProfile(0.62, 0.035, -2.2, -0.4, 0.09).reverse(),
      [0.62, -2.3],
      [0.6, -2.42],
      [0.56, -2.45],
      [0.5, -2.45],
      [0.5, 2.3],
    ])
    const bezel = lathe([
      [0.44, 2.3],
      [0.64, 2.3],
      [0.66, 2.33],
      [0.66, 2.58],
      [0.62, 2.63],
      [0.47, 2.63],
      [0.44, 2.58],
      [0.44, 2.3],
    ])
    const knurlBand = new THREE.CylinderGeometry(0.664, 0.664, 0.16, 96, 1, true)
    const lensCap = new THREE.SphereGeometry(1.2, 72, 12, 0, Math.PI * 2, 0, Math.asin(0.44 / 1.2))
    const lensDisc = new THREE.CylinderGeometry(0.44, 0.44, 0.03, 72)
    const spacer = lathe([
      [0.36, 2.2],
      [0.46, 2.2],
      [0.46, 2.5],
      [0.36, 2.5],
      [0.36, 2.2],
    ])
    const sensorBase = new THREE.CylinderGeometry(0.4, 0.4, 0.09, 64)
    const can = lathe([
      [0, 0.26],
      [0.12, 0.26],
      [0.17, 0.22],
      [0.17, 0],
      [0.2, 0],
      [0.2, -0.04],
      [0, -0.04],
    ], 48)
    const canWindow = new THREE.CylinderGeometry(0.075, 0.075, 0.02, 32)
    const leg = new THREE.CylinderGeometry(0.012, 0.012, 0.3, 8)
    const board = new THREE.CylinderGeometry(0.49, 0.49, 0.045, 64)
    const standoff = new THREE.CylinderGeometry(0.035, 0.035, 0.62, 12)
    const ic = new THREE.BoxGeometry(0.22, 0.04, 0.16)
    const smd = new THREE.BoxGeometry(0.07, 0.03, 0.05)
    const cap = new THREE.CylinderGeometry(0.05, 0.05, 0.16, 16)
    const nut = new THREE.CylinderGeometry(0.84, 0.84, 0.22, 6)
    const nutHole = new THREE.CylinderGeometry(0.63, 0.63, 0.225, 48)
    const rearCap = lathe([
      [0, -2.45],
      [0.58, -2.45],
      [0.6, -2.5],
      [0.52, -2.72],
      [0.3, -2.76],
      [0, -2.76],
    ])
    const m12Nut = new THREE.CylinderGeometry(0.3, 0.3, 0.34, 48, 1, false)
    const plug = lathe([
      [0, -3.1],
      [0.27, -3.1],
      [0.27, -3.38],
      [0.2, -3.55],
      [0.12, -3.6],
      [0, -3.6],
    ], 48)
    const cable = tube(
      [
        [0, -3.55, 0],
        [0, -4.05, 0.05],
        [0, -4.5, 0.45],
        [0, -4.75, 1.2],
        [0, -4.85, 2.4],
      ],
      0.09,
      80,
      14,
    )
    const band = new THREE.CylinderGeometry(0.623, 0.623, 0.05, 96, 1, true)
    // Dark liner so the bore reads as an interior, not a mirror, when the parts are pulled out.
    const liner = new THREE.CylinderGeometry(0.497, 0.497, 4.7, 64, 1, true)
    return { liner, housing, bezel, knurlBand, lensCap, lensDisc, spacer, sensorBase, can, canWindow, leg, board, standoff, ic, smd, cap, nut, nutHole, rearCap, m12Nut, plug, cable, band }
  }, [])

  return (
    // Lay the instrument horizontal: local +Y (front) → world +Z.
    <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]}>
      <Part id="optics" offset={[0, 2.25, 0]} anchor={[0, 2.6, -0.85]} delay={0}>
        <mesh geometry={g.lensCap} material={m.irLens} position={[0, 2.52 - 1.2 * Math.cos(Math.asin(0.44 / 1.2)), 0]} />
        <mesh geometry={g.lensDisc} material={m.irLens} position={[0, 2.5, 0]} />
        <mesh geometry={g.spacer} material={m.anodisedDark} />
      </Part>

      <Part id="bezel" offset={[0, 1.45, 0]} anchor={[0, 2.5, -1]} delay={0.05}>
        <mesh geometry={g.bezel} material={m.stainlessPolished} />
        <mesh geometry={g.knurlBand} material={m.knurled} position={[0, 2.46, 0]} />
      </Part>

      <Part id="sensor" offset={[0, 1.05, -0.15]} anchor={[0, 1.7, -0.75]} delay={0.12}>
        <group position={[0, 1.5, 0]}>
          <mesh geometry={g.sensorBase} material={m.plasticBlack} />
          <mesh geometry={g.can} material={m.stainlessPolished} position={[0, 0.08, 0]} />
          <mesh geometry={g.canWindow} material={m.gold} position={[0, 0.345, 0]} />
          {[0, 1, 2].map((i) => (
            <mesh key={i} geometry={g.leg} material={m.gold} position={[Math.cos((i * Math.PI * 2) / 3) * 0.08, -0.18, Math.sin((i * Math.PI * 2) / 3) * 0.08]} />
          ))}
        </group>
      </Part>

      <Part id="electronics" offset={[0, 0.35, -0.25]} anchor={[0, 0.3, -0.9]} delay={0.18}>
        <group position={[0, 0.3, 0]}>
          {[-0.3, 0.3].map((y) => (
            <group key={y} position={[0, y, 0]}>
              <mesh geometry={g.board} material={m.pcb} />
              <mesh geometry={g.ic} material={m.chip} position={[-0.1, 0.04, 0.05]} />
              <mesh geometry={g.ic} material={m.chip} position={[0.16, 0.04, -0.14]} rotation={[0, 0.6, 0]} />
              {[...Array(6)].map((_, i) => (
                <mesh key={i} geometry={g.smd} material={i % 2 ? m.gold : m.chip} position={[Math.cos(i) * 0.33, 0.035, Math.sin(i * 1.7) * 0.3]} />
              ))}
              <mesh geometry={g.cap} material={m.anodisedBlue} position={[0.26, 0.1, 0.2]} />
            </group>
          ))}
          {[0, 1, 2].map((i) => (
            <mesh key={i} geometry={g.standoff} material={m.gold} position={[Math.cos(i * 2.1 + 0.4) * 0.4, 0, Math.sin(i * 2.1 + 0.4) * 0.4]} />
          ))}
        </group>
      </Part>

      <Part id="housing" offset={[0, -0.2, 1.45]} anchor={[0, 0.9, 0.95]} delay={0.08}>
        <mesh geometry={g.housing} material={m.stainless} />
        <mesh geometry={g.liner} material={m.plasticBlack} position={[0, -0.07, 0]} />
        <mesh geometry={g.band} material={m.anodisedDark} position={[0, 1.92, 0]} />
      </Part>

      <Part id="mounting" offset={[0, -1.95, 1.45]} anchor={[0, -1.4, 2.4]} delay={0.25}>
        {[-1.05, -1.75].map((y) => (
          <group key={y} position={[0, y, 0]} rotation={[0, Math.PI / 6, 0]}>
            <mesh geometry={g.nut} material={m.stainlessPolished} />
            <mesh geometry={g.nutHole} material={m.anodisedDark} />
          </group>
        ))}
      </Part>

      <Part id="connector" offset={[0, -1.2, 0]} anchor={[0, -3.0, -0.8]} delay={0.15}>
        <mesh geometry={g.rearCap} material={m.stainless} />
        <mesh geometry={g.m12Nut} material={m.knurled} position={[0, -2.93, 0]} />
        <mesh geometry={g.plug} material={m.plasticBlack} />
        <mesh geometry={g.cable} material={m.cableGrey} />
      </Part>
    </group>
  )
}
