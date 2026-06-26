import type { CSSProperties, ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { useGameStore, towerLevelCost, TOWER_LEVEL_MAX } from '../store/gameStore'
import { TOWERS, TOWER_IDS, type TowerId, type TowerDef } from '../data/towers'
import { RELICS, type RelicDef } from '../data/relics'
import { haptics } from '../lib/haptics'

/**
 * SkillTreeUpgrades — restyled Upgrades screen faithful to promo panel 5.
 *
 * TOWERS tab: each tower is a premium stat card showing DAMAGE / RANGE / SPEED
 *   with +deltas for the next permanent level, a rarity tag, level pips, and a
 *   glossy gold UPGRADE button wired to `buyTowerLevel` + `towerLevelCost`.
 * SKILLS tab: a connected node graph of relics, bought via `buyRelic`.
 *
 * Self-contained: all visuals are inline styles using the design-token palette,
 * no external CSS dependency beyond the global `.btn/.tab` classes (optional).
 */

type Tab = 'towers' | 'skills'

interface Props {
  onBack?: () => void
}

// ---- design tokens (mirrored locally so the file is drop-in self-contained) ----
const C = {
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
  cyanDeep: '#1B7FA8',
  good: '#5EE08A',
  bad: '#FF4D5E',
  coin: '#FFD27A',
  gem: '#5CC8FF',
  text: '#F2ECFF',
  textDim: '#B9AEDC',
  textMute: '#8478A8',
  inkOnLight: '#1A0E33',
  line: 'rgba(177, 76, 255, 0.22)',
  lineGold: 'rgba(255, 210, 122, 0.28)',
  lineSoft: 'rgba(242, 236, 255, 0.10)',
  locked: '#5A5476',
} as const

const GRAD_CTA = 'linear-gradient(180deg, #FFE08A 0%, #FFB347 38%, #FF7B00 100%)'
const GRAD_MAGENTA = 'linear-gradient(180deg, #C77BFF 0%, #B14CFF 45%, #7A2FD6 100%)'
const GRAD_PANEL = 'linear-gradient(160deg, rgba(60,40,120,0.85), rgba(28,16,62,0.92))'
const GLOW_GOLD = '0 0 14px rgba(255,210,122,0.75), 0 0 32px rgba(255,179,71,0.45)'
const GLOW_MAGENTA = '0 0 12px rgba(177,76,255,0.75), 0 0 28px rgba(177,76,255,0.45)'

// convert towers.ts numeric (0xRRGGBB) colors to CSS hex
const hex = (n: number): string => '#' + n.toString(16).padStart(6, '0')

// rarity derived from permanent level for flavour, faithful to panel 5 ("LEGENDARY")
const RARITY = ['COMMON', 'RARE', 'EPIC', 'EPIC', 'LEGENDARY', 'LEGENDARY'] as const
const RARITY_COLOR: Record<string, string> = {
  COMMON: C.textDim,
  RARE: C.cyan,
  EPIC: C.magenta,
  LEGENDARY: C.gold,
}

// permanent meta level grants +8% damage per level (matches store comment)
const META_DMG_PER_LEVEL = 0.08

function fmt(n: number): string {
  return Math.round(n).toLocaleString()
}

// ---------------------------------------------------------------------------

export default function SkillTreeUpgrades({ onBack }: Props): JSX.Element {
  const meta = useGameStore((s) => s.meta)
  const buyTowerLevel = useGameStore((s) => s.buyTowerLevel)
  const buyRelic = useGameStore((s) => s.buyRelic)
  const go = useGameStore((s) => s.go)
  const [tab, setTab] = useState<Tab>('towers')

  const back = (): void => {
    haptics.light()
    if (onBack) onBack()
    else go('menu')
  }

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
      {/* ---- top bar ---- */}
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
        <h1
          style={{
            flex: 1,
            margin: 0,
            fontFamily: "'Cinzel', Georgia, serif",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '0.04em',
            textShadow: '0 2px 8px rgba(7,3,18,0.6)',
          }}
        >
          UPGRADES
        </h1>
        <Chip icon="🪙" value={fmt(meta.coins)} color={C.coin} />
        <Chip icon="💎" value={fmt(meta.gems)} color={C.gem} />
      </div>

      {/* ---- tabs ---- */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: '0 16px 12px',
          flexShrink: 0,
        }}
      >
        <TabButton active={tab === 'towers'} onClick={() => setTab('towers')}>
          TOWERS
        </TabButton>
        <TabButton active={tab === 'skills'} onClick={() => setTab('skills')}>
          SKILLS
        </TabButton>
      </div>

      {/* ---- content ---- */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: '4px 16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {tab === 'towers' ? (
          TOWER_IDS.map((id) => (
            <TowerCard
              key={id}
              id={id}
              def={TOWERS[id]}
              level={meta.towerLevels[id] ?? 0}
              coins={meta.coins}
              onBuy={() => {
                if (buyTowerLevel(id)) haptics.success()
                else haptics.light()
              }}
            />
          ))
        ) : (
          <SkillGraph
            relics={RELICS}
            owned={meta.relics}
            gems={meta.gems}
            onBuy={(rid) => {
              if (buyRelic(rid)) haptics.success()
              else haptics.light()
            }}
          />
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// TOWER STAT CARD
// ---------------------------------------------------------------------------

function TowerCard({
  id,
  def,
  level,
  coins,
  onBuy,
}: {
  id: TowerId
  def: TowerDef
  level: number
  coins: number
  onBuy: () => void
}): JSX.Element {
  const maxed = level >= TOWER_LEVEL_MAX
  const cost = towerLevelCost(level)
  const afford = coins >= cost && !maxed
  const rarity = RARITY[Math.min(level, RARITY.length - 1)]
  const body = hex(def.color)
  const accent = hex(def.accent)

  // peak in-run tier used as the headline stat, scaled by current meta level
  const peak = def.tiers[def.tiers.length - 1]
  const curMul = 1 + level * META_DMG_PER_LEVEL
  const nextMul = 1 + (level + 1) * META_DMG_PER_LEVEL

  const dmgCur = ((peak.dmgMin + peak.dmgMax) / 2) * curMul
  const dmgNext = ((peak.dmgMin + peak.dmgMax) / 2) * nextMul
  const dmgDelta = dmgNext - dmgCur

  // range/speed are not boosted by meta level here, but we surface them as stats
  const range = peak.range
  const speed = 1 / peak.cd // attacks per second

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 18,
        padding: 16,
        background: GRAD_PANEL,
        border: `1px solid ${maxed ? C.lineGold : C.line}`,
        boxShadow: maxed
          ? `0 12px 32px rgba(7,3,18,0.6), ${GLOW_GOLD}`
          : '0 8px 24px rgba(7,3,18,0.55)',
        overflow: 'hidden',
      }}
    >
      {/* accent rim-light bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: `linear-gradient(180deg, ${accent}, ${body})`,
          boxShadow: `0 0 12px ${accent}`,
        }}
      />

      {/* header: icon medallion + name + rarity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <div
          style={{
            width: 56,
            height: 56,
            flexShrink: 0,
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30,
            background: `radial-gradient(circle at 35% 30%, ${body}, ${C.bg500} 90%)`,
            border: `1.5px solid ${accent}`,
            boxShadow: `inset 0 0 14px rgba(0,0,0,0.4), 0 0 16px ${accent}66`,
          }}
        >
          {def.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'Cinzel', Georgia, serif",
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: '0.02em',
              lineHeight: 1.1,
            }}
          >
            {def.name}
          </div>
          <div
            style={{
              display: 'inline-block',
              marginTop: 6,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '0.10em',
              padding: '3px 9px',
              borderRadius: 999,
              color: rarity === 'LEGENDARY' ? C.inkOnLight : '#0f0820',
              background: RARITY_COLOR[rarity],
              boxShadow: `0 0 12px ${RARITY_COLOR[rarity]}88`,
            }}
          >
            {rarity}
          </div>
        </div>
        <LevelPips level={level} accent={accent} />
      </div>

      {/* stat rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        <StatRow
          label="DAMAGE"
          value={fmt(dmgCur)}
          delta={maxed ? null : `+${fmt(dmgDelta)}`}
          color={C.orange2}
        />
        <StatRow label="RANGE" value={range.toFixed(1)} delta={null} color={C.cyan} />
        <StatRow
          label="SPEED"
          value={`${speed.toFixed(2)}/s`}
          delta={null}
          color={C.magenta}
        />
      </div>

      {/* special trait line, faithful to panel 5 "SPECIAL: PIERCING SHOT" */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 11,
          color: C.textDim,
          marginBottom: 14,
        }}
      >
        <span style={{ color: C.gold, fontWeight: 700, letterSpacing: '0.04em' }}>
          SPECIAL:
        </span>
        <span style={{ flex: 1 }}>{def.blurb}</span>
      </div>

      {/* glossy upgrade button */}
      <UpgradeButton maxed={maxed} afford={afford} cost={cost} onClick={onBuy} />
    </div>
  )
}

