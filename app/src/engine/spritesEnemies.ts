// spritesEnemies.ts
// Canvas 2D sprite renderer for all 8 enemy types in Tower Swipe Defense.
// Cute-menacing stylized-3D: rounded volumes, rim-light, eyes, soft additive
// glow, and status FX (frozen / poisoned / enraged / shield). Everything is
// drawn in code — no images. Colors follow the design-token palette.
//
// Usage:
//   drawEnemySprite(ctx, 'slime', x, y, scale, {
//     hpFrac: 1, faceLeft: false, wobble: t, frozen: false,
//     poisoned: false, enraged: false, shield: false, boss: false, time: t,
//   })

export type EnemySpriteType =
  | 'slime'
  | 'imp'
  | 'brute'
  | 'shaman'
  | 'warlock'
  | 'golem'
  | 'ogre'
  | 'dragon'

export interface EnemySpriteOpts {
  /** Health fraction 0..1 — drives a thin floating HP bar + low-hp reddening. */
  hpFrac: number
  /** Mirror horizontally so the sprite faces left (it walks toward the keep). */
  faceLeft: boolean
  /** Free-running time-ish value (seconds) driving idle bob/squash. */
  wobble: number
  /** Encased in frost: cyan crystal overlay, dimmed body. */
  frozen: boolean
  /** Toxin DoT: green bubbling glow + drips. */
  poisoned: boolean
  /** Enraged (boss low-hp / fast): red aura + glowing eyes. */
  enraged: boolean
  /** Has a protective aura/shield bubble. */
  shield: boolean
  /** Boss flag: extra base scale + crown + heavier glow. */
  boss: boolean
  /** Absolute animation time (seconds) for FX cycling. */
  time: number
}

// ---------------------------------------------------------------------------
// Palette (mirrors design tokens, kept local so this file is self-contained).
// ---------------------------------------------------------------------------
const PAL = {
  ink: '#1A0E33',
  white: '#F2ECFF',
  frost: '#3FE0FF',
  frostDeep: '#1B7FA8',
  toxin: '#5EE08A',
  toxinHi: '#9CF06A',
  rage: '#FF4D5E',
  rageHi: '#FF8A3D',
  shield: '#5CC8FF',
  gold: '#FFD27A',
  bad: '#FF4D5E',
  good: '#5EE08A',
} as const

interface Skin {
  body: string
  bodyHi: string
  bodyShade: string
  accent: string
  eye: string
}

// Per-type skins (body / lit highlight / shaded side / accent / eye color).
const SKINS: Record<EnemySpriteType, Skin> = {
  slime: { body: '#76C043', bodyHi: '#A6E86B', bodyShade: '#3F7D22', accent: '#9CF06A', eye: '#1A0E33' },
  imp: { body: '#E06D4A', bodyHi: '#FF9E6E', bodyShade: '#8A2F1A', accent: '#FFB347', eye: '#FFE15A' },
  brute: { body: '#8A8F99', bodyHi: '#C2C6CE', bodyShade: '#4A4E57', accent: '#B14CFF', eye: '#FF4D5E' },
  shaman: { body: '#F0D27A', bodyHi: '#FFEBB0', bodyShade: '#A07D2A', accent: '#5EE08A', eye: '#5A1FB8' },
  warlock: { body: '#9A7BFF', bodyHi: '#C7B0FF', bodyShade: '#4A2F8A', accent: '#3FE0FF', eye: '#3FE0FF' },
  golem: { body: '#6F7A6A', bodyHi: '#9CA694', bodyShade: '#39402F', accent: '#FFB347', eye: '#FF9E2C' },
  ogre: { body: '#B0473A', bodyHi: '#E6745C', bodyShade: '#5A1F18', accent: '#FFD27A', eye: '#FFE15A' },
  dragon: { body: '#D8632E', bodyHi: '#FF9E4C', bodyShade: '#7A2A10', accent: '#FF7B00', eye: '#FFE15A' },
}

