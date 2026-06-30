import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import { useGameStore } from '../store/gameStore'
import { RELICS, type RelicDef } from '../data/relics'
import { assetUrl } from '../lib/assets'
import { haptics } from '../lib/haptics'

/**
 * SkillTreeView — a connected, glowing node graph of three skill BRANCHES,
 * faithful to promo panels 5 / 7. Node icons are sliced from the REAL
 * `ui/skill_icons.png` sheet (a ~3×3 grid of 9 node glyphs) rather than emoji.
 *
 * The graph is bound to `useGameStore` relics:
 *   - relic in `meta.relics`                         → MAXED  (gold, ✓)
 *   - first un-owned, prerequisite met, affordable    → UNLOCKED (magenta, buyable → buyRelic)
 *   - everything else                                 → LOCKED  (dim, padlock)
 *
 * Buying a node calls the store's `buyRelic(id)` action (spends gems). The tree
 * is gated per-branch: a node only unlocks once the node above it in the same
 * branch is owned, giving the classic "spend down the branch" Clash/Rush feel.
 *
 * Self-contained: every visual is an inline style using the design-token
 * palette. No new deps, no external CSS beyond optional global classes.
 */

interface Props {
  /** Optional back handler; falls back to navigating to the menu screen. */
  onBack?: () => void
  /** Hide the internal header (when embedded under an existing top bar). */
  embedded?: boolean
}

// ---- design tokens (mirrored locally so the file is drop-in self-contained) ----
const C = {
  bg900: '#120A2A',
  bg700: '#1A0F3D',
  bg500: '#321C6E',
  surface: 'rgba(28, 16, 62, 0.92)',
  surfaceHi: 'rgba(54, 34, 110, 0.85)',
  magenta: '#B14CFF',
  magenta2: '#7B61FF',
  magentaDeep: '#5A1FB8',
  orange: '#FF7B00',
  orange2: '#FFB347',
  gold: '#FFD27A',
  goldDeep: '#B85600',
  cyan: '#3FE0FF',
  good: '#5EE08A',
  gem: '#5CC8FF',
  text: '#F2ECFF',
  textDim: '#B9AEDC',
  textMute: '#8478A8',
  ink: '#1A0E33',
  line: 'rgba(177, 76, 255, 0.22)',
  lineGold: 'rgba(255, 210, 122, 0.28)',
  locked: '#5A5476',
} as const

const GLOW_GOLD = '0 0 14px rgba(255,210,122,0.75), 0 0 30px rgba(255,179,71,0.40)'
const GLOW_MAGENTA = '0 0 12px rgba(177,76,255,0.80), 0 0 26px rgba(177,76,255,0.45)'
const GLOW_CYAN = '0 0 12px rgba(63,224,255,0.70), 0 0 26px rgba(63,224,255,0.40)'

// ---------------------------------------------------------------------------
// skill_icons.png slicing — a ~3×3 grid (9 glyphs). Each <i> shows one cell
// via background-size 300% (3 cols × 3 rows) + position percentages 0/50/100.
// ---------------------------------------------------------------------------

const SHEET_COLS = 3
const SHEET_ROWS = 3

/** background-position % for a (col,row) cell in a 3×3 sheet → 0 / 50 / 100. */
function cellPos(col: number, row: number): string {
  const x = SHEET_COLS > 1 ? (col / (SHEET_COLS - 1)) * 100 : 0
  const y = SHEET_ROWS > 1 ? (row / (SHEET_ROWS - 1)) * 100 : 0
  return `${x}% ${y}%`
}

// ---------------------------------------------------------------------------
// BRANCH MODEL — three thematic branches, each an ordered chain of relics.
// Relic ids come from data/relics.ts. The order within a branch defines the
// prerequisite chain (node N unlocks once node N-1 is owned).
// ---------------------------------------------------------------------------

type BranchKey = 'offense' | 'economy' | 'defense'

interface Branch {
  key: BranchKey
  title: string
  accent: string
  glow: string
  /** relic ids in unlock order; also drives the skill_icons.png cell column. */
  chain: string[]
}