function StatRow({
  label,
  value,
  delta,
  color,
}: {
  label: string
  value: string
  delta: string | null
  color: string
}): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '7px 12px',
        borderRadius: 10,
        background: C.surface3,
        border: `1px solid ${C.lineSoft}`,
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: '0.10em',
          color: C.textMute,
          width: 64,
        }}
      >
        {label}
      </span>
      <span
        style={{
          flex: 1,
          fontSize: 16,
          fontWeight: 800,
          fontVariantNumeric: 'tabular-nums',
          color: C.text,
        }}
      >
        {value}
      </span>
      {delta && (
        <span
          style={{
            fontSize: 13,
            fontWeight: 800,
            fontVariantNumeric: 'tabular-nums',
            color,
            textShadow: `0 0 10px ${color}88`,
          }}
        >
          {delta}
        </span>
      )}
    </div>
  )
}

function LevelPips({ level, accent }: { level: number; accent: string }): JSX.Element {
  return (
    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
      {Array.from({ length: TOWER_LEVEL_MAX }).map((_, i) => {
        const on = i < level
        return (
          <span
            key={i}
            style={{
              width: 8,
              height: 18,
              borderRadius: 4,
              background: on ? accent : 'rgba(242,236,255,0.12)',
              boxShadow: on ? `0 0 8px ${accent}` : 'none',
            }}
          />
        )
      })}
    </div>
  )
}

