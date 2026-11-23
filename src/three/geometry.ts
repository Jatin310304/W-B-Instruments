import * as THREE from 'three'

/**
 * Revolve a [radius, height] profile around the Y axis.
 * Each profile segment gets its own ring of vertices with a flat profile normal, so machined
 * edges stay crisp (THREE.LatheGeometry averages normals across corners, which softens them).
 * Normals face away from the profile's interior whichever way the profile is drawn.
 */
export function lathe(profile: [number, number][], segments = 96) {
  // Signed area including the implied closing edge tells us the drawing direction.
  let area = 0
  for (let i = 0; i < profile.length; i++) {
    const [x0, y0] = profile[i]
    const [x1, y1] = profile[(i + 1) % profile.length]
    area += x0 * y1 - x1 * y0
  }
  const sign = area > 0 ? 1 : -1
  const pos: number[] = []
  const nor: number[] = []
  const uv: number[] = []
  const idx: number[] = []
  let total = 0
  for (let i = 0; i < profile.length - 1; i++) total += Math.hypot(profile[i + 1][0] - profile[i][0], profile[i + 1][1] - profile[i][1])
  let run = 0
  for (let i = 0; i < profile.length - 1; i++) {
    const [r0, y0] = profile[i]
    const [r1, y1] = profile[i + 1]
    const dx = r1 - r0
    const dy = y1 - y0
    const len = Math.hypot(dx, dy)
    if (len < 1e-6) continue
    const nr = (sign * dy) / len
    const ny = (-sign * dx) / len
    const base = pos.length / 3
    for (let j = 0; j <= segments; j++) {
      const t = (j / segments) * Math.PI * 2
      const c = Math.cos(t)
      const s2 = Math.sin(t)
      pos.push(r0 * s2, y0, r0 * c, r1 * s2, y1, r1 * c)
      nor.push(nr * s2, ny, nr * c, nr * s2, ny, nr * c)
      uv.push(j / segments, run / total, j / segments, (run + len) / total)
    }
    for (let j = 0; j < segments; j++) {
      const a = base + j * 2
      const b = a + 1
      const c2 = a + 2
      const d = a + 3
      if (sign > 0) idx.push(a, c2, b, b, c2, d)
      else idx.push(a, b, c2, b, d, c2)
    }
    run += len
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3))
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  g.setIndex(idx)
  g.computeBoundingSphere()
  return g
}

/** A screw thread approximated by grooves between y0 and y1. */
export function threadProfile(r: number, depth: number, y0: number, y1: number, pitch: number): [number, number][] {
  const out: [number, number][] = []
  for (let y = y0; y < y1 - pitch * 0.5; y += pitch) {
    out.push([r, y], [r - depth, y + pitch * 0.35], [r - depth, y + pitch * 0.55], [r, y + pitch * 0.9])
  }
  return out
}

export function tube(points: [number, number, number][], radius: number, segments = 64, radial = 12) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)))
  return new THREE.TubeGeometry(curve, segments, radius, radial, false)
}

/** Rounded box built from a shape, extruded with a bevel (lighter than drei's RoundedBox for many instances). */
export function roundedBox(w: number, h: number, d: number, r: number, bevel = 0.02) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  const g = new THREE.ExtrudeGeometry(s, { depth: d - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 10 })
  g.translate(0, 0, -(d - bevel * 2) / 2)
  return g
}
