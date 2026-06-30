import { useMemo, useState, type CSSProperties } from 'react'
import { useGameStore } from '../store/gameStore'

/**
 * BattlePassScreen — Season 4 "Shadow Invasion" Battle Pass (cosmetic/mock).
 *
 * - Tier progress bar (current / max) with XP fill.
 * - Horizontal track of reward tiers: FREE row + PREMIUM row.
 * - Reward icons: coins / gems / skins / chests / boosts.
 * - Glossy "ACTIVATE PASS" CTA.
 *
 * Self-contained: only depends on useGameStore for coins/gems display and go('menu').
 * No engine/data coupling — all pass data is local mock content.
 */

type RewardKind = 'coins' | 'gems' | 'skin' | 'chest' | 'boost' | 'emote'

interface RewardDef {
  kind: RewardKind
  icon: string
  label: string
}

interface TierDef {
  tier: number
  free: RewardDef | null
  premium: RewardDef
}

const SEASON_NAME = 'SHADOW INVASION'
const SEASON_NUM = 4
const CURRENT_TIER = 6
const MAX_TIER = 30
const XP_INTO_TIER = 650
const XP_PER_TIER = 1000

const TRACK: TierDef[] = [
  { tier: 1, free: { kind: 'coins', icon: '🪙', label: '500' }, premium: { kind: 'gems', icon: '💎', label: '50' } },
  { tier: 2, free: null, premium: { kind: 'coins', icon: '🪙', label: '1.2K' } },
  { tier: 3, free: { kind: 'boost', icon: '⚡', label: 'x2 XP' }, premium: { kind: 'skin', icon: '🏹', label: 'Archer Skin' } },
  { tier: 4, free: { kind: 'coins', icon: '🪙', label: '800' }, premium: { kind: 'gems', icon: '💎', label: '75' } },
  { tier: 5, free: null, premium: { kind: 'chest', icon: '🎁', label: 'Rare Crate' } },
  { tier: 6, free: { kind: 'gems', icon: '💎', label: '40' }, premium: { kind: 'emote', icon: '😈', label: 'Shadow Emote' } },
  { tier: 7, free: { kind: 'coins', icon: '🪙', label: '1K' }, premium: { kind: 'skin', icon: '🔮', label: 'Mage Skin' } },
  { tier: 8, free: null, premium: { kind: 'boost', icon: '⚡', label: 'x3 Coins' } },
  { tier: 9, free: { kind: 'gems', icon: '💎', label: '60' }, premium: { kind: 'gems', icon: '💎', label: '120' } },
  { tier: 10, free: { kind: 'chest', icon: '🎁', label: 'Crate' }, premium: { kind: 'skin', icon: '🐉', label: 'Dragon Tower' } },
  { tier: 11, free: null, premium: { kind: 'coins', icon: '🪙', label: '2K' } },
  { tier: 12, free: { kind: 'coins', icon: '🪙', label: '1.5K' }, premium: { kind: 'gems', icon: '💎', label: '90' } },
]

const COLORS = {
  bg700: '#1A0F3D',
  bg600: '#241452',
  bg500: '#321C6E',
  surface1: 'rgba(40, 24, 84, 0.72)',
  surface2: 'rgba(54, 34, 110, 0.85)',
  surface3: 'rgba(28, 16, 62, 0.92)',
  magenta: '#B14CFF',
  magenta2: '#7B61FF',
  magentaDeep: '#5A1FB8',
  orange: '#FF7B00',
  orange2: '#FFB347',
  gold: '#FFD27A',
  goldDeep: '#B85600',
  cyan: '#3FE0FF',
  text: '#F2ECFF',
  textDim: '#B9AEDC',
  textMute: '#8478A8',
  inkDark: '#1A0E33',
  locked: '#5A5476',
  line: 'rgba(177, 76, 255, 0.22)',
  lineGold: 'rgba(255, 210, 122, 0.28)',
}

