// background.ts — layered parallax stylized-3D scene drawn behind the isometric board.
//
// drawBackground(ctx, w, h, themeName, time)
//   themeName: 'meadow' | 'canyon' | 'frost' | 'ashlands' (case-insensitive;
//              also accepts the display names 'Meadow' | 'Canyon' | 'Frostland' | 'Ashlands').
//   time:      seconds (or ms — auto-normalized) used to animate fog, embers & light.
//
// Pure Canvas 2D, no external libs / images. Everything is procedurally drawn so it
// matches the deep-purple / magenta+orange+cyan token palette regardless of theme.
// Layers (back → front): gradient sky → light shafts → far spire/mountain silhouettes
// (parallax) → near silhouettes → drifting fog bands → ambient particles → vignette.

// ---------------------------------------------------------------------------
// Palette (mirrors app/src/styles design tokens)
// ---------------------------------------------------------------------------
const BG = {
  bg900: '#0B0518',
  bg800: '#120A2A',
  bg700: '#1A0F3D',
  bg600: '#241452',
  bg500: '#321C6E',
} as const

type ThemeKey = 'meadow' | 'canyon' | 'frost' | 'ashlands'

interface ThemeBg {
  /** sky gradient stops, top → bottom */
  skyTop: string
  skyMid: string
  skyBottom: string
  /** glow color of the light bloom / shafts near the horizon */
  bloom: string
  /** far silhouette tint (lighter, more atmospheric) */
  far: string
  /** near silhouette tint (darker) */
  near: string
  /** ambient particle color */
  particle: string
  /** particle behaviour: rising embers vs falling snow vs drifting motes */
  particleKind: 'ember' | 'snow' | 'mote'
  /** silhouette skyline style */
  skyline: 'mountains' | 'spires' | 'jagged'
}

const THEMES: Record<ThemeKey, ThemeBg> = {
  meadow: {
    skyTop: BG.bg700,
    skyMid: BG.bg600,
    skyBottom: BG.bg500,
    bloom: '#3FE0FF',
    far: '#2A1A5C',
    near: '#160C36',
    particle: 'rgba(156,240,106,0.55)',
    particleKind: 'mote',
    skyline: 'mountains',
  },
  canyon: {
    skyTop: '#1F0F33',
    skyMid: '#3A1B3F',
    skyBottom: '#5A2A38',
    bloom: '#FF9E2C',
    far: '#4A1F45',
    near: '#2A0F2C',
    particle: 'rgba(255,179,71,0.6)',
    particleKind: 'ember',
    skyline: 'jagged',
  },
  frost: {
    skyTop: BG.bg800,
    skyMid: '#16204A',
    skyBottom: '#234A7A',
    bloom: '#5CC8FF',
    far: '#23335E',
    near: '#101B3A',
    particle: 'rgba(200,235,255,0.75)',
    particleKind: 'snow',
    skyline: 'mountains',
  },
  ashlands: {
    skyTop: '#1A0512',
    skyMid: '#3A0F12',
    skyBottom: '#6A1E14',
    bloom: '#FF7B00',
    far: '#4A1410',
    near: '#240807',
    particle: 'rgba(255,140,60,0.7)',
    particleKind: 'ember',
    skyline: 'spires',
  },
}

// ---------------------------------------------------------------------------
// Per-(theme,size) cached gradients & silhouette geometry (rebuilt on change)
// ---------------------------------------------------------------------------
interface BgCache {
  key: string
  sky: CanvasGradient
  bloom: CanvasGradient
  vignette: CanvasGradient
  far: number[]
  near: number[]
}
let cache: BgCache | null = null

