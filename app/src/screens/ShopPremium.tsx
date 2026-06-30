import { useState, type CSSProperties } from 'react'
import { useGameStore } from '../store/gameStore'
import { assetUrl, UI } from '../lib/assets'

/* ──────────────────────────────────────────────────────────────────────────
 * ShopPremium — AAA mobile-TD shop (Clash Royale / Rush Royale tier).
 *
 * Self-contained: no engine changes, no new deps, strict TS. Renders premium
 * glossy gem-pack cards, a Starter-Pack hero banner with the real reward
 * chest, a No-Ads tile and a daily free-spin tile. All currency glyphs use the
 * REAL `ui/icons_currency.png` 2×2 sheet sliced in CSS (200% 200% trick).
 *
 * Store surface used: meta.{gems,noAds,lastDailyDate}, buyNoAds(),
 * grantDailySpin() → number, go('menu').
 * ────────────────────────────────────────────────────────────────────────── */

/* ── Currency icon: slice ui/icons_currency.png (2×2 of 512² cells) ──────────
 *  [0,0] gem(purple)  [1,0] coin(gold)
 *  [0,1] heart(red)   [1,1] energy(cyan)
 * background-size 200% 200% → each cell fills the box; position 0%/100%. */
type Cur = 'gem' | 'coin' | 'heart' | 'energy'
const CUR_POS: Record<Cur, string> = {
  gem: '0% 0%',
  coin: '100% 0%',
  heart: '0% 100%',
  energy: '100% 100%',
}
function CurIcon({ kind, size = 22 }: { kind: Cur; size?: number }) {
  const style: CSSProperties = {
    display: 'inline-block',
    width: size,
    height: size,
    flex: '0 0 auto',
    backgroundImage: `url(${assetUrl(UI.currency)})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '200% 200%',
    backgroundPosition: CUR_POS[kind],
    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.55))',
  }
  return <i style={style} aria-hidden />
}

interface GemPack {
  id: string
  gems: number
  price: string
  glow: string
  bonus?: string
  best?: boolean
}

// 500 / 1200 / 2500 / 6500 per brief.
const GEM_PACKS: GemPack[] = [
  { id: 'p1', gems: 500, price: '$4.99', glow: '#5CC8FF' },
  { id: 'p2', gems: 1200, price: '$9.99', glow: '#7B61FF', bonus: '+10%' },
  { id: 'p3', gems: 2500, price: '$19.99', glow: '#B14CFF', bonus: '+25%', best: true },
  { id: 'p4', gems: 6500, price: '$49.99', glow: '#FFB347', bonus: '+40%' },
]

/** Mock IAP — packs are display-only; we never grant gems for fake currency. */
function mockPurchase(label: string): void {
  if (typeof window !== 'undefined') window.alert(`${label}\n\n(Demo build — purchases are mocked.)`)
}

export default function ShopPremium() {
  const gems = useGameStore((s) => s.meta.gems)
  const noAds = useGameStore((s) => s.meta.noAds)
  const lastDaily = useGameStore((s) => s.meta.lastDailyDate)
  const buyNoAds = useGameStore((s) => s.buyNoAds)
  const grantDailySpin = useGameStore((s) => s.grantDailySpin)
  const go = useGameStore((s) => s.go)

  const today = new Date().toISOString().slice(0, 10)
  const spinUsed = lastDaily === today
  const [spinReward, setSpinReward] = useState<number | null>(null)

  function onSpin(): void {
    if (spinUsed) return
    setSpinReward(grantDailySpin())
  }

  return (
    <div className="shop-premium screen">
      <style>{CSS}</style>

      {/* ── Top bar ── */}
      <header className="sp-top">
        <button className="sp-back" onClick={() => go('menu')} aria-label="Back">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              d="M11 3 L5 9 L11 15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="sp-title">SHOP</h1>
        <span className="sp-balance">
          <CurIcon kind="gem" size={18} />
          {gems.toLocaleString()}
        </span>
      </header>

      <div className="sp-scroll">
        {/* ── Starter Pack hero banner ── */}
        <button
          className="sp-starter"
          onClick={() => mockPurchase('Starter Pack — $2.99')}
          aria-label="Buy Starter Pack"
        >
          <span className="sp-disc">-80%</span>
          <img className="sp-chest" src={assetUrl(UI.chest)} alt="" aria-hidden />
          <span className="sp-starter-body">
            <strong className="sp-starter-name">STARTER PACK</strong>
            <span className="sp-starter-loot">
              <CurIcon kind="gem" size={15} />
              300
              <CurIcon kind="coin" size={15} />
              5,000
              <span className="sp-relic">+1 Relic</span>
            </span>
            <span className="sp-starter-price">
              <s>$14.99</s>
              <em>$2.99</em>
            </span>
          </span>
        </button>

        {/* ── Gem packs ── */}
        <div className="sp-section">
          <h2>GEM PACKS</h2>
          <span className="sp-sub">
            <CurIcon kind="gem" size={13} /> Premium Currency
          </span>
        </div>

        <div className="sp-grid">
          {GEM_PACKS.map((p) => (
            <button
              key={p.id}
              className={'sp-pack' + (p.best ? ' best' : '')}
              style={{ ['--glow' as string]: p.glow } as CSSProperties}
              onClick={() => mockPurchase(`${p.gems.toLocaleString()} Gems — ${p.price}`)}
              aria-label={`Buy ${p.gems} gems`}
            >
              <span className="sp-sheen" aria-hidden />
              {p.best && <span className="sp-badge">BEST VALUE</span>}
              {p.bonus && <span className="sp-bonus">{p.bonus}</span>}
              <span className="sp-gem-wrap">
                <CurIcon kind="gem" size={p.best ? 60 : 48} />
              </span>
              <strong className="sp-amount">{p.gems.toLocaleString()}</strong>
              <span className="sp-gems-label">Gems</span>
              <span className="sp-buy">{p.price}</span>
            </button>
          ))}
        </div>

        {/* ── Daily free spin ── */}
        <div className={'sp-tile cyan' + (spinUsed ? ' done' : '')}>
          <span className="sp-tile-ic energy">
            <CurIcon kind="energy" size={30} />
          </span>
          <div className="sp-tile-body">
            <strong>Daily Free Spin</strong>
            <span className="sp-tile-sub">
              {spinUsed
                ? 'Come back tomorrow for another spin!'
                : spinReward != null
                  ? `You won ${spinReward.toLocaleString()} coins!`
                  : 'Spin for free coins, once per day.'}
            </span>
          </div>
          <button className="sp-tile-cta" disabled={spinUsed} onClick={onSpin} aria-label="Daily free spin">
            {spinUsed ? 'DONE' : 'SPIN'}
          </button>
        </div>

        {/* ── No Ads ── */}
        <div className={'sp-tile' + (noAds ? ' done' : '')}>
          <span className="sp-tile-ic noads" aria-hidden>
            <svg width="26" height="26" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.2" />
              <path d="M6 6 L18 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </span>
          <div className="sp-tile-body">
            <strong>Remove Ads</strong>
            <span className="sp-tile-sub">
              {noAds ? 'Ad-free unlocked. Thank you!' : 'No banners or interstitials, forever.'}
            </span>
          </div>
          <button
            className="sp-tile-cta"
            disabled={noAds}
            onClick={() => buyNoAds()}
            aria-label="Remove ads"
          >
            {noAds ? 'OWNED' : '$3.99'}
          </button>
        </div>

        <p className="sp-fine">Demo build — gem packs and premium offers are mocked.</p>
      </div>
    </div>
  )
}

/* ── Scoped premium styling (palette-faithful, glossy candy 3D) ──────────── */
const CSS = `
.shop-premium {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  background:
    radial-gradient(120% 80% at 50% -10%, #2a1559 0%, #160a33 45%, #0b0518 100%);
  color: #f2ecff; overflow: hidden;
  font-family: -apple-system, system-ui, sans-serif;
}

/* top bar */
.shop-premium .sp-top {
  flex: 0 0 auto; display: flex; align-items: center; gap: 12px;
  padding: calc(env(safe-area-inset-top, 0px) + 12px) 16px 12px;
}
.shop-premium .sp-back {
  width: 40px; height: 40px; flex: 0 0 auto; border: none; border-radius: 12px;
  display: grid; place-items: center; color: #f2ecff; cursor: pointer;
  background: linear-gradient(180deg, rgba(255,255,255,.12), rgba(0,0,0,.4));
  box-shadow: inset 0 1px 0 rgba(255,255,255,.18), 0 4px 10px rgba(0,0,0,.45);
}
.shop-premium .sp-back:active { transform: translateY(1px); }
.shop-premium .sp-title {
  flex: 1; margin: 0; font-family: 'Cinzel', serif; font-size: 22px;
  font-weight: 800; letter-spacing: .08em;
  text-shadow: 0 2px 8px rgba(177,76,255,.5);
}
.shop-premium .sp-balance {
  display: inline-flex; align-items: center; gap: 7px; font-weight: 800;
  font-size: 15px; color: #d9b8ff; padding: 6px 13px 6px 9px;
  border-radius: 999px; background: rgba(0,0,0,.34);
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.1);
}

/* scroll body */
.shop-premium .sp-scroll {
  flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch;
  padding: 4px 16px calc(env(safe-area-inset-bottom, 0px) + 24px);
  display: flex; flex-direction: column; gap: 16px;
}

/* starter banner */
.shop-premium .sp-starter {
  position: relative; overflow: hidden; text-align: left; cursor: pointer;
  border: none; border-radius: 22px; padding: 16px 18px;
  display: flex; align-items: center; gap: 14px;
  background: linear-gradient(100deg, #5A1FB8, #B14CFF 52%, #FF7B00);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.3),
    0 8px 24px rgba(177,76,255,.45), 0 4px 10px rgba(0,0,0,.5);
}
.shop-premium .sp-starter:active { transform: translateY(2px); }
.shop-premium .sp-disc {
  position: absolute; top: -2px; right: -2px; z-index: 2;
  background: #ff3b6b; color: #fff; font-weight: 800; font-size: 13px;
  padding: 7px 14px 6px; border-radius: 0 22px 0 16px;
  box-shadow: 0 0 14px rgba(255,59,107,.7);
}
.shop-premium .sp-chest {
  width: 70px; height: 70px; flex: 0 0 auto; object-fit: contain;
  filter: drop-shadow(0 4px 10px rgba(0,0,0,.55))
    drop-shadow(0 0 14px rgba(255,210,122,.6));
}
.shop-premium .sp-starter-body { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.shop-premium .sp-starter-name {
  font-family: 'Cinzel', serif; font-size: 18px; font-weight: 800;
  letter-spacing: .05em; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,.4);
}
.shop-premium .sp-starter-loot {
  display: inline-flex; align-items: center; gap: 5px; flex-wrap: wrap;
  font-size: 13px; font-weight: 700; color: #fff;
}
.shop-premium .sp-relic {
  margin-left: 4px; font-size: 11px; padding: 1px 8px; border-radius: 999px;
  background: rgba(0,0,0,.28); border: 1px solid rgba(255,255,255,.25);
}
.shop-premium .sp-starter-price { display: inline-flex; align-items: baseline; gap: 10px; margin-top: 2px; }
.shop-premium .sp-starter-price s { font-size: 12px; color: rgba(255,255,255,.7); }
.shop-premium .sp-starter-price em {
  font-style: normal; font-weight: 800; font-size: 20px; color: #FFE9C2;
  text-shadow: 0 0 10px rgba(255,179,71,.7);
}

/* section header */
.shop-premium .sp-section { display: flex; align-items: baseline; justify-content: space-between; }
.shop-premium .sp-section h2 {
  margin: 0; font-family: 'Cinzel', serif; font-size: 17px; letter-spacing: .06em;
}
.shop-premium .sp-sub {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12px; color: #8478a8;
}

/* gem packs grid */
.shop-premium .sp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.shop-premium .sp-pack {
  position: relative; overflow: hidden; cursor: pointer;
  border-radius: 18px; padding: 18px 12px 14px;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  background: linear-gradient(180deg, #243047, #141a2b);
  border: 1px solid rgba(255,255,255,.1);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.14), 0 6px 16px rgba(0,0,0,.5);
}
.shop-premium .sp-pack:active { transform: translateY(2px); }
.shop-premium .sp-pack.best {
  border-color: rgba(255,210,122,.6);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.18),
    0 0 22px rgba(255,179,71,.4), 0 6px 16px rgba(0,0,0,.5);
}
.shop-premium .sp-sheen {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(180deg, rgba(255,255,255,.1), rgba(255,255,255,0) 42%);
}
.shop-premium .sp-badge {
  position: absolute; top: 9px; left: 50%; transform: translateX(-50%);
  font-size: 10px; font-weight: 800; letter-spacing: .07em; color: #1A0E33;
  background: linear-gradient(180deg, #FFD27A, #FFB347); padding: 2px 10px;
  border-radius: 999px; box-shadow: 0 0 12px rgba(255,179,71,.6);
}
.shop-premium .sp-bonus {
  position: absolute; top: 9px; right: 9px;
  font-size: 11px; font-weight: 800; color: #1A0E33;
  background: linear-gradient(180deg, #5CC8FF, #3FE0FF); padding: 1px 8px;
  border-radius: 999px; box-shadow: 0 0 10px rgba(63,224,255,.5);
}
.shop-premium .sp-pack.best .sp-bonus { top: auto; bottom: 56px; right: 12px; }
.shop-premium .sp-gem-wrap {
  margin-top: 8px; filter: drop-shadow(0 0 16px var(--glow, #7B61FF));
  display: grid; place-items: center;
}
.shop-premium .sp-pack.best .sp-gem-wrap { margin-top: 16px; }
.shop-premium .sp-amount {
  font-size: 22px; font-weight: 800; color: var(--glow, #fff);
  text-shadow: 0 0 12px var(--glow, #7B61FF);
}
.shop-premium .sp-gems-label { font-size: 12px; color: #8478a8; margin-top: -4px; }
.shop-premium .sp-buy {
  margin-top: 6px; width: 100%; min-height: 40px; display: grid; place-items: center;
  font-weight: 800; font-size: 15px; color: #fff; border-radius: 12px;
  background: linear-gradient(180deg, #FFB347, #FF7B00);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.45), 0 4px 0 #b85600;
}
.shop-premium .sp-pack:active .sp-buy {
  box-shadow: inset 0 1px 0 rgba(255,255,255,.45), 0 1px 0 #b85600;
}

/* utility tiles (spin / no-ads) */
.shop-premium .sp-tile {
  display: flex; align-items: center; gap: 12px; padding: 12px 14px;
  border-radius: 16px; background: linear-gradient(180deg, #1e2740, #131a2b);
  border: 1px solid rgba(255,255,255,.1);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.1), 0 4px 12px rgba(0,0,0,.45);
}
.shop-premium .sp-tile.cyan {
  border-color: rgba(63,224,255,.4);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.1), 0 0 18px rgba(63,224,255,.25);
}
.shop-premium .sp-tile.done { opacity: .6; }
.shop-premium .sp-tile-ic {
  width: 46px; height: 46px; flex: 0 0 auto; border-radius: 12px;
  display: grid; place-items: center; background: rgba(0,0,0,.3);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.08);
}
.shop-premium .sp-tile-ic.noads { color: #ff6b6b; }
.shop-premium .sp-tile-body { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.shop-premium .sp-tile-body strong { font-size: 15px; }
.shop-premium .sp-tile-sub { font-size: 12px; color: #8478a8; }
.shop-premium .sp-tile-cta {
  flex: 0 0 auto; min-width: 78px; min-height: 40px; border: none; cursor: pointer;
  font-weight: 800; font-size: 14px; color: #fff; border-radius: 12px; padding: 0 16px;
  background: linear-gradient(180deg, #B14CFF, #7B61FF);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.35), 0 4px 0 #4a2f9e;
}
.shop-premium .sp-tile-cta:active { transform: translateY(2px); box-shadow: inset 0 1px 0 rgba(255,255,255,.35), 0 1px 0 #4a2f9e; }
.shop-premium .sp-tile-cta:disabled {
  cursor: default; color: #cfc6ec; background: linear-gradient(180deg, #353050, #25223a);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
}

.shop-premium .sp-fine { font-size: 11px; color: #6c6090; text-align: center; margin: 0; }
`
