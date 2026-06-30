// VictoryScreen.tsx — premium AAA mobile-TD victory overlay (Clash Royale / Rush Royale tier).
// Self-contained: real banner + chest assets, 3 pop-in stars, count-up score, reward chips,
// glossy CONTINUE CTA. Strict TS, React 18, no new deps, plain CSS injected once.
//
// Usage:
//   <VictoryScreen wave={12} stars={3} coins={420} gems={5} onContinue={() => go('worldmap')} />
//
// Assets pulled through assetUrl()/UI so BASE_URL is honored on non-root deploys.

import { useEffect, useRef, useState } from 'react'
import { assetUrl, UI } from '../lib/assets'

export interface VictoryScreenProps {
  /** Wave reached (drives the headline score count-up). */
  wave: number
  /** 0–3 earned stars (clamped). */
  stars: number
  /** Coin reward to display. */
  coins: number
  /** Gem reward to display. */
  gems: number
  /** Fired when the player taps CONTINUE. */
  onContinue: () => void
}

// 2×2 currency sheet → background-position per cell. Mirrors the HUD <Cur> helper.
const CUR_POS: Record<'gem' | 'coin' | 'heart' | 'energy', string> = {
  gem: '0% 0%',
  coin: '100% 0%',
  heart: '0% 100%',
  energy: '100% 100%',
}

function Cur({ kind, size = 22 }: { kind: keyof typeof CUR_POS; size?: number }) {
  return (
    <i
      className="vc-cur"
      aria-hidden
      style={{
        width: size,
        height: size,
        backgroundPosition: CUR_POS[kind],
      }}
    />
  )
}

/** Eased count-up hook (ease-out cubic). Returns the current integer value. */
function useCountUp(target: number, durationMs: number, startDelayMs = 0): number {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)
  useEffect(() => {
    let start: number | null = null
    let timer: ReturnType<typeof setTimeout> | null = null
    const tick = (now: number) => {
      if (start === null) start = now
      const t = Math.min(1, (now - start) / Math.max(1, durationMs))
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    timer = setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick)
    }, startDelayMs)
    return () => {
      if (timer) clearTimeout(timer)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [target, durationMs, startDelayMs])
  return value
}

export default function VictoryScreen({ wave, stars, coins, gems, onContinue }: VictoryScreenProps) {
  const earned = Math.max(0, Math.min(3, Math.round(stars)))
  const score = useCountUp(wave, 900, 450)
  const coinUp = useCountUp(coins, 1000, 700)
  const gemUp = useCountUp(gems, 1000, 850)

  // Reveal the chest + reward row after stars have popped.
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 1100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="vc-overlay" role="dialog" aria-modal="true" aria-label="Victory">
      <style>{VICTORY_CSS}</style>

      {/* radial bloom + slow rotating god-rays behind everything */}
      <div className="vc-rays" aria-hidden />
      <div className="vc-bloom" aria-hidden />

      <div className="vc-card">
        {/* Title banner (VICTORY + 3-star art) */}
        <img className="vc-banner" src={assetUrl(UI.bannerVictory)} alt="Victory" draggable={false} />

        {/* 3 pop-in stars overlaying/aligned under the banner */}
        <div className="vc-stars" aria-label={`${earned} of 3 stars`}>
          {[0, 1, 2].map((i) => (
            <Star key={i} filled={i < earned} index={i} />
          ))}
        </div>

        {/* Count-up headline score */}
        <div className="vc-score">
          <span className="vc-score-label">WAVE REACHED</span>
          <span className="vc-score-val">{score}</span>
        </div>

        {/* Glowing reward chest */}
        <div className={'vc-chest' + (revealed ? ' open' : '')}>
          <span className="vc-chest-glow" aria-hidden />
          <img className="vc-chest-img" src={assetUrl(UI.chest)} alt="Reward chest" draggable={false} />
          <div className="vc-sparks" aria-hidden>
            {[...Array(8)].map((_, i) => (
              <span key={i} className="vc-spark" style={{ ['--a' as never]: `${i * 45}deg` }} />
            ))}
          </div>
        </div>

        {/* Reward chips */}
        <div className={'vc-rewards' + (revealed ? ' in' : '')}>
          <div className="vc-reward coin">
            <Cur kind="coin" size={26} />
            <span className="vc-reward-val">{coinUp}</span>
          </div>
          {gems > 0 && (
            <div className="vc-reward gem">
              <Cur kind="gem" size={26} />
              <span className="vc-reward-val">{gemUp}</span>
            </div>
          )}
        </div>

        {/* Glossy CONTINUE CTA */}
        <button className="vc-continue" onClick={onContinue} autoFocus>
          <svg className="vc-play" width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            <path d="M3 2.2v11.6a1 1 0 0 0 1.53.85l9.2-5.8a1 1 0 0 0 0-1.7l-9.2-5.8A1 1 0 0 0 3 2.2Z" fill="currentColor" />
          </svg>
          CONTINUE
        </button>
      </div>
    </div>
  )
}

