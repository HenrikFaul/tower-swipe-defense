import { useState, type CSSProperties } from 'react'
import { useGameStore } from '../store/gameStore'
import { assetUrl, UI } from '../lib/assets'

/**
 * DailyRewardsPremium — AAA-polish 7-day daily reward calendar.
 *
 * Premium upgrade over the emoji version:
 *  - REAL `ui/icon_chest.png` chest art (lit for today/claimable, dimmed for past,
 *    grayscaled + lock for future days).
 *  - REAL `ui/icons_currency.png` 2×2 sheet for coin/gem chips, sliced exactly per
 *    the HUD design spec (background-size 200% 200%, position 0%/100%).
 *  - Today highlighted with a pulsing magenta/orange ring; CLAIM grants via the
 *    store's `grantDailySpin()` (falls back) or a supplied `grant` handler.
 *
 * Self-contained, strict-TS clean, no new deps, plain inline styles + one <style>
 * block for keyframes. Palette: deep purple/indigo bg, magenta #B14CFF / #7B61FF,
 * orange-gold #FF7B00/#FFB347/#FFD27A, cyan #3FE0FF/#5CC8FF.
 */
export interface DailyRewardsPremiumProps {
  /** Custom claim handler. Receives the claimed day's reward. */
  grant?: (reward: DailyReward) => void
  /** Override the back action (defaults to go('menu')). */
  onBack?: () => void
}

export interface DailyReward {
  day: number
  coins: number
  gems: number
  premium: boolean
}

/** Escalating 7-day track. Days 5 & 7 are premium "big chests". */
const REWARDS: DailyReward[] = [
  { day: 1, coins: 100, gems: 0, premium: false },
  { day: 2, coins: 200, gems: 0, premium: false },
  { day: 3, coins: 350, gems: 2, premium: false },
  { day: 4, coins: 600, gems: 3, premium: false },
  { day: 5, coins: 1000, gems: 5, premium: true },
  { day: 6, coins: 1800, gems: 8, premium: false },
  { day: 7, coins: 3500, gems: 20, premium: true },
]

const STORAGE_KEY = 'tsd_daily_rewards_v1'

const CHEST_URL = assetUrl(UI.chest)
const CUR_URL = assetUrl(UI.currency)

interface ClaimState {
  date: string // YYYY-MM-DD of last claim
  streak: number // 1..7 = the last claimed day position
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function dayDiff(a: string, b: string): number {
  const da = Date.parse(a + 'T00:00:00Z')
  const db = Date.parse(b + 'T00:00:00Z')
  return Math.round((db - da) / 86_400_000)
}

function loadClaim(): ClaimState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { date: '', streak: 0 }
    const parsed = JSON.parse(raw) as Partial<ClaimState>
    const streak = typeof parsed.streak === 'number' ? parsed.streak : 0
    return { date: typeof parsed.date === 'string' ? parsed.date : '', streak }
  } catch {
    return { date: '', streak: 0 }
  }
}

function saveClaim(state: ClaimState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* private mode / quota — non-fatal */
  }
}

/** Resolve the current claim status from persisted state. */
function resolveStatus(claim: ClaimState): { todayIndex: number; canClaim: boolean } {
  const today = todayKey()
  if (!claim.date) return { todayIndex: 0, canClaim: true }
  const diff = dayDiff(claim.date, today)
  if (diff <= 0) {
    // Already claimed today — next day is highlighted but locked.
    return { todayIndex: Math.min(claim.streak, REWARDS.length - 1), canClaim: false }
  }
  if (diff === 1) {
    // Consecutive day: advance, wrapping the 7-day cycle.
    return { todayIndex: claim.streak % REWARDS.length, canClaim: true }
  }
  // Streak broken — restart at day 1.
  return { todayIndex: 0, canClaim: true }
}

/* ─────────────────────── currency icon (sliced sheet) ─────────────────────── */

