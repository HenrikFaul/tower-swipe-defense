import { useMemo, useState, type CSSProperties } from 'react'
import { useGameStore } from '../store/gameStore'
import { assetUrl, UI } from '../lib/assets'

/**
 * BattlePassPremium — AAA-tier Season Battle Pass (cosmetic preview).
 *
 * Faithful to the real bundled asset sheets:
 *  - ui/icon_battlepass.png  → season emblem in the banner.
 *  - ui/icon_chest.png       → reward-chest tiers.
 *  - ui/icons_currency.png   → coin / gem / heart / energy reward + topbar chips,
 *                              sliced from the 2×2 (512²) grid via background-position.
 *
 * Currency sheet grid (col,row): [0,0] gem · [1,0] coin · [0,1] heart · [1,1] energy.
 * Each icon is a square box with background-size:200% 200% and 0%/100% positions.
 *
 * Self-contained: only couples to useGameStore for coins/gems display + go('menu').
 * No engine/data dependency — all pass content is local mock. Strict-TS clean.
 */

type CurKind = 'gem' | 'coin' | 'heart' | 'energy'
type RewardKind = CurKind | 'chest' | 'skin' | 'boost' | 'emote'

interface RewardDef {
  kind: RewardKind
  /** emoji fallback for non-asset reward kinds (skin/boost/emote) */
  glyph?: string
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
  { tier: 1, free: { kind: 'coin', label: '500' }, premium: { kind: 'gem', label: '50' } },
  { tier: 2, free: null, premium: { kind: 'coin', label: '1.2K' } },
  { tier: 3, free: { kind: 'boost', glyph: '⚡', label: 'x2 XP' }, premium: { kind: 'skin', glyph: '🏹', label: 'Archer Skin' } },
  { tier: 4, free: { kind: 'coin', label: '800' }, premium: { kind: 'gem', label: '75' } },
  { tier: 5, free: null, premium: { kind: 'chest', label: 'Rare Crate' } },
  { tier: 6, free: { kind: 'gem', label: '40' }, premium: { kind: 'emote', glyph: '😈', label: 'Shadow Emote' } },
  { tier: 7, free: { kind: 'coin', label: '1K' }, premium: { kind: 'skin', glyph: '🔮', label: 'Mage Skin' } },
  { tier: 8, free: null, premium: { kind: 'energy', label: '+5 ⚡' } },
  { tier: 9, free: { kind: 'heart', label: '+3 ♥' }, premium: { kind: 'gem', label: '120' } },
  { tier: 10, free: { kind: 'chest', label: 'Crate' }, premium: { kind: 'skin', glyph: '🐉', label: 'Dragon Tower' } },
  { tier: 11, free: null, premium: { kind: 'coin', label: '2K' } },
  { tier: 12, free: { kind: 'coin', label: '1.5K' }, premium: { kind: 'gem', label: '90' } },
]

const COLORS = {
  bg700: '#1A0F3D',
  surface1: 'rgba(40, 24, 84, 0.72)',
  surface3: 'rgba(28, 16, 62, 0.92)',
  magenta: '#B14CFF',
  magenta2: '#7B61FF',
  orange: '#FF7B00',
  orange2: '#FFB347',
  gold: '#FFD27A',
  goldDeep: '#B85600',
  cyan: '#3FE0FF',
  text: '#F2ECFF',
  textDim: '#B9AEDC',
  textMute: '#8478A8',
  inkDark: '#1A0E33',
  line: 'rgba(177, 76, 255, 0.22)',
  lineGold: 'rgba(255, 210, 122, 0.28)',
}

// icon_battlepass.png isn't guaranteed to be in the UI map; resolve directly.
const BP_EMBLEM = assetUrl('ui/icon_battlepass.png')

const CUR_SHEET = `url(${assetUrl(UI.currency)})`
// col,row → background-position X Y (0% = first cell, 100% = second cell)
const CUR_POS: Record<CurKind, string> = {
  gem: '0% 0%', // [0,0]
  coin: '100% 0%', // [1,0]
  heart: '0% 100%', // [0,1]
  energy: '100% 100%', // [1,1]
}