// rgba helper from #rrggbb hex.
function rgba(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

// ---------------------------------------------------------------------------
// Public API.
// ---------------------------------------------------------------------------
export function drawEnemySprite(
  ctx: CanvasRenderingContext2D,
  type: EnemySpriteType,
  x: number,
  y: number,
  scale: number,
  opts: EnemySpriteOpts,
): void {
  const skin = SKINS[type]
  const t = opts.time
  const boss = opts.boss || type === 'ogre' || type === 'dragon'
  const s = scale * (boss ? 1.55 : 1)

  // Idle squash & bob from wobble.
  const bob = Math.sin(opts.wobble * 2.6) * 1.6 * s
  const squash = 1 + Math.sin(opts.wobble * 2.6) * 0.05

  ctx.save()
  ctx.translate(x, y + bob)
  if (opts.faceLeft) ctx.scale(-1, 1)

  // Ground contact shadow.
  drawShadow(ctx, s)

  // Status auras drawn behind the body (additive).
  if (opts.shield) drawShieldAura(ctx, s, t)
  if (opts.enraged) drawRageAura(ctx, s, t)
  if (opts.poisoned) drawPoisonHaze(ctx, s, t)

  ctx.save()
  ctx.scale(1, squash)

  // Body per type.
  switch (type) {
    case 'slime': drawSlime(ctx, skin, s, opts); break
    case 'imp': drawImp(ctx, skin, s, opts); break
    case 'brute': drawBrute(ctx, skin, s, opts); break
    case 'shaman': drawShaman(ctx, skin, s, opts); break
    case 'warlock': drawWarlock(ctx, skin, s, opts); break
    case 'golem': drawGolem(ctx, skin, s, opts); break
    case 'ogre': drawOgre(ctx, skin, s, opts); break
    case 'dragon': drawDragon(ctx, skin, s, opts); break
  }

  ctx.restore()

  // Frozen overlay on top of everything (so it reads as encasing ice).
  if (opts.frozen) drawFrozenShell(ctx, s, t)

  ctx.restore()

  // HP bar floats above, in screen space (un-mirrored).
  drawHpBar(ctx, x, y + bob, s, opts.hpFrac, boss)
}

// ---------------------------------------------------------------------------
// Shared primitives.
// ---------------------------------------------------------------------------
function drawShadow(ctx: CanvasRenderingContext2D, s: number): void {
  ctx.save()
  ctx.globalAlpha = 0.45
  ctx.fillStyle = 'rgba(7,3,18,0.55)'
  ctx.beginPath()
  ctx.ellipse(0, 16 * s, 16 * s, 5 * s, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function blob(ctx: CanvasRenderingContext2D, r: number, fill: string | CanvasGradient): void {
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.fillStyle = fill
  ctx.fill()
}

// Rounded 3d body: radial highlight + rim light. Returns nothing; centred at 0,0.
function roundBody(
  ctx: CanvasRenderingContext2D,
  r: number,
  skin: Skin,
  dim: boolean,
): void {
  const g = ctx.createRadialGradient(-r * 0.35, -r * 0.45, r * 0.1, 0, 0, r * 1.05)
  g.addColorStop(0, skin.bodyHi)
  g.addColorStop(0.55, skin.body)
  g.addColorStop(1, skin.bodyShade)
  ctx.globalAlpha = dim ? 0.7 : 1
  blob(ctx, r, g)
  ctx.globalAlpha = 1
  // Rim light bottom-right.
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  ctx.globalAlpha = 0.35
  ctx.lineWidth = Math.max(1, r * 0.08)
  ctx.strokeStyle = skin.bodyHi
  ctx.beginPath()
  ctx.arc(0, 0, r * 0.96, Math.PI * 0.05, Math.PI * 0.75)
  ctx.stroke()
  ctx.restore()
}

// Cute eye: white sclera + dark pupil + spec highlight. eyeColor tints sclera.
function eye(
  ctx: CanvasRenderingContext2D,
  ex: number,
  ey: number,
  r: number,
  pupil: string,
  glow?: string,
): void {
  ctx.save()
  if (glow) {
    ctx.shadowColor = glow
    ctx.shadowBlur = r * 2.5
  }
  ctx.fillStyle = '#F8F4FF'
  ctx.beginPath()
  ctx.arc(ex, ey, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0
  ctx.fillStyle = pupil
  ctx.beginPath()
  ctx.arc(ex + r * 0.18, ey + r * 0.12, r * 0.55, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.beginPath()
  ctx.arc(ex - r * 0.25, ey - r * 0.3, r * 0.22, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function angryBrow(
  ctx: CanvasRenderingContext2D,
  ex: number,
  ey: number,
  w: number,
  inner: boolean,
  color: string,
): void {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = Math.max(1, w * 0.35)
  ctx.lineCap = 'round'
  ctx.beginPath()
  if (inner) {
    ctx.moveTo(ex - w, ey - w * 0.9)
    ctx.lineTo(ex + w, ey - w * 0.2)
  } else {
    ctx.moveTo(ex - w, ey - w * 0.2)
    ctx.lineTo(ex + w, ey - w * 0.9)
  }
  ctx.stroke()
  ctx.restore()
}

function additiveGlow(ctx: CanvasRenderingContext2D, r: number, color: string, a: number): void {
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
  g.addColorStop(0, rgba(color, a))
  g.addColorStop(1, rgba(color, 0))
  ctx.fillStyle = g
  blob(ctx, r, g)
  ctx.restore()
}

// ---------------------------------------------------------------------------
// Status FX.
// ---------------------------------------------------------------------------
function drawShieldAura(ctx: CanvasRenderingContext2D, s: number, t: number): void {
  const r = 18 * s + Math.sin(t * 3) * 1.5 * s
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  ctx.lineWidth = 2
  ctx.strokeStyle = rgba(PAL.shield, 0.55)
  ctx.shadowColor = PAL.shield
  ctx.shadowBlur = 12
  ctx.beginPath()
  ctx.arc(0, -2 * s, r, 0, Math.PI * 2)
  ctx.stroke()
  ctx.globalAlpha = 0.12
  ctx.fillStyle = PAL.shield
  ctx.fill()
  ctx.restore()
}

function drawRageAura(ctx: CanvasRenderingContext2D, s: number, t: number): void {
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + t * 4
    const rr = 16 * s + Math.sin(t * 9 + i) * 3 * s
    ctx.fillStyle = rgba(PAL.rageHi, 0.5)
    ctx.shadowColor = PAL.rage
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(Math.cos(a) * rr, Math.sin(a) * rr - 2 * s, 2.2 * s, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

function drawPoisonHaze(ctx: CanvasRenderingContext2D, s: number, t: number): void {
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  for (let i = 0; i < 5; i++) {
    const ph = t * 1.6 + i * 1.3
    const bx = Math.sin(ph * 2 + i) * 9 * s
    const by = -((ph % 1.6) / 1.6) * 22 * s + 6 * s
    const a = 0.5 * (1 - (ph % 1.6) / 1.6)
    ctx.fillStyle = rgba(PAL.toxin, a)
    ctx.shadowColor = PAL.toxin
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.arc(bx, by, 2 * s + (i % 2) * s, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

function drawFrozenShell(ctx: CanvasRenderingContext2D, s: number, t: number): void {
  ctx.save()
  // Icy tint over body.
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 0.32
  const g = ctx.createRadialGradient(-4 * s, -6 * s, 2, 0, 0, 18 * s)
  g.addColorStop(0, rgba(PAL.frost, 0.9))
  g.addColorStop(1, rgba(PAL.frostDeep, 0.4))
  ctx.fillStyle = g
  blob(ctx, 17 * s, g)
  // Crystal facets.
  ctx.globalAlpha = 0.85
  ctx.globalCompositeOperation = 'lighter'
  ctx.strokeStyle = rgba('#CFF6FF', 0.8)
  ctx.lineWidth = 1.2
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.4
    ctx.beginPath()
    ctx.moveTo(Math.cos(a) * 6 * s, Math.sin(a) * 6 * s - 2 * s)
    ctx.lineTo(Math.cos(a) * 15 * s, Math.sin(a) * 15 * s - 2 * s)
    ctx.stroke()
  }
  // Sparkle.
  const sp = (Math.sin(t * 5) + 1) * 0.5
  ctx.globalAlpha = 0.4 + sp * 0.5
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(-7 * s, -9 * s, 1.4 * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawHpBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
  hpFrac: number,
  boss: boolean,
): void {
  if (hpFrac >= 0.999 && !boss) return
  const w = (boss ? 40 : 26) * (s / Math.max(s, 1)) + (boss ? 18 : 8) * s
  const h = boss ? 5 : 3.2
  const bx = x - w / 2
  const by = y - (boss ? 34 : 24) * s
  ctx.save()
  ctx.fillStyle = 'rgba(7,3,18,0.7)'
  roundRect(ctx, bx - 1, by - 1, w + 2, h + 2, h)
  ctx.fill()
  const frac = Math.max(0, Math.min(1, hpFrac))
  const low = frac < 0.35
  const grad = ctx.createLinearGradient(bx, 0, bx + w, 0)
  if (boss) {
    grad.addColorStop(0, '#B81F3A')
    grad.addColorStop(0.5, PAL.bad)
    grad.addColorStop(1, PAL.rageHi)
  } else if (low) {
    grad.addColorStop(0, PAL.bad)
    grad.addColorStop(1, '#FF7A5C')
  } else {
    grad.addColorStop(0, PAL.good)
    grad.addColorStop(1, '#9CF06A')
  }
  ctx.fillStyle = grad
  roundRect(ctx, bx, by, Math.max(h, w * frac), h, h)
  ctx.fill()
  ctx.restore()
}

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

// ---------------------------------------------------------------------------
// Per-type bodies. All centred at local 0,0, sized via `s`.
// ---------------------------------------------------------------------------
function drawSlime(ctx: CanvasRenderingContext2D, skin: Skin, s: number, _o: EnemySpriteOpts): void {
  const r = 13 * s
  additiveGlow(ctx, r * 1.6, skin.accent, 0.18)
  // Gummy dome (flat bottom).
  ctx.save()
  const g = ctx.createRadialGradient(-r * 0.35, -r * 0.5, r * 0.1, 0, 0, r * 1.1)
  g.addColorStop(0, skin.bodyHi)
  g.addColorStop(0.6, skin.body)
  g.addColorStop(1, skin.bodyShade)
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.moveTo(-r, 8 * s)
  ctx.quadraticCurveTo(-r * 1.05, -r, 0, -r)
  ctx.quadraticCurveTo(r * 1.05, -r, r, 8 * s)
  ctx.quadraticCurveTo(0, 12 * s, -r, 8 * s)
  ctx.closePath()
  ctx.fill()
  // Inner jelly shine.
  ctx.globalAlpha = 0.5
  ctx.fillStyle = rgba('#FFFFFF', 0.6)
  ctx.beginPath()
  ctx.ellipse(-r * 0.3, -r * 0.35, r * 0.3, r * 0.45, -0.4, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
  eye(ctx, -r * 0.32, -r * 0.1, 2.6 * s, skin.eye)
  eye(ctx, r * 0.4, -r * 0.1, 2.6 * s, skin.eye)
  // Smile.
  ctx.save()
  ctx.strokeStyle = 'rgba(26,14,51,0.7)'
  ctx.lineWidth = 1.3 * s
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.arc(r * 0.05, r * 0.1, 3 * s, 0.15, Math.PI - 0.15)
  ctx.stroke()
  ctx.restore()
}

function drawImp(ctx: CanvasRenderingContext2D, skin: Skin, s: number, o: EnemySpriteOpts): void {
  const r = 9 * s
  additiveGlow(ctx, r * 1.8, PAL.rageHi, 0.16)
  // Horns.
  ctx.save()
  ctx.fillStyle = skin.bodyShade
  for (const sx of [-1, 1]) {
    ctx.beginPath()
    ctx.moveTo(sx * r * 0.5, -r * 0.7)
    ctx.quadraticCurveTo(sx * r * 1.0, -r * 1.7, sx * r * 0.4, -r * 1.9)
    ctx.quadraticCurveTo(sx * r * 0.3, -r * 1.0, sx * r * 0.2, -r * 0.7)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()
  roundBody(ctx, r, skin, false)
  // Pointy ears.
  ctx.save()
  ctx.fillStyle = skin.body
  for (const sx of [-1, 1]) {
    ctx.beginPath()
    ctx.moveTo(sx * r * 0.85, -r * 0.1)
    ctx.lineTo(sx * r * 1.5, -r * 0.5)
    ctx.lineTo(sx * r * 0.95, r * 0.35)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()
  const glow = o.enraged ? PAL.rage : undefined
  eye(ctx, -r * 0.3, 0, 2.1 * s, skin.eye, glow)
  eye(ctx, r * 0.4, 0, 2.1 * s, skin.eye, glow)
  angryBrow(ctx, -r * 0.3, -r * 0.4, 2.4 * s, true, skin.bodyShade)
  angryBrow(ctx, r * 0.4, -r * 0.4, 2.4 * s, false, skin.bodyShade)
  // Fang grin.
  ctx.save()
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.moveTo(-1.5 * s, r * 0.4)
  ctx.lineTo(0, r * 0.75)
  ctx.lineTo(1.5 * s, r * 0.4)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawBrute(ctx: CanvasRenderingContext2D, skin: Skin, s: number, o: EnemySpriteOpts): void {
  const r = 16 * s
  // Bulky armored torso (rounded square).
  ctx.save()
  const g = ctx.createLinearGradient(0, -r, 0, r)
  g.addColorStop(0, skin.bodyHi)
  g.addColorStop(0.5, skin.body)
  g.addColorStop(1, skin.bodyShade)
  ctx.fillStyle = g
  roundRect(ctx, -r, -r * 0.9, r * 2, r * 1.9, r * 0.45)
  ctx.fill()
  // Armor plate seam + studs.
  ctx.strokeStyle = rgba(skin.bodyShade, 0.9)
  ctx.lineWidth = 1.5 * s
  ctx.beginPath()
  ctx.moveTo(0, -r * 0.5)
  ctx.lineTo(0, r * 0.8)
  ctx.stroke()
  ctx.fillStyle = skin.accent
  ctx.shadowColor = skin.accent
  ctx.shadowBlur = 6
  for (const sx of [-1, 1]) {
    ctx.beginPath()
    ctx.arc(sx * r * 0.55, -r * 0.6, 1.6 * s, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
  // Helmet rim.
  ctx.save()
  ctx.fillStyle = skin.bodyShade
  roundRect(ctx, -r, -r * 0.95, r * 2, r * 0.4, r * 0.2)
  ctx.fill()
  ctx.restore()
  const glow = o.enraged ? PAL.rage : skin.eye
  eye(ctx, -r * 0.35, -r * 0.15, 2.4 * s, '#1A0E33', glow)
  eye(ctx, r * 0.45, -r * 0.15, 2.4 * s, '#1A0E33', glow)
  // Grim mouth.
  ctx.save()
  ctx.strokeStyle = 'rgba(26,14,51,0.8)'
  ctx.lineWidth = 1.6 * s
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(-r * 0.35, r * 0.45)
  ctx.lineTo(r * 0.45, r * 0.45)
  ctx.stroke()
  ctx.restore()
}

function drawShaman(ctx: CanvasRenderingContext2D, skin: Skin, s: number, o: EnemySpriteOpts): void {
  const r = 12 * s
  additiveGlow(ctx, r * 1.7, skin.accent, 0.2)
  // Robed body (triangle-ish).
  ctx.save()
  const g = ctx.createLinearGradient(0, -r, 0, r * 1.4)
  g.addColorStop(0, skin.bodyHi)
  g.addColorStop(0.6, skin.body)
  g.addColorStop(1, skin.bodyShade)
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.moveTo(0, -r)
  ctx.quadraticCurveTo(r * 1.4, r * 0.4, r * 0.9, r * 1.3)
  ctx.lineTo(-r * 0.9, r * 1.3)
  ctx.quadraticCurveTo(-r * 1.4, r * 0.4, 0, -r)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
  // Hood.
  ctx.save()
  ctx.fillStyle = skin.bodyShade
  ctx.beginPath()
  ctx.arc(0, -r * 0.3, r * 0.7, Math.PI, 0)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
  eye(ctx, -r * 0.28, -r * 0.05, 2 * s, skin.eye, skin.accent)
  eye(ctx, r * 0.32, -r * 0.05, 2 * s, skin.eye, skin.accent)
  // Healing staff orb.
  const pulse = (Math.sin(o.time * 4) + 1) * 0.5
  ctx.save()
  ctx.strokeStyle = skin.bodyShade
  ctx.lineWidth = 1.6 * s
  ctx.beginPath()
  ctx.moveTo(r * 0.9, r * 1.2)
  ctx.lineTo(r * 0.9, -r * 1.1)
  ctx.stroke()
  ctx.globalCompositeOperation = 'lighter'
  ctx.shadowColor = PAL.good
  ctx.shadowBlur = 8 + pulse * 6
  ctx.fillStyle = PAL.toxinHi
  ctx.beginPath()
  ctx.arc(r * 0.9, -r * 1.25, 2.6 * s + pulse * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawWarlock(ctx: CanvasRenderingContext2D, skin: Skin, s: number, o: EnemySpriteOpts): void {
  const r = 12 * s
  additiveGlow(ctx, r * 1.8, skin.accent, 0.2)
  // Caped figure.
  ctx.save()
  const g = ctx.createLinearGradient(0, -r * 1.2, 0, r * 1.4)
  g.addColorStop(0, skin.bodyHi)
  g.addColorStop(0.55, skin.body)
  g.addColorStop(1, skin.bodyShade)
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.moveTo(0, -r * 1.2)
  ctx.bezierCurveTo(r * 1.5, -r * 0.6, r * 1.2, r * 1.2, r * 0.7, r * 1.3)
  ctx.lineTo(-r * 0.7, r * 1.3)
  ctx.bezierCurveTo(-r * 1.2, r * 1.2, -r * 1.5, -r * 0.6, 0, -r * 1.2)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
  // Pointed wizard hat.
  ctx.save()
  ctx.fillStyle = skin.bodyShade
  ctx.beginPath()
  ctx.moveTo(0, -r * 2.4)
  ctx.lineTo(r * 0.75, -r * 0.6)
  ctx.lineTo(-r * 0.75, -r * 0.6)
  ctx.closePath()
  ctx.fill()
  // Hat star.
  ctx.globalCompositeOperation = 'lighter'
  ctx.fillStyle = skin.accent
  ctx.shadowColor = skin.accent
  ctx.shadowBlur = 8
  ctx.beginPath()
  ctx.arc(0, -r * 1.5, 2 * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
  const glow = o.enraged ? PAL.rage : skin.eye
  eye(ctx, -r * 0.3, -r * 0.1, 2.1 * s, skin.eye, glow)
  eye(ctx, r * 0.34, -r * 0.1, 2.1 * s, skin.eye, glow)
}

function drawGolem(ctx: CanvasRenderingContext2D, skin: Skin, s: number, o: EnemySpriteOpts): void {
  const r = 17 * s
  // Stacked rocky blocks.
  ctx.save()
  const g = ctx.createLinearGradient(0, -r, 0, r)
  g.addColorStop(0, skin.bodyHi)
  g.addColorStop(0.5, skin.body)
  g.addColorStop(1, skin.bodyShade)
  ctx.fillStyle = g
  drawRockChunk(ctx, 0, r * 0.2, r * 1.1, r * 0.9)
  drawRockChunk(ctx, -r * 0.1, -r * 0.7, r * 0.75, r * 0.6)
  ctx.restore()
  // Glowing core cracks.
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const pulse = (Math.sin(o.time * 3) + 1) * 0.5
  ctx.strokeStyle = rgba(skin.accent, 0.6 + pulse * 0.3)
  ctx.shadowColor = skin.accent
  ctx.shadowBlur = 8 + pulse * 6
  ctx.lineWidth = 1.6 * s
  ctx.beginPath()
  ctx.moveTo(-r * 0.4, r * 0.5)
  ctx.lineTo(0, r * 0.1)
  ctx.lineTo(r * 0.3, r * 0.55)
  ctx.stroke()
  ctx.restore()
  const glow = o.enraged ? PAL.rage : skin.eye
  eye(ctx, -r * 0.32, -r * 0.65, 2.4 * s, '#1A0E33', glow)
  eye(ctx, r * 0.28, -r * 0.65, 2.4 * s, '#1A0E33', glow)
}

function drawRockChunk(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number): void {
  ctx.beginPath()
  ctx.moveTo(cx - w, cy - h * 0.6)
  ctx.lineTo(cx - w * 0.5, cy - h)
  ctx.lineTo(cx + w * 0.7, cy - h * 0.8)
  ctx.lineTo(cx + w, cy + h * 0.3)
  ctx.lineTo(cx + w * 0.4, cy + h)
  ctx.lineTo(cx - w * 0.7, cy + h * 0.9)
  ctx.closePath()
  ctx.fill()
}

function drawOgre(ctx: CanvasRenderingContext2D, skin: Skin, s: number, o: EnemySpriteOpts): void {
  const r = 16 * s
  additiveGlow(ctx, r * 1.7, o.enraged ? PAL.rage : skin.accent, 0.18)
  // Hulking torso.
  ctx.save()
  const g = ctx.createRadialGradient(-r * 0.4, -r * 0.5, r * 0.2, 0, 0, r * 1.2)
  g.addColorStop(0, skin.bodyHi)
  g.addColorStop(0.55, skin.body)
  g.addColorStop(1, skin.bodyShade)
  ctx.fillStyle = g
  roundRect(ctx, -r * 1.1, -r * 0.9, r * 2.2, r * 1.9, r * 0.5)
  ctx.fill()
  // Shoulder spikes.
  ctx.fillStyle = skin.bodyShade
  for (const sx of [-1, 1]) {
    ctx.beginPath()
    ctx.moveTo(sx * r * 0.9, -r * 0.7)
    ctx.lineTo(sx * r * 1.4, -r * 1.4)
    ctx.lineTo(sx * r * 1.1, -r * 0.3)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()
  // Tusks.
  ctx.save()
  ctx.fillStyle = '#FFF3D0'
  for (const sx of [-1, 1]) {
    ctx.beginPath()
    ctx.moveTo(sx * r * 0.25, r * 0.35)
    ctx.lineTo(sx * r * 0.45, r * 0.85)
    ctx.lineTo(sx * r * 0.1, r * 0.5)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()
  const glow = o.enraged ? PAL.rage : PAL.gold
  eye(ctx, -r * 0.4, -r * 0.2, 2.8 * s, skin.eye, glow)
  eye(ctx, r * 0.45, -r * 0.2, 2.8 * s, skin.eye, glow)
  angryBrow(ctx, -r * 0.4, -r * 0.55, 3 * s, true, skin.bodyShade)
  angryBrow(ctx, r * 0.45, -r * 0.55, 3 * s, false, skin.bodyShade)
  // Boss crown.
  drawCrown(ctx, 0, -r * 1.05, r * 0.55)
}

function drawDragon(ctx: CanvasRenderingContext2D, skin: Skin, s: number, o: EnemySpriteOpts): void {
  const r = 17 * s
  additiveGlow(ctx, r * 2, PAL.rageHi, 0.22)
  // Wings behind.
  ctx.save()
  const flap = Math.sin(o.time * 3) * 0.25
  ctx.fillStyle = skin.bodyShade
  for (const sx of [-1, 1]) {
    ctx.save()
    ctx.translate(sx * r * 0.6, -r * 0.2)
    ctx.rotate(sx * (0.5 + flap))
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(r * 1.6, -r * 0.8, r * 2.0, r * 0.2)
    ctx.lineTo(r * 1.2, r * 0.2)
    ctx.lineTo(r * 1.5, r * 0.9)
    ctx.lineTo(r * 0.6, r * 0.4)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
  ctx.restore()
  // Body.
  ctx.save()
  const g = ctx.createRadialGradient(-r * 0.4, -r * 0.5, r * 0.2, 0, 0, r * 1.2)
  g.addColorStop(0, skin.bodyHi)
  g.addColorStop(0.55, skin.body)
  g.addColorStop(1, skin.bodyShade)
  ctx.fillStyle = g
  blob(ctx, r, g)
  ctx.restore()
  // Snout / muzzle.
  ctx.save()
  ctx.fillStyle = skin.body
  ctx.beginPath()
  ctx.ellipse(r * 0.55, r * 0.15, r * 0.55, r * 0.4, -0.2, 0, Math.PI * 2)
  ctx.fill()
  // Horns.
  ctx.fillStyle = '#FFF3D0'
  for (const sx of [-1, 1]) {
    ctx.beginPath()
    ctx.moveTo(sx * r * 0.4, -r * 0.7)
    ctx.lineTo(sx * r * 0.7, -r * 1.5)
    ctx.lineTo(sx * r * 0.15, -r * 0.8)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()
  // Nostril fire glow.
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const fire = (Math.sin(o.time * 6) + 1) * 0.5
  ctx.fillStyle = rgba(PAL.rageHi, 0.7)
  ctx.shadowColor = '#FF7B00'
  ctx.shadowBlur = 6 + fire * 8
  ctx.beginPath()
  ctx.arc(r * 0.95, r * 0.05, 1.6 * s + fire * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
  const glow = o.enraged ? PAL.rage : skin.eye
  eye(ctx, -r * 0.1, -r * 0.25, 2.6 * s, '#1A0E33', glow)
  eye(ctx, r * 0.3, -r * 0.25, 2.6 * s, '#1A0E33', glow)
  angryBrow(ctx, -r * 0.1, -r * 0.6, 3 * s, true, skin.bodyShade)
  angryBrow(ctx, r * 0.3, -r * 0.6, 3 * s, false, skin.bodyShade)
  drawCrown(ctx, -r * 0.05, -r * 1.0, r * 0.55)
}

function drawCrown(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number): void {
  ctx.save()
  ctx.fillStyle = '#FFD27A'
  ctx.shadowColor = '#FFB347'
  ctx.shadowBlur = 8
  ctx.beginPath()
  ctx.moveTo(cx - w, cy)
  ctx.lineTo(cx - w, cy - w * 0.5)
  ctx.lineTo(cx - w * 0.5, cy - w * 0.1)
  ctx.lineTo(cx, cy - w * 0.7)
  ctx.lineTo(cx + w * 0.5, cy - w * 0.1)
  ctx.lineTo(cx + w, cy - w * 0.5)
  ctx.lineTo(cx + w, cy)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}
