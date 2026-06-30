// palette.ts — Canvas-renderer color constants for TOWER SWIPE DEFENSE.
//
// Single source of truth for the Canvas 2D draw code. Mirrors the CSS token
// system (deep purple/indigo/navy backgrounds; magenta + orange/gold + cyan
// accents; additive neon glow/bloom). Every entry is provided as a numeric hex
// (for fast ctx work / 0x math) AND a CSS string (for ctx.fillStyle /
// strokeStyle / shadowColor). Use the helpers at the bottom to convert.

/* ────────────────────────────────────────────────────────────────────────── *
 *  HELPERS
 * ────────────────────────────────────────────────────────────────────────── */

/** Numeric hex (0xRRGGBB) → css `#rrggbb`. */
export const hex = (n: number): string => `#${(n & 0xffffff).toString(16).padStart(6, '0')}`

/** Numeric hex (0xRRGGBB) + alpha 0..1 → css `rgba(r,g,b,a)` (for glow halos). */
export const withAlpha = (n: number, a: number): string => {
  const r = (n >> 16) & 0xff
  const g = (n >> 8) & 0xff
  const b = n & 0xff
  return `rgba(${r},${g},${b},${a})`
}

/** css `#rrggbb` string → numeric hex. */
export const toNum = (s: string): number => parseInt(s.replace('#', ''), 16)

/* ────────────────────────────────────────────────────────────────────────── *
 *  NUMERIC HEX (0xRRGGBB) — raw values, single source of truth
 * ────────────────────────────────────────────────────────────────────────── */

export const HEX = {
  // Backgrounds (darkest → lightest)
  bg900: 0x0b0518,
  bg800: 0x120a2a,
  bg700: 0x1a0f3d,
  bg600: 0x241452,
  bg500: 0x321c6e,
  bgNavy: 0x0e1430,
  bgNavy2: 0x16204a,

  // Brand accents
  magenta: 0xb14cff,
  magenta2: 0x7b61ff,
  magentaDeep: 0x5a1fb8,
  orange: 0xff7b00,
  orange2: 0xffb347,
  gold: 0xffd27a,
  goldDeep: 0xb85600,
  cyan: 0x3fe0ff,
  cyan2: 0x5cc8ff,
  cyanDeep: 0x1b7fa8,

  // Semantic / functional
  good: 0x5ee08a,
  good2: 0x9cf06a,
  bad: 0xff4d5e,
  bad2: 0xff7a5c,
  warn: 0xffc23d,
  coin: 0xffd27a,
  coinDeep: 0xc9920e,
  gem: 0x5cc8ff,
  xp: 0xb14cff,
  energy: 0xffc23d,
  locked: 0x5a5476,

  // Text / ink
  text: 0xf2ecff,
  textDim: 0xb9aedc,
  textMute: 0x8478a8,
  inkOnLight: 0x1a0e33,
  white: 0xffffff,
} as const

/* ────────────────────────────────────────────────────────────────────────── *
 *  CSS STRINGS — derived once, for direct ctx assignment
 * ────────────────────────────────────────────────────────────────────────── */

export const CSS = {
  bg900: hex(HEX.bg900),
  bg800: hex(HEX.bg800),
  bg700: hex(HEX.bg700),
  bg600: hex(HEX.bg600),
  bg500: hex(HEX.bg500),
  bgNavy: hex(HEX.bgNavy),
  bgNavy2: hex(HEX.bgNavy2),

  magenta: hex(HEX.magenta),
  magenta2: hex(HEX.magenta2),
  magentaDeep: hex(HEX.magentaDeep),
  orange: hex(HEX.orange),
  orange2: hex(HEX.orange2),
  gold: hex(HEX.gold),
  goldDeep: hex(HEX.goldDeep),
  cyan: hex(HEX.cyan),
  cyan2: hex(HEX.cyan2),
  cyanDeep: hex(HEX.cyanDeep),

  good: hex(HEX.good),
  good2: hex(HEX.good2),
  bad: hex(HEX.bad),
  bad2: hex(HEX.bad2),
  warn: hex(HEX.warn),
  coin: hex(HEX.coin),
  coinDeep: hex(HEX.coinDeep),
  gem: hex(HEX.gem),
  xp: hex(HEX.xp),
  energy: hex(HEX.energy),
  locked: hex(HEX.locked),

  text: hex(HEX.text),
  textDim: hex(HEX.textDim),
  textMute: hex(HEX.textMute),
  inkOnLight: hex(HEX.inkOnLight),
  white: hex(HEX.white),
} as const

/* ────────────────────────────────────────────────────────────────────────── *
 *  BACKGROUND FIELD — gameplay battlefield draw stops
 * ────────────────────────────────────────────────────────────────────────── */

export interface FieldGradient {
  /** radial bloom center stop */
  inner: string
  /** outer/void stop */
  outer: string
  /** mid stop for 3-stop gradients */
  mid: string
}

export const FIELD: FieldGradient = {
  inner: CSS.bg600, // #241452
  mid: CSS.bg700, // #1A0F3D
  outer: CSS.bgNavy, // #0E1430
}

/** App-frame radial purple bloom over navy void (panel backgrounds). */
export const APP_BG: { inner: string; mid: string; outer: string } = {
  inner: CSS.bg500, // #321C6E
  mid: CSS.bg700, // #1A0F3D
  outer: CSS.bg900, // #0B0518
}

/** Vignette overlay edge color (use with radial transparent → this). */
export const VIGNETTE_EDGE = withAlpha(HEX.bg900, 0.85)

/* ────────────────────────────────────────────────────────────────────────── *
 *  PER-TOWER COLORS + GLOWS (synced with towers.ts numeric colors)
 * ────────────────────────────────────────────────────────────────────────── */

