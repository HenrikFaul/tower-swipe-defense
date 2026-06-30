import { useState, type CSSProperties } from 'react'
import { useGameStore } from '../store/gameStore'

/**
 * DailyRewardsScreen — 7-day escalating reward calendar.
 *
 * Self-contained, no external libs. Matches the Tower Swipe Defense token system
 * (deep purple backgrounds, magenta/orange/gold/cyan accents, additive glow).
 *
 * - `grant` (optional): custom claim handler. Receives the day's reward; if omitted
 *   the screen falls back to the store's `grantDailySpin()` (which adds coins).
 * - `onBack` (optional): override the back action (defaults to go('menu')).
 */
export interface DailyRewardsScreenProps {
  grant?: (reward: DailyReward) => void
  onBack?: () => void
}

export interface DailyReward {
  day: number
  coins: number
  gems: number
  premium: boolean
}

/** Escalating 7-day track. Day 7 is the premium "big chest". */
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

interface ClaimState {
  date: string // YYYY-MM-DD of last claim
  streak: number // 1..7 = current day position (the last claimed day)
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
    // Already claimed today — next claimable day is highlighted but locked.
    return { todayIndex: Math.min(claim.streak, REWARDS.length - 1), canClaim: false }
  }
  if (diff === 1) {
    // Consecutive day: advance, wrapping the 7-day cycle.
    return { todayIndex: claim.streak % REWARDS.length, canClaim: true }
  }
  // Streak broken — restart at day 1.
  return { todayIndex: 0, canClaim: true }
}