/** Sliced currency icon from the real 2×2 sheet. */
function Cur({ kind, size = 22 }: { kind: CurKind; size?: number }) {
  return (
    <i
      aria-hidden
      style={{
        display: 'inline-block',
        flex: '0 0 auto',
        width: size,
        height: size,
        backgroundImage: CUR_SHEET,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '200% 200%',
        backgroundPosition: CUR_POS[kind],
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.55))',
      }}
    />
  )
}

export default function BattlePassPremium() {
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
          <span style={{ ...styles.chip, ...styles.chipCoin }}>
            <Cur kind="coin" size={16} />
            {fmt(coins)}
          </span>
          <span style={{ ...styles.chip, ...styles.chipGem }}>
            <Cur kind="gem" size={16} />
            {fmt(gems)}
          </span>
        </div>
      </header>

      <div style={styles.scroll}>
        {/* ---- Season banner (real battlepass emblem) ---- */}
        <section style={styles.banner}>
          <div style={styles.bannerGlow} />
          <div style={styles.bannerEmblemWrap}>
            <img src={BP_EMBLEM} alt="" style={styles.bannerEmblem} />
          </div>
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
                  <div
                    style={{
                      ...styles.tierNode,
                      ...(claimed ? styles.tierNodeOn : {}),
                      ...(t.tier === CURRENT_TIER ? styles.tierNodeCurrent : {}),
                    }}
                  >
                    {t.tier}
                  </div>

                  <RewardCell reward={t.free} claimed={claimed} prem={false} />
                  <div style={styles.connector} />
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
              <span style={styles.ctaPrice}>
                <Cur kind="gem" size={15} />
                950
              </span>
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
  locked = false,
  prem,
}: {
  reward: RewardDef | null
  claimed: boolean
  locked?: boolean
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
      <span style={{ ...styles.rewardIcon, filter: showLock ? 'grayscale(0.7)' : 'none' }}>
        <RewardArt reward={reward} />
      </span>
      <span style={styles.rewardLabel}>{reward.label}</span>
      {showLock && <span style={styles.rewardLock}>🔒</span>}
      {claimed && <span style={styles.rewardCheck}>✓</span>}
    </div>
  )
}

/** Render the reward visual: real asset for currencies/chest, emoji glyph otherwise. */
function RewardArt({ reward }: { reward: RewardDef }) {
  switch (reward.kind) {
    case 'gem':
    case 'coin':
    case 'heart':
    case 'energy':
      return <Cur kind={reward.kind} size={30} />
    case 'chest':
      return <img src={assetUrl(UI.chest)} alt="" style={styles.chestImg} />
    default:
      return <span style={{ fontSize: 26, lineHeight: 1 }}>{reward.glyph ?? '🎁'}</span>
  }
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
  kicker: { fontSize: 11, letterSpacing: '0.14em', color: COLORS.orange2, fontWeight: 700 },
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
    gap: 5,
    padding: '5px 10px 5px 7px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
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
  bannerEmblemWrap: {
    position: 'relative',
    width: 60,
    height: 60,
    flex: '0 0 auto',
    display: 'grid',
    placeItems: 'center',
  },
  bannerEmblem: {
    width: 60,
    height: 60,
    objectFit: 'contain',
    filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.5))',
  },
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
  progressTier: { fontFamily: "'Cinzel', Georgia, serif", fontSize: 24, fontWeight: 800, color: COLORS.gold },
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
  rowTag: { fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', padding: '4px 10px', borderRadius: 999 },
  rowTagFree: { color: COLORS.cyan, background: 'rgba(63,224,255,0.12)', border: '1px solid rgba(63,224,255,0.30)' },
  rowTagPrem: { color: COLORS.gold, background: 'rgba(255,210,122,0.14)', border: `1px solid ${COLORS.lineGold}` },

  track: { display: 'flex', gap: 10, overflowX: 'auto', padding: '4px 2px 8px', scrollbarWidth: 'thin' },
  column: { flex: '0 0 auto', width: 76, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
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
  tierNodeCurrent: { boxShadow: '0 0 0 2px #FFB347, 0 0 16px rgba(255,123,0,0.55)', color: '#fff' },
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
  rewardIcon: { display: 'grid', placeItems: 'center', height: 32, lineHeight: 1 },
  chestImg: { width: 34, height: 34, objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.55))' },
  rewardLabel: { fontSize: 10, fontWeight: 700, color: COLORS.textDim, lineHeight: 1.05, padding: '0 2px' },
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
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
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
