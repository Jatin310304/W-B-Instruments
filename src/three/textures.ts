import * as THREE from 'three'

/** Small procedural textures (no image downloads), cached for the whole visit. */
const cache = new Map<string, THREE.Texture>()

function canvasTexture(key: string, w: number, h: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, srgb = false) {
  const hit = cache.get(key)
  if (hit) return hit
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d')!, w, h)
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.anisotropy = 8
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  cache.set(key, t)
  return t
}

/** Fine brushed-metal grain for stainless roughness maps. */
export const brushedTexture = () =>
  canvasTexture('brushed', 512, 64, (ctx, w, h) => {
    ctx.fillStyle = '#7a7a7a'
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 2600; i++) {
      const v = 95 + Math.random() * 90
      ctx.fillStyle = `rgba(${v},${v},${v},${0.18 + Math.random() * 0.25})`
      ctx.fillRect(Math.random() * w, Math.random() * h, 30 + Math.random() * 160, 1)
    }
  })

/** Straight knurl for grip rings (bump map). */
export const knurlTexture = () =>
  canvasTexture('knurl', 256, 16, (ctx, w, h) => {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, w, h)
    for (let x = 0; x < w; x += 4) {
      const g = ctx.createLinearGradient(x, 0, x + 4, 0)
      g.addColorStop(0, '#000')
      g.addColorStop(0.5, '#fff')
      g.addColorStop(1, '#000')
      ctx.fillStyle = g
      ctx.fillRect(x, 0, 4, h)
    }
  })

/** Printed circuit board: solder mask, traces and pads. */
export const pcbTexture = () =>
  canvasTexture(
    'pcb',
    512,
    512,
    (ctx, w, h) => {
      ctx.fillStyle = '#123a2c'
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = 'rgba(210,180,90,.55)'
      ctx.lineWidth = 3
      for (let i = 0; i < 60; i++) {
        let x = Math.random() * w
        let y = Math.random() * h
        ctx.beginPath()
        ctx.moveTo(x, y)
        for (let k = 0; k < 4; k++) {
          if (Math.random() < 0.5) x += (Math.random() - 0.5) * 180
          else y += (Math.random() - 0.5) * 180
          ctx.lineTo(x, y)
        }
        ctx.stroke()
        ctx.fillStyle = 'rgba(225,195,110,.9)'
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fill()
      }
    },
    true,
  )

/** Seven-segment style display face. Only neutral test patterns and units are drawn, never readings. */
export function displayTexture(opts: { text: string; unit?: string; fg: string; bg: string; key: string; w?: number; h?: number; font?: string }) {
  const { text, unit, fg, bg, key, w = 512, h = 256, font } = opts
  return canvasTexture(
    `display:${key}`,
    w,
    h,
    (ctx) => {
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = fg
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.font = font ?? `600 ${Math.round(h * 0.6)}px ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace`
      ctx.fillText(text, unit ? w * 0.78 : w * 0.92, h * 0.54)
      if (unit) {
        ctx.font = `600 ${Math.round(h * 0.2)}px ui-monospace, Menlo, Consolas, monospace`
        ctx.textAlign = 'left'
        ctx.fillText(unit, w * 0.8, h * 0.68)
      }
    },
    true,
  )
}

/** Radial glow used for the blackbody cavity and measurement spots. */
export const glowTexture = () =>
  canvasTexture(
    'glow',
    256,
    256,
    (ctx, w) => {
      const g = ctx.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
      g.addColorStop(0, 'rgba(255,255,255,1)')
      g.addColorStop(0.3, 'rgba(255,255,255,.55)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, w)
    },
    true,
  )