function UpgradeButton({
  maxed,
  afford,
  cost,
  onClick,
}: {
  maxed: boolean
  afford: boolean
  cost: number
  onClick: () => void
}): JSX.Element {
  const disabled = maxed || !afford
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        width: '100%',
        height: 48,
        borderRadius: 14,
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: "'Cinzel', Georgia, serif",
        fontSize: 15,
        fontWeight: 800,
        letterSpacing: '0.06em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        position: 'relative',
        overflow: 'hidden',
        color: maxed ? C.gold : afford ? C.inkOnLight : C.textMute,
        background: maxed
          ? 'rgba(255,210,122,0.10)'
          : afford
            ? GRAD_CTA
            : 'rgba(40,24,84,0.6)',
        border: maxed ? `1px solid ${C.lineGold}` : 'none',
        boxShadow: afford
          ? `0 6px 0 ${C.goldDeep}, 0 10px 20px rgba(255,123,0,0.30)`
          : 'none',
        transition: 'transform 90ms cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {/* top gloss */}
      {afford && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0) 45%)',
            pointerEvents: 'none',
          }}
        />
      )}
      <span style={{ position: 'relative' }}>
        {maxed ? 'MAX LEVEL' : afford ? `UPGRADE  🪙 ${fmt(cost)}` : `🪙 ${fmt(cost)}`}
      </span>
    </button>
  )
}

// ---------------------------------------------------------------------------
// SKILLS NODE GRAPH
// ---------------------------------------------------------------------------

interface NodePos {
  relic: RelicDef
  x: number // 0..1 within graph width
  y: number // px from top of graph
}

const GRAPH_ROW_H = 116
const GRAPH_COLS = [0.22, 0.5, 0.78] as const

function SkillGraph({
  relics,
  owned,
  gems,
  onBuy,
}: {
  relics: RelicDef[]
  owned: string[]
  gems: number
  onBuy: (id: string) => void
}): JSX.Element {
  // lay relics out in a zig-zag connected tree (deterministic from order)
  const nodes: NodePos[] = useMemo(
    () =>
      relics.map((relic, i) => {
        const col = i % GRAPH_COLS.length
        return { relic, x: GRAPH_COLS[col], y: 40 + i * GRAPH_ROW_H }
      }),
    [relics],
  )

  const graphH = nodes.length ? nodes[nodes.length - 1].y + 70 : 200
  const NODE = 64

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: graphH,
        borderRadius: 18,
        padding: '0',
        background:
          'radial-gradient(120% 90% at 50% 0%, rgba(50,28,110,0.55), rgba(28,16,62,0.85) 90%)',
        border: `1px solid ${C.line}`,
        boxShadow: 'inset 0 0 40px rgba(177,76,255,0.10)',
        overflow: 'hidden',
      }}
    >
      {/* connecting edges */}
      <svg
        width="100%"
        height={graphH}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <defs>
          <linearGradient id="edgeOn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.magenta} />
            <stop offset="100%" stopColor={C.magenta2} />
          </linearGradient>
        </defs>
        {nodes.slice(1).map((n, i) => {
          const prev = nodes[i]
          const lit = owned.includes(prev.relic.id) || owned.includes(n.relic.id)
          return (
            <line
              key={n.relic.id}
              x1={`${prev.x * 100}%`}
              y1={prev.y + NODE / 2}
              x2={`${n.x * 100}%`}
              y2={n.y + NODE / 2}
              stroke={lit ? 'url(#edgeOn)' : 'rgba(177,76,255,0.18)'}
              strokeWidth={lit ? 3 : 2}
              strokeLinecap="round"
              style={lit ? { filter: 'drop-shadow(0 0 5px rgba(177,76,255,0.7))' } : undefined}
            />
          )
        })}
      </svg>

      {/* nodes */}
      {nodes.map((n) => {
        const isOwned = owned.includes(n.relic.id)
        const afford = gems >= n.relic.price
        return (
          <SkillNode
            key={n.relic.id}
            relic={n.relic}
            owned={isOwned}
            afford={afford}
            x={n.x}
            y={n.y}
            size={NODE}
            onBuy={() => !isOwned && onBuy(n.relic.id)}
          />
        )
      })}
    </div>
  )
}

