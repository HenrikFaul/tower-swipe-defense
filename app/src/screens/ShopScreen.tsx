import { useState, type CSSProperties } from 'react'
import { useGameStore } from '../store/gameStore'
import { AppBar, Tap } from '../components/Common'
import { haptics } from '../lib/haptics'
import { playSfx } from '../lib/audio'

interface GemPack {
  id: string
  gems: number
  price: string
  glow: string
  deep: string
  best?: boolean
}

const GEM_PACKS: GemPack[] = [
  { id: 'p1', gems: 500, price: '$1.99', glow: 'var(--cyan)', deep: 'var(--cyan-deep)' },
  { id: 'p2', gems: 1200, price: '$4.99', glow: 'var(--magenta)', deep: 'var(--magenta-deep)' },
  { id: 'p3', gems: 2500, price: '$9.99', glow: 'var(--orange)', deep: 'var(--gold-deep)', best: true },
  { id: 'p4', gems: 6500, price: '$19.99', glow: 'var(--gold)', deep: 'var(--gold-deep)' },
]

/** Mock IAP — packs are display-only; we never grant gems for fake currency. */
function mockPurchase(label: string): void {
  playSfx('ui_tap')
  haptics.success()
  // eslint-disable-next-line no-alert
  if (typeof window !== 'undefined') window.alert(`${label}\n\n(Demo build — purchases are mocked.)`)
}

export default function ShopScreen() {
  const noAds = useGameStore((s) => s.meta.noAds)
  const lastDaily = useGameStore((s) => s.meta.lastDailyDate)
  const buyNoAds = useGameStore((s) => s.buyNoAds)
  const grantDailySpin = useGameStore((s) => s.grantDailySpin)

  const today = new Date().toISOString().slice(0, 10)
  const spinUsed = lastDaily === today
  const [spinReward, setSpinReward] = useState<number | null>(null)

  function onSpin(): void {
    if (spinUsed) return
    const reward = grantDailySpin()
    setSpinReward(reward)
    haptics.success()
  }

  const cardBase: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 'var(--r, 16px)',
    padding: 'var(--sp-4, 16px) var(--sp-3, 12px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    border: '1px solid var(--line-soft)',
    background: 'var(--surface-1)',
  }

  return (
    <div className="screen">
      <AppBar title="Shop" />

      <div className="scroll col gap pad" style={{ paddingTop: 0 }}>
        {/* Starter Pack special offer banner */}
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 'var(--r-lg, 22px)',
            padding: '16px 18px',
            background: 'var(--grad-banner, linear-gradient(100deg,#5A1FB8,#B14CFF 50%,#FF7B00))',
            boxShadow: 'var(--sh-3), var(--glow-magenta)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -8,
              right: -8,
              background: 'var(--bad)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 13,
              padding: '6px 14px 4px',
              borderRadius: '0 0 0 14px',
              boxShadow: 'var(--glow-bad)',
              transform: 'rotate(2deg)',
            }}
          >
            -80%
          </div>
          <div className="row" style={{ alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 38, filter: 'drop-shadow(var(--glow-gold))' }}>🎁</span>
            <div className="col" style={{ flex: 1, gap: 2 }}>
              <strong style={{ fontSize: 18, color: '#fff', letterSpacing: '0.04em' }}>STARTER PACK</strong>
              <span style={{ color: 'rgba(255,255,255,0.92)', fontSize: 13 }}>
                300 💎 · 5,000 🪙 · 1 Relic
              </span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textDecoration: 'line-through' }}>
                $14.99
              </span>
            </div>
            <Tap
              className="btn"
              ariaLabel="Buy Starter Pack"
              onClick={() => mockPurchase('Starter Pack — $2.99')}
            >
              $2.99
            </Tap>
          </div>
        </div>

        {/* Gem packs grid */}
        <div className="row" style={{ alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
          <h3 className="display" style={{ margin: 0, fontSize: 18 }}>GEM PACKS</h3>
          <span className="muted" style={{ fontSize: 12 }}>💎 Premium Currency</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--sp-3, 12px)',
          }}
        >
          {GEM_PACKS.map((p) => (
            <div
              key={p.id}
              style={{
                ...cardBase,
                border: p.best ? '1px solid var(--line-gold)' : cardBase.border,
                boxShadow: p.best ? 'var(--sh-2), var(--glow-gold)' : 'var(--sh-2)',
              }}
            >
              {/* glossy top sheen */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0) 42%)',
                  pointerEvents: 'none',
                }}
              />
              {p.best && (
                <span
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    color: 'var(--ink-on-light, #1A0E33)',
                    background: 'var(--gold)',
                    padding: '2px 10px',
                    borderRadius: 'var(--r-pill, 999px)',
                    boxShadow: 'var(--glow-gold)',
                  }}
                >
                  BEST VALUE
                </span>
              )}
              <div
                style={{
                  fontSize: 44,
                  marginTop: p.best ? 14 : 0,
                  filter: `drop-shadow(0 0 14px ${p.glow})`,
                }}
              >
                💎
              </div>
              <strong style={{ fontSize: 22, color: p.glow, textShadow: `0 0 12px ${p.glow}` }}>
                {p.gems.toLocaleString()}
              </strong>
              <span className="muted" style={{ fontSize: 12, marginTop: -4 }}>Gems</span>
              <Tap
                className="btn full"
                ariaLabel={`Buy ${p.gems} gems`}
                onClick={() => mockPurchase(`${p.gems.toLocaleString()} Gems — ${p.price}`)}
              >
                {p.price}
              </Tap>
            </div>
          ))}
        </div>

        {/* Daily free spin */}
        <div
          className="li"
          style={{
            alignItems: 'center',
            border: '1px solid var(--line-cyan)',
            boxShadow: spinUsed ? 'none' : 'var(--glow-cyan)',
          }}
        >
          <span className="ic" style={{ fontSize: 28 }}>🎡</span>
          <div className="col" style={{ flex: 1, gap: 2 }}>
            <strong>Daily Free Spin</strong>
            <span className="muted" style={{ fontSize: 12 }}>
              {spinUsed
                ? 'Come back tomorrow for another spin!'
                : spinReward != null
                ? `You won 🪙 ${spinReward.toLocaleString()}!`
                : 'Spin for free coins, once per day.'}
            </span>
          </div>
          <Tap
            className={spinUsed ? 'btn secondary' : 'btn'}
            disabled={spinUsed}
            ariaLabel="Daily free spin"
            onClick={onSpin}
          >
            {spinUsed ? 'DONE' : 'SPIN'}
          </Tap>
        </div>

        {/* No Ads */}
        <div className="li" style={{ alignItems: 'center' }}>
          <span className="ic" style={{ fontSize: 28 }}>🚫</span>
          <div className="col" style={{ flex: 1, gap: 2 }}>
            <strong>Remove Ads</strong>
            <span className="muted" style={{ fontSize: 12 }}>
              {noAds ? 'Ad-free unlocked. Thank you!' : 'No banners or interstitials, forever.'}
            </span>
          </div>
          <Tap
            className={noAds ? 'btn secondary' : 'btn'}
            disabled={noAds}
            ariaLabel="Remove ads"
            onClick={() => {
              buyNoAds()
              haptics.success()
            }}
          >
            {noAds ? 'OWNED' : '$3.99'}
          </Tap>
        </div>

        <p className="muted" style={{ fontSize: 11, textAlign: 'center', margin: '4px 0 8px' }}>
          Demo build — gem packs and premium offers are mocked.
        </p>
      </div>
    </div>
  )
}
