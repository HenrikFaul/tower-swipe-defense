import { useEffect, useState } from 'react'

/**
 * VictoryPro — polished VICTORY / result modal (promo board panel 10).
 *
 * Pure presentational. Renders an overlay scrim + glassy modal with a big
 * extruded "VICTORY" title, three pop-in animated stars, a score readout,
 * reward chips (coins / gems), a glowing loot chest, and a glossy CONTINUE
 * CTA. All visuals are self-contained (scoped <style> block using the design
 * tokens) so it drops in without touching global.css.
 */
export interface VictoryProProps {
  /** Wave number that was cleared. */
  wave: number
  /** Earned stars, 0–3. */
  stars: number
  /** Coins rewarded this run. */
  coins: number
  /** Gems rewarded this run (chip hidden when 0). */
  gems: number
  /** Fired when the player taps CONTINUE. */
  onContinue: () => void
}

const STAR_DELAYS = [120, 320, 520] as const

export default function VictoryPro({
  wave,
  stars,
  coins,
  gems,
  onContinue,
}: VictoryProProps): JSX.Element {
  const earned: number = Math.max(0, Math.min(3, Math.round(stars)))
  const [shown, setShown] = useState<number>(0)

  // Reveal stars one-by-one for the pop cascade.
  useEffect(() => {
    const timers: number[] = []
    for (let i = 0; i < earned; i++) {
      timers.push(
        window.setTimeout(() => setShown((s) => Math.max(s, i + 1)), STAR_DELAYS[i] ?? 520),
      )
    }
    return () => {
      for (const t of timers) window.clearTimeout(t)
    }
  }, [earned])

  return (
    <div className="vp-overlay" role="dialog" aria-modal="true" aria-label="Victory">
      <style>{VP_CSS}</style>

      {/* god-rays behind the card */}
      <div className="vp-rays" aria-hidden="true" />

      <div className="vp-card">
        <div className="vp-banner">WAVE {wave} CLEARED</div>

        <h1 className="vp-title" data-text="VICTORY">
          VICTORY
        </h1>

        <div className="vp-stars" aria-label={`${earned} of 3 stars`}>
          {[0, 1, 2].map((i) => {
            const filled: boolean = i < earned
            const visible: boolean = i < shown
            return (
              <span
                key={i}
                className={
                  'vp-star' +
                  (filled ? ' is-filled' : ' is-empty') +
                  (visible ? ' is-in' : '')
                }
                style={{ ['--vp-i' as string]: String(i) }}
              >
                ★
              </span>
            )
          })}
        </div>

        <div className="vp-score">
          <span className="vp-score-label">SCORE</span>
          <span className="vp-score-val">{(wave * 1000 + earned * 250).toLocaleString()}</span>
        </div>

        {/* loot chest */}
        <div className="vp-chest" aria-hidden="true">
          <div className="vp-chest-glow" />
          <span className="vp-chest-emoji">🎁</span>
          <span className="vp-spark vp-spark-a">✦</span>
          <span className="vp-spark vp-spark-b">✦</span>
          <span className="vp-spark vp-spark-c">✦</span>
        </div>

        <div className="vp-rewards">
          <span className="vp-chip vp-chip-coin">🪙 {coins.toLocaleString()}</span>
          {gems > 0 && <span className="vp-chip vp-chip-gem">💎 {gems.toLocaleString()}</span>}
        </div>

        <button type="button" className="vp-cta" onClick={onContinue}>
          <span className="vp-cta-gloss" aria-hidden="true" />
          CONTINUE
        </button>
      </div>
    </div>
  )
}