// Deterministic value-noise so silhouettes & particles are stable per frame.
function hash(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

/** Build a ridge-line height profile (array of normalized heights 0..1). */
function ridgeline(segments: number, seed: number, roughness: number, baseline: number): number[] {
  const pts: number[] = []
  for (let i = 0; i <= segments; i++) {
    const a = hash(i + seed) - 0.5
    const b = (hash(i * 0.37 + seed * 7.3) - 0.5) * 0.5
    pts.push(baseline + (a + b) * roughness)
  }
  return pts
}

function resolveTheme(name: string): ThemeBg {
  const k = name.trim().toLowerCase()
  if (k === 'meadow') return THEMES.meadow
  if (k === 'canyon') return THEMES.canyon
  if (k === 'frost' || k === 'frostland') return THEMES.frost
  if (k === 'ashlands' || k === 'volcano' || k === 'volcanoland') return THEMES.ashlands
  return THEMES.meadow
}

function rebuild(ctx: CanvasRenderingContext2D, w: number, h: number, name: string): BgCache {
  const th = resolveTheme(name)

  const sky = ctx.createLinearGradient(0, 0, 0, h)
  sky.addColorStop(0, th.skyTop)
  sky.addColorStop(0.55, th.skyMid)
  sky.addColorStop(1, th.skyBottom)

  // horizon bloom centered slightly below mid-screen
  const cy = h * 0.5
  const bloom = ctx.createRadialGradient(w * 0.5, cy, 10, w * 0.5, cy, Math.max(w, h) * 0.62)
  bloom.addColorStop(0, withAlpha(th.bloom, 0.34))
  bloom.addColorStop(0.35, withAlpha(th.bloom, 0.14))
  bloom.addColorStop(1, withAlpha(th.bloom, 0))

  const vignette = ctx.createRadialGradient(w * 0.5, h * 0.42, Math.min(w, h) * 0.32, w * 0.5, h * 0.5, Math.max(w, h) * 0.78)
  vignette.addColorStop(0, 'rgba(11,5,24,0)')
  vignette.addColorStop(0.7, 'rgba(11,5,24,0.18)')
  vignette.addColorStop(1, 'rgba(11,5,24,0.85)')

  const segByline = th.skyline === 'spires' ? 14 : 10
  const far = ridgeline(segByline, 11, th.skyline === 'mountains' ? 0.16 : 0.26, 0.42)
  const near = ridgeline(segByline + 4, 53, th.skyline === 'mountains' ? 0.22 : 0.34, 0.6)

  return { key: `${w}x${h}|${name}`, sky, bloom, vignette, far, near }
}

function withAlpha(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

// ---------------------------------------------------------------------------
// Silhouette drawing
// ---------------------------------------------------------------------------
function drawSilhouette(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  heights: number[],
  baseY: number,
  color: string,
  rimColor: string,
  spires: boolean,
): void {
  const seg = heights.length - 1
  const step = w / seg

  ctx.beginPath()
  ctx.moveTo(0, h)
  ctx.lineTo(0, baseY - heights[0] * h * 0.3)
  for (let i = 1; i <= seg; i++) {
    const x = i * step
    const y = baseY - heights[i] * h * 0.3
    if (spires) {
      // sharp vertical spires: dip to baseline between peaks for a fortress skyline
      const px = (i - 0.5) * step
      const py = baseY - heights[i - 1] * h * 0.3
      ctx.lineTo(px, baseY + h * 0.04)
      ctx.lineTo(px, py)
      ctx.lineTo(x, y)
    } else {
      const cx = x - step * 0.5
      const cy = baseY - heights[i - 1] * h * 0.3
      ctx.quadraticCurveTo(cx, cy, x, y)
    }
  }
  ctx.lineTo(w, h)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()

  // thin rim-light along the ridge for the stylized-3D pop
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  ctx.strokeStyle = rimColor
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.moveTo(0, baseY - heights[0] * h * 0.3)
  for (let i = 1; i <= seg; i++) {
    const x = i * step
    const y = baseY - heights[i] * h * 0.3
    if (spires) {
      ctx.lineTo((i - 0.5) * step, baseY - heights[i - 1] * h * 0.3)
    }
    ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.restore()
}

// ---------------------------------------------------------------------------
// Light shafts (god-rays from horizon bloom)
// ---------------------------------------------------------------------------
function drawLightShafts(ctx: CanvasRenderingContext2D, w: number, h: number, bloom: string, t: number): void {
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const cx = w * 0.5
  const cy = h * 0.5
  const shafts = 5
  for (let i = 0; i < shafts; i++) {
    const sway = Math.sin(t * 0.18 + i * 1.7) * 0.12
    const ang = -Math.PI / 2 + (i - (shafts - 1) / 2) * 0.26 + sway
    const len = h * 0.95
    const half = (w * 0.05) * (0.7 + 0.3 * Math.sin(t * 0.3 + i))
    const ex = cx + Math.cos(ang) * len
    const ey = cy + Math.sin(ang) * len
    const nx = Math.cos(ang + Math.PI / 2) * half
    const ny = Math.sin(ang + Math.PI / 2) * half
    const g = ctx.createLinearGradient(cx, cy, ex, ey)
    g.addColorStop(0, withAlpha(bloom, 0.12))
    g.addColorStop(1, withAlpha(bloom, 0))
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(ex - nx, ey - ny)
    ctx.lineTo(ex + nx, ey + ny)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()
}

// ---------------------------------------------------------------------------
// Drifting fog bands
// ---------------------------------------------------------------------------
function drawFog(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, t: number): void {
  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  const bands = 3
  for (let i = 0; i < bands; i++) {
    const y = h * (0.5 + i * 0.14)
    const drift = ((t * (8 + i * 5)) % (w + 240)) - 120
    const amp = h * (0.05 + i * 0.02)
    const alpha = 0.06 + i * 0.015
    ctx.fillStyle = withAlpha(color, alpha)
    ctx.beginPath()
    ctx.moveTo(-120, h)
    for (let x = -120; x <= w + 120; x += 40) {
      const yy = y + Math.sin((x + drift) * 0.012 + i) * amp
      ctx.lineTo(x, yy)
    }
    ctx.lineTo(w + 120, h)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()
}

// ---------------------------------------------------------------------------
// Ambient particles (embers / snow / motes)
// ---------------------------------------------------------------------------
function drawParticles(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  kind: ThemeBg['particleKind'],
  t: number,
): void {
  const count = 46
  ctx.save()
  ctx.globalCompositeOperation = kind === 'snow' ? 'screen' : 'lighter'
  for (let i = 0; i < count; i++) {
    const seed = i * 2.331
    const baseX = hash(seed) * w
    const speed = 0.04 + hash(seed + 1) * 0.08
    const size = 1 + hash(seed + 2) * 2.2
    const swayAmp = 14 + hash(seed + 3) * 26

    let x: number
    let y: number
    if (kind === 'ember') {
      // rise upward, recycle from bottom
      const prog = (hash(seed + 4) + t * speed) % 1
      y = h - prog * h * 1.05
      x = baseX + Math.sin(t * 0.7 + seed) * swayAmp
    } else if (kind === 'snow') {
      const prog = (hash(seed + 4) + t * speed) % 1
      y = prog * h * 1.05
      x = baseX + Math.sin(t * 0.5 + seed) * swayAmp
    } else {
      // motes: gentle floating drift
      y = (hash(seed + 4) * h + Math.sin(t * 0.3 + seed) * 30) % h
      x = baseX + Math.sin(t * 0.4 + seed * 1.3) * swayAmp
    }

    const twinkle = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 2 + seed * 5))
    ctx.globalAlpha = twinkle
    ctx.fillStyle = color
    ctx.shadowColor = color
    ctx.shadowBlur = kind === 'snow' ? 0 : 8
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  themeName: string,
  time: number,
): void {
  // accept ms or seconds: anything > 1000 treated as ms
  const t = time > 1000 ? time / 1000 : time
  const th = resolveTheme(themeName)

  const key = `${w}x${h}|${themeName}`
  if (!cache || cache.key !== key) cache = rebuild(ctx, w, h, themeName)
  const c = cache

  // 1. sky gradient
  ctx.fillStyle = c.sky
  ctx.fillRect(0, 0, w, h)

  // 2. horizon bloom + light shafts
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  ctx.fillStyle = c.bloom
  ctx.fillRect(0, 0, w, h)
  ctx.restore()
  drawLightShafts(ctx, w, h, th.bloom, t)

  // 3. far skyline (parallax — sits higher, lighter, faint)
  const spires = th.skyline === 'spires' || th.skyline === 'jagged'
  drawSilhouette(ctx, w, h, c.far, h * 0.62, th.far, withAlpha(th.bloom, 0.22), spires)

  // 4. near skyline (darker, lower, with a stronger rim)
  drawSilhouette(ctx, w, h, c.near, h * 0.74, th.near, withAlpha(th.bloom, 0.4), spires)

  // 5. drifting fog over the bases
  drawFog(ctx, w, h, th.bloom, t)

  // 6. ambient particles
  drawParticles(ctx, w, h, th.particle, th.particleKind, t)

  // 7. vignette to frame the board
  ctx.fillStyle = c.vignette
  ctx.fillRect(0, 0, w, h)
}

export default drawBackground