export default function BattlePassScreen() {
  const go = useGameStore((s) => s.go)
  const coins = useGameStore((s) => s.meta.coins)
  const gems = useGameStore((s) => s.meta.gems)
  const reducedMotion = useGameStore((s) => s.settings.reducedMotion)

  const [activated, setActivated] = useState(false)

  const progressPct = useMemo(() => {
    const tierFrac = (CURRENT_TIER - 1 + XP_INTO_TIER / XP_PER_TIER) / MAX_TIER
    return Math.max(0, Math.min(1, tierFrac)) * 100
  }, [])

  return (
    <div style={styles.screen}>
      {/* ---- Top bar ---- */}
      <header style={styles.topBar}>
        <button style={styles.backBtn} onClick={() => go('menu')} aria-label="Back to menu">
          ‹
        </button>
        <div style={styles.topTitleWrap}>
          <span style={styles.kicker}>SEASON {SEASON_NUM}</span>
          <span style={styles.title}>BATTLE PASS</span>
        </div>
        <div style={styles.currencies}>
          <span style={{ ...styles.chip, ...styles.chipCoin }}>🪙 {fmt(coins)}</span>
          <span style={{ ...styles.chip, ...styles.chipGem }}>💎 {fmt(gems)}</span>
        </div>
      </header>

      <div style={styles.scroll}>
        {/* ---- Season banner ---- */}
        <section style={styles.banner}>
          <div style={styles.bannerGlow} />
          <div style={styles.bannerIcon}>👹</div>
          <div style={styles.bannerText}>
            <div style={styles.bannerName}>{SEASON_NAME}</div>
            <div style={styles.bannerSub}>Ends in 18d 04h · Climb the shadow ranks</div>
          </div>
          <div style={styles.bannerTimer}>18d</div>
        </section>

        {/* ---- Tier progress ---- */}
        <section style={styles.progressCard}>
          <div style={styles.progressHead}>
            <span style={styles.progressLabel}>TIER PROGRESS</span>
            <span style={styles.progressTier}>
              {CURRENT_TIER}
              <span style={styles.progressTierMax}> / {MAX_TIER}</span>
            </span>
          </div>
          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progressPct}%`,
                transition: reducedMotion ? 'none' : 'width 600ms cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <div style={styles.progressGloss} />
            </div>
            <span style={styles.progressXp}>
              {XP_INTO_TIER} / {XP_PER_TIER} XP
            </span>
          </div>
        </section>

        {/* ---- Reward track ---- */}
        <section style={styles.trackSection}>
          <div style={styles.rowLabels}>
            <span style={{ ...styles.rowTag, ...styles.rowTagFree }}>FREE</span>
            <span style={{ ...styles.rowTag, ...styles.rowTagPrem }}>PREMIUM ✦</span>
          </div>

          <div style={styles.track}>
            {TRACK.map((t) => {
              const claimed = t.tier <= CURRENT_TIER
              return (
                <div key={t.tier} style={styles.column}>
                  {/* tier number node */}
                  <div
                    style={{
                      ...styles.tierNode,
                      ...(claimed ? styles.tierNodeOn : {}),
                      ...(t.tier === CURRENT_TIER ? styles.tierNodeCurrent : {}),
                    }}
                  >
                    {t.tier}
                  </div>

                  {/* FREE reward */}
                  <RewardCell reward={t.free} claimed={claimed} locked={false} prem={false} />

                  {/* connector */}
                  <div style={styles.connector} />

                  {/* PREMIUM reward */}
                  <RewardCell reward={t.premium} claimed={claimed && activated} locked={!activated} prem />
                </div>
              )
            })}
          </div>
        </section>

        {/* ---- CTA ---- */}
        <section style={styles.ctaWrap}>
          {activated ? (
            <div style={styles.activeBadge}>✓ PREMIUM PASS ACTIVE</div>
          ) : (
            <button style={styles.cta} onClick={() => setActivated(true)}>
              <span style={styles.ctaGloss} />
              <span style={styles.ctaText}>ACTIVATE PASS</span>
              <span style={styles.ctaPrice}>💎 950</span>
            </button>
          )}
          <p style={styles.ctaNote}>Unlock all premium rewards & +20% season XP. Cosmetic preview.</p>
        </section>
      </div>
    </div>
  )
}

function RewardCell({
  reward,
  claimed,
  locked,
  prem,
}: {
  reward: RewardDef | null
  claimed: boolean
  locked: boolean
  prem: boolean
}) {
  if (!reward) {
    return <div style={{ ...styles.rewardCell, ...styles.rewardEmpty }}>—</div>
  }
  const accent = prem ? COLORS.gold : COLORS.cyan
  const showLock = prem && locked
  return (
    <div
      style={{
        ...styles.rewardCell,
        borderColor: claimed ? accent : prem ? COLORS.lineGold : COLORS.line,
        background: claimed
          ? prem
            ? 'rgba(255, 210, 122, 0.16)'
            : 'rgba(63, 224, 255, 0.14)'
          : COLORS.surface3,
        boxShadow: claimed ? `0 0 14px ${prem ? 'rgba(255,210,122,0.5)' : 'rgba(63,224,255,0.45)'}` : 'none',
        opacity: showLock ? 0.55 : 1,
      }}
    >
      <span style={{ ...styles.rewardIcon, filter: showLock ? 'grayscale(0.7)' : 'none' }}>{reward.icon}</span>
      <span style={styles.rewardLabel}>{reward.label}</span>
      {showLock && <span style={styles.rewardLock}>🔒</span>}
      {claimed && <span style={styles.rewardCheck}>✓</span>}
    </div>
  )
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}

const styles: Record<string, CSSProperties> = {
  screen: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    background: 'radial-gradient(120% 85% at 50% 18%, #321C6E 0%, #1A0F3D 45%, #0B0518 100%)',
    color: COLORS.text,
    fontFamily: "'Inter', system-ui, sans-serif",
    overflow: 'hidden',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 14px',
    borderBottom: `1px solid ${COLORS.line}`,
    background: 'rgba(18, 10, 42, 0.6)',
  },
  backBtn: {
    width: 40,
    height: 40,
    flex: '0 0 auto',
    borderRadius: 14,
    border: `1px solid ${COLORS.line}`,
    background: COLORS.surface1,
    color: COLORS.text,
    fontSize: 26,
    lineHeight: '34px',
    cursor: 'pointer',
  },
  topTitleWrap: { display: 'flex', flexDirection: 'column', flex: '1 1 auto', minWidth: 0 },
  kicker: {
    fontSize: 11,
    letterSpacing: '0.14em',
    color: COLORS.orange2,
    fontWeight: 700,
  },
  title: {
    fontFamily: "'Cinzel', Georgia, serif",
    fontSize: 20,
    fontWeight: 800,
    letterSpacing: '0.04em',
    lineHeight: 1.05,
  },
  currencies: { display: 'flex', gap: 6, flex: '0 0 auto' },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '5px 9px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums',
    border: `1px solid ${COLORS.line}`,
    background: COLORS.surface3,
  },
  chipCoin: { color: COLORS.gold, borderColor: COLORS.lineGold },
  chipGem: { color: COLORS.cyan, borderColor: 'rgba(63,224,255,0.30)' },

  scroll: {
    flex: 1,
    overflowY: 'auto',
    padding: '14px 14px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },

  banner: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 16px',
    borderRadius: 18,
    overflow: 'hidden',
    background: 'linear-gradient(100deg, #5A1FB8, #B14CFF 50%, #FF7B00)',
    boxShadow: '0 12px 32px rgba(7,3,18,0.62)',
  },
  bannerGlow: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(80% 120% at 18% 30%, rgba(255,255,255,0.28), transparent 60%)',
    pointerEvents: 'none',
  },
  bannerIcon: { fontSize: 38, filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.4))' },
  bannerText: { flex: 1, minWidth: 0, position: 'relative' },
  bannerName: {
    fontFamily: "'Cinzel', Georgia, serif",
    fontSize: 19,
    fontWeight: 800,
    letterSpacing: '0.05em',
    textShadow: '0 2px 6px rgba(0,0,0,0.45)',
  },
  bannerSub: { fontSize: 12, color: 'rgba(242,236,255,0.85)', marginTop: 2 },
  bannerTimer: {
    position: 'relative',
    padding: '6px 12px',
    borderRadius: 999,
    background: 'rgba(11,5,24,0.5)',
    border: '1px solid rgba(255,255,255,0.25)',
    fontWeight: 800,
    fontSize: 13,
    color: COLORS.gold,
  },

  progressCard: {
    padding: 14,
    borderRadius: 16,
    background: COLORS.surface1,
    border: `1px solid ${COLORS.line}`,
    boxShadow: '0 6px 16px rgba(7,3,18,0.55)',
  },
  progressHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 },
  progressLabel: { fontSize: 12, letterSpacing: '0.1em', color: COLORS.textDim, fontWeight: 700 },
  progressTier: {
    fontFamily: "'Cinzel', Georgia, serif",
    fontSize: 24,
    fontWeight: 800,
    color: COLORS.gold,
  },
  progressTierMax: { fontSize: 16, color: COLORS.textMute },
  progressTrack: {
    position: 'relative',
    height: 22,
    borderRadius: 999,
    background: COLORS.surface3,
    border: `1px solid ${COLORS.line}`,
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    insetBlock: 0,
    left: 0,
    borderRadius: 999,
    background: 'linear-gradient(90deg, #7B61FF, #B14CFF, #E07BFF)',
    boxShadow: '0 0 14px rgba(177,76,255,0.7)',
  },
  progressGloss: {
    position: 'absolute',
    top: 2,
    left: 6,
    right: 6,
    height: 7,
    borderRadius: 999,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.45), rgba(255,255,255,0))',
  },
  progressXp: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    color: '#fff',
    textShadow: '0 1px 3px rgba(0,0,0,0.6)',
    fontVariantNumeric: 'tabular-nums',
  },

  trackSection: { display: 'flex', flexDirection: 'column', gap: 8 },
  rowLabels: { display: 'flex', gap: 8 },
  rowTag: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.08em',
    padding: '4px 10px',
    borderRadius: 999,
  },
  rowTagFree: { color: COLORS.cyan, background: 'rgba(63,224,255,0.12)', border: '1px solid rgba(63,224,255,0.30)' },
  rowTagPrem: { color: COLORS.gold, background: 'rgba(255,210,122,0.14)', border: `1px solid ${COLORS.lineGold}` },

  track: {
    display: 'flex',
    gap: 10,
    overflowX: 'auto',
    padding: '4px 2px 8px',
    scrollbarWidth: 'thin',
  },
  column: {
    flex: '0 0 auto',
    width: 76,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  tierNode: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 800,
    background: COLORS.surface3,
    border: `1px solid ${COLORS.line}`,
    color: COLORS.textDim,
  },
  tierNodeOn: {
    background: 'linear-gradient(180deg, #C77BFF, #7A2FD6)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.25)',
  },
  tierNodeCurrent: {
    boxShadow: '0 0 0 2px #FFB347, 0 0 16px rgba(255,123,0,0.55)',
    color: '#fff',
  },
  connector: { width: 2, height: 8, background: COLORS.line, borderRadius: 2 },

  rewardCell: {
    width: 72,
    height: 72,
    borderRadius: 14,
    border: `1px solid ${COLORS.line}`,
    background: COLORS.surface3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    position: 'relative',
    textAlign: 'center',
  },
  rewardEmpty: { color: COLORS.textMute, fontSize: 18, borderStyle: 'dashed' },
  rewardIcon: { fontSize: 26, lineHeight: 1 },
  rewardLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.textDim,
    lineHeight: 1.05,
    padding: '0 2px',
  },
  rewardLock: { position: 'absolute', bottom: 3, right: 4, fontSize: 11 },
  rewardCheck: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: '#5EE08A',
    color: '#06270f',
    fontSize: 11,
    fontWeight: 900,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 10px rgba(94,224,138,0.7)',
  },

  ctaWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 4 },
  cta: {
    position: 'relative',
    width: '100%',
    maxWidth: 360,
    minHeight: 56,
    border: 'none',
    borderRadius: 16,
    cursor: 'pointer',
    background: 'linear-gradient(180deg, #FFE08A 0%, #FFB347 38%, #FF7B00 100%)',
    boxShadow: '0 6px 0 #B85600, 0 10px 20px rgba(255,123,0,0.30), 0 12px 28px rgba(7,3,18,0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    overflow: 'hidden',
  },
  ctaGloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0))',
    pointerEvents: 'none',
  },
  ctaText: {
    position: 'relative',
    fontFamily: "'Cinzel', Georgia, serif",
    fontSize: 19,
    fontWeight: 800,
    letterSpacing: '0.06em',
    color: COLORS.inkDark,
  },
  ctaPrice: {
    position: 'relative',
    fontSize: 14,
    fontWeight: 800,
    color: COLORS.inkDark,
    background: 'rgba(255,255,255,0.35)',
    padding: '4px 10px',
    borderRadius: 999,
  },
  activeBadge: {
    width: '100%',
    maxWidth: 360,
    minHeight: 52,
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    letterSpacing: '0.06em',
    color: '#5EE08A',
    background: 'rgba(94,224,138,0.12)',
    border: '1px solid rgba(94,224,138,0.45)',
    boxShadow: '0 0 16px rgba(94,224,138,0.4)',
  },
  ctaNote: { fontSize: 11, color: COLORS.textMute, textAlign: 'center', margin: 0 },
}
