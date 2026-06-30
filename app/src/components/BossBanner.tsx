// BossBanner.tsx — Premium boss-fight overlay for Tower Swipe Defense.
//
// Pure presentational React overlay matching reference panels 5/6:
//   - Top boss HP banner: name (Cinzel small-caps) + segmented glowing red HP bar
//     + phase pips (filled = phases survived, current pulses).
//   - Screen-edge fire vignette (animated radial/inset glow framing the screen).
//
// No new deps, strict TS, self-contained inline styles + a small <style> block
// for keyframes. Drop into PlayScreen above the HUD when a boss is active:
//
//   {hud.bossLabel && (
//     <BossBanner
//       name={hud.bossLabel}
//       hpFrac={hud.bossHpFrac}
//       phase={hud.bossPhase}       // 1-based current phase
//       maxPhase={hud.bossMaxPhase} // total phases (e.g. 3)
//     />
//   )}

import { CSSProperties } from 'react'

export interface BossBannerProps {
  /** Boss display name, e.g. "INFERNO DRAGON". */
  name: string
  /** Current HP fraction 0..1. */
  hpFrac: number
  /** 1-based current phase (defaults to 1). */
  phase?: number
  /** Total number of phases (defaults to 1 → pips hidden). */
  maxPhase?: number
}

// ---------------------------------------------------------------------------
// Palette (mirrors design-system tokens; inlined so the file is portable).
// ---------------------------------------------------------------------------
const C = {
  red: '#FF3B30',
  redHot: '#FF7B4A',
  redDeep: '#B81414',
  redGlow: 'rgba(255,59,48,.7)',
  gold: '#FFD27A',
  ember: '#FF7B00',
  inkLine: 'rgba(255,255,255,.16)',
} as const

const SEGMENTS = 24 // segment ticks across the HP bar

const clamp01 = (n: number): number => (n < 0 ? 0 : n > 1 ? 1 : n)

export default function BossBanner({
  name,
  hpFrac,
  phase = 1,
  maxPhase = 1,
}: BossBannerProps) {
  const frac = clamp01(hpFrac)
  const pct = Math.round(frac * 100)
  const showPips = maxPhase > 1

  // Bar tints toward white-hot as HP drops (boss enrages near death).
  const fillStart = frac > 0.35 ? C.red : C.redHot
  const fillEnd = frac > 0.35 ? C.redDeep : C.ember

  return (
    <div style={wrap} aria-hidden={false} role="status" aria-label={`${name} ${pct}% health`}>
      {/* Screen-edge fire vignette */}
      <div style={vignette} aria-hidden />
      <div style={vignettePulse} aria-hidden />

      {/* Banner */}
      <div style={banner}>
        <div style={nameRow}>
          <span style={skull} aria-hidden>
            {/* tiny flame glyph as SVG (crisp, no emoji) */}
            <svg width="16" height="18" viewBox="0 0 16 18">
              <path
                d="M8 0c1.6 3 4.4 4 4.4 7.6 0 .9-.2 1.7-.6 2.4C12.6 9.3 13 8.2 13 7c2 2.4 2.4 4.7 2.4 6.1 0 2.7-2.3 4.9-7.4 4.9S.6 15.8.6 13.1C.6 9.9 3 7.6 4.6 6.2c0 1.1.5 2 1.6 2.6C5.4 7.6 5 6.4 5 5.2 5 2.6 6.6 1.4 8 0Z"
                fill="url(#flame)"
              />
              <defs>
                <linearGradient id="flame" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={C.gold} />
                  <stop offset=".55" stopColor={C.ember} />
                  <stop offset="1" stopColor={C.redDeep} />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span style={nameText}>{name}</span>
          <span style={hpText}>{pct}%</span>
        </div>

        {/* HP bar: gradient fill + segment ticks overlay + glossy top light */}
        <div style={track}>
          <div
            style={{
              ...fill,
              width: `${pct}%`,
              background: `linear-gradient(180deg, ${fillStart}, ${fillEnd})`,
            }}
          >
            <div style={fillGloss} />
          </div>
          <div style={segOverlay} aria-hidden />
          <div style={trackEdge} aria-hidden />
        </div>

        {/* Phase pips */}
        {showPips && (
          <div style={pipRow}>
            {Array.from({ length: maxPhase }, (_, i) => {
              const idx = i + 1
              const done = idx < phase
              const current = idx === phase
              return (
                <span
                  key={idx}
                  style={{
                    ...pip,
                    ...(done ? pipDone : current ? pipCurrent : pipEmpty),
                  }}
                  aria-hidden
                />
              )
            })}
            <span style={phaseLabel}>
              PHASE {Math.min(phase, maxPhase)}/{maxPhase}
            </span>
          </div>
        )}
      </div>

      <style>{KEYFRAMES}</style>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const wrap: CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 30,
}

// Static red fire frame hugging the screen edges.
const vignette: CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  boxShadow:
    'inset 0 0 60px 8px rgba(255,40,20,.45), inset 0 0 140px 30px rgba(180,20,20,.28)',
  background:
    'radial-gradient(120% 80% at 50% 120%, rgba(255,80,20,.22), transparent 60%)',
}

