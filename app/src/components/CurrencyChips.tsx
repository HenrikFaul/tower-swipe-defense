// CurrencyChips.tsx — Premium currency chip components for Tower Swipe Defense.
//
// Renders coin / gem / heart / energy values as glossy candy pills using the
// REAL `ui/icons_currency.png` 2×2 sheet (512² cells) sliced via background-position.
// No new deps, strict TS, plain React 18 + inline styles (self-contained — no CSS
// import required). Drop into any HUD, top bar, shop, or reward screen.
//
//   import { CoinChip, GemChip, HeartChip, EnergyPill, SheetIcon } from './CurrencyChips'
//   <CoinChip value={meta.coins} />
//   <GemChip  value={meta.gems} />
//   <HeartChip value={hud.lives} low={hud.lives <= 5} />
//   <EnergyPill value={energy} max={10} />
//
// The sheet URL resolves through assetUrl()/BASE_URL so it is deploy-base-safe.

import { CSSProperties, ReactNode } from 'react'
import { assetUrl, UI } from '../lib/assets'

// ---------------------------------------------------------------------------
// Palette (mirrors the design-system tokens; inlined so the file is portable).
// ---------------------------------------------------------------------------
const C = {
  coin: '#FFD27A',
  coinShadow: 'rgba(255,123,0,.45)',
  gem: '#C79BFF',
  gemShadow: 'rgba(123,97,255,.45)',
  heart: '#ff8a7a',
  heartShadow: 'rgba(255,77,77,.5)',
  energy: '#5CC8FF',
  energyShadow: 'rgba(63,224,255,.45)',
  pillBg: 'linear-gradient(180deg, rgba(255,255,255,.14), rgba(0,0,0,.42))',
  pillLine: 'rgba(255,255,255,.16)',
} as const

const SHEET = assetUrl(UI.currency) // 'ui/icons_currency.png'

// ---------------------------------------------------------------------------
// SheetIcon — one square slice from the 2×2 currency sheet.
//
// background-size:200% 200% scales the sheet so each 512² cell == the icon box;
// positions are then exactly 0% / 100% per axis (resolution-independent).
//   [0,0] gem   → 0%   0%
//   [1,0] coin  → 100% 0%
//   [0,1] heart → 0%   100%
//   [1,1] energy→ 100% 100%
// ---------------------------------------------------------------------------
export type CurrencyKind = 'gem' | 'coin' | 'heart' | 'energy'

const POS: Record<CurrencyKind, string> = {
  gem: '0% 0%',
  coin: '100% 0%',
  heart: '0% 100%',
  energy: '100% 100%',
}