function SkillNode({
  relic,
  owned,
  afford,
  x,
  y,
  size,
  onBuy,
}: {
  relic: RelicDef
  owned: boolean
  afford: boolean
  x: number
  y: number
  size: number
  onBuy: () => void
}): JSX.Element {
  const buyable = !owned && afford
  const ringColor = owned ? C.gold : buyable ? C.magenta : C.locked

  return (
    <button
      onClick={owned ? undefined : onBuy}
      disabled={owned || !afford}
      aria-label={`${relic.name} — ${relic.desc}`}
      style={{
        position: 'absolute',
        left: `calc(${x * 100}% - ${size / 2}px)`,
        top: y,
        width: size,
        // generous tap/label area below the orb
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: owned || !afford ? 'default' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
      }}
    >
      {/* orb */}
      <span
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 26,
          background: owned
            ? 'radial-gradient(circle at 35% 30%, #FFE9B0, #FFB347 80%)'
            : 'radial-gradient(circle at 35% 30%, rgba(80,52,150,0.95), rgba(28,16,62,0.95) 90%)',
          border: `2px solid ${ringColor}`,
          boxShadow: owned
            ? GLOW_GOLD
            : buyable
              ? GLOW_MAGENTA
              : 'inset 0 0 12px rgba(0,0,0,0.5)',
          filter: !owned && !afford ? 'grayscale(0.5) opacity(0.7)' : 'none',
        }}
      >
        {relic.icon}
        {owned && (
          <span
            style={{
              position: 'absolute',
              marginTop: size - 22,
              marginLeft: size - 22,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: C.good,
              color: '#0c2415',
              fontSize: 11,
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 8px rgba(94,224,138,0.8)',
            }}
          >
            ✓
          </span>
        )}
      </span>

      {/* label + cost */}
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: owned ? C.gold : afford ? C.text : C.textMute,
          textAlign: 'center',
          lineHeight: 1.1,
          maxWidth: 78,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {relic.name}
      </span>
      <span
        style={{
          fontSize: 10,
          fontWeight: 800,
          fontVariantNumeric: 'tabular-nums',
          padding: '2px 8px',
          borderRadius: 999,
          color: owned ? C.good : afford ? C.gem : C.textMute,
          background: owned ? 'rgba(94,224,138,0.12)' : 'rgba(92,200,255,0.10)',
          border: `1px solid ${owned ? 'rgba(94,224,138,0.3)' : 'rgba(92,200,255,0.25)'}`,
          whiteSpace: 'nowrap',
        }}
      >
        {owned ? 'OWNED' : `💎 ${relic.price}`}
      </span>
    </button>
  )
}

// ---------------------------------------------------------------------------
// SMALL SHARED UI
// ---------------------------------------------------------------------------

const iconBtnStyle: CSSProperties = {
  width: 40,
  height: 40,
  flexShrink: 0,
  borderRadius: 12,
  border: `1px solid ${C.line}`,
  background: C.surface1,
  color: C.text,
  fontSize: 26,
  lineHeight: 1,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingBottom: 3,
}

function Chip({
  icon,
  value,
  color,
}: {
  icon: string
  value: string
  color: string
}): JSX.Element {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '6px 11px',
        borderRadius: 999,
        background: C.surface3,
        border: `1px solid ${C.lineSoft}`,
        fontSize: 13,
        fontWeight: 800,
        fontVariantNumeric: 'tabular-nums',
        color,
      }}
    >
      <span style={{ fontSize: 13 }}>{icon}</span>
      {value}
    </span>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}): JSX.Element {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        height: 44,
        borderRadius: 12,
        border: `1px solid ${active ? C.lineGold : C.line}`,
        cursor: 'pointer',
        fontFamily: "'Cinzel', Georgia, serif",
        fontSize: 14,
        fontWeight: 800,
        letterSpacing: '0.08em',
        color: active ? '#FFFFFF' : C.textDim,
        background: active ? GRAD_MAGENTA : C.surface1,
        boxShadow: active ? `0 6px 0 ${C.magentaDeep}, ${GLOW_MAGENTA}` : 'none',
      }}
    >
      {children}
    </button>
  )
}