const BRANCHES: Branch[] = [
  {
    key: 'offense',
    title: 'OFFENSE',
    accent: C.orange2,
    glow: 'rgba(255,179,71,0.55)',
    chain: ['sharpened', 'eagle', 'overload'],
  },
  {
    key: 'economy',
    title: 'ECONOMY',
    accent: C.gold,
    glow: 'rgba(255,210,122,0.55)',
    chain: ['warchest', 'midas', 'banker'],
  },
  {
    key: 'defense',
    title: 'DEFENSE',
    accent: C.cyan,
    glow: 'rgba(63,224,255,0.55)',
    chain: ['rampart', 'bulwark'],
  },
]

// map relic id → its sheet cell. Column = branch index, row = depth in branch.
const ICON_CELL: Record<string, { col: number; row: number }> = (() => {
  const m: Record<string, { col: number; row: number }> = {}
  BRANCHES.forEach((b, col) => {
    b.chain.forEach((id, row) => {
      m[id] = { col, row }
    })
  })
  return m
})()

type NodeState = 'maxed' | 'unlocked' | 'locked'

// ---------------------------------------------------------------------------

export default function SkillTreeView({ onBack, embedded = false }: Props): JSX.Element {
  const meta = useGameStore((s) => s.meta)
  const buyRelic = useGameStore((s) => s.buyRelic)
  const go = useGameStore((s) => s.go)

  const owned = meta.relics
  const gems = meta.gems

  const back = (): void => {
    haptics.light()
    if (onBack) onBack()
    else go('menu')
  }

  const buy = (id: string): void => {
    if (buyRelic(id)) haptics.success()
    else haptics.light()
  }

  // resolve each relic's display state from store + prerequisite chain
  const stateFor = useMemo(() => {
    const fn = (branch: Branch, depth: number): NodeState => {
      const id = branch.chain[depth]
      if (owned.includes(id)) return 'maxed'
      const prereqMet = depth === 0 || owned.includes(branch.chain[depth - 1])
      return prereqMet ? 'unlocked' : 'locked'
    }
    return fn
  }, [owned])

  const ownedCount = owned.length
  const totalCount = RELICS.length

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        background:
          'radial-gradient(120% 85% at 50% 0%, #321C6E 0%, #1A0F3D 50%, #120A2A 100%)',
        color: C.text,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {!embedded && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            flexShrink: 0,
          }}
        >
          <button onClick={back} aria-label="Back" style={iconBtnStyle}>
            ‹
          </button>
          <div style={{ flex: 1 }}>
            <h1
              style={{
                margin: 0,
                fontFamily: "'Cinzel', Georgia, serif",
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: '0.04em',
                textShadow: '0 2px 8px rgba(7,3,18,0.6)',
              }}
            >
              SKILL TREE
            </h1>
            <div style={{ fontSize: 11, color: C.textMute, fontWeight: 700, letterSpacing: '0.06em' }}>
              {ownedCount}/{totalCount} RELICS UNLOCKED
            </div>
          </div>
          <Chip value={gems} />
        </div>
      )}

      {/* ---- three-branch node graph ---- */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: '8px 12px 28px',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'stretch',
            maxWidth: 560,
            margin: '0 auto',
          }}
        >
          {BRANCHES.map((branch) => (
            <BranchColumn
              key={branch.key}
              branch={branch}
              owned={owned}
              gems={gems}
              stateFor={stateFor}
              onBuy={buy}
            />
          ))}
        </div>

        <Legend />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// BRANCH COLUMN — a glowing capsule containing a vertical chain of nodes,
// joined by glowing connector segments that light up as nodes are owned.
// ---------------------------------------------------------------------------