function Cur({ kind, size = 16 }: { kind: 'gem' | 'coin' | 'heart' | 'energy'; size?: number }) {
  // 2×2 sheet → background-size 200% 200%, position 0%/100% per axis.
  const pos: Record<typeof kind, string> = {
    gem: '0% 0%',
    coin: '100% 0%',
    heart: '0% 100%',
    energy: '100% 100%',
  }
  return (
    <i
      aria-hidden
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        flex: '0 0 auto',
        backgroundImage: `url(${CUR_URL})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '200% 200%',
        backgroundPosition: pos[kind],
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.55))',
      }}
    />
  )
}

/* ───────────────────────────── main screen ───────────────────────────── */

export default function DailyRewardsPremium({ grant, onBack }: DailyRewardsPremiumProps) {
  const go = useGameStore((s) => s.go)
  const grantDailySpin = useGameStore((s) => s.grantDailySpin)
  const coins = useGameStore((s) => s.meta.coins)
  const gems = useGameStore((s) => s.meta.gems)
  const reducedMotion = useGameStore((s) => s.settings.reducedMotion)

  const [claim, setClaim] = useState<ClaimState>(() => loadClaim())
  const [popDay, setPopDay] = useState<number>(0)

  const { todayIndex, canClaim } = resolveStatus(claim)
  const todayReward = REWARDS[todayIndex]

  const handleBack = () => (onBack ? onBack() : go('menu'))

  const handleClaim = () => {
    if (!canClaim) return
    const reward = REWARDS[todayIndex]
    if (grant) grant(reward)
    else grantDailySpin() // store fallback: adds a randomized coin amount
    const next: ClaimState = { date: todayKey(), streak: todayIndex + 1 }
    saveClaim(next)
    setClaim(next)
    setPopDay(reward.day)
  }

  return (
    <div style={S.screen}>
      <style>{KEYFRAMES}</style>
      <div style={S.vignette} aria-hidden />

      {/* Top bar */}
      <header style={S.topbar}>
        <button style={S.iconBtn} aria-label="Back" onClick={handleBack}>
          ‹
        </button>
        <div style={S.title}>DAILY REWARDS</div>
        <div style={S.currencies}>
          <span style={S.chipCoin}>
            <Cur kind="coin" size={15} />
            {Math.floor(coins).toLocaleString()}
          </span>
          <span style={S.chipGem}>
            <Cur kind="gem" size={15} />
            {gems.toLocaleString()}
          </span>
        </div>
      </header>

      <div style={S.scroll}>
        {/* Hero banner */}
        <div style={S.banner}>
          <div style={S.bannerGlow} aria-hidden />
          <img src={CHEST_URL} alt="" style={S.bannerChest} />
          <div style={S.bannerCopy}>
            <div style={S.bannerTitle}>
              DAY {Math.min(todayIndex + 1, 7)} <span style={S.bannerOf}>/ 7</span>
            </div>
            <div style={S.bannerSub}>
              {canClaim ? 'Your reward is ready — claim it!' : 'Come back tomorrow for more!'}
            </div>
          </div>
        </div>

        {/* 7-chest grid */}
        <div style={S.grid}>
          {REWARDS.map((r, i) => {
            const claimed = !!claim.date && i < todayIndex
            const isToday = i === todayIndex
            const claimable = isToday && canClaim
            const locked = i > todayIndex
            return (
              <ChestCard
                key={r.day}
                reward={r}
                claimed={claimed}
                claimable={claimable}
                isToday={isToday}
                locked={locked}
                wide={r.day === 7}
                popping={popDay === r.day && !reducedMotion}
                reducedMotion={reducedMotion}
              />
            )
          })}
        </div>

        {/* Claim CTA */}
        <button
          style={{
            ...(canClaim ? S.claimBtn : S.claimBtnDisabled),
            ...(canClaim && !reducedMotion ? S.claimBreathe : null),
          }}
          disabled={!canClaim}
          onClick={handleClaim}
        >
          {canClaim ? (
            <>
              <span style={S.claimMain}>CLAIM DAY {todayIndex + 1}</span>
              <span style={S.claimRewardInline}>
                <Cur kind="coin" size={14} />
                {todayReward.coins.toLocaleString()}
                {todayReward.gems > 0 ? (
                  <>
                    <Cur kind="gem" size={14} />
                    {todayReward.gems}
                  </>
                ) : null}
              </span>
            </>
          ) : (
            'COME BACK TOMORROW'
          )}
        </button>

        <p style={S.footnote}>Log in daily to keep your streak. Miss a day and it resets to Day 1.</p>
      </div>
    </div>
  )
}

/* ───────────────────────────── Chest card ───────────────────────────── */

interface ChestCardProps {
  reward: DailyReward
  claimed: boolean
  claimable: boolean
  isToday: boolean
  locked: boolean
  wide: boolean
  popping: boolean
  reducedMotion: boolean
}

function ChestCard({
  reward,
  claimed,
  claimable,
  isToday,
  locked,
  wide,
  popping,
  reducedMotion,
}: ChestCardProps) {
  const cardStyle: CSSProperties = {
    ...S.chest,
    ...(wide ? S.chestWide : null),
    ...(reward.premium ? S.chestPremium : null),
    ...(claimable ? S.chestClaimable : null),
    ...(claimed ? S.chestClaimed : null),
    ...(locked ? S.chestLocked : null),
    ...(popping ? S.chestPop : null),
  }

  // Chest art tint by state: bright for claimable, gold for premium, dim/gray otherwise.
  const chestImgStyle: CSSProperties = {
    ...S.chestImg,
    ...(wide ? S.chestImgWide : null),
    ...(claimed ? S.chestImgClaimed : null),
    ...(locked ? S.chestImgLocked : null),
    ...(claimable && !reducedMotion ? S.chestImgBounce : null),
  }

  return (
    <div style={cardStyle}>
      {reward.premium && !claimed && !locked ? <div style={S.premiumTag}>PREMIUM</div> : null}
      <div style={S.dayLabel}>DAY {reward.day}</div>

      <div style={S.chestArt}>
        {claimable ? <div style={{ ...S.chestRing, ...(reducedMotion ? null : S.chestRingPulse) }} aria-hidden /> : null}
        <img src={CHEST_URL} alt="" style={chestImgStyle} />
        {claimed ? <div style={S.claimedTick} aria-hidden>✓</div> : null}
        {locked ? <div style={S.lockBadge} aria-hidden>🔒</div> : null}
      </div>

      <div style={S.rewardRow}>
        <span style={S.rewardCoin}>
          <Cur kind="coin" size={13} />
          {reward.coins.toLocaleString()}
        </span>
        {reward.gems > 0 ? (
          <span style={S.rewardGem}>
            <Cur kind="gem" size={13} />
            {reward.gems}
          </span>
        ) : null}
      </div>

      {isToday && !claimed ? <div style={S.todayPip}>TODAY</div> : null}
    </div>
  )
}

/* ───────────────────────────── Keyframes ───────────────────────────── */

const KEYFRAMES = `
@keyframes tsdRingPulse {
  0%, 100% { transform: scale(1); opacity: .85; }
  50% { transform: scale(1.12); opacity: 1; }
}
@keyframes tsdChestBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
@keyframes tsdClaimBreathe {
  0%, 100% { box-shadow: 0 6px 0 #B85600, 0 10px 20px rgba(255,123,0,0.30), 0 12px 28px rgba(7,3,18,0.55); }
  50% { box-shadow: 0 6px 0 #B85600, 0 10px 26px rgba(255,123,0,0.65), 0 12px 30px rgba(7,3,18,0.6); }
}
`

/* ───────────────────────────── Styles ───────────────────────────── */

const S: Record<string, CSSProperties> = {
  screen: {
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: 'radial-gradient(120% 85% at 50% 18%, #321C6E 0%, #1A0F3D 45%, #0B0518 100%)',
    color: '#F2ECFF',
    fontFamily: 'Inter, system-ui, sans-serif',
    overflow: 'hidden',
  },
  vignette: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    background: 'radial-gradient(110% 90% at 50% 42%, transparent 55%, rgba(11,5,24,0.85) 100%)',
  },
  topbar: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '14px 16px 8px',
  },
  iconBtn: {
    width: 40,
    height: 40,
    flexShrink: 0,
    borderRadius: 12,
    border: '1px solid rgba(177,76,255,0.22)',
    background: 'rgba(40,24,84,0.72)',
    color: '#F2ECFF',
    fontSize: 26,
    lineHeight: '36px',
    cursor: 'pointer',
  },
  title: {
    fontFamily: 'Cinzel, Georgia, serif',
    fontWeight: 800,
    fontSize: 20,
    letterSpacing: '0.06em',
    color: '#FFD27A',
    textShadow: '0 0 14px rgba(255,210,122,0.55)',
  },
  currencies: { marginLeft: 'auto', display: 'flex', gap: 6 },
  chipCoin: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '5px 10px 5px 8px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    color: '#FFD27A',
    background: 'rgba(28,16,62,0.92)',
    border: '1px solid rgba(255,210,122,0.28)',
  },
  chipGem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '5px 10px 5px 8px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    color: '#5CC8FF',
    background: 'rgba(28,16,62,0.92)',
    border: '1px solid rgba(63,224,255,0.30)',
  },
  scroll: {
    position: 'relative',
    zIndex: 1,
    flex: 1,
    overflowY: 'auto',
    padding: '8px 16px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },

  banner: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 22,
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    background: 'linear-gradient(100deg, #5A1FB8, #B14CFF 50%, #FF7B00)',
    boxShadow: '0 12px 32px rgba(7,3,18,0.62)',
  },
  bannerGlow: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(60% 120% at 85% -10%, rgba(255,255,255,0.35), transparent 60%)',
    pointerEvents: 'none',
  },
  bannerChest: {
    position: 'relative',
    width: 58,
    height: 58,
    objectFit: 'contain',
    filter: 'drop-shadow(0 4px 10px rgba(7,3,18,0.6)) drop-shadow(0 0 12px rgba(255,210,122,0.5))',
  },
  bannerCopy: { position: 'relative' },
  bannerTitle: {
    fontFamily: 'Cinzel, Georgia, serif',
    fontWeight: 800,
    fontSize: 26,
    color: '#FFFFFF',
    textShadow: '0 2px 6px rgba(7,3,18,0.5)',
  },
  bannerOf: { color: 'rgba(255,255,255,0.7)', fontSize: 18 },
  bannerSub: { fontSize: 13, color: 'rgba(255,255,255,0.92)', fontWeight: 600 },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
  },
  chest: {
    position: 'relative',
    borderRadius: 16,
    padding: '12px 8px 10px',
    background: 'linear-gradient(180deg, rgba(54,34,110,0.6), rgba(28,16,62,0.92))',
    border: '1px solid rgba(177,76,255,0.22)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 6px 16px rgba(7,3,18,0.55)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    minHeight: 124,
    transition: 'transform 160ms cubic-bezier(0.22,1,0.36,1)',
  },
  chestWide: { gridColumn: 'span 3' },
  chestPremium: {
    background: 'linear-gradient(160deg, rgba(120,46,210,0.7), rgba(28,16,62,0.92))',
    border: '1px solid rgba(255,210,122,0.45)',
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.14), 0 8px 22px rgba(7,3,18,0.6), 0 0 18px rgba(255,179,71,0.25)',
  },
  chestClaimable: {
    background: 'linear-gradient(180deg, rgba(70,40,140,0.95), rgba(40,22,90,0.95))',
    border: '2px solid #FFB347',
    boxShadow:
      '0 0 0 2px rgba(255,179,71,0.35), 0 0 24px rgba(255,123,0,0.55), 0 10px 24px rgba(7,3,18,0.6)',
    transform: 'translateY(-3px)',
  },
  chestClaimed: {
    background: 'rgba(28,16,62,0.55)',
    border: '1px solid rgba(94,224,138,0.30)',
    opacity: 0.78,
    boxShadow: 'none',
  },
  chestLocked: {
    background: 'rgba(20,12,40,0.7)',
    border: '1px solid rgba(120,108,170,0.18)',
    boxShadow: 'none',
  },
  chestPop: { transform: 'scale(1.08) translateY(-2px)' },

  premiumTag: {
    position: 'absolute',
    top: 6,
    right: 6,
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: '0.06em',
    padding: '2px 6px',
    borderRadius: 6,
    color: '#1A0E33',
    background: 'linear-gradient(180deg, #FFF3C4, #FFD27A 60%, #FF9E2C)',
    boxShadow: '0 0 10px rgba(255,210,122,0.6)',
    zIndex: 2,
  },
  dayLabel: {
    fontFamily: 'Cinzel, Georgia, serif',
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: '0.06em',
    color: '#B9AEDC',
  },
  chestArt: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    height: 52,
  },
  chestImg: {
    position: 'relative',
    width: 48,
    height: 48,
    objectFit: 'contain',
    filter: 'drop-shadow(0 4px 8px rgba(7,3,18,0.55))',
    zIndex: 1,
  },
  chestImgWide: { width: 64, height: 64 },
  chestImgClaimed: { filter: 'grayscale(0.5) brightness(0.85) drop-shadow(0 0 8px rgba(94,224,138,0.5))', opacity: 0.6 },
  chestImgLocked: { filter: 'grayscale(0.9) brightness(0.45)', opacity: 0.5 },
  chestImgBounce: { animation: 'tsdChestBounce 1.4s ease-in-out infinite' },
  chestRing: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: '50%',
    border: '2px solid rgba(255,179,71,0.6)',
    boxShadow: '0 0 18px rgba(255,123,0,0.6)',
    pointerEvents: 'none',
  },
  chestRingPulse: { animation: 'tsdRingPulse 1.6s ease-in-out infinite' },
  claimedTick: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 18,
    height: 18,
    borderRadius: '50%',
    fontSize: 12,
    fontWeight: 800,
    lineHeight: '18px',
    textAlign: 'center',
    color: '#0B2417',
    background: 'linear-gradient(180deg, #8CF0B4, #36C46B)',
    boxShadow: '0 0 8px rgba(94,224,138,0.6)',
    zIndex: 2,
  },
  lockBadge: {
    position: 'absolute',
    fontSize: 18,
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
    zIndex: 2,
  },
  rewardRow: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 8 },
  rewardCoin: { display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 800, color: '#FFD27A' },
  rewardGem: { display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 800, color: '#5CC8FF' },
  todayPip: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: '0.08em',
    color: '#1A0E33',
    background: 'linear-gradient(180deg, #FFE08A, #FFB347)',
    padding: '2px 8px',
    borderRadius: 999,
  },

  claimBtn: {
    width: '100%',
    minHeight: 56,
    border: 'none',
    borderRadius: 16,
    cursor: 'pointer',
    fontFamily: 'Cinzel, Georgia, serif',
    fontWeight: 800,
    fontSize: 18,
    letterSpacing: '0.06em',
    color: '#1A0E33',
    background: 'linear-gradient(180deg, #FFE08A 0%, #FFB347 38%, #FF7B00 100%)',
    boxShadow: '0 6px 0 #B85600, 0 10px 20px rgba(255,123,0,0.30), 0 12px 28px rgba(7,3,18,0.55)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  claimBreathe: { animation: 'tsdClaimBreathe 1.6s ease-in-out infinite' },
  claimMain: { textShadow: '0 1px 0 rgba(255,255,255,0.3)' },
  claimBtnDisabled: {
    width: '100%',
    minHeight: 56,
    border: '1px solid rgba(177,76,255,0.22)',
    borderRadius: 16,
    cursor: 'not-allowed',
    fontFamily: 'Cinzel, Georgia, serif',
    fontWeight: 800,
    fontSize: 16,
    letterSpacing: '0.06em',
    color: '#8478A8',
    background: 'rgba(28,16,62,0.92)',
    boxShadow: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimRewardInline: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    fontFamily: 'Inter, sans-serif',
    fontSize: 13,
    fontWeight: 800,
    color: '#2A1606',
  },

  footnote: {
    margin: 0,
    textAlign: 'center',
    fontSize: 12,
    color: '#8478A8',
  },
}