// Slow breathing overlay so the fire feels alive.
const vignettePulse: CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  boxShadow: 'inset 0 0 100px 16px rgba(255,90,30,.4)',
  animation: 'bossFireBreathe 2.4s ease-in-out infinite',
}

const banner: CSSProperties = {
  position: 'absolute',
  top: 'calc(env(safe-area-inset-top, 0px) + 56px)',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'min(420px, calc(100% - 32px))',
  padding: '8px 14px 9px',
  borderRadius: 14,
  background:
    'linear-gradient(180deg, rgba(48,12,16,.92), rgba(20,6,10,.94))',
  border: `1px solid ${C.inkLine}`,
  boxShadow:
    'inset 0 1px 0 rgba(255,255,255,.14), 0 0 22px rgba(255,40,20,.45), 0 6px 18px rgba(0,0,0,.55)',
  pointerEvents: 'none',
}

const nameRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 7,
  marginBottom: 6,
}

const skull: CSSProperties = {
  display: 'inline-flex',
  filter: 'drop-shadow(0 0 4px rgba(255,90,30,.7))',
}

const nameText: CSSProperties = {
  flex: 1,
  fontFamily: "'Cinzel', serif",
  fontWeight: 800,
  fontSize: 14,
  letterSpacing: '.08em',
  textTransform: 'uppercase',
  color: '#FFE3D1',
  textShadow: '0 1px 2px rgba(0,0,0,.7), 0 0 10px rgba(255,60,30,.5)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const hpText: CSSProperties = {
  fontWeight: 800,
  fontSize: 12,
  fontVariantNumeric: 'tabular-nums',
  color: C.gold,
  textShadow: '0 1px 2px rgba(0,0,0,.6)',
}

const track: CSSProperties = {
  position: 'relative',
  height: 16,
  borderRadius: 8,
  overflow: 'hidden',
  background:
    'linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.7))',
  boxShadow: 'inset 0 1px 2px rgba(0,0,0,.7)',
}

const fill: CSSProperties = {
  position: 'absolute',
  inset: 0,
  right: 'auto',
  borderRadius: 8,
  transition: 'width .25s ease-out, background .4s linear',
  boxShadow: `0 0 12px ${C.redGlow}`,
}

const fillGloss: CSSProperties = {
  position: 'absolute',
  insetInline: 0,
  top: 0,
  height: '50%',
  borderRadius: '8px 8px 0 0',
  background:
    'linear-gradient(180deg, rgba(255,255,255,.4), rgba(255,255,255,0))',
}

// Segment ticks via repeating gradient (the "RTS health bar" look).
const segOverlay: CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  background: `repeating-linear-gradient(90deg, rgba(0,0,0,.55) 0 1.5px, transparent 1.5px ${100 / SEGMENTS}%)`,
  mixBlendMode: 'multiply',
}

const trackEdge: CSSProperties = {
  position: 'absolute',
  inset: 0,
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,.14)',
  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.4)',
  pointerEvents: 'none',
}

const pipRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  marginTop: 7,
}

const pip: CSSProperties = {
  width: 9,
  height: 9,
  borderRadius: '50%',
  flex: '0 0 auto',
}

const pipDone: CSSProperties = {
  background: 'radial-gradient(circle at 35% 30%, #ffb37a, #b81414)',
  boxShadow: '0 0 6px rgba(255,90,30,.7)',
}

const pipCurrent: CSSProperties = {
  background: 'radial-gradient(circle at 35% 30%, #fff2c0, #ff7b00)',
  boxShadow: '0 0 10px rgba(255,160,40,.95)',
  animation: 'bossPipPulse 1s ease-in-out infinite',
}

const pipEmpty: CSSProperties = {
  background: 'rgba(255,255,255,.1)',
  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.18)',
}

const phaseLabel: CSSProperties = {
  marginLeft: 'auto',
  fontFamily: "'Cinzel', serif",
  fontWeight: 700,
  fontSize: 10,
  letterSpacing: '.1em',
  color: 'rgba(255,210,170,.85)',
  textTransform: 'uppercase',
}

const KEYFRAMES = `
@keyframes bossFireBreathe {
  0%, 100% { opacity: .55; }
  50%      { opacity: 1; }
}
@keyframes bossPipPulse {
  0%, 100% { transform: scale(1);    filter: brightness(1); }
  50%      { transform: scale(1.25); filter: brightness(1.4); }
}
`