function Star({ filled, index }: { filled: boolean; index: number }) {
  return (
    <span
      className={'vc-star' + (filled ? ' filled' : ' empty')}
      style={{ animationDelay: `${0.35 + index * 0.22}s` }}
      aria-hidden
    >
      <svg viewBox="0 0 48 48" width="100%" height="100%">
        <defs>
          <linearGradient id={`vcStarG${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFE9A8" />
            <stop offset="0.5" stopColor="#FFD27A" />
            <stop offset="1" stopColor="#FF9E1B" />
          </linearGradient>
        </defs>
        <path
          d="M24 2.5l6.3 12.8 14.1 2-10.2 10 2.4 14.1L24 34.8 11.4 41.4l2.4-14.1L3.6 17.3l14.1-2L24 2.5Z"
          fill={filled ? `url(#vcStarG${index})` : 'rgba(255,255,255,.06)'}
          stroke={filled ? 'rgba(255,255,255,.85)' : 'rgba(255,255,255,.14)'}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

const VICTORY_CSS = `
.vc-overlay {
  position: fixed; inset: 0; z-index: 70;
  display: grid; place-items: center;
  padding: 24px;
  background: radial-gradient(120% 90% at 50% 30%, rgba(40,18,72,.78), rgba(6,4,18,.94) 70%);
  -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px);
  animation: vcFade .35s ease both;
  overflow: hidden;
}
@keyframes vcFade { from { opacity: 0; } to { opacity: 1; } }

.vc-rays, .vc-bloom { position: absolute; left: 50%; top: 34%; transform: translate(-50%,-50%); pointer-events: none; }
.vc-rays {
  width: 150vmax; height: 150vmax;
  background: repeating-conic-gradient(from 0deg, rgba(255,210,122,.10) 0deg 6deg, transparent 6deg 18deg);
  -webkit-mask: radial-gradient(closest-side, #000 0, transparent 62%);
          mask: radial-gradient(closest-side, #000 0, transparent 62%);
  animation: vcSpin 24s linear infinite; opacity: .55;
}
@keyframes vcSpin { to { transform: translate(-50%,-50%) rotate(360deg); } }
.vc-bloom {
  width: 64vmax; height: 64vmax;
  background: radial-gradient(circle, rgba(177,76,255,.28), transparent 60%);
  animation: vcPulse 3.4s ease-in-out infinite;
}
@keyframes vcPulse { 50% { opacity: .65; transform: translate(-50%,-50%) scale(1.08); } }

.vc-card {
  position: relative; z-index: 1;
  width: min(420px, 100%);
  display: flex; flex-direction: column; align-items: center;
  text-align: center;
  animation: vcRise .5s cubic-bezier(.2,1.1,.35,1) both;
}
@keyframes vcRise { from { opacity: 0; transform: translateY(26px) scale(.94); } to { opacity: 1; transform: none; } }

.vc-banner {
  width: min(360px, 92%); height: auto; display: block;
  filter: drop-shadow(0 8px 22px rgba(255,123,0,.45));
  animation: vcBanner .6s cubic-bezier(.2,1.3,.4,1) both;
}
@keyframes vcBanner { from { opacity: 0; transform: scale(.7) translateY(-12px); } to { opacity: 1; transform: none; } }

.vc-stars {
  display: flex; gap: 14px; align-items: flex-end;
  margin-top: -6px; margin-bottom: 4px;
}
.vc-star { width: 52px; height: 52px; display: block; transform: scale(0) rotate(-30deg); }
.vc-star:nth-child(2) { width: 64px; height: 64px; margin-bottom: 8px; }
.vc-star.filled {
  animation: vcStarPop .5s cubic-bezier(.2,1.6,.45,1) both;
  filter: drop-shadow(0 0 10px rgba(255,178,40,.8));
}
.vc-star.empty { animation: vcStarPop .5s ease both; opacity: .8; }
@keyframes vcStarPop { 0% { transform: scale(0) rotate(-30deg); } 60% { transform: scale(1.25) rotate(6deg); } 100% { transform: scale(1) rotate(0); } }

.vc-score { margin: 6px 0 14px; display: flex; flex-direction: column; gap: 2px; }
.vc-score-label { font-size: 11px; letter-spacing: .22em; font-weight: 800; color: rgba(255,255,255,.62); }
.vc-score-val {
  font-family: 'Cinzel', serif; font-weight: 800; font-size: 46px; line-height: 1;
  color: #FFE9A8;
  text-shadow: 0 2px 0 rgba(0,0,0,.4), 0 0 22px rgba(255,210,122,.55);
  font-variant-numeric: tabular-nums;
}

.vc-chest { position: relative; width: 130px; height: 130px; display: grid; place-items: center; margin-bottom: 6px; }
.vc-chest-glow {
  position: absolute; inset: -18%; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,210,122,.55), rgba(177,76,255,.22) 45%, transparent 70%);
  filter: blur(2px); animation: vcPulse 2.6s ease-in-out infinite;
}
.vc-chest-img {
  position: relative; width: 100%; height: 100%; object-fit: contain;
  filter: drop-shadow(0 8px 14px rgba(0,0,0,.5));
  animation: vcChestIn .6s cubic-bezier(.2,1.2,.4,1) both;
}
.vc-chest.open .vc-chest-img { animation: vcChestPop .6s cubic-bezier(.2,1.5,.4,1) both, vcBob 2.8s ease-in-out 1s infinite; }
@keyframes vcChestIn { from { opacity: 0; transform: scale(.6); } to { opacity: 1; transform: none; } }
@keyframes vcChestPop { 0% { transform: scale(.6) translateY(8px); } 55% { transform: scale(1.16) translateY(-4px); } 100% { transform: scale(1); } }
@keyframes vcBob { 50% { transform: translateY(-5px); } }

.vc-sparks { position: absolute; inset: 0; pointer-events: none; opacity: 0; }
.vc-chest.open .vc-sparks { animation: vcSparkBurst .8s ease-out .15s both; }
@keyframes vcSparkBurst { 0% { opacity: 1; } 100% { opacity: 0; } }
.vc-spark {
  position: absolute; left: 50%; top: 50%; width: 6px; height: 6px; border-radius: 50%;
  background: #FFE9A8; box-shadow: 0 0 8px #FFD27A;
  transform: rotate(var(--a)) translateY(0);
}
.vc-chest.open .vc-spark { animation: vcSparkFly .7s ease-out .15s both; }
@keyframes vcSparkFly { from { transform: rotate(var(--a)) translateY(0) scale(1); opacity: 1; } to { transform: rotate(var(--a)) translateY(-64px) scale(0); opacity: 0; } }

.vc-rewards { display: flex; gap: 12px; margin: 4px 0 22px; opacity: 0; transform: translateY(10px); transition: opacity .4s ease, transform .4s ease; }
.vc-rewards.in { opacity: 1; transform: none; }
.vc-reward {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 16px 8px 12px; border-radius: 999px;
  background: linear-gradient(180deg, rgba(255,255,255,.10), rgba(0,0,0,.4));
  border: 1px solid var(--panel-line, rgba(255,210,122,.16));
  box-shadow: inset 0 1px 0 rgba(255,255,255,.18), 0 6px 14px rgba(0,0,0,.45);
}
.vc-reward-val { font-weight: 800; font-size: 19px; font-variant-numeric: tabular-nums; }
.vc-reward.coin .vc-reward-val { color: var(--coin, #ffd27a); }
.vc-reward.gem .vc-reward-val { color: var(--gem, #5cc8ff); }

.vc-cur {
  display: inline-block; flex: 0 0 auto;
  background-image: url('/assets/game/ui/icons_currency.png');
  background-repeat: no-repeat; background-size: 200% 200%;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,.55));
}

.vc-continue {
  width: 100%; max-width: 320px; min-height: 54px;
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  font-family: 'Cinzel', serif; font-weight: 800; font-size: 17px; letter-spacing: .04em;
  color: #fff; border: none; border-radius: 16px; cursor: pointer;
  background: linear-gradient(180deg, #FFB347, #FF7B00);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.5), 0 6px 0 #b85600, 0 12px 22px rgba(255,123,0,.42);
  animation: vcCtaBreathe 1.7s ease-in-out infinite;
}
.vc-continue:active { transform: translateY(3px); box-shadow: inset 0 1px 0 rgba(255,255,255,.5), 0 3px 0 #b85600, 0 6px 14px rgba(255,123,0,.4); }
.vc-continue:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
.vc-play { filter: drop-shadow(0 1px 1px rgba(0,0,0,.4)); }
@keyframes vcCtaBreathe { 50% { box-shadow: inset 0 1px 0 rgba(255,255,255,.5), 0 6px 0 #b85600, 0 14px 30px rgba(255,123,0,.65); } }

@media (prefers-reduced-motion: reduce) {
  .vc-overlay *, .vc-overlay { animation: none !important; }
  .vc-star, .vc-rewards { opacity: 1; transform: none; }
}
`
