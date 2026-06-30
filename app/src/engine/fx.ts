// fx.ts — reusable Canvas2D FX helpers for Tower Swipe Defense
// Self-contained, zero-dependency, TypeScript-strict-safe.
// Palette mirrors the design-token system (deep purple/indigo/navy bg;
// magenta/orange-gold/cyan accents; additive glow/bloom, neon beams).
//
// All draw helpers expect a CanvasRenderingContext2D and save/restore their
// own state, so callers never have to clean up shadow/composite settings.

// ─────────────────────────────────────────────────────────────────────────────
// Palette / FX color constants (string + numeric mirror of tokens.ts §10)
// ─────────────────────────────────────────────────────────────────────────────

export const FX_COLORS = {
  fire: '#FF7B00',
  ice: '#3FE0FF',
  poison: '#5EE08A',
  magic: '#B14CFF',
  lightning: '#9CC8FF',
  spark: '#FFD27A',
  laserCyan: '#3FE0FF',
  laserMagenta: '#B14CFF',
  laserOrange: '#FF9E2C',
  gold: '#FFD27A',
  orange: '#FF7B00',
  cyan: '#3FE0FF',
  magenta: '#B14CFF',
  white: '#FFFFFF',
  crit: '#FFE15A',
  bigHit: '#FF8A3D',
} as const

/** ctx.shadowBlur tiers (matches GLOW_BLUR in tokens.ts). */
export const GLOW_BLUR = { sm: 8, md: 18, lg: 30 } as const

// ─────────────────────────────────────────────────────────────────────────────
// Small math / color utils
// ─────────────────────────────────────────────────────────────────────────────

/** rgba() string from #rrggbb hex + alpha. */
export function rgba(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v)
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t
const TAU = Math.PI * 2

/** Mulberry32 deterministic PRNG factory (seedable jitter). */
export function makeRng(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// glow — run a draw fn under an additive bloom pass
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Wrap a drawing callback in an additive ('lighter') glow context.
 * Sets shadowColor/shadowBlur to the accent so anything drawn inside blooms.
 * State is fully isolated (save/restore).
 *
 * @param ctx    target context
 * @param fn     draw callback (receives the same ctx)
 * @param color  accent hex (#rrggbb)
 * @param blur   shadowBlur radius (default GLOW_BLUR.md)
 */
export function glow(
  ctx: CanvasRenderingContext2D,
  fn: (ctx: CanvasRenderingContext2D) => void,
  color: string,
  blur: number = GLOW_BLUR.md,
): void {
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  ctx.shadowColor = color
  ctx.shadowBlur = blur
  fn(ctx)
  ctx.restore()
}

// ─────────────────────────────────────────────────────────────────────────────
// drawBeam — neon laser between two points (wide halo + bright core)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Draw an additive neon beam (laser/frost-ray). Renders a wide faint halo
 * then a thin bright core for a bloom feel.
 *
 * @param width core line width (px); halo is ~3.2x this.
 */
export function drawBeam(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width = 3,
): void {
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  ctx.lineCap = 'round'
  ctx.shadowColor = color
  ctx.shadowBlur = GLOW_BLUR.lg

  // outer halo
  ctx.globalAlpha = 0.35
  ctx.strokeStyle = color
  ctx.lineWidth = width * 3.2
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()

  // mid glow
  ctx.globalAlpha = 0.6
  ctx.lineWidth = width * 1.7
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()

  // bright white-hot core
  ctx.globalAlpha = 1
  ctx.shadowBlur = GLOW_BLUR.sm
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = Math.max(1, width * 0.6)
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()

  ctx.restore()
}

// ─────────────────────────────────────────────────────────────────────────────
// drawMuzzle — flash at a barrel tip when firing
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Muzzle flash: bright radial pop plus a few spokes, pointing along `angle`.
 * @param t 0..1 life (1 = freshly fired, fades to 0)
 */
export function drawMuzzle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  color: string,
  size = 14,
  t = 1,
): void {
  const k = clamp01(t)
  if (k <= 0) return
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.globalCompositeOperation = 'lighter'
  ctx.shadowColor = color
  ctx.shadowBlur = GLOW_BLUR.md * k

  // radial core
  const r = size * (0.6 + 0.4 * k)
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
  grad.addColorStop(0, rgba('#FFFFFF', 0.95 * k))
  grad.addColorStop(0.45, rgba(color, 0.7 * k))
  grad.addColorStop(1, rgba(color, 0))
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, TAU)
  ctx.fill()

  // forward spokes
  ctx.strokeStyle = rgba('#FFFFFF', 0.85 * k)
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  for (let i = -1; i <= 1; i++) {
    const a = i * 0.45
    const len = size * (1.4 + 0.6 * k) * (i === 0 ? 1 : 0.7)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len)
    ctx.stroke()
  }
  ctx.restore()
}