export type TowerId = 'archer' | 'cannon' | 'mage' | 'ice' | 'poison' | 'barracks'

export interface TowerPalette {
  /** tower body fill */
  body: number
  /** roof / projectile / accent */
  accent: number
  /** additive glow color for beams & muzzle bloom */
  glow: number
  body_: string
  accent_: string
  glow_: string
}

const tower = (body: number, accent: number, glow: number): TowerPalette => ({
  body,
  accent,
  glow,
  body_: hex(body),
  accent_: hex(accent),
  glow_: hex(glow),
})

export const TOWERS: Record<TowerId, TowerPalette> = {
  archer: tower(0x8a6a44, 0xffd27a, HEX.gold),
  cannon: tower(0x5a5466, 0xff7b00, HEX.orange),
  mage: tower(0x7b61ff, 0xb14cff, HEX.magenta),
  ice: tower(0x5cc8ff, 0x3fe0ff, HEX.cyan),
  poison: tower(0x5ee08a, 0x9cf06a, HEX.good),
  barracks: tower(0xc98a4a, 0xffb347, HEX.orange2),
}

/* ────────────────────────────────────────────────────────────────────────── *
 *  ENEMY COLORS (synced with enemies.ts)
 * ────────────────────────────────────────────────────────────────────────── */

export type EnemyId =
  | 'slime'
  | 'imp'
  | 'brute'
  | 'shaman'
  | 'warlock'
  | 'golem'
  | 'ogre'
  | 'dragon'

export interface EnemyPalette {
  /** body fill */
  body: number
  /** outline / detail accent */
  accent: number
  body_: string
  accent_: string
}

const foe = (body: number, accent: number): EnemyPalette => ({
  body,
  accent,
  body_: hex(body),
  accent_: hex(accent),
})

export const ENEMIES: Record<EnemyId, EnemyPalette> = {
  slime: foe(0x76c043, 0x3f7d22),
  imp: foe(0xe06d4a, 0x8a2f1a),
  brute: foe(0x8a8f99, 0x4a4e57),
  shaman: foe(0xf0d27a, 0xa07d2a),
  warlock: foe(0x9a7bff, 0x4a2f8a),
  golem: foe(0x6f7a6a, 0x39402f),
  ogre: foe(0xa9583f, 0x5c2a1c),
  dragon: foe(0xd23a3a, 0x7a1320),
}

/* ────────────────────────────────────────────────────────────────────────── *
 *  ELEMENT FX / BEAM COLORS (additive — beams, lasers, fire, sparks, lightning)
 * ────────────────────────────────────────────────────────────────────────── */

export interface BeamColor {
  /** full-saturation bright core */
  core: number
  core_: string
  /** outer halo (use with globalAlpha ~0.35 or withAlpha) */
  halo_: string
}

const beam = (core: number, haloAlpha = 0.35): BeamColor => ({
  core,
  core_: hex(core),
  halo_: withAlpha(core, haloAlpha),
})

export const FX = {
  fire: beam(0xff7b00),
  ice: beam(0x3fe0ff),
  poison: beam(0x5ee08a),
  magic: beam(0xb14cff),
  lightning: beam(0x9cc8ff),
  spark: beam(0xffd27a),
  laserCyan: beam(0x3fe0ff),
  laserMagenta: beam(0xb14cff),
  laserOrange: beam(0xff9e2c),
} as const

/* ────────────────────────────────────────────────────────────────────────── *
 *  DAMAGE NUMBER COLORS (floating combat text)
 * ────────────────────────────────────────────────────────────────────────── */

export interface DamageColor {
  fill: number
  fill_: string
  /** text-shadow / additive glow color string */
  glow_: string
}

const dmg = (fill: number, glow: number): DamageColor => ({
  fill,
  fill_: hex(fill),
  glow_: withAlpha(glow, 0.8),
})

export const DAMAGE = {
  normal: dmg(0xffffff, 0xb14cff), // white
  crit: dmg(0xffe15a, 0xff9e2c), // crit yellow
  big: dmg(0xff8a3d, 0xff7b00), // big-hit orange
  heal: dmg(0x5ee08a, 0x9cf06a), // green
} as const

/* ────────────────────────────────────────────────────────────────────────── *
 *  CURRENCY (gold / gem / xp / energy)
 * ────────────────────────────────────────────────────────────────────────── */

export const CURRENCY = {
  coin: HEX.coin,
  coinDeep: HEX.coinDeep,
  coin_: CSS.coin,
  coinDeep_: CSS.coinDeep,
  gem: HEX.gem,
  gem_: CSS.gem,
  xp: HEX.xp,
  xp_: CSS.xp,
  energy: HEX.energy,
  energy_: CSS.energy,
} as const

/* ────────────────────────────────────────────────────────────────────────── *
 *  HP / XP / BOSS BAR GRADIENT STOPS
 * ────────────────────────────────────────────────────────────────────────── */

export const BARS = {
  hp: { lo: CSS.good, hi: CSS.good2 }, // healthy green
  hpLow: { lo: CSS.bad, hi: CSS.bad2 }, // low-hp red
  xp: { lo: CSS.magenta2, mid: CSS.magenta, hi: '#e07bff' },
  bossHp: { lo: '#b81f3a', mid: CSS.bad, hi: '#ff8a3d' },
} as const

/* ────────────────────────────────────────────────────────────────────────── *
 *  GLOW BLUR TIERS (ctx.shadowBlur)
 * ────────────────────────────────────────────────────────────────────────── */

export const GLOW_BLUR = { sm: 8, md: 18, lg: 30 } as const
