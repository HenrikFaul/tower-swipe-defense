// spritesTowers.ts
// Stylized-3D tower sprites for TOWER SWIPE DEFENSE, drawn purely with Canvas 2D
// (no images, no external libs). Faithful to the design-token palette: deep
// purple/navy bases, magenta + orange/gold + cyan accents, rim light, additive
// glow/bloom, contact shadow, ground glow, tier pips, idle + fire animation.
//
// Public API:
//   drawTowerSprite(ctx, type, x, y, scale, opts)
//
// (x, y) is the tower's *base / footprint center* on the ground (isometric anchor).
// `scale` ~ pixel radius of the footprint (e.g. 26 for a play-grid cell).

export type TowerSpriteType =
  | 'archer'
  | 'cannon'
  | 'mage'
  | 'ice'
  | 'poison'
  | 'barracks'

export interface TowerSpriteOpts {
  /** In-run tier index 0..2 (controls height, extra detail, pip count). */
  tier: number
  /** 0..1 muzzle-flash / recoil intensity; decays over a shot. */
  flash: number
  /** Facing angle in radians (where the turret aims). 0 = +x (right). */
  angle: number
  /** Draw a selection ring + pulse when true. */
  selected: boolean
  /** Animation clock in seconds (idle bob, glow pulse, particles). */
  time: number
}

/* ------------------------------------------------------------------ */
/* Palette (mirrors design tokens)                                     */
/* ------------------------------------------------------------------ */

const C = {
  // backgrounds / shadow
  void: '#0B0518',
  bg700: '#1A0F3D',
  bg500: '#321C6E',
  // brand accents
  magenta: '#B14CFF',
  magentaDeep: '#5A1FB8',
  violet: '#7B61FF',
  orange: '#FF7B00',
  orange2: '#FFB347',
  gold: '#FFD27A',
  goldHi: '#FFF3C4',
  goldDeep: '#B85600',
  cyan: '#3FE0FF',
  cyan2: '#5CC8FF',
  cyanDeep: '#1B7FA8',
  good: '#5EE08A',
  good2: '#9CF06A',
  bad: '#FF4D5E',
  text: '#F2ECFF',
  stone: '#3A2C5E',
  stoneHi: '#5A468C',
  stoneLo: '#241452',
} as const

interface TowerStyle {
  body: string
  bodyHi: string
  bodyLo: string
  accent: string
  glow: string
  beam: string
}

