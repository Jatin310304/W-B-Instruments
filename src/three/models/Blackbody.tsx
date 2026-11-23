import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { materials } from '../materials'
import { roundedBox } from '../geometry'
import { displayTexture, glowTexture } from '../textures'
import { useDisplayGlow } from '../useGlow'
import { useViewer } from '../ViewerContext'
import Pyrometer from './Pyrometer'
import type { ModelProps } from './registry'

/**
 * Conceptual blackbody calibration source: an insulated furnace with a cavity aperture and a
 * separate controller. With `demo`, a pyrometer sights into the cavity, as in a verification check.
 */
export default function Blackbody({ demo, modelKey }: ModelProps) {
  const m = materials()
  const v = useViewer()
  const cavityGlow = useRef<THREE.MeshBasicMaterial>(null)
  const halo = useRef<THREE.Sprite>(null)
  const beam = useRef<THREE.Mesh>(null)
  const ctrlDisplay = useRef<THREE.Mesh>(null)
  useDisplayGlow(ctrlDisplay, 0.8, 2.2)

  const g = useMemo(() => {
    const tex = displayTexture({ key: 'bb-ctrl', text: '----', fg: '#ff4a2a', bg: '#120505', w: 384, h: 140 })
    const dispMat = new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: '#ffffff', emissiveIntensity: 1, roughness: 0.4 })
    dispMat.userData.ownEmissive = true
    // Hollow cavity: an open cylinder seen from inside, lit from within.
    const cavityWall = new THREE.MeshStandardMaterial({ color: '#1a0f0a', emissive: '#ff5a1a', emissiveIntensity: 0.6, side: THREE.BackSide, roughness: 0.9 })
    cavityWall.userData.ownEmissive = true
    return {
      body: roundedBox(3.2, 2.5, 3.1, 0.12, 0.04),
      front: roundedBox(3.0, 2.3, 0.12, 0.06, 0.02),
      flange: new THREE.TorusGeometry(0.68, 0.07, 16, 72),
      cavity: new THREE.CylinderGeometry(0.6, 0.6, 1.6, 64, 1, true),
      cavityWall,
      cavityBack: new THREE.CircleGeometry(0.6, 64),
      vent: new THREE.BoxGeometry(2.2, 0.04, 0.1),
      foot: new THREE.CylinderGeometry(0.16, 0.2, 0.12, 24),
      ctrl: roundedBox(1.5, 1.7, 2.4, 0.08, 0.03),
      ctrlFace: new THREE.PlaneGeometry(0.95, 0.36),
      dispMat,
      key: new THREE.BoxGeometry(0.16, 0.1, 0.06),
      switchG: new THREE.BoxGeometry(0.22, 0.14, 0.08),
      beam: new THREE.CylinderGeometry(0.01, 0.01, 1, 8, 1, true),
    }
  }, [])

  useFrame(() => {
    const t = v.clock.current
    // A steady reference: a slow, gentle breathing glow rather than a flicker.
    const k = 0.85 + Math.sin(t * 1.4) * 0.15
    if (cavityGlow.current) cavityGlow.current.opacity = 0.9 * k
    if (halo.current) {
      const mat = halo.current.material as THREE.SpriteMaterial
      mat.opacity = (0.35 + v.night.current * 0.35) * k
    }
    if (beam.current) {
      const mat = beam.current.material as THREE.MeshBasicMaterial
      mat.opacity = demo ? 0.35 + 0.35 * (0.5 + Math.sin(t * 3) * 0.5) : 0
    }
  })

  return (
    <group position={[demo ? 0.7 : 0.35, 0, 0]}>
      {/* Furnace */}
      <group>
        <mesh geometry={g.body} material={m.anodisedBlue} />
        <mesh geometry={g.front} material={m.anodisedDark} position={[0, 0, 1.56]} />
        <mesh geometry={g.flange} material={m.stainlessPolished} position={[0, 0.1, 1.63]} />
        <mesh geometry={g.cavity} material={g.cavityWall} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.1, 0.82]} />
        <mesh geometry={g.cavityBack} position={[0, 0.1, 0.03]}>
          <meshBasicMaterial ref={cavityGlow} color="#ffb070" transparent />
        </mesh>
        <sprite ref={halo} position={[0, 0.1, 2.15]} scale={[1.7, 1.7, 1]}>
          <spriteMaterial map={glowTexture()} color="#ff7a32" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
        {[0.95, 1.05, 1.15].map((y) => (
          <mesh key={y} geometry={g.vent} material={m.chip} position={[0, y, -0.4]} rotation={[0, 0, 0]} />
        ))}
        {[-1.3, 1.3].flatMap((x) => [-1.2, 1.2].map((z) => <mesh key={`${x}${z}`} geometry={g.foot} material={m.rubber} position={[x, -1.31, z]} />))}
      </group>

      {/* Controller */}
      <group position={[-2.5, -0.4, 0.3]}>
        <mesh geometry={g.ctrl} material={m.plasticNavy} />
        <mesh ref={ctrlDisplay} geometry={g.ctrlFace} material={g.dispMat} position={[0, 0.35, 1.215]} />
        {[-0.3, -0.1, 0.1, 0.3].map((x) => (
          <mesh key={x} geometry={g.key} material={m.plasticGrey} position={[x, -0.05, 1.22]} />
        ))}
        <mesh geometry={g.switchG} material={m.plasticBlack} position={[0.4, -0.55, 1.22]} />
        {[-0.55, 0.55].flatMap((x) => [-0.95, 0.95].map((z) => <mesh key={`${x}${z}`} geometry={g.foot} material={m.rubber} position={[x, -0.91, z]} scale={0.7} />))}
      </group>

      {/* Verification demonstration: a pyrometer sighting into the cavity. */}
      {demo && modelKey === 'blackbody' && (
        <>
          {/* Aimed from the front-right so the furnace stays readable behind it. */}
          <group position={[2.6, 0.3, 3.4]} rotation={[0, -2.164, 0]}>
            <group scale={0.42}>
              <Pyrometer modelKey="pyrometer" />
            </group>
            <mesh ref={beam} geometry={g.beam} position={[0, -0.03, 2.0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 2.2, 1]}>
              <meshBasicMaterial color="#ff7a32" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
            </mesh>
          </group>
        </>
      )}
    </group>
  )
}
