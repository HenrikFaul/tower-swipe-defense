import { useMemo, type CSSProperties } from 'react'
import { useGameStore } from '../store/gameStore'

/**
 * WorldMapScreen — chapter select.
 * Five chapters along a winding path, each with star progress; the final
 * Dark Fortress is locked. Tapping an unlocked chapter starts a run with a
 * deterministic per-chapter seed. Back button returns to the menu.
 *
 * Self-contained: relies only on useGameStore (go, startRun) and the global
 * design tokens. Faithful to the deep-purple / magenta-orange-cyan palette.
 */

type ChapterTheme = 'forest' | 'desert' | 'frozen' | 'volcano' | 'dark'

interface Chapter {
  id: string
  name: string
  icon: string
  theme: ChapterTheme
  total: number
  cleared: number
  /** stable seed offset used for startRun */
  seed: number
}

/** Accent colors per chapter theme, drawn from the brand token palette. */
const THEME: Record<ChapterTheme, { core: string; deep: string; glow: string }> = {
  forest: { core: '#5EE08A', deep: '#1E7A45', glow: 'rgba(94,224,138,0.65)' },
  desert: { core: '#FFD27A', deep: '#B85600', glow: 'rgba(255,210,122,0.65)' },
  frozen: { core: '#3FE0FF', deep: '#1B7FA8', glow: 'rgba(63,224,255,0.65)' },
  volcano: { core: '#FF7B00', deep: '#9A2A1E', glow: 'rgba(255,123,0,0.7)' },
  dark: { core: '#B14CFF', deep: '#5A1FB8', glow: 'rgba(177,76,255,0.65)' },
}

const CHAPTERS: Chapter[] = [
  { id: 'forest', name: 'Green Forest', icon: '🌲', theme: 'forest', total: 30, cleared: 30, seed: 1001 },
  { id: 'desert', name: 'Desert Ruins', icon: '🏜️', theme: 'desert', total: 30, cleared: 30, seed: 2002 },
  { id: 'frozen', name: 'Frozen Peaks', icon: '🏔️', theme: 'frozen', total: 30, cleared: 30, seed: 3003 },
  { id: 'volcano', name: 'Volcano Land', icon: '🌋', theme: 'volcano', total: 30, cleared: 20, seed: 4004 },
  { id: 'dark', name: 'Dark Fortress', icon: '🏰', theme: 'dark', total: 30, cleared: 0, seed: 5005 },
]

/** Horizontal offset (%) per node to create the winding S-path. */
const PATH_X = [22, 70, 28, 66, 42]

function starsForChapter(c: Chapter): number {
  if (c.total <= 0) return 0
  const ratio = c.cleared / c.total
  return Math.max(0, Math.min(3, Math.round(ratio * 3)))
}

export interface WorldMapScreenProps {
  /** Optional callback when a chapter is chosen; falls back to startRun. */
  onChapter?: (chapter: Chapter) => void
}