const STYLE: Record<TowerSpriteType, TowerStyle> = {
  archer: {
    body: '#8A6A44',
    bodyHi: '#C9A66B',
    bodyLo: '#4E3A22',
    accent: C.gold,
    glow: C.gold,
    beam: C.gold,
  },
  cannon: {
    body: '#5A5466',
    bodyHi: '#8A82A0',
    bodyLo: '#2E2A3A',
    accent: C.orange,
    glow: C.orange,
    beam: '#FF9E2C',
  },
  mage: {
    body: '#7B61FF',
    bodyHi: '#C7A6FF',
    bodyLo: '#3A2A7A',
    accent: C.magenta,
    glow: C.magenta,
    beam: C.magenta,
  },
  ice: {
    body: '#5CC8FF',
    bodyHi: '#BFEFFF',
    bodyLo: '#235E80',
    accent: C.cyan,
    glow: C.cyan,
    beam: C.cyan,
  },
  poison: {
    body: '#5EE08A',
    bodyHi: '#BFF8CF',
    bodyLo: '#22633E',
    accent: C.good2,
    glow: C.good,
    beam: C.good2,
  },
  barracks: {
    body: '#C98A4A',
    bodyHi: '#F0C189',
    bodyLo: '#6E4720',
    accent: C.orange2,
    glow: C.orange2,
    beam: C.orange2,
  },
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function rgba(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

/** Vertical linear gradient between three stops (top->mid->bottom). */
function vgrad(
  ctx: CanvasRenderingContext2D,
  y0: number,
  y1: number,
  top: string,
  mid: string,
  bot: string,
): CanvasGradient {
  const g = ctx.createLinearGradient(0, y0, 0, y1)
  g.addColorStop(0, top)
  g.addColorStop(0.5, mid)
  g.addColorStop(1, bot)
  return g
}

/** Filled rounded rect (centered horizontally on local 0). */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

/** Squashed ellipse (used for iso footprints, shadows, glows). */
function ellipse(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
): void {
  ctx.beginPath()
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
  ctx.closePath()
}

/* ------------------------------------------------------------------ */
/* Shared ground layer: contact shadow + additive ground glow          */
/* ------------------------------------------------------------------ */

function drawGround(
  ctx: CanvasRenderingContext2D,
  s: number,
  style: TowerStyle,
  pulse: number,
): void {
  // Contact shadow (soft, below footprint).
  ctx.save()
  ctx.globalCompositeOperation = 'source-over'
  const sh = ctx.createRadialGradient(0, s * 0.18, 0, 0, s * 0.18, s * 1.25)
  sh.addColorStop(0, rgba(C.void, 0.55))
  sh.addColorStop(1, rgba(C.void, 0))
  ctx.fillStyle = sh
  ellipse(ctx, 0, s * 0.18, s * 1.15, s * 0.5)
  ctx.fill()
  ctx.restore()

  // Additive ground glow tinted by the tower element.
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const gg = ctx.createRadialGradient(0, s * 0.1, 0, 0, s * 0.1, s * 1.05)
  gg.addColorStop(0, rgba(style.glow, 0.32 + pulse * 0.12))
  gg.addColorStop(0.6, rgba(style.glow, 0.1))
  gg.addColorStop(1, rgba(style.glow, 0))
  ctx.fillStyle = gg
  ellipse(ctx, 0, s * 0.12, s * 1.0, s * 0.42)
  ctx.fill()
  ctx.restore()
}

/* ------------------------------------------------------------------ */
/* Shared stone plinth (iso base block all towers sit on)              */
/* ------------------------------------------------------------------ */

function drawPlinth(ctx: CanvasRenderingContext2D, s: number): void {
  const topY = -s * 0.05
  const botY = s * 0.32
  const rx = s * 0.82
  const ry = s * 0.34

  // Side wall (the iso "thickness").
  ctx.save()
  ctx.fillStyle = vgrad(ctx, topY, botY + ry, C.stoneLo, '#1B1140', C.void)
  ctx.beginPath()
  ctx.moveTo(-rx, topY)
  ctx.lineTo(-rx, botY)
  ctx.ellipse(0, botY, rx, ry, 0, Math.PI, 0, true)
  ctx.lineTo(rx, topY)
  ctx.ellipse(0, topY, rx, ry, 0, 0, Math.PI, false)
  ctx.closePath()
  ctx.fill()

  // Top cap with rim light.
  ctx.fillStyle = vgrad(ctx, topY - ry, topY + ry, C.stoneHi, C.stone, C.stoneLo)
  ellipse(ctx, 0, topY, rx, ry)
  ctx.fill()

  // Magenta hairline rim on the lit (top-left) edge.
  ctx.lineWidth = Math.max(1, s * 0.045)
  ctx.strokeStyle = rgba(C.magenta, 0.35)
  ctx.beginPath()
  ctx.ellipse(0, topY, rx, ry, 0, Math.PI * 0.85, Math.PI * 1.9)
  ctx.stroke()
  ctx.restore()
}

/* ------------------------------------------------------------------ */
/* Rim light helper: bright stroke on the upper-left of a path-region  */
/* ------------------------------------------------------------------ */

function rimStroke(
  ctx: CanvasRenderingContext2D,
  color: string,
  w: number,
): void {
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  ctx.lineWidth = w
  ctx.strokeStyle = rgba(color, 0.85)
  ctx.stroke()
  ctx.restore()
}

/* ------------------------------------------------------------------ */
/* Muzzle flash (additive burst at turret tip, oriented by angle)      */
/* ------------------------------------------------------------------ */

function drawMuzzle(
  ctx: CanvasRenderingContext2D,
  tipX: number,
  tipY: number,
  angle: number,
  flash: number,
  style: TowerStyle,
  s: number,
): void {
  if (flash <= 0.01) return
  ctx.save()
  ctx.translate(tipX, tipY)
  ctx.rotate(angle)
  ctx.globalCompositeOperation = 'lighter'

  const r = s * (0.3 + flash * 0.55)
  const burst = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
  burst.addColorStop(0, rgba('#FFFFFF', 0.95 * flash))
  burst.addColorStop(0.35, rgba(style.beam, 0.8 * flash))
  burst.addColorStop(1, rgba(style.beam, 0))
  ctx.fillStyle = burst
  ellipse(ctx, 0, 0, r, r * 0.8)
  ctx.fill()

  // Forward beam streak.
  ctx.globalAlpha = flash
  const beam = ctx.createLinearGradient(0, 0, s * 1.4, 0)
  beam.addColorStop(0, rgba('#FFFFFF', 0.9))
  beam.addColorStop(0.4, rgba(style.beam, 0.7))
  beam.addColorStop(1, rgba(style.beam, 0))
  ctx.fillStyle = beam
  roundRect(ctx, 0, -s * 0.09 * flash, s * 1.4, s * 0.18 * flash, s * 0.09)
  ctx.fill()

  // Sparks.
  const n = 5
  for (let i = 0; i < n; i++) {
    const a = (i / n - 0.5) * 1.1
    const d = s * (0.3 + flash * 0.6)
    ctx.fillStyle = rgba(C.gold, 0.9 * flash)
    ellipse(
      ctx,
      Math.cos(a) * d,
      Math.sin(a) * d,
      s * 0.05,
      s * 0.05,
    )
    ctx.fill()
  }
  ctx.restore()
}

/* ------------------------------------------------------------------ */
/* Tier pips: small glowing gems on the plinth front (1 + tier count)  */
/* ------------------------------------------------------------------ */

function drawTierPips(
  ctx: CanvasRenderingContext2D,
  s: number,
  tier: number,
  style: TowerStyle,
  pulse: number,
): void {
  const count = Math.max(0, Math.min(2, tier)) + 1
  const gap = s * 0.26
  const y = s * 0.2
  const x0 = -gap * (count - 1) * 0.5
  for (let i = 0; i < count; i++) {
    const cx = x0 + i * gap
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    const g = ctx.createRadialGradient(cx, y, 0, cx, y, s * 0.16)
    g.addColorStop(0, rgba(C.gold, 0.95))
    g.addColorStop(0.5, rgba(style.glow, 0.7 + pulse * 0.2))
    g.addColorStop(1, rgba(style.glow, 0))
    ctx.fillStyle = g
    ellipse(ctx, cx, y, s * 0.1, s * 0.1)
    ctx.fill()
    ctx.restore()
    // Solid core.
    ctx.fillStyle = C.goldHi
    ellipse(ctx, cx, y, s * 0.045, s * 0.045)
    ctx.fill()
  }
}

/* ------------------------------------------------------------------ */
/* Selection ring (animated dashed iso ring on the ground)             */
/* ------------------------------------------------------------------ */

function drawSelection(
  ctx: CanvasRenderingContext2D,
  s: number,
  time: number,
): void {
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const rx = s * 1.05
  const ry = s * 0.44
  const y = s * 0.16
  ctx.lineWidth = Math.max(1.5, s * 0.07)
  ctx.strokeStyle = rgba(C.gold, 0.9)
  ctx.setLineDash([s * 0.3, s * 0.22])
  ctx.lineDashOffset = -time * s * 0.9
  ctx.beginPath()
  ctx.ellipse(0, y, rx, ry, 0, 0, Math.PI * 2)
  ctx.stroke()
  // Soft inner glow band.
  ctx.setLineDash([])
  ctx.lineWidth = Math.max(2, s * 0.16)
  ctx.strokeStyle = rgba(C.orange, 0.18)
  ctx.beginPath()
  ctx.ellipse(0, y, rx, ry, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

/* ================================================================== */
/* Per-tower turret drawings (local origin = plinth top center 0,0;    */
/* tower grows upward into negative Y; `h` = body height by tier)      */
/* ================================================================== */

function drawArcher(
  ctx: CanvasRenderingContext2D,
  s: number,
  st: TowerStyle,
  tier: number,
  angle: number,
  bob: number,
): void {
  const h = s * (1.2 + tier * 0.16)
  // Tapered stone turret.
  ctx.fillStyle = vgrad(ctx, -h, 0, st.bodyHi, st.body, st.bodyLo)
  ctx.beginPath()
  ctx.moveTo(-s * 0.5, 0)
  ctx.lineTo(-s * 0.4, -h)
  ctx.lineTo(s * 0.4, -h)
  ctx.lineTo(s * 0.5, 0)
  ctx.closePath()
  ctx.fill()
  // Crenellated top ring.
  ctx.fillStyle = st.bodyHi
  for (let i = -2; i <= 2; i++) {
    roundRect(ctx, i * s * 0.18 - s * 0.07, -h - s * 0.16, s * 0.14, s * 0.18, s * 0.03)
    ctx.fill()
  }
  ellipse(ctx, 0, -h, s * 0.42, s * 0.16)
  ctx.fillStyle = st.bodyLo
  ctx.fill()
  // Rim light (left edge).
  ctx.beginPath()
  ctx.moveTo(-s * 0.5, 0)
  ctx.lineTo(-s * 0.4, -h)
  rimStroke(ctx, C.gold, s * 0.05)
  // Archer + bow on top, aiming.
  ctx.save()
  ctx.translate(0, -h - s * 0.02 + bob)
  ctx.rotate(Math.max(-0.5, Math.min(0.5, Math.sin(angle) * 0.5)))
  ctx.strokeStyle = st.accent
  ctx.lineWidth = s * 0.07
  ctx.globalCompositeOperation = 'lighter'
  ctx.beginPath()
  ctx.arc(0, 0, s * 0.3, -Math.PI * 0.42, Math.PI * 0.42)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(0, -s * 0.27)
  ctx.lineTo(0, s * 0.27)
  ctx.stroke()
  ctx.restore()
}

function drawCannon(
  ctx: CanvasRenderingContext2D,
  s: number,
  st: TowerStyle,
  tier: number,
  angle: number,
  flash: number,
): void {
  const h = s * (0.9 + tier * 0.12)
  // Stubby fortified base.
  ctx.fillStyle = vgrad(ctx, -h, 0, st.bodyHi, st.body, st.bodyLo)
  roundRect(ctx, -s * 0.6, -h, s * 1.2, h + s * 0.2, s * 0.22)
  ctx.fill()
  // Rivet band.
  ctx.fillStyle = rgba('#000000', 0.25)
  roundRect(ctx, -s * 0.6, -h * 0.45, s * 1.2, s * 0.16, s * 0.06)
  ctx.fill()
  ctx.fillStyle = st.bodyHi
  roundRect(ctx, -s * 0.6, -h, s * 1.2, s * 0.1, s * 0.05)
  ctx.fill()
  // Rotating barrel (recoils with flash).
  const recoil = flash * s * 0.2
  ctx.save()
  ctx.translate(0, -h * 0.7)
  ctx.rotate(angle)
  ctx.translate(-recoil, 0)
  const bl = s * (0.85 + tier * 0.06)
  ctx.fillStyle = vgrad(ctx, -s * 0.2, s * 0.2, '#6E6680', '#3E394C', '#211E2C')
  roundRect(ctx, 0, -s * 0.2, bl, s * 0.4, s * 0.14)
  ctx.fill()
  // Muzzle ring.
  ctx.fillStyle = '#1A1726'
  ellipse(ctx, bl, 0, s * 0.12, s * 0.2)
  ctx.fill()
  ctx.globalCompositeOperation = 'lighter'
  ctx.strokeStyle = rgba(st.accent, 0.6)
  ctx.lineWidth = s * 0.05
  roundRect(ctx, 0, -s * 0.2, bl, s * 0.4, s * 0.14)
  ctx.stroke()
  ctx.restore()
}

function drawMage(
  ctx: CanvasRenderingContext2D,
  s: number,
  st: TowerStyle,
  tier: number,
  time: number,
  pulse: number,
): void {
  const h = s * (1.35 + tier * 0.2)
  // Slender spire.
  ctx.fillStyle = vgrad(ctx, -h, 0, st.bodyHi, st.body, st.bodyLo)
  ctx.beginPath()
  ctx.moveTo(-s * 0.42, 0)
  ctx.lineTo(-s * 0.28, -h * 0.78)
  ctx.lineTo(s * 0.28, -h * 0.78)
  ctx.lineTo(s * 0.42, 0)
  ctx.closePath()
  ctx.fill()
  // Conical roof.
  ctx.fillStyle = vgrad(ctx, -h, -h * 0.6, C.magentaDeep, st.accent, st.body)
  ctx.beginPath()
  ctx.moveTo(-s * 0.36, -h * 0.78)
  ctx.lineTo(0, -h)
  ctx.lineTo(s * 0.36, -h * 0.78)
  ctx.closePath()
  ctx.fill()
  // Rim light on spire left.
  ctx.beginPath()
  ctx.moveTo(-s * 0.42, 0)
  ctx.lineTo(-s * 0.28, -h * 0.78)
  rimStroke(ctx, C.violet, s * 0.05)
  // Floating orb above the roof with rotating runes.
  const oy = -h - s * 0.32 + Math.sin(time * 2) * s * 0.05
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const orb = ctx.createRadialGradient(0, oy, 0, 0, oy, s * 0.4)
  orb.addColorStop(0, rgba('#FFFFFF', 0.95))
  orb.addColorStop(0.4, rgba(st.accent, 0.85))
  orb.addColorStop(1, rgba(st.accent, 0))
  ctx.fillStyle = orb
  ellipse(ctx, 0, oy, s * (0.22 + pulse * 0.05), s * (0.22 + pulse * 0.05))
  ctx.fill()
  // Orbiting sparks.
  for (let i = 0; i < 3; i++) {
    const a = time * 3 + (i * Math.PI * 2) / 3
    const r = s * 0.34
    ctx.fillStyle = rgba(C.magenta, 0.9)
    ellipse(ctx, Math.cos(a) * r, oy + Math.sin(a) * r * 0.5, s * 0.05, s * 0.05)
    ctx.fill()
  }
  ctx.restore()
}

function drawIce(
  ctx: CanvasRenderingContext2D,
  s: number,
  st: TowerStyle,
  tier: number,
  time: number,
  pulse: number,
): void {
  const h = s * (1.15 + tier * 0.18)
  // Crystal cluster: central shard + side shards.
  const shard = (
    ox: number,
    sh: number,
    w: number,
    tint: string,
  ): void => {
    ctx.fillStyle = vgrad(ctx, -sh, 0, '#EAFBFF', tint, st.bodyLo)
    ctx.beginPath()
    ctx.moveTo(ox - w, 0)
    ctx.lineTo(ox - w * 0.5, -sh * 0.85)
    ctx.lineTo(ox, -sh)
    ctx.lineTo(ox + w * 0.5, -sh * 0.85)
    ctx.lineTo(ox + w, 0)
    ctx.closePath()
    ctx.fill()
    // Facet highlight.
    ctx.globalCompositeOperation = 'lighter'
    ctx.fillStyle = rgba('#FFFFFF', 0.4)
    ctx.beginPath()
    ctx.moveTo(ox, -sh)
    ctx.lineTo(ox + w * 0.5, -sh * 0.85)
    ctx.lineTo(ox, 0)
    ctx.closePath()
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
  }
  shard(-s * 0.34, h * 0.6, s * 0.24, '#7FD9FF')
  shard(s * 0.34, h * 0.68, s * 0.26, '#7FD9FF')
  shard(0, h, s * 0.34, st.body)
  // Frost aura.
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const aura = ctx.createRadialGradient(0, -h * 0.5, 0, 0, -h * 0.5, s * 0.8)
  aura.addColorStop(0, rgba(st.glow, 0.3 + pulse * 0.15))
  aura.addColorStop(1, rgba(st.glow, 0))
  ctx.fillStyle = aura
  ellipse(ctx, 0, -h * 0.5, s * 0.7, s * 0.8)
  ctx.fill()
  // Drifting snow specks.
  for (let i = 0; i < 4; i++) {
    const a = time * 0.8 + i
    const r = s * 0.5
    ctx.fillStyle = rgba('#FFFFFF', 0.7)
    ellipse(
      ctx,
      Math.cos(a) * r,
      -h * 0.5 + Math.sin(a * 1.3) * r * 0.6,
      s * 0.035,
      s * 0.035,
    )
    ctx.fill()
  }
  ctx.restore()
}

function drawPoison(
  ctx: CanvasRenderingContext2D,
  s: number,
  st: TowerStyle,
  tier: number,
  time: number,
  pulse: number,
): void {
  const h = s * (1.0 + tier * 0.14)
  // Cauldron / vat body.
  ctx.fillStyle = vgrad(ctx, -h, 0, st.bodyHi, st.body, st.bodyLo)
  ctx.beginPath()
  ctx.moveTo(-s * 0.55, -h * 0.2)
  ctx.quadraticCurveTo(-s * 0.62, 0, -s * 0.42, s * 0.18)
  ctx.lineTo(s * 0.42, s * 0.18)
  ctx.quadraticCurveTo(s * 0.62, 0, s * 0.55, -h * 0.2)
  ctx.lineTo(s * 0.55, -h * 0.7)
  ctx.quadraticCurveTo(0, -h, -s * 0.55, -h * 0.7)
  ctx.closePath()
  ctx.fill()
  // Bubbling toxin surface.
  const sy = -h * 0.7
  ctx.fillStyle = vgrad(ctx, sy - s * 0.1, sy + s * 0.1, '#D8FFD0', st.accent, st.body)
  ellipse(ctx, 0, sy, s * 0.52, s * 0.16)
  ctx.fill()
  // Glow + bubbles.
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const gl = ctx.createRadialGradient(0, sy, 0, 0, sy, s * 0.6)
  gl.addColorStop(0, rgba(st.glow, 0.5 + pulse * 0.2))
  gl.addColorStop(1, rgba(st.glow, 0))
  ctx.fillStyle = gl
  ellipse(ctx, 0, sy, s * 0.55, s * 0.3)
  ctx.fill()
  for (let i = 0; i < 4; i++) {
    const ph = (time * 0.9 + i * 0.27) % 1
    const bx = (i - 1.5) * s * 0.22
    ctx.fillStyle = rgba(C.good2, 0.7 * (1 - ph))
    ellipse(ctx, bx, sy - ph * h * 0.7, s * 0.06 * (1 - ph * 0.5), s * 0.06 * (1 - ph * 0.5))
    ctx.fill()
  }
  ctx.restore()
  // Rim light.
  ctx.beginPath()
  ctx.moveTo(-s * 0.55, -h * 0.7)
  ctx.quadraticCurveTo(-s * 0.62, 0, -s * 0.42, s * 0.18)
  rimStroke(ctx, C.good, s * 0.04)
}

function drawBarracks(
  ctx: CanvasRenderingContext2D,
  s: number,
  st: TowerStyle,
  tier: number,
  time: number,
): void {
  const h = s * (0.85 + tier * 0.12)
  // Wide fort house.
  ctx.fillStyle = vgrad(ctx, -h, 0, st.bodyHi, st.body, st.bodyLo)
  roundRect(ctx, -s * 0.68, -h, s * 1.36, h + s * 0.18, s * 0.12)
  ctx.fill()
  // Battlement roof.
  ctx.fillStyle = st.bodyLo
  for (let i = -3; i <= 3; i++) {
    roundRect(ctx, i * s * 0.2 - s * 0.07, -h - s * 0.16, s * 0.15, s * 0.18, s * 0.03)
    ctx.fill()
  }
  // Banner pole + waving flag.
  ctx.strokeStyle = '#3A2C1A'
  ctx.lineWidth = s * 0.05
  ctx.beginPath()
  ctx.moveTo(s * 0.42, -h)
  ctx.lineTo(s * 0.42, -h - s * 0.7)
  ctx.stroke()
  const wave = Math.sin(time * 4) * s * 0.05
  ctx.fillStyle = st.accent
  ctx.beginPath()
  ctx.moveTo(s * 0.42, -h - s * 0.7)
  ctx.lineTo(s * 0.42 + s * 0.4, -h - s * 0.6 + wave)
  ctx.lineTo(s * 0.42, -h - s * 0.45)
  ctx.closePath()
  ctx.fill()
  // Door arch.
  ctx.fillStyle = C.stoneLo
  roundRect(ctx, -s * 0.18, -h * 0.55, s * 0.36, h * 0.55, s * 0.12)
  ctx.fill()
  // Rim light on roof.
  ctx.beginPath()
  ctx.moveTo(-s * 0.68, -h)
  ctx.lineTo(s * 0.68, -h)
  rimStroke(ctx, C.orange2, s * 0.05)
}

/* ================================================================== */
/* Public entry point                                                  */
/* ================================================================== */

export function drawTowerSprite(
  ctx: CanvasRenderingContext2D,
  type: TowerSpriteType,
  x: number,
  y: number,
  scale: number,
  opts: TowerSpriteOpts,
): void {
  const st = STYLE[type]
  const tier = Math.max(0, Math.min(2, Math.floor(opts.tier)))
  const flash = Math.max(0, Math.min(1, opts.flash))
  const time = opts.time
  const angle = opts.angle
  const s = scale

  // Idle pulse (glow breathing) and vertical bob.
  const pulse = 0.5 + 0.5 * Math.sin(time * 2.2)
  const bob = Math.sin(time * 1.6) * s * 0.03

  ctx.save()
  ctx.translate(x, y)
  // 'round' joins keep extruded edges clean.
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  // 1) Ground: contact shadow + element ground glow.
  drawGround(ctx, s, st, pulse)

  // 2) Selection ring under the tower (drawn on the ground plane).
  if (opts.selected) drawSelection(ctx, s, time)

  // 3) Stone plinth all towers stand on.
  drawPlinth(ctx, s)

  // 4) Turret body (lifted onto plinth top). Subtle idle bob.
  ctx.save()
  ctx.translate(0, -s * 0.05 + bob)
  switch (type) {
    case 'archer':
      drawArcher(ctx, s, st, tier, angle, bob)
      break
    case 'cannon':
      drawCannon(ctx, s, st, tier, angle, flash)
      break
    case 'mage':
      drawMage(ctx, s, st, tier, time, pulse)
      break
    case 'ice':
      drawIce(ctx, s, st, tier, time, pulse)
      break
    case 'poison':
      drawPoison(ctx, s, st, tier, time, pulse)
      break
    case 'barracks':
      drawBarracks(ctx, s, st, tier, time)
      break
  }
  ctx.restore()

  // 5) Muzzle flash at the turret tip (oriented by angle), for shooters.
  if (type === 'archer' || type === 'cannon' || type === 'mage') {
    const tipR = type === 'cannon' ? s * 1.0 : s * 0.6
    const tipH =
      type === 'mage'
        ? -s * (1.35 + tier * 0.2) - s * 0.32
        : -s * (1.05 + tier * 0.12)
    drawMuzzle(
      ctx,
      Math.cos(angle) * tipR,
      tipH + Math.sin(angle) * s * 0.25,
      angle,
      flash,
      st,
      s,
    )
  }

  // 6) Tier pips on the plinth front.
  drawTierPips(ctx, s, tier, st, pulse)

  ctx.restore()
}

export default drawTowerSprite