function BranchColumn({
  branch,
  owned,
  gems,
  stateFor,
  onBuy,
}: {
  branch: Branch
  owned: string[]
  gems: number
  stateFor: (b: Branch, depth: number) => NodeState
  onBuy: (id: string) => void
}): JSX.Element {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 20,
        padding: '14px 6px 16px',
        background:
          'linear-gradient(160deg, rgba(60,40,120,0.55), rgba(28,16,62,0.85))',
        border: `1px solid ${C.line}`,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 24px rgba(7,3,18,0.5)',
      }}
    >
      {/* branch title plate */}
      <div
        style={{
          fontFamily: "'Cinzel', Georgia, serif",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: '0.10em',
          color: branch.accent,
          textShadow: `0 0 10px ${branch.glow}`,
          marginBottom: 12,
          whiteSpace: 'nowrap',
        }}
      >
        {branch.title}
      </div>

      {branch.chain.map((id, depth) => {
        const relic = RELICS.find((r) => r.id === id)
        if (!relic) return null
        const state = stateFor(branch, depth)
        const last = depth === branch.chain.length - 1
        // connector below this node is "lit" once this node is owned
        const connectorLit = state === 'maxed'
        return (
          <div
            key={id}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <SkillNode
              relic={relic}
              state={state}
              afford={gems >= relic.price}
              accent={branch.accent}
              onBuy={() => onBuy(id)}
            />
            {!last && <Connector lit={connectorLit} accent={branch.accent} glow={branch.glow} />}
          </div>
        )
      })}
    </div>
  )
}

function Connector({
  lit,
  accent,
  glow,
}: {
  lit: boolean
  accent: string
  glow: string
}): JSX.Element {
  return (
    <span
      aria-hidden
      style={{
        width: 4,
        height: 26,
        margin: '3px 0',
        borderRadius: 999,
        background: lit
          ? `linear-gradient(180deg, ${accent}, ${accent}88)`
          : 'rgba(177,76,255,0.16)',
        boxShadow: lit ? `0 0 8px ${glow}` : 'none',
        flexShrink: 0,
      }}
    />
  )
}

// ---------------------------------------------------------------------------
// SKILL NODE — glossy orb whose face is a slice of skill_icons.png.
// ---------------------------------------------------------------------------

const NODE = 66

function SkillNode({
  relic,
  state,
  afford,
  accent,
  onBuy,
}: {
  relic: RelicDef
  state: NodeState
  afford: boolean
  accent: string
  onBuy: () => void
}): JSX.Element {
  const cell = ICON_CELL[relic.id] ?? { col: 0, row: 0 }
  const maxed = state === 'maxed'
  const unlocked = state === 'unlocked'
  const buyable = unlocked && afford
  const locked = state === 'locked'

  const ringColor = maxed ? C.gold : buyable ? accent : C.locked
  const orbGlow = maxed
    ? GLOW_GOLD
    : buyable
      ? (accent === C.cyan ? GLOW_CYAN : GLOW_MAGENTA)
      : 'inset 0 0 12px rgba(0,0,0,0.55)'

  const clickable = buyable
  const aria = `${relic.name} — ${relic.desc}. ${
    maxed ? 'Unlocked.' : buyable ? `Costs ${relic.price} gems.` : locked ? 'Locked.' : 'Not enough gems.'
  }`

  return (
    <button
      onClick={clickable ? onBuy : undefined}
      disabled={!clickable}
      aria-label={aria}
      style={{
        position: 'relative',
        width: 92,
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: clickable ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
      }}
    >
      {/* orb */}
      <span
        style={{
          position: 'relative',
          width: NODE,
          height: NODE,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: maxed
            ? 'radial-gradient(circle at 35% 28%, #FFE9B0, #FFB347 78%, #C77A12 100%)'
            : 'radial-gradient(circle at 35% 28%, rgba(80,52,150,0.95), rgba(24,14,54,0.96) 92%)',
          border: `2.5px solid ${ringColor}`,
          boxShadow: orbGlow,
          animation: buyable ? 'stvNodePulse 1.6s ease-in-out infinite' : 'none',
        }}
      >
        {/* sliced sheet glyph */}
        <i
          aria-hidden
          style={{
            width: 40,
            height: 40,
            backgroundImage: `url(${assetUrl('ui/skill_icons.png')})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${SHEET_COLS * 100}% ${SHEET_ROWS * 100}%`,
            backgroundPosition: cellPos(cell.col, cell.row),
            filter: locked
              ? 'grayscale(1) brightness(0.55) drop-shadow(0 1px 2px rgba(0,0,0,0.6))'
              : 'drop-shadow(0 1px 3px rgba(0,0,0,0.6))',
            opacity: locked ? 0.7 : 1,
          }}
        />

        {/* inner top-gloss */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.30), rgba(255,255,255,0) 46%)',
            pointerEvents: 'none',
          }}
        />

        {/* state badge */}
        {maxed && <Badge bg={C.good} ink="#0c2415" glyph="✓" />}
        {locked && <Badge bg="rgba(20,12,40,0.92)" ink={C.locked} glyph="🔒" border={C.locked} />}
      </span>

      {/* name */}
      <span
        style={{
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: '0.02em',
          lineHeight: 1.05,
          color: maxed ? C.gold : unlocked ? C.text : C.textMute,
          textAlign: 'center',
          maxWidth: 88,
        }}
      >
        {relic.name}
      </span>

      {/* desc */}
      <span
        style={{
          fontSize: 9,
          fontWeight: 600,
          color: C.textMute,
          textAlign: 'center',
          lineHeight: 1.15,
          maxWidth: 88,
          minHeight: 22,
        }}
      >
        {relic.desc}
      </span>

      {/* cost / status pill */}
      <span
        style={{
          marginTop: 1,
          fontSize: 10,
          fontWeight: 800,
          fontVariantNumeric: 'tabular-nums',
          padding: '3px 9px',
          borderRadius: 999,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          whiteSpace: 'nowrap',
          color: maxed ? C.good : buyable ? C.gem : C.textMute,
          background: maxed
            ? 'rgba(94,224,138,0.14)'
            : buyable
              ? 'rgba(92,200,255,0.12)'
              : 'rgba(20,12,40,0.6)',
          border: `1px solid ${
            maxed
              ? 'rgba(94,224,138,0.32)'
              : buyable
                ? 'rgba(92,200,255,0.28)'
                : 'rgba(132,120,168,0.22)'
          }`,
        }}
      >
        {maxed ? (
          'OWNED'
        ) : locked ? (
          'LOCKED'
        ) : (
          <>
            <GemIcon /> {relic.price}
          </>
        )}
      </span>
    </button>
  )
}

