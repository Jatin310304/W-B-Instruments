import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { materials } from '../materials'
import { roundedBox, tube } from '../geometry'
import { displayTexture } from '../textures'
import { useDisplayGlow } from '../useGlow'
import { useViewer } from '../ViewerContext'
import type { ModelProps } from './registry'

/** Conceptual dry block temperature calibrator with a probe in the heated block. */
export default function DryBlock(_: ModelProps) {
  const m = materials()
  const v = useViewer()
  const disp = useRef<THREE.Mesh>(null)
  const heat = useRef<THREE.MeshStandardMaterial>(null)
  useDisplayGlow(disp, 0.3, 1.5)
  const g = useMemo(() => {
    const tex = displayTexture({ key: 'dry-lcd', text: '---.-', unit: '°C', fg: '#d8f3ff', bg: '#0e2738', w: 512, h: 200 })
    const dispMat = new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: '#ffffff', emissiveIntensity: 0.6, roughness: 0.5 })
    dispMat.userData.ownEmissive = true
    return {
      body: roundedBox(3.0, 1.7, 2.5, 0.16, 0.05),
      top: roundedBox(2.9, 0.12, 2.4, 0.12, 0.03),
      well: new THREE.CylinderGeometry(0.62, 0.62, 0.16, 64),
      ring: new THREE.TorusGeometry(0.66, 0.05, 12, 64),
      hole: new THREE.CylinderGeometry(0.075, 0.075, 0.17, 20),
      face: new THREE.PlaneGeometry(1.3, 0.5),
      dispMat,
      key: roundedBox(0.22, 0.14, 0.06, 0.04, 0.012),
      handle: tube([[-1.1, 0.95, -0.9], [-1.1, 1.35, -0.9], [1.1, 1.35, -0.9], [1.1, 0.95, -0.9]], 0.06, 48, 10),
      probe: new THREE.CylinderGeometry(0.05, 0.05, 2.0, 16),
      probeHandle: new THREE.CylinderGeometry(0.11, 0.11, 0.55, 24),
      cable: tube([[0.3, 2.55, 0.25], [0.35, 3.0, 0.3], [1.0, 3.2, 0.5], [1.9, 2.4, 0.8], [2.2, 0.9, 1.0]], 0.045, 64, 10),
      vent: new THREE.BoxGeometry(0.05, 0.9, 0.6),
    }
  }, [])

  useFrame(() => {
    if (heat.current) heat.current.emissiveIntensity = 0.15 + v.night.current * 0.35 + Math.sin(v.clock.current * 1.2) * 0.05
  })

  return (
    <group position={[0, -0.35, 0]}>
      <mesh geometry={g.body} material={m.plasticGrey} />
      <mesh geometry={g.top} material={m.anodisedDark} position={[0, 0.88, 0]} />
      <group position={[0.35, 0.92, -0.1]}>
        <mesh geometry={g.well}>
          <meshStandardMaterial ref={heat} color="#a7abb3" metalness={1} roughness={0.35} emissive="#ff6a2a" emissiveIntensity={0.2} />
        </mesh>
        <mesh geometry={g.ring} material={m.stainlessPolished} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.06, 0]} />
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} geometry={g.hole} material={m.chip} position={[Math.cos(i * 1.256) * 0.34, 0.005, Math.sin(i * 1.256) * 0.34]} />
        ))}
        <group position={[-0.05, 1.0, 0.33]}>
          <mesh geometry={g.probe} material={m.stainlessPolished} position={[0, -0.25, 0]} />
          <mesh geometry={g.probeHandle} material={m.plasticBlack} position={[0, 0.95, 0]} />
        </group>
      </group>
      <mesh ref={disp} geometry={g.face} material={g.dispMat} position={[-0.55, 0.2, 1.26]} />
      {[0.4, 0.75, 1.1].map((x) => (
        <mesh key={x} geometry={g.key} material={m.plasticBlack} position={[x, 0.2, 1.27]} />
      ))}
      {[-0.9, -0.6, -0.3].map((z) => (
        <mesh key={z} geometry={g.vent} material={m.chip} position={[1.51, 0, z]} />
      ))}
      <mesh geometry={g.handle} material={m.plasticBlack} />
      <mesh geometry={g.cable} material={m.cableGrey} position={[0, -0.65, 0]} />
    </group>
  )
}
