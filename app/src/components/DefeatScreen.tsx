import { useState } from 'react'
import { assetUrl } from '../lib/assets'

/**
 * DefeatScreen — premium defeat modal in the Tower Swipe Defense house style.
 *
 * No victory banner; red-tinted "keep has fallen" frame. Uses the REAL
 * `ui/icons_currency.png` sheet (2×2 of 512² cells) for reward chips instead
 * of emoji. Self-contained: scoped CSS is injected once via <style>, the
 * currency sheet URL is resolved through assetUrl()/BASE_URL on the root so
 * it is base-safe. Strict-TS clean, no new deps, no engine coupling.
 *
 * Usage:
 *   <DefeatScreen wave={r.wave} score={r.score} coins={r.coins}
 *                 gems={r.gems}            // optional
 *                 onClaim={(doubled) => finalize(doubled)}
 *                 onRetry={() => startRun()} />
 */

export interface DefeatScreenProps {
  /** Wave the run ended on. */
  wave: number
  /** Final score. */
  score: number
  /** Coins earned this run. */
  coins: number
  /** Optional gems earned this run (chip hidden when 0/undefined). */
  gems?: number
  /** Claim rewards. `doubled` is true when the player watched the rewarded ad. */
  onClaim: (doubled: boolean) => void
  /** Restart the run immediately. */
  onRetry: () => void
}

/** Single currency icon sliced from the real 2×2 sheet via background-position. */
function Cur({ kind, size = 18 }: { kind: 'gem' | 'coin' | 'heart' | 'energy'; size?: number }) {
  return <i className={`dft-cur ${kind}`} style={{ width: size, height: size }} aria-hidden />
}