// ─────────────────────────────────────────────────────────────────────────────
// drawExplosion — expanding additive blast ring + core flash
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Stateless explosion render driven by a 0..1 progress value.
 * @param progress 0 = ignition, 1 = fully dissipated
 * @param maxRadius radius of the shockwave ring at progress=1
 */
export function drawExplosion(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number,
  maxRadius = 48,
  color: string = FX_COLORS.fire,
): void {
  const p = clamp01(progress)
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  ctx.shadowColor = color
  ctx.shadowBlur = GLOW_BLUR.lg

  // core flash (bright early, shrinks)
  const coreA = (1 - p) * (1 - p)
  const coreR = maxRadius * (0.35 + 0.25 * p)
  const core = ctx.createRadialGradient(x, y, 0, x, y, coreR)
  core.addColorStop(0, rgba('#FFFFFF', 0.95 * coreA))
  core.addColorStop(0.4, rgba(FX_COLORS.spark, 0.8 * coreA))
  core.addColorStop(0.75, rgba(color, 0.55 * coreA))
  core.addColorStop(1, rgba(color, 0))
  ctx.fillStyle = core
  ctx.beginPath()
  ctx.arc(x, y, coreR, 0, TAU)
  ctx.fill()

  // shockwave ring (expands + fades)
  const ringR = maxRadius * p
  const ringA = (1 - p) * 0.8
  ctx.globalAlpha = ringA
  ctx.strokeStyle = color
  ctx.lineWidth = lerp(5, 1, p)
  ctx.beginPath()
  ctx.arc(x, y, ringR, 0, TAU)
  ctx.stroke()
  ctx.restore()
}

// ─────────────────────────────────────────────────────────────────────────────
// drawLightning — jagged additive bolt between two points
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Jagged lightning arc. Deterministic when `seed` is supplied, otherwise
 * uses Math.random for live flicker.
 * @param segments number of zig-zag segments
 * @param jitter   max perpendicular offset (px)
 */
export function drawLightning(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string = FX_COLORS.lightning,
  segments = 8,
  jitter = 12,
  seed?: number,
): void {
  const rnd = seed !== undefined ? makeRng(seed) : Math.random
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  const nx = -dy / len
  const ny = dx / len

  const pts: Array<[number, number]> = [[x1, y1]]
  for (let i = 1; i < segments; i++) {
    const t = i / segments
    // taper jitter toward the endpoints
    const taper = Math.sin(t * Math.PI)
    const off = (rnd() - 0.5) * 2 * jitter * taper
    pts.push([lerp(x1, x2, t) + nx * off, lerp(y1, y2, t) + ny * off])
  }
  pts.push([x2, y2])

  const stroke = (w: number, col: string, a: number): void => {
    ctx.globalAlpha = a
    ctx.strokeStyle = col
    ctx.lineWidth = w
    ctx.beginPath()
    ctx.moveTo(pts[0][0], pts[0][1])
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
    ctx.stroke()
  }

  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.shadowColor = color
  ctx.shadowBlur = GLOW_BLUR.md
  stroke(6, color, 0.4) // halo
  stroke(3, color, 0.8) // body
  ctx.shadowBlur = GLOW_BLUR.sm
  stroke(1.3, '#FFFFFF', 1) // hot core
  ctx.restore()
}

// ─────────────────────────────────────────────────────────────────────────────
// Damage numbers + Combo system
// ─────────────────────────────────────────────────────────────────────────────

export type DamageKind = 'normal' | 'crit' | 'big' | 'heal'

interface DamageNumber {
  x: number
  y: number
  vx: number
  vy: number
  text: string
  color: string
  size: number
  age: number
  life: number
  crit: boolean
}