export default function WorldMapScreen({ onChapter }: WorldMapScreenProps) {
  const go = useGameStore((s) => s.go)
  const startRun = useGameStore((s) => s.startRun)
  const bestWave = useGameStore((s) => s.meta.bestWave)

  // First chapter is always playable; each later chapter unlocks once the
  // previous one has any progress. Dark Fortress requires every prior chapter
  // fully cleared.
  const unlocked = useMemo<boolean[]>(() => {
    const out: boolean[] = []
    for (let i = 0; i < CHAPTERS.length; i++) {
      if (i === 0) {
        out.push(true)
        continue
      }
      const prev = CHAPTERS[i - 1]
      if (CHAPTERS[i].theme === 'dark') {
        out.push(CHAPTERS.slice(0, i).every((c) => c.cleared >= c.total))
      } else {
        out.push(prev.cleared > 0)
      }
    }
    return out
  }, [])

  function launch(chapter: Chapter) {
    if (onChapter) {
      onChapter(chapter)
      return
    }
    startRun({ mode: 'normal', seed: chapter.seed })
  }

  const totalCleared = CHAPTERS.reduce((a, c) => a + c.cleared, 0)
  const grandTotal = CHAPTERS.reduce((a, c) => a + c.total, 0)

  return (
    <div style={S.screen}>
      {/* ambient floating glows */}
      <div style={{ ...S.orb, ...S.orbA }} aria-hidden />
      <div style={{ ...S.orb, ...S.orbB }} aria-hidden />

      {/* header */}
      <header style={S.header}>
        <button
          style={S.backBtn}
          aria-label="Back to menu"
          onClick={() => go('menu')}
        >
          ‹
        </button>
        <div style={S.titleWrap}>
          <h1 style={S.title}>WORLD MAP</h1>
          <span style={S.subtitle}>SELECT A CHAPTER</span>
        </div>
        <div style={S.progressPill}>
          <span style={S.progressIcon}>⭐</span>
          <span style={S.progressTxt}>
            {totalCleared}
            <span style={S.progressDim}>/{grandTotal}</span>
          </span>
        </div>
      </header>

      {/* scrollable map */}
      <div style={S.scroll}>
        <div style={S.map}>
          <PathSvg />
          {CHAPTERS.map((c, i) => {
            const open = unlocked[i]
            const stars = starsForChapter(c)
            const t = THEME[c.theme]
            const isLast = i === CHAPTERS.length - 1
            return (
              <div
                key={c.id}
                style={{
                  ...S.nodeRow,
                  left: `${PATH_X[i]}%`,
                  top: `${8 + i * 18}%`,
                }}
              >
                <button
                  style={{
                    ...S.node,
                    background: open
                      ? `radial-gradient(circle at 35% 28%, ${t.core} 0%, ${t.deep} 78%)`
                      : 'radial-gradient(circle at 35% 28%, #3a335a 0%, #211a3d 80%)',
                    borderColor: open ? t.core : 'rgba(242,236,255,0.12)',
                    boxShadow: open
                      ? `0 0 0 4px rgba(11,5,24,0.55), 0 0 22px ${t.glow}, 0 10px 24px rgba(7,3,18,0.6)`
                      : '0 0 0 4px rgba(11,5,24,0.55), 0 8px 18px rgba(7,3,18,0.6)',
                    cursor: open ? 'pointer' : 'not-allowed',
                    opacity: open ? 1 : 0.92,
                  }}
                  disabled={!open}
                  aria-label={open ? `Play ${c.name}` : `${c.name} (locked)`}
                  onClick={() => open && launch(c)}
                >
                  <span style={{ ...S.nodeIcon, filter: open ? 'none' : 'grayscale(1)' }}>
                    {open ? c.icon : '🔒'}
                  </span>
                  {open && (
                    <span style={S.chapNum}>{i + 1}</span>
                  )}
                </button>

                <div
                  style={{
                    ...S.card,
                    borderColor: open ? `${t.core}55` : 'rgba(242,236,255,0.10)',
                    ...(open ? {} : S.cardLocked),
                  }}
                >
                  <div style={S.cardName}>{c.name}</div>
                  {open ? (
                    <>
                      <div style={S.stars}>
                        {[0, 1, 2].map((s) => (
                          <span
                            key={s}
                            style={{
                              ...S.star,
                              color: s < stars ? '#FFD27A' : 'rgba(242,236,255,0.18)',
                              textShadow:
                                s < stars ? '0 0 8px rgba(255,210,122,0.7)' : 'none',
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <div style={S.barTrack}>
                        <div
                          style={{
                            ...S.barFill,
                            width: `${(c.cleared / c.total) * 100}%`,
                            background: `linear-gradient(90deg, ${t.deep}, ${t.core})`,
                            boxShadow: `0 0 8px ${t.glow}`,
                          }}
                        />
                      </div>
                      <div style={S.cardMeta}>
                        {c.cleared}/{c.total} LEVELS
                      </div>
                    </>
                  ) : (
                    <div style={S.lockedMeta}>
                      {isLast ? 'CLEAR ALL CHAPTERS TO UNLOCK' : 'LOCKED'}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <footer style={S.footer}>
        <span style={S.footNote}>BEST WAVE REACHED</span>
        <span style={S.footVal}>{bestWave}</span>
      </footer>
    </div>
  )
}

/** Winding connector path drawn behind the nodes. */
function PathSvg() {
  // Build a smooth poly-line through the node anchor points (in %).
  const pts = PATH_X.map((x, i) => ({ x, y: 8 + i * 18 + 7 }))
  const d = pts
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ')
  return (
    <svg
      style={S.pathSvg}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d={d}
        fill="none"
        stroke="rgba(11,5,24,0.6)"
        strokeWidth={4.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={d}
        fill="none"
        stroke="rgba(177,76,255,0.45)"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="0.6 3.2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

const S: Record<string, CSSProperties> = {
  screen: {
    position: 'relative',
    width: '100%',
    maxWidth: 520,
    margin: '0 auto',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background:
      'radial-gradient(120% 85% at 50% 14%, #321C6E 0%, #1A0F3D 46%, #0B0518 100%)',
    color: '#F2ECFF',
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  orb: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(42px)',
    pointerEvents: 'none',
    opacity: 0.5,
  },
  orbA: {
    width: 240,
    height: 240,
    top: -60,
    left: -70,
    background: 'radial-gradient(circle, rgba(177,76,255,0.55), transparent 70%)',
  },
  orbB: {
    width: 260,
    height: 260,
    bottom: 40,
    right: -90,
    background: 'radial-gradient(circle, rgba(63,224,255,0.40), transparent 70%)',
  },
  header: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 16px 10px',
  },
  backBtn: {
    flex: '0 0 auto',
    width: 44,
    height: 44,
    borderRadius: 14,
    border: '1px solid rgba(177,76,255,0.30)',
    background: 'rgba(40,24,84,0.72)',
    color: '#F2ECFF',
    fontSize: 26,
    lineHeight: '40px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 6px 16px rgba(7,3,18,0.55)',
  },
  titleWrap: { display: 'flex', flexDirection: 'column', lineHeight: 1.05 },
  title: {
    margin: 0,
    fontFamily: "'Cinzel', Georgia, serif",
    fontSize: 24,
    fontWeight: 800,
    letterSpacing: '0.06em',
    color: '#F2ECFF',
    textShadow: '0 0 14px rgba(177,76,255,0.5)',
  },
  subtitle: {
    fontSize: 11,
    letterSpacing: '0.18em',
    color: '#B9AEDC',
    marginTop: 2,
  },
  progressPill: {
    marginLeft: 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 12px',
    borderRadius: 999,
    background: 'rgba(28,16,62,0.92)',
    border: '1px solid rgba(255,210,122,0.28)',
    boxShadow: '0 0 12px rgba(255,210,122,0.25)',
  },
  progressIcon: { fontSize: 14, filter: 'drop-shadow(0 0 6px rgba(255,210,122,0.7))' },
  progressTxt: { fontSize: 15, fontWeight: 800, color: '#FFD27A', fontVariantNumeric: 'tabular-nums' },
  progressDim: { color: '#8478A8', fontWeight: 600 },

  scroll: {
    position: 'relative',
    zIndex: 1,
    flex: 1,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    padding: '4px 0 12px',
  },
  map: {
    position: 'relative',
    width: '100%',
    height: 640,
    minHeight: 640,
  },
  pathSvg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  nodeRow: {
    position: 'absolute',
    transform: 'translate(-50%, 0)',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: 'min(78%, 360px)',
  },
  node: {
    position: 'relative',
    flex: '0 0 auto',
    width: 72,
    height: 72,
    borderRadius: '50%',
    border: '2px solid',
    display: 'grid',
    placeItems: 'center',
    padding: 0,
  },
  nodeIcon: { fontSize: 32, lineHeight: 1 },
  chapNum: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: 'linear-gradient(180deg, #FFE08A, #FF7B00)',
    color: '#1A0E33',
    fontSize: 13,
    fontWeight: 800,
    display: 'grid',
    placeItems: 'center',
    border: '2px solid #0B0518',
    boxShadow: '0 0 10px rgba(255,140,60,0.6)',
  },
  card: {
    flex: 1,
    minWidth: 0,
    padding: '10px 14px',
    borderRadius: 14,
    background: 'linear-gradient(160deg, rgba(60,40,120,0.85), rgba(28,16,62,0.92))',
    border: '1px solid',
    boxShadow: '0 6px 16px rgba(7,3,18,0.55)',
  },
  cardLocked: {
    background: 'rgba(28,16,62,0.7)',
  },
  cardName: {
    fontFamily: "'Cinzel', Georgia, serif",
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: '0.02em',
    color: '#F2ECFF',
  },
  stars: { display: 'flex', gap: 3, margin: '4px 0 6px', fontSize: 15 },
  star: { lineHeight: 1 },
  barTrack: {
    height: 7,
    borderRadius: 999,
    background: 'rgba(8,4,22,0.6)',
    overflow: 'hidden',
    border: '1px solid rgba(242,236,255,0.08)',
  },
  barFill: { height: '100%', borderRadius: 999 },
  cardMeta: {
    marginTop: 5,
    fontSize: 10,
    letterSpacing: '0.12em',
    color: '#B9AEDC',
    fontVariantNumeric: 'tabular-nums',
  },
  lockedMeta: {
    marginTop: 6,
    fontSize: 10,
    letterSpacing: '0.14em',
    color: '#8478A8',
  },
  footer: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '12px 16px',
    borderTop: '1px solid rgba(177,76,255,0.18)',
    background: 'rgba(18,10,42,0.7)',
  },
  footNote: { fontSize: 11, letterSpacing: '0.16em', color: '#8478A8' },
  footVal: {
    fontSize: 18,
    fontWeight: 800,
    color: '#FFD27A',
    fontVariantNumeric: 'tabular-nums',
    textShadow: '0 0 10px rgba(255,210,122,0.5)',
  },
}