export default function DefeatScreen({
  wave,
  score,
  coins,
  gems,
  onClaim,
  onRetry,
}: DefeatScreenProps) {
  const [claimed, setClaimed] = useState(false)

  const claim = (doubled: boolean) => {
    if (claimed) return
    setClaimed(true)
    onClaim(doubled)
  }

  return (
    <div
      className="dft-overlay"
      style={{ ['--cur-sheet' as keyof React.CSSProperties]: `url(${assetUrl('ui/icons_currency.png')})` } as React.CSSProperties}
      role="dialog"
      aria-modal="true"
      aria-label="Defeat"
    >
      <DefeatStyles />

      <div className="dft-modal">
        {/* red glow crown / broken-shield glyph */}
        <div className="dft-crest" aria-hidden>
          <svg width="60" height="60" viewBox="0 0 60 60">
            <defs>
              <linearGradient id="dftShield" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ff6b5c" />
                <stop offset="1" stopColor="#c4241a" />
              </linearGradient>
            </defs>
            <path
              d="M30 4 L52 12 V30 C52 44 42 53 30 57 C18 53 8 44 8 30 V12 Z"
              fill="url(#dftShield)"
              stroke="rgba(0,0,0,.45)"
              strokeWidth="2"
            />
            {/* crack */}
            <path
              d="M30 9 L24 27 L33 31 L26 50"
              fill="none"
              stroke="rgba(0,0,0,.55)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M30 9 L24 27 L33 31 L26 50"
              fill="none"
              stroke="rgba(255,220,210,.45)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="dft-tag">THE KEEP HAS FALLEN</div>

        <h1 className="dft-title">DEFEAT</h1>
        <div className="dft-sub">
          Reached <b>WAVE {wave}</b>
        </div>

        <div className="dft-rewards">
          <div className="dft-rew-label">SPOILS RECOVERED</div>
          <div className="dft-chips">
            <span className="dft-chip score">
              <svg className="dft-trophy" width="15" height="15" viewBox="0 0 24 24" aria-hidden>
                <path
                  d="M6 3h12v3a6 6 0 0 1-12 0V3Z M4 4h2v2a3 3 0 0 1-2-2Zm16 0a3 3 0 0 1-2 2V4h2ZM9 13h6l-1 4h2v2H8v-2h2l-1-4Z"
                  fill="currentColor"
                />
              </svg>
              {score.toLocaleString()}
            </span>
            <span className="dft-chip coin">
              <Cur kind="coin" size={17} />
              {coins.toLocaleString()}
            </span>
            {!!gems && gems > 0 && (
              <span className="dft-chip gem">
                <Cur kind="gem" size={17} />
                {gems.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {!claimed ? (
          <div className="dft-actions">
            <button className="dft-btn double" onClick={() => claim(true)} aria-label="Double coins via ad">
              <span className="dft-ad-glyph" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path d="M3 3 L13 8 L3 13 Z" fill="currentColor" />
                </svg>
              </span>
              DOUBLE COINS
              <span className="dft-ad-tag">AD</span>
            </button>

            <div className="dft-row">
              <button className="dft-btn retry" onClick={onRetry} aria-label="Retry">
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                  <path
                    d="M12 5V2L7 7l5 5V8a6 6 0 1 1-6 6H4a8 8 0 1 0 8-9Z"
                    fill="currentColor"
                  />
                </svg>
                RETRY
              </button>
              <button className="dft-btn claim" onClick={() => claim(false)} aria-label="Claim and continue">
                CLAIM
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
                  <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="dft-actions">
            <div className="dft-claimed">Spoils claimed</div>
            <button className="dft-btn retry full" onClick={onRetry} aria-label="Retry">
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                <path d="M12 5V2L7 7l5 5V8a6 6 0 1 1-6 6H4a8 8 0 1 0 8-9Z" fill="currentColor" />
              </svg>
              RETRY
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Scoped styles (injected once). Faithful to palette / candy buttons.
 * ------------------------------------------------------------------ */
function DefeatStyles() {
  return (
    <style>{`
.dft-overlay {
  position: fixed; inset: 0; z-index: 60;
  display: grid; place-items: center;
  padding: max(20px, env(safe-area-inset-top)) 18px max(20px, env(safe-area-inset-bottom));
  background:
    radial-gradient(120% 90% at 50% 18%, rgba(224,69,46,.28), rgba(0,0,0,0) 60%),
    rgba(8,6,14,.74);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
  animation: dftFade .22s ease both;
}
@keyframes dftFade { from { opacity: 0; } to { opacity: 1; } }

.dft-cur {
  display: inline-block; flex: 0 0 auto;
  background-image: var(--cur-sheet);
  background-repeat: no-repeat;
  background-size: 200% 200%;
  image-rendering: auto;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,.55));
}
.dft-cur.gem    { background-position:   0%   0%; }
.dft-cur.coin   { background-position: 100%   0%; }
.dft-cur.heart  { background-position:   0% 100%; }
.dft-cur.energy { background-position: 100% 100%; }

.dft-modal {
  position: relative;
  width: 100%; max-width: 360px;
  border-radius: 22px;
  padding: 40px 22px 22px;
  text-align: center;
  background: linear-gradient(180deg, #2a1620, #171019 62%, #120b14);
  border: 1px solid rgba(255,120,100,.22);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.10),
    inset 0 0 60px rgba(224,69,46,.10),
    0 22px 60px rgba(0,0,0,.6),
    0 0 0 1px rgba(0,0,0,.4);
  animation: dftPop .28s cubic-bezier(.2,.9,.3,1.2) both;
}
@keyframes dftPop { from { transform: translateY(14px) scale(.94); opacity: 0; } to { transform: none; opacity: 1; } }

.dft-crest {
  position: absolute; top: -30px; left: 50%; transform: translateX(-50%);
  width: 64px; height: 64px; display: grid; place-items: center;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 38%, #3a1418, #18090c);
  border: 1px solid rgba(255,120,100,.3);
  box-shadow: 0 0 26px rgba(224,69,46,.55), inset 0 2px 4px rgba(255,255,255,.12);
  animation: dftCrest 2.6s ease-in-out infinite;
}
@keyframes dftCrest { 50% { box-shadow: 0 0 34px rgba(224,69,46,.8), inset 0 2px 4px rgba(255,255,255,.12); } }

.dft-tag {
  font-family: 'Cinzel', Georgia, serif;
  font-size: 11px; font-weight: 800; letter-spacing: .18em;
  color: #ff8a7a; text-transform: uppercase;
  margin-bottom: 2px;
}

.dft-title {
  margin: 2px 0 4px;
  font-family: 'Cinzel', Georgia, serif;
  font-size: 44px; font-weight: 900; letter-spacing: .04em;
  line-height: 1;
  color: #fff;
  background: linear-gradient(180deg, #ffd9cf, #ff6b5c 55%, #c4241a);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 10px rgba(224,69,46,.45));
}

.dft-sub {
  font-size: 13px; color: rgba(255,255,255,.62); margin-bottom: 16px;
}
.dft-sub b { color: #ffd27a; font-weight: 800; }

.dft-rewards {
  margin: 0 0 18px;
  padding: 12px 12px 14px;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(0,0,0,.28));
  border: 1px solid rgba(255,255,255,.08);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.07);
}
.dft-rew-label {
  font-size: 10px; font-weight: 800; letter-spacing: .16em;
  color: rgba(255,255,255,.45); text-transform: uppercase; margin-bottom: 10px;
}
.dft-chips {
  display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;
}
.dft-chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 12px 6px 9px;
  border-radius: 999px;
  font-size: 14px; font-weight: 800;
  font-variant-numeric: tabular-nums;
  background: rgba(0,0,0,.36);
  border: 1px solid rgba(255,255,255,.10);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.10);
  color: #fff;
}
.dft-chip.score  { color: #ffe6a3; }
.dft-chip .dft-trophy { color: #ffd27a; }
.dft-chip.coin   { color: var(--coin, #ffd27a); }
.dft-chip.gem    { color: var(--gem, #6fc7ff); }

.dft-actions { display: flex; flex-direction: column; gap: 10px; }
.dft-row { display: flex; gap: 10px; }

.dft-btn {
  position: relative;
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; min-height: 50px;
  border: none; border-radius: 14px; cursor: pointer;
  font-family: 'Cinzel', Georgia, serif;
  font-size: 15px; font-weight: 800; letter-spacing: .04em;
  color: #fff;
  transition: transform .06s ease, box-shadow .12s ease, filter .12s ease;
  -webkit-tap-highlight-color: transparent;
}
.dft-btn:active { transform: translateY(3px); }

/* primary: glossy orange candy (rewarded ad / double) */
.dft-btn.double {
  background: linear-gradient(180deg, #FFB347, #FF7B00);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.5),
    0 6px 0 #b85600,
    0 10px 20px rgba(255,123,0,.4);
  animation: dftBreathe 1.7s ease-in-out infinite;
}
.dft-btn.double:active {
  box-shadow: inset 0 1px 0 rgba(255,255,255,.5), 0 3px 0 #b85600, 0 6px 12px rgba(255,123,0,.4);
  animation: none;
}
@keyframes dftBreathe {
  50% { box-shadow: inset 0 1px 0 rgba(255,255,255,.5), 0 6px 0 #b85600, 0 10px 26px rgba(255,123,0,.65); }
}
.dft-ad-glyph {
  display: grid; place-items: center;
  width: 22px; height: 22px; border-radius: 50%;
  background: rgba(0,0,0,.28); color: #fff;
}
.dft-ad-tag {
  font-family: system-ui, sans-serif;
  font-size: 9px; font-weight: 900; letter-spacing: .06em;
  padding: 2px 6px; border-radius: 6px;
  background: rgba(0,0,0,.34); color: #fff;
}

/* retry: dark beveled */
.dft-btn.retry {
  flex: 1;
  background: linear-gradient(180deg, #2c3550, #1a2030);
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.14), 0 4px 10px rgba(0,0,0,.5);
}
.dft-btn.retry.full { flex: none; }
.dft-btn.retry:active { box-shadow: inset 0 1px 0 rgba(255,255,255,.14), 0 2px 6px rgba(0,0,0,.5); }

/* claim: magenta accent ghost */
.dft-btn.claim {
  flex: 1;
  background: linear-gradient(180deg, #8a4dff, #6a32d8);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.28), 0 4px 0 #4d22a0, 0 8px 16px rgba(123,97,255,.35);
}
.dft-btn.claim:active { box-shadow: inset 0 1px 0 rgba(255,255,255,.28), 0 2px 0 #4d22a0; }

.dft-claimed {
  font-size: 13px; font-weight: 700; color: rgba(255,255,255,.62);
  padding: 6px 0;
}
`}</style>
  )
}