export function SheetIcon({
  kind,
  size = 20,
  style,
}: {
  kind: CurrencyKind
  size?: number
  style?: CSSProperties
}) {
  return (
    <i
      aria-hidden
      style={{
        display: 'inline-block',
        flex: '0 0 auto',
        width: size,
        height: size,
        backgroundImage: `url(${SHEET})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '200% 200%',
        backgroundPosition: POS[kind],
        imageRendering: 'auto',
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.55))',
        ...style,
      }}
    />
  )
}

// ---------------------------------------------------------------------------
// Pill — shared glossy capsule wrapper. Currency-tinted number + lifted icon.
// ---------------------------------------------------------------------------
function pillStyle(numColor: string, glow: string, size: number): CSSProperties {
  const pad = size <= 18 ? '4px 9px 4px 5px' : '5px 11px 5px 6px'
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: size <= 18 ? 5 : 6,
    padding: pad,
    borderRadius: 999,
    background: C.pillBg,
    border: `1px solid ${C.pillLine}`,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,.18), 0 4px 12px rgba(0,0,0,.45), 0 0 14px ${glow}`,
    color: numColor,
    fontWeight: 800,
    fontSize: Math.max(12, Math.round(size * 0.72)),
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  }
}

function Pill({
  kind,
  children,
  numColor,
  glow,
  size,
  iconSize,
  className,
  extraStyle,
  title,
}: {
  kind: CurrencyKind
  children: ReactNode
  numColor: string
  glow: string
  size: number
  iconSize: number
  className?: string
  extraStyle?: CSSProperties
  title?: string
}) {
  return (
    <span
      className={className}
      title={title}
      style={{ ...pillStyle(numColor, glow, size), ...extraStyle }}
    >
      <SheetIcon kind={kind} size={iconSize} />
      <span>{children}</span>
    </span>
  )
}

// Compact integer formatter: 12500 → 12.5K, 2_400_000 → 2.4M.
function fmt(value: number): string {
  if (!Number.isFinite(value)) return '0'
  const abs = Math.abs(value)
  if (abs >= 1_000_000) return trim(value / 1_000_000) + 'M'
  if (abs >= 10_000) return trim(value / 1_000) + 'K'
  return Math.round(value).toLocaleString()
}
function trim(n: number): string {
  return (Math.round(n * 10) / 10).toString()
}

type ChipProps = {
  value: number
  /** Pass false to show the full number (default true → 12.5K style above 10K). */
  compact?: boolean
  size?: number
  className?: string
  style?: CSSProperties
}

// ---------------------------------------------------------------------------
// CoinChip — gold currency.
// ---------------------------------------------------------------------------
export function CoinChip({ value, compact = true, size = 22, className, style }: ChipProps) {
  return (
    <Pill
      kind="coin"
      numColor={C.coin}
      glow={C.coinShadow}
      size={size}
      iconSize={Math.round(size * 0.82)}
      className={className}
      extraStyle={style}
      title={`${Math.round(value).toLocaleString()} coins`}
    >
      {compact ? fmt(value) : Math.round(value).toLocaleString()}
    </Pill>
  )
}

// ---------------------------------------------------------------------------
// GemChip — premium purple currency.
// ---------------------------------------------------------------------------
export function GemChip({ value, compact = true, size = 22, className, style }: ChipProps) {
  return (
    <Pill
      kind="gem"
      numColor={C.gem}
      glow={C.gemShadow}
      size={size}
      iconSize={Math.round(size * 0.82)}
      className={className}
      extraStyle={style}
      title={`${Math.round(value).toLocaleString()} gems`}
    >
      {compact ? fmt(value) : Math.round(value).toLocaleString()}
    </Pill>
  )
}

// ---------------------------------------------------------------------------
// HeartChip — lives. Pulses red when `low` (e.g. lives <= 5).
// ---------------------------------------------------------------------------
export function HeartChip({
  value,
  size = 22,
  low = false,
  className,
  style,
}: Omit<ChipProps, 'compact'> & { low?: boolean }) {
  const glow = low ? C.heartShadow : 'rgba(255,77,77,.28)'
  return (
    <Pill
      kind="heart"
      numColor={C.heart}
      glow={glow}
      size={size}
      iconSize={Math.round(size * 0.82)}
      className={className}
      extraStyle={{
        ...(low ? { animation: 'tsdHeartPulse .9s ease-in-out infinite' } : null),
        ...style,
      }}
      title={`${Math.round(value)} lives`}
    >
      {Math.max(0, Math.round(value))}
      <PulseKeyframes />
    </Pill>
  )
}

// ---------------------------------------------------------------------------
// EnergyPill — cyan stamina, optional `/max` and a fill bar.
// ---------------------------------------------------------------------------
export function EnergyPill({
  value,
  max,
  size = 22,
  className,
  style,
}: {
  value: number
  max?: number
  size?: number
  className?: string
  style?: CSSProperties
}) {
  const v = Math.max(0, Math.round(value))
  const hasMax = typeof max === 'number' && max > 0
  const frac = hasMax ? Math.min(1, v / (max as number)) : 0
  return (
    <span
      className={className}
      title={hasMax ? `${v} / ${max} energy` : `${v} energy`}
      style={{
        ...pillStyle(C.energy, C.energyShadow, size),
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {hasMax && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 999,
            width: `${frac * 100}%`,
            background: 'linear-gradient(180deg, rgba(92,200,255,.30), rgba(63,224,255,.14))',
            pointerEvents: 'none',
            transition: 'width .25s ease',
          }}
        />
      )}
      <SheetIcon kind="energy" size={Math.round(size * 0.82)} style={{ position: 'relative' }} />
      <span style={{ position: 'relative' }}>
        {v}
        {hasMax && <span style={{ opacity: 0.55, fontWeight: 700 }}>{`/${max}`}</span>}
      </span>
    </span>
  )
}

// ---------------------------------------------------------------------------
// Keyframes for the heart pulse, injected once (idempotent via id check).
// ---------------------------------------------------------------------------
function PulseKeyframes() {
  if (typeof document !== 'undefined' && !document.getElementById('tsd-currency-kf')) {
    const el = document.createElement('style')
    el.id = 'tsd-currency-kf'
    el.textContent =
      '@keyframes tsdHeartPulse{50%{filter:brightness(1.4) drop-shadow(0 0 6px #ff4d4d)}}'
    document.head.appendChild(el)
  }
  return null
}

// ---------------------------------------------------------------------------
// CurrencyChip — generic dispatch helper if you prefer one entry point.
// ---------------------------------------------------------------------------
export function CurrencyChip({
  kind,
  value,
  ...rest
}: ChipProps & { kind: CurrencyKind }) {
  switch (kind) {
    case 'coin':
      return <CoinChip value={value} {...rest} />
    case 'gem':
      return <GemChip value={value} {...rest} />
    case 'heart':
      return <HeartChip value={value} {...rest} />
    case 'energy':
      return <EnergyPill value={value} {...rest} />
  }
}