export default function DailyRewardsScreen({ grant, onBack }: DailyRewardsScreenProps) {
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
    if (grant) {
      grant(reward)
    } else {
      // Store fallback: grantDailySpin adds a randomized coin amount.
      grantDailySpin()
    }
    const next: ClaimState = { date: todayKey(), streak: todayIndex + 1 }
    saveClaim(next)
    setClaim(next)
    setPopDay(reward.day)
  }

  return (
    <div style={S.screen}>
      <div style={S.vignette} aria-hidden />

      {/* Top bar */}
      <header style={S.topbar}>
        <button style={S.iconBtn} aria-label="Back" onClick={handleBack}>
          ‹
        </button>
        <div style={S.title}>DAILY REWARDS</div>
        <div style={S.currencies}>
          <span style={S.chipCoin}>🪙 {Math.floor(coins).toLocaleString()}</span>
          <span style={S.chipGem}>💎 {gems.toLocaleString()}</span>
        </div>
      </header>

      <div style={S.scroll}>
        {/* Hero banner */}
        <div style={S.banner}>
          <div style={S.bannerGlow} aria-hidden />
          <div style={S.bannerRow}>
            <span style={S.bannerEmoji}>🎁</span>
            <div>
              <div style={S.bannerTitle}>
                DAY {Math.min(todayIndex + 1, 7)} <span style={S.bannerOf}>/ 7</span>
              </div>
              <div style={S.bannerSub}>
                {canClaim ? 'Your reward is ready — claim it!' : 'Come back tomorrow for more!'}
              </div>
            </div>
          </div>
        </div>

        {/* 7-chest grid */}
        <div style={S.grid}>
          {REWARDS.map((r, i) => {
            const claimed = !!claim.date && i < todayIndex
            const isToday = i === todayIndex
            const claimable = isToday && canClaim
            return (
              <ChestCard
                key={r.day}
                reward={r}
                claimed={claimed}
                claimable={claimable}
                isToday={isToday}
                wide={r.day === 7}
                popping={popDay === r.day && !reducedMotion}
              />
            )
          })}
        </div>

        {/* Claim CTA */}
        <button
          style={canClaim ? S.claimBtn : S.claimBtnDisabled}
          disabled={!canClaim}
          onClick={handleClaim}
        >
          {canClaim ? (
            <>
              CLAIM DAY {todayIndex + 1}
              <span style={S.claimRewardInline}>
                🪙 {todayReward.coins.toLocaleString()}
                {todayReward.gems > 0 ? `  💎 ${todayReward.gems}` : ''}
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
  wide: boolean
  popping: boolean
}

function ChestCard({ reward, claimed, claimable, isToday, wide, popping }: ChestCardProps) {
  const cardStyle: CSSProperties = {
    ...S.chest,
    ...(wide ? S.chestWide : null),
    ...(reward.premium ? S.chestPremium : null),
    ...(claimable ? S.chestClaimable : null),
    ...(claimed ? S.chestClaimed : null),
    ...(popping ? S.chestPop : null),
  }

  const chestEmoji = reward.premium ? '🏆' : '🎁'

  return (
    <div style={cardStyle}>
      {reward.premium && !claimed ? <div style={S.premiumTag}>PREMIUM</div> : null}
      <div style={S.dayLabel}>DAY {reward.day}</div>

      <div style={S.chestArt}>
        <span style={claimed ? S.chestIconClaimed : S.chestIcon}>{claimed ? '✅' : chestEmoji}</span>
        {claimable ? <div style={S.chestRing} aria-hidden /> : null}
      </div>

      <div style={S.rewardRow}>
        <span style={S.rewardCoin}>🪙 {reward.coins.toLocaleString()}</span>
        {reward.gems > 0 ? <span style={S.rewardGem}>💎 {reward.gems}</span> : null}
      </div>

      {isToday && !claimed ? <div style={S.todayPip}>TODAY</div> : null}
    </div>
  )
}

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
    gap: 4,
    padding: '5px 9px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    color: '#FFD27A',
    background: 'rgba(28,16,62,0.92)',
    border: '1px solid rgba(255,210,122,0.28)',
  },
  chipGem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '5px 9px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
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
    padding: '16px 18px',
    background: 'linear-gradient(100deg, #5A1FB8, #B14CFF 50%, #FF7B00)',
    boxShadow: '0 12px 32px rgba(7,3,18,0.62)',
  },
  bannerGlow: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(60% 120% at 85% -10%, rgba(255,255,255,0.35), transparent 60%)',
    pointerEvents: 'none',
  },
  bannerRow: { position: 'relative', display: 'flex', alignItems: 'center', gap: 14 },
  bannerEmoji: { fontSize: 40, filter: 'drop-shadow(0 0 10px rgba(255,210,122,0.7))' },
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
    background: 'rgba(40,24,84,0.72)',
    border: '1px solid rgba(177,76,255,0.22)',
    boxShadow: '0 6px 16px rgba(7,3,18,0.55)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    minHeight: 112,
    transition: 'transform 160ms cubic-bezier(0.22,1,0.36,1)',
  },
  chestWide: { gridColumn: 'span 3' },
  chestPremium: {
    background: 'linear-gradient(160deg, rgba(90,31,184,0.65), rgba(28,16,62,0.92))',
    border: '1px solid rgba(255,210,122,0.45)',
    boxShadow: '0 8px 22px rgba(7,3,18,0.6), 0 0 18px rgba(255,179,71,0.25)',
  },
  chestClaimable: {
    background: 'rgba(54,34,110,0.92)',
    border: '2px solid #FFB347',
    boxShadow: '0 0 0 2px rgba(255,179,71,0.35), 0 0 22px rgba(255,123,0,0.55), 0 10px 24px rgba(7,3,18,0.6)',
    transform: 'translateY(-2px)',
  },
  chestClaimed: {
    background: 'rgba(28,16,62,0.6)',
    border: '1px solid rgba(94,224,138,0.30)',
    opacity: 0.7,
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
  },
  dayLabel: {
    fontFamily: 'Cinzel, Georgia, serif',
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: '0.06em',
    color: '#B9AEDC',
  },
  chestArt: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  chestIcon: { fontSize: 36, filter: 'drop-shadow(0 4px 8px rgba(7,3,18,0.5))' },
  chestIconClaimed: { fontSize: 32, filter: 'drop-shadow(0 0 8px rgba(94,224,138,0.6))' },
  chestRing: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: '50%',
    border: '2px solid rgba(255,179,71,0.55)',
    boxShadow: '0 0 16px rgba(255,123,0,0.55)',
    pointerEvents: 'none',
  },
  rewardRow: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6 },
  rewardCoin: { fontSize: 12, fontWeight: 700, color: '#FFD27A' },
  rewardGem: { fontSize: 12, fontWeight: 700, color: '#5CC8FF' },
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
    gap: 2,
  },
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
  },
  claimRewardInline: { fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700, opacity: 0.9 },

  footnote: {
    margin: 0,
    textAlign: 'center',
    fontSize: 12,
    color: '#8478A8',
  },
}