/** Format a raw damage value to AAA-style "12.8K" / "22.3K" / "1.4M". */
export function formatDamage(value: number): string {
  const v = Math.round(value)
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (v >= 1_000) return (v / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(v)
}

export interface ComboState {
  /** current multiplier count (e.g. 15 → "COMBO X15") */
  count: number
  /** % bonus damage label (e.g. 200 → "+200% DAMAGE!") */
  bonusPct: number
  /** 0..1 fade/scale alpha for rendering the banner */
  alpha: number
  /** seconds remaining before combo decays */
  remaining: number
}

export interface DamageNumbersOptions {
  /** ms a number stays on screen */
  lifeMs?: number
  /** seconds of idle before combo resets */
  comboWindowSec?: number
  /** disable motion/overshoot for reduced-motion users */
  reducedMotion?: boolean
  /** hard cap on simultaneous floating numbers */
  max?: number
}

/**
 * Floating damage numbers + combo meter, matching the juice spec:
 *  - white normals, yellow crits, orange big-hits, green heals
 *  - numbers pop up, drift, gravity-settle, then fade
 *  - landing hits within the combo window grows "COMBO Xn +m% DAMAGE!"
 *
 * Usage:
 *   const dn = new DamageNumbers()
 *   dn.spawn(x, y, 12800, 'big')        // on each hit
 *   dn.update(dtSeconds)                // each frame
 *   dn.draw(ctx)                        // each frame
 *   dn.getCombo()                       // -> ComboState | null for HUD
 */
export class DamageNumbers {
  private items: DamageNumber[] = []
  private readonly lifeMs: number
  private readonly comboWindow: number
  private readonly reducedMotion: boolean
  private readonly max: number

  // combo
  private comboCount = 0
  private comboTimer = 0
  private comboAlpha = 0
  private comboPop = 0 // 0..1 punch on increment

  constructor(opts: DamageNumbersOptions = {}) {
    this.lifeMs = opts.lifeMs ?? 900
    this.comboWindow = opts.comboWindowSec ?? 1.6
    this.reducedMotion = opts.reducedMotion ?? false
    this.max = opts.max ?? 64
  }

  /** Spawn a floating number at world coords. Advances the combo meter. */
  spawn(x: number, y: number, value: number, kind: DamageKind = 'normal'): void {
    let color: string
    let size: number
    const crit = kind === 'crit' || kind === 'big'
    switch (kind) {
      case 'crit':
        color = FX_COLORS.crit
        size = 26
        break
      case 'big':
        color = FX_COLORS.bigHit
        size = 30
        break
      case 'heal':
        color = FX_COLORS.poison
        size = 20
        break
      default:
        color = FX_COLORS.white
        size = 20
    }

    const spread = this.reducedMotion ? 0 : (Math.random() - 0.5) * 40
    const text = (kind === 'heal' ? '+' : '') + formatDamage(value)
    this.items.push({
      x,
      y,
      vx: spread,
      vy: this.reducedMotion ? -20 : -90 - Math.random() * 40,
      text,
      color,
      size,
      age: 0,
      life: this.lifeMs,
      crit,
    })
    if (this.items.length > this.max) this.items.splice(0, this.items.length - this.max)

    // combo (heals don't build combo)
    if (kind !== 'heal') {
      this.comboCount += 1
      this.comboTimer = this.comboWindow
      this.comboAlpha = 1
      this.comboPop = 1
    }
  }

  /** Advance by dt seconds. */
  update(dt: number): void {
    const ms = dt * 1000
    for (let i = this.items.length - 1; i >= 0; i--) {
      const n = this.items[i]
      n.age += ms
      if (n.age >= n.life) {
        this.items.splice(i, 1)
        continue
      }
      if (!this.reducedMotion) {
        n.x += n.vx * dt
        n.y += n.vy * dt
        n.vy += 180 * dt // gravity settle
        n.vx *= 1 - Math.min(1, 3 * dt) // horizontal drag
      } else {
        n.y += n.vy * dt
      }
    }

    // combo decay
    if (this.comboTimer > 0) {
      this.comboTimer -= dt
      if (this.comboTimer <= 0) {
        this.comboCount = 0
        this.comboTimer = 0
      }
    }
    // fade the banner once the combo has lapsed or while idle-tailing
    if (this.comboCount <= 0) {
      this.comboAlpha = Math.max(0, this.comboAlpha - dt * 4)
    } else if (this.comboTimer < 0.5) {
      this.comboAlpha = Math.max(0.15, this.comboTimer / 0.5)
    }
    this.comboPop = Math.max(0, this.comboPop - dt * (this.reducedMotion ? 12 : 6))
  }

  /** Draw all floating numbers (call after world, before HUD). */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save()
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (const n of this.items) {
      const t = n.age / n.life
      const a = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85 // pop-in then fade
      const pop = !this.reducedMotion && t < 0.18 ? 1 + (1 - t / 0.18) * 0.4 : 1
      const fs = n.size * pop
      ctx.globalAlpha = clamp01(a)
      ctx.font = `800 ${fs}px Inter, system-ui, sans-serif`

      // dark outline for readability over bright FX
      ctx.lineWidth = Math.max(2, fs * 0.16)
      ctx.strokeStyle = 'rgba(7,3,18,0.85)'
      ctx.lineJoin = 'round'
      ctx.strokeText(n.text, n.x, n.y)

      // glow for crits/big hits
      if (n.crit) {
        ctx.shadowColor = n.color
        ctx.shadowBlur = GLOW_BLUR.md
      } else {
        ctx.shadowBlur = 0
      }
      ctx.fillStyle = n.color
      ctx.fillText(n.text, n.x, n.y)
      ctx.shadowBlur = 0
    }
    ctx.restore()
  }

  /**
   * Draw the "COMBO Xn +m% DAMAGE!" banner centered at (cx, cy).
   * No-op when there's no active combo. Bonus = (count-1)*20% capped 500%.
   */
  drawComboBanner(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
    const combo = this.getCombo()
    if (!combo) return
    ctx.save()
    ctx.translate(cx, cy)
    const scale = 1 + (this.reducedMotion ? 0 : this.comboPop * 0.25)
    ctx.scale(scale, scale)
    ctx.globalAlpha = combo.alpha
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // main combo line
    ctx.font = '800 30px Cinzel, Georgia, serif'
    ctx.lineWidth = 5
    ctx.strokeStyle = 'rgba(7,3,18,0.9)'
    ctx.lineJoin = 'round'
    const main = `COMBO X${combo.count}`
    ctx.strokeText(main, 0, 0)
    ctx.shadowColor = FX_COLORS.orange
    ctx.shadowBlur = GLOW_BLUR.lg
    ctx.fillStyle = FX_COLORS.spark
    ctx.fillText(main, 0, 0)
    ctx.shadowBlur = 0

    // bonus line
    ctx.font = '800 16px Inter, system-ui, sans-serif'
    ctx.lineWidth = 3
    const sub = `+${combo.bonusPct}% DAMAGE!`
    ctx.strokeText(sub, 0, 26)
    ctx.shadowColor = FX_COLORS.magenta
    ctx.shadowBlur = GLOW_BLUR.md
    ctx.fillStyle = FX_COLORS.white
    ctx.fillText(sub, 0, 26)
    ctx.restore()
  }

  /** Current combo state for HUD/React, or null if inactive. */
  getCombo(): ComboState | null {
    if (this.comboCount <= 1 && this.comboAlpha <= 0.01) return null
    const bonusPct = Math.min(500, Math.max(0, this.comboCount - 1) * 20)
    return {
      count: this.comboCount,
      bonusPct,
      alpha: clamp01(this.comboAlpha),
      remaining: Math.max(0, this.comboTimer),
    }
  }

  /** Damage multiplier implied by the current combo (1 + bonus%). */
  getDamageMultiplier(): number {
    const combo = this.getCombo()
    return combo ? 1 + combo.bonusPct / 100 : 1
  }

  /** Number of active floating items (debug/perf). */
  get activeCount(): number {
    return this.items.length
  }

  /** Clear everything (e.g. on run end / screen change). */
  clear(): void {
    this.items.length = 0
    this.comboCount = 0
    this.comboTimer = 0
    this.comboAlpha = 0
    this.comboPop = 0
  }
}