function Badge({
  bg,
  ink,
  glyph,
  border,
}: {
  bg: string
  ink: string
  glyph: string
  border?: string
}): JSX.Element {
  return (
    <span
      aria-hidden
      style={{
        position: 'absolute',
        right: -3,
        bottom: -3,
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: bg,
        color: ink,
        fontSize: 10,
        fontWeight: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: border ? `1px solid ${border}` : 'none',
        boxShadow: '0 0 8px rgba(0,0,0,0.5)',
      }}
    >
      {glyph}
    </span>
  )
}

// ---------------------------------------------------------------------------
// SMALL SHARED UI
// ---------------------------------------------------------------------------

// gem icon sliced from the real currency sheet ([0,0] of a 2×2 grid).
function GemIcon(): JSX.Element {
  return (
    <i
      aria-hidden
      style={{
        width: 12,
        height: 12,
        display: 'inline-block',
        flex: '0 0 auto',
        backgroundImage: `url(${assetUrl('ui/icons_currency.png')})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '200% 200%',
        backgroundPosition: '0% 0%',
        filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.5))',
      }}
    />
  )
}

function Chip({ value }: { value: number }): JSX.Element {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '6px 11px',
        borderRadius: 999,
        background: C.surface,
        border: `1px solid ${C.line}`,
        fontSize: 13,
        fontWeight: 800,
        fontVariantNumeric: 'tabular-nums',
        color: C.gem,
      }}
    >
      <GemIcon />
      {value.toLocaleString()}
    </span>
  )
}

function Legend(): JSX.Element {
  const item = (color: string, label: string): JSX.Element => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span
        style={{
          width: 11,
          height: 11,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', color: C.textDim }}>
        {label}
      </span>
    </span>
  )
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 18,
        marginTop: 18,
        flexWrap: 'wrap',
      }}
    >
      {item(C.gold, 'UNLOCKED')}
      {item(C.magenta, 'AVAILABLE')}
      {item(C.locked, 'LOCKED')}

      {/* keyframes for the available-node pulse (scoped, injected once) */}
      <style>{`@keyframes stvNodePulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}`}</style>
    </div>
  )
}

const iconBtnStyle: CSSProperties = {
  width: 40,
  height: 40,
  flexShrink: 0,
  borderRadius: 12,
  border: `1px solid ${C.line}`,
  background: C.surfaceHi,
  color: C.text,
  fontSize: 26,
  lineHeight: 1,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingBottom: 3,
}