const VP_CSS = `
.vp-overlay{
  position:absolute; inset:0; z-index:60;
  display:flex; align-items:center; justify-content:center;
  padding:24px;
  background:
    radial-gradient(110% 90% at 50% 38%, rgba(50,28,110,0.35) 0%, transparent 60%),
    rgba(8,4,22,0.74);
  -webkit-backdrop-filter:blur(3px); backdrop-filter:blur(3px);
  animation:vp-fade 200ms cubic-bezier(0.22,1,0.36,1) both;
}
@keyframes vp-fade{ from{opacity:0} to{opacity:1} }

.vp-rays{
  position:absolute; width:520px; height:520px; max-width:120%; max-height:80%;
  pointer-events:none;
  background:repeating-conic-gradient(from 0deg at 50% 50%,
    rgba(177,76,255,0.16) 0deg 7deg, transparent 7deg 18deg);
  -webkit-mask:radial-gradient(closest-side, #000 0%, transparent 72%);
  mask:radial-gradient(closest-side, #000 0%, transparent 72%);
  animation:vp-spin 24s linear infinite;
}
@keyframes vp-spin{ to{ transform:rotate(360deg) } }

.vp-card{
  position:relative; z-index:1;
  width:100%; max-width:360px;
  padding:22px 20px 24px;
  border-radius:22px;
  border:1px solid rgba(255,210,122,0.28);
  background:linear-gradient(160deg, rgba(60,40,120,0.92), rgba(28,16,62,0.96));
  box-shadow:0 24px 64px rgba(7,3,18,0.70), 0 0 0 1px rgba(177,76,255,0.18) inset;
  text-align:center;
  animation:vp-pop 320ms cubic-bezier(0.2,1.35,0.5,1) both;
  font-family:'Inter', system-ui, sans-serif;
  color:#F2ECFF;
}
@keyframes vp-pop{ from{opacity:0; transform:translateY(14px) scale(0.92)} to{opacity:1; transform:none} }

.vp-banner{
  display:inline-block;
  margin-bottom:6px; padding:5px 16px;
  border-radius:999px;
  font-size:11px; font-weight:800; letter-spacing:0.16em;
  color:#FFE9C4;
  background:linear-gradient(100deg, #5A1FB8, #B14CFF 55%, #FF7B00);
  box-shadow:0 0 18px rgba(177,76,255,0.5);
}

.vp-title{
  margin:6px 0 10px;
  font-family:'Cinzel', Georgia, serif;
  font-size:46px; line-height:1; font-weight:800; letter-spacing:0.04em;
  background:linear-gradient(180deg, #FFF3C4 0%, #FFD27A 42%, #FF9E2C 72%, #FF7B00 100%);
  -webkit-background-clip:text; background-clip:text; color:transparent;
  -webkit-text-fill-color:transparent;
  filter:drop-shadow(0 2px 0 #B85600) drop-shadow(0 0 18px rgba(255,179,71,0.55));
}

.vp-stars{
  display:flex; justify-content:center; gap:6px; margin:2px 0 12px;
}
.vp-star{
  font-size:42px; line-height:1;
  transform:scale(0) rotate(-30deg); opacity:0;
}
.vp-star.is-in{
  animation:vp-star-pop 420ms cubic-bezier(0.2,1.35,0.5,1) forwards;
}
@keyframes vp-star-pop{
  0%{ transform:scale(0) rotate(-30deg); opacity:0 }
  60%{ transform:scale(1.25) rotate(6deg); opacity:1 }
  100%{ transform:scale(1) rotate(0); opacity:1 }
}
.vp-star.is-filled{
  color:#FFD27A;
  text-shadow:0 0 14px rgba(255,210,122,0.85), 0 0 30px rgba(255,179,71,0.5);
}
.vp-star.is-filled:nth-child(2){ font-size:50px; }
.vp-star.is-empty{
  color:#5A5476;
  opacity:1; transform:none;
  text-shadow:none;
}

.vp-score{
  display:inline-flex; align-items:baseline; gap:8px;
  margin-bottom:14px; padding:6px 16px;
  border-radius:999px;
  background:rgba(28,16,62,0.92);
  border:1px solid rgba(242,236,255,0.10);
}
.vp-score-label{ font-size:11px; font-weight:700; letter-spacing:0.14em; color:#B9AEDC; }
.vp-score-val{ font-size:20px; font-weight:800; color:#F2ECFF; font-variant-numeric:tabular-nums; }

.vp-chest{
  position:relative;
  width:96px; height:88px; margin:2px auto 14px;
  display:flex; align-items:center; justify-content:center;
}
.vp-chest-glow{
  position:absolute; inset:-12px;
  border-radius:50%;
  background:radial-gradient(closest-side, rgba(255,210,122,0.55), transparent 72%);
  animation:vp-glow 1.8s ease-in-out infinite;
}
@keyframes vp-glow{ 0%,100%{opacity:0.55; transform:scale(0.95)} 50%{opacity:1; transform:scale(1.06)} }
.vp-chest-emoji{
  position:relative; font-size:64px; line-height:1;
  filter:drop-shadow(0 6px 10px rgba(7,3,18,0.6));
  animation:vp-bob 2.4s ease-in-out infinite;
}
@keyframes vp-bob{ 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-5px) rotate(2deg)} }
.vp-spark{
  position:absolute; color:#FFD27A; font-size:14px;
  text-shadow:0 0 10px rgba(255,210,122,0.9);
  animation:vp-twinkle 1.6s ease-in-out infinite;
}
.vp-spark-a{ top:2px; left:8px; animation-delay:0s; }
.vp-spark-b{ top:10px; right:6px; font-size:18px; animation-delay:0.5s; }
.vp-spark-c{ bottom:4px; left:18px; font-size:11px; animation-delay:1s; }
@keyframes vp-twinkle{ 0%,100%{opacity:0; transform:scale(0.4)} 50%{opacity:1; transform:scale(1)} }

.vp-rewards{
  display:flex; justify-content:center; flex-wrap:wrap; gap:8px; margin-bottom:18px;
}
.vp-chip{
  display:inline-flex; align-items:center; gap:6px;
  padding:7px 14px; border-radius:999px;
  font-size:14px; font-weight:800; font-variant-numeric:tabular-nums;
  background:rgba(40,24,84,0.72);
  border:1px solid rgba(242,236,255,0.10);
}
.vp-chip-coin{ color:#FFD27A; border-color:rgba(255,210,122,0.28); box-shadow:0 0 12px rgba(255,210,122,0.22); }
.vp-chip-gem{ color:#5CC8FF; border-color:rgba(63,224,255,0.30); box-shadow:0 0 12px rgba(63,224,255,0.22); }

.vp-cta{
  position:relative; overflow:hidden;
  width:100%; height:54px;
  border:0; border-radius:16px; cursor:pointer;
  font-family:'Cinzel', Georgia, serif;
  font-size:19px; font-weight:800; letter-spacing:0.08em;
  color:#1A0E33;
  background:linear-gradient(180deg, #FFE08A 0%, #FFB347 38%, #FF7B00 100%);
  box-shadow:0 6px 0 #B85600, 0 10px 20px rgba(255,123,0,0.30), 0 12px 28px rgba(7,3,18,0.55);
  transition:transform 90ms cubic-bezier(0.22,1,0.36,1), box-shadow 90ms cubic-bezier(0.22,1,0.36,1);
}
.vp-cta:active{
  transform:translateY(4px);
  box-shadow:0 2px 0 #B85600, 0 4px 12px rgba(7,3,18,0.5);
}
.vp-cta-gloss{
  position:absolute; inset:0; pointer-events:none;
  background:linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0) 45%);
}

@media (prefers-reduced-motion: reduce){
  .vp-overlay,.vp-card,.vp-star.is-in{ animation-duration:90ms; }
  .vp-rays,.vp-chest-glow,.vp-chest-emoji,.vp-spark{ animation:none; }
  .vp-star{ transform:none; opacity:1; }
}
`
