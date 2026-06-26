import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../store/gameStore'

/**
 * MainMenuPro — restyled premium main menu.
 *
 * Layout (top → bottom), matching the AAA promo reference:
 *   TOP BAR  : level badge + XP bar · energy ⚡ · coins · gems · settings gear
 *   BANNER   : "SEASON 4 — SHADOW INVASION" with countdown timer
 *   CASTLE   : central glowing isometric castle on a floating platform (canvas)
 *   CTA      : glossy gold START + ENDLESS / CO-OP (CO-OP shows "soon")
 *   NAV      : Shop · Towers · Home(active) · Quests · Guild
 *
 * Uses only the existing store API. Since meta has no explicit level/xp/energy,
 * those are derived for display from totalRuns / bestScore (purely cosmetic).
 */

// ---- design tokens (mirrors styles/tokens.ts) -----------------------------
const C = {
  bg900: '#0B0518',
  bg700: '#1A0F3D',
  bg600: '#241452',
  bg500: '#321C6E',
  magenta: '#B14CFF',
  magentaDeep: '#5A1FB8',
  orange: '#FF7B00',
  orange2: '#FFB347',
  gold: '#FFD27A',
  goldDeep: '#B85600',
  cyan: '#3FE0FF',
  cyan2: '#5CC8FF',
  good: '#5EE08A',
  warn: '#FFC23D',
  ink: '#1A0E33',
  text: '#F2ECFF',
  textDim: '#B9AEDC',
} as const

const fmt = (n: number): string => Math.floor(n).toLocaleString('en-US')
const fmtCompact = (n: number): string => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(Math.floor(n))
}

// ---- glowing isometric castle (canvas) ------------------------------------
function CastleScene({ reducedMotion }: { reducedMotion: boolean }): JSX.Element {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    let raf = 0
    let t = 0

    const draw = (): void => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const W = cv.clientWidth
      const H = cv.clientHeight
      cv.width = W * dpr
      cv.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      const cx = W * 0.5
      const cy = H * 0.46
      const bob = reducedMotion ? 0 : Math.sin(t / 40) * 4
      const pulse = reducedMotion ? 0.5 : 0.5 + Math.sin(t / 28) * 0.5

      // ambient radial bloom behind castle
      const bloom = ctx.createRadialGradient(cx, cy, 8, cx, cy, W * 0.55)
      bloom.addColorStop(0, `rgba(177,76,255,${0.42 + pulse * 0.18})`)
      bloom.addColorStop(0.5, 'rgba(123,97,255,0.18)')
      bloom.addColorStop(1, 'rgba(11,5,24,0)')
      ctx.fillStyle = bloom
      ctx.fillRect(0, 0, W, H)

      ctx.save()
      ctx.translate(0, bob)

      // floating platform (iso diamond)
      const pw = W * 0.46
      const ph = pw * 0.42
      const py = cy + H * 0.2
      const diamond = (yOff: number, fill: string): void => {
        ctx.beginPath()
        ctx.moveTo(cx, py - ph / 2 + yOff)
        ctx.lineTo(cx + pw / 2, py + yOff)
        ctx.lineTo(cx, py + ph / 2 + yOff)
        ctx.lineTo(cx - pw / 2, py + yOff)
        ctx.closePath()
        ctx.fillStyle = fill
        ctx.fill()
      }
      diamond(ph * 0.5, C.bg900) // shadow / underside
      diamond(0, C.bg500)
      // platform top sheen
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(cx, py - ph / 2)
      ctx.lineTo(cx + pw / 2, py)
      ctx.lineTo(cx, py + ph / 2)
      ctx.lineTo(cx - pw / 2, py)
      ctx.closePath()
      ctx.clip()
      const topG = ctx.createLinearGradient(cx, py - ph / 2, cx, py + ph / 2)
      topG.addColorStop(0, 'rgba(124,90,200,0.55)')
      topG.addColorStop(1, 'rgba(36,20,82,0.2)')
      ctx.fillStyle = topG
      ctx.fillRect(cx - pw / 2, py - ph / 2, pw, ph)
      ctx.restore()

      // ---- castle towers (3 chunky blocks) ----
      const towerH = H * 0.3
      const drawTower = (tx: number, w: number, h: number, lit: string): void => {
        const top = cy - h * 0.4
        // left face (lit)
        ctx.fillStyle = lit
        ctx.fillRect(tx - w / 2, top, w * 0.55, h)
        // right face (shadow)
        ctx.fillStyle = C.bg600
        ctx.fillRect(tx + w * 0.05, top, w * 0.45, h)
        // crenellation
        ctx.fillStyle = lit
        for (let i = 0; i < 3; i++) {
          ctx.fillRect(tx - w / 2 + i * (w / 3), top - 6, w / 5, 7)
        }
        // pointed roof
        ctx.beginPath()
        ctx.moveTo(tx - w / 2 - 3, top - 6)
        ctx.lineTo(tx, top - w * 0.95)
        ctx.lineTo(tx + w / 2 + 3, top - 6)
        ctx.closePath()
        ctx.fillStyle = C.magenta
        ctx.fill()
        // roof glow flag
        ctx.save()
        ctx.globalCompositeOperation = 'lighter'
        ctx.shadowColor = C.cyan
        ctx.shadowBlur = 14 + pulse * 10
        ctx.fillStyle = C.cyan
        ctx.beginPath()
        ctx.arc(tx, top - w * 0.95, 3.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
        // glowing windows
        ctx.save()
        ctx.globalCompositeOperation = 'lighter'
        ctx.fillStyle = `rgba(255,210,122,${0.55 + pulse * 0.35})`
        ctx.fillRect(tx - w * 0.12, top + h * 0.35, w * 0.16, h * 0.22)
        ctx.restore()
      }

      drawTower(cx - pw * 0.26, W * 0.12, towerH * 0.72, C.bg500)
      drawTower(cx + pw * 0.26, W * 0.12, towerH * 0.72, C.bg500)
      drawTower(cx, W * 0.17, towerH, C.bg600) // central keep

      ctx.restore()

      // floating energy motes around the castle
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      const motes = reducedMotion ? 0 : 7
      for (let i = 0; i < motes; i++) {
        const a = (i / motes) * Math.PI * 2 + t / 60
        const r = W * 0.34
        const mx = cx + Math.cos(a) * r
        const my = cy + Math.sin(a) * r * 0.42 - 10
        const col = i % 2 === 0 ? C.cyan : C.magenta
        ctx.shadowColor = col
        ctx.shadowBlur = 10
        ctx.fillStyle = col
        ctx.beginPath()
        ctx.arc(mx, my, 2.2, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      t++
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [reducedMotion])

  return <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} />
}

// ---- small UI atoms -------------------------------------------------------
function TopStat({
  icon,
  value,
  color,
}: {
  icon: string
  value: string
  color: string
}): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        padding: '5px 10px',
        borderRadius: 999,
        background: 'rgba(28,16,62,0.92)',
        border: '1px solid rgba(242,236,255,0.10)',
        fontWeight: 700,
        fontSize: 13,
        color: C.text,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: 14, filter: `drop-shadow(0 0 4px ${color})` }}>{icon}</span>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  )
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string
  label: string
  active?: boolean
  onClick: () => void
}): JSX.Element {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        padding: '8px 0 6px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: active ? C.gold : C.textDim,
        minHeight: 48,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          display: 'grid',
          placeItems: 'center',
          fontSize: 20,
          borderRadius: 14,
          background: active ? 'linear-gradient(180deg,#FFE08A,#FFB347,#FF7B00)' : 'transparent',
          boxShadow: active ? '0 4px 0 #B85600, 0 0 16px rgba(255,123,0,0.55)' : 'none',
          transform: active ? 'translateY(-10px)' : 'none',
          filter: active ? 'none' : 'grayscale(0.15)',
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          marginTop: active ? -8 : 0,
        }}
      >
        {label}
      </span>
    </button>
  )
}

// ---- season countdown -----------------------------------------------------
function useSeasonTimer(): string {
  const [now, setNow] = useState<number>(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])
  // season ends at the next month boundary
  const d = new Date(now)
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime()
  let s = Math.max(0, Math.floor((end - now) / 1000))
  const days = Math.floor(s / 86400)
  s -= days * 86400
  const h = Math.floor(s / 3600)
  s -= h * 3600
  const m = Math.floor(s / 60)
  if (days > 0) return `${days}d ${h}h`
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

// ---- main component -------------------------------------------------------
export default function MainMenuPro(): JSX.Element {
  const go = useGameStore((s) => s.go)
  const startRun = useGameStore((s) => s.startRun)
  const meta = useGameStore((s) => s.meta)
  const reducedMotion = useGameStore((s) => s.settings.reducedMotion)

  const [toast, setToast] = useState<string | null>(null)
  const timer = useSeasonTimer()

  // derived cosmetic progression (store has no real level/xp/energy)
  const level = Math.max(1, Math.floor(Math.sqrt(meta.totalRuns * 4 + meta.bestScore / 600)) + 1)
  const xpInto = (meta.bestScore + meta.totalRuns * 250) % 1000
  const xpPct = Math.min(100, (xpInto / 1000) * 100)
  const energy = 30

  const flash = (msg: string): void => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 1600)
  }

  const onStart = (): void => {
    startRun({ mode: 'normal', seed: Math.floor(Math.random() * 1e9) })
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'radial-gradient(120% 85% at 50% 18%, #321C6E 0%, #1A0F3D 45%, #0B0518 100%)',
        color: C.text,
        overflow: 'hidden',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* ===================== TOP BAR ===================== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 12px 8px',
          zIndex: 3,
        }}
      >
        {/* level badge + xp */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 800,
              fontSize: 15,
              color: C.ink,
              background: 'linear-gradient(180deg,#FFE08A,#FFB347,#FF7B00)',
              boxShadow: '0 0 0 2px #B85600, 0 0 14px rgba(255,179,71,0.55)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {level}
          </div>
          <div style={{ width: 84 }}>
            <div style={{ fontSize: 9, color: C.textDim, fontWeight: 700, letterSpacing: '0.05em' }}>
              LEVEL
            </div>
            <div
              style={{
                height: 7,
                borderRadius: 999,
                background: 'rgba(28,16,62,0.92)',
                border: '1px solid rgba(242,236,255,0.10)',
                overflow: 'hidden',
                marginTop: 2,
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${xpPct}%`,
                  borderRadius: 999,
                  background: 'linear-gradient(90deg,#7B61FF,#B14CFF,#E07BFF)',
                  boxShadow: '0 0 10px rgba(177,76,255,0.75)',
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* currencies */}
        <TopStat icon="⚡" value={`${energy}/30`} color={C.warn} />
        <TopStat icon="🪙" value={fmtCompact(meta.coins)} color={C.gold} />
        <TopStat icon="💎" value={fmtCompact(meta.gems)} color={C.cyan} />

        {/* settings gear */}
        <button
          onClick={() => go('settings')}
          aria-label="Settings"
          style={{
            width: 38,
            height: 38,
            flex: '0 0 auto',
            borderRadius: 12,
            border: '1px solid rgba(242,236,255,0.10)',
            background: 'rgba(28,16,62,0.92)',
            color: C.text,
            fontSize: 18,
            cursor: 'pointer',
          }}
        >
          ⚙️
        </button>
      </div>

      {/* ===================== SEASON BANNER ===================== */}
      <div style={{ padding: '4px 12px 0', zIndex: 3 }}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 12px',
            borderRadius: 14,
            overflow: 'hidden',
            background: 'linear-gradient(100deg,#5A1FB8,#B14CFF 50%,#FF7B00)',
            border: '1px solid rgba(255,210,122,0.28)',
            boxShadow: '0 6px 16px rgba(7,3,18,0.55)',
          }}
        >
          <span style={{ fontSize: 22, filter: 'drop-shadow(0 0 8px rgba(177,76,255,0.9))' }}>
            🌑
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: C.gold,
                textShadow: '0 1px 2px rgba(7,3,18,0.6)',
              }}
            >
              SEASON 4
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: '0.02em',
                color: '#FFFFFF',
                textShadow: '0 1px 3px rgba(7,3,18,0.7)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              SHADOW INVASION
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: 999,
              background: 'rgba(11,5,24,0.45)',
              color: C.gold,
              fontVariantNumeric: 'tabular-nums',
              whiteSpace: 'nowrap',
            }}
          >
            ⏳ {timer}
          </div>
        </div>
      </div>

      {/* ===================== CASTLE STAGE ===================== */}
      <div style={{ position: 'relative', flex: 1, minHeight: 0, zIndex: 1 }}>
        <CastleScene reducedMotion={reducedMotion} />
        {/* side buttons: Events / Pass / Inbox */}
        <div
          style={{
            position: 'absolute',
            right: 10,
            top: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            zIndex: 3,
          }}
        >
          {[
            { icon: '🎟️', label: 'Events', act: () => go('rewards') },
            { icon: '🏆', label: 'Pass', act: () => go('battlepass') },
            { icon: '📥', label: 'Inbox', act: () => flash('Inbox — soon') },
          ].map((b) => (
            <button
              key={b.label}
              aria-label={b.label}
              onClick={b.act}
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                border: '1px solid rgba(177,76,255,0.22)',
                background: 'rgba(40,24,84,0.72)',
                backdropFilter: 'blur(6px)',
                color: C.text,
                fontSize: 19,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(7,3,18,0.45)',
              }}
            >
              {b.icon}
            </button>
          ))}
        </div>

        {/* game title */}
        <div
          style={{
            position: 'absolute',
            top: 6,
            left: 12,
            zIndex: 2,
            fontFamily: "'Cinzel', Georgia, serif",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '0.02em',
            textShadow: '0 3px 0 rgba(7,3,18,0.5)',
          }}
        >
          <div style={{ fontSize: 22, color: '#FFFFFF' }}>TOWER</div>
          <div
            style={{
              fontSize: 26,
              background: 'linear-gradient(180deg,#FFF3C4 0%,#FFD27A 40%,#FF9E2C 70%,#FF7B00 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              filter: 'drop-shadow(0 0 12px rgba(255,140,60,0.55))',
            }}
          >
            SWIPE
          </div>
          <div style={{ fontSize: 22, color: '#FFFFFF' }}>DEFENSE</div>
        </div>
      </div>

      {/* ===================== CTA STACK ===================== */}
      <div
        style={{
          padding: '0 16px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          zIndex: 3,
        }}
      >
        <button
          onClick={onStart}
          style={{
            position: 'relative',
            width: '100%',
            minHeight: 60,
            border: 'none',
            borderRadius: 18,
            fontFamily: "'Cinzel', Georgia, serif",
            fontWeight: 800,
            fontSize: 24,
            letterSpacing: '0.08em',
            color: C.ink,
            cursor: 'pointer',
            background: 'linear-gradient(180deg,#FFE08A 0%,#FFB347 38%,#FF7B00 100%)',
            boxShadow:
              '0 6px 0 #B85600, 0 10px 20px rgba(255,123,0,0.30), 0 0 22px rgba(255,140,60,0.5)',
            overflow: 'hidden',
          }}
        >
          {/* top gloss */}
          <span
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 18,
              background: 'linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0) 45%)',
              pointerEvents: 'none',
            }}
          />
          ▶ START
        </button>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => go('worldmap')}
            style={{
              flex: 1,
              minHeight: 48,
              borderRadius: 16,
              border: '1px solid rgba(63,224,255,0.30)',
              fontFamily: "'Cinzel', Georgia, serif",
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: '0.06em',
              color: C.ink,
              cursor: 'pointer',
              background: 'linear-gradient(180deg,#7BEBFF 0%,#3FE0FF 45%,#1B9FCB 100%)',
              boxShadow: '0 5px 0 #1B7FA8, 0 0 18px rgba(63,224,255,0.45)',
            }}
          >
            ♾️ ENDLESS
          </button>
          <button
            onClick={() => flash('CO-OP — coming soon')}
            style={{
              flex: 1,
              minHeight: 48,
              borderRadius: 16,
              border: '1px solid rgba(177,76,255,0.22)',
              fontFamily: "'Cinzel', Georgia, serif",
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: '0.06em',
              color: C.text,
              cursor: 'pointer',
              opacity: 0.92,
              background: 'linear-gradient(180deg,#C77BFF 0%,#B14CFF 45%,#7A2FD6 100%)',
              boxShadow: '0 5px 0 #5A1FB8, 0 0 18px rgba(177,76,255,0.35)',
            }}
          >
            👥 CO-OP
            <span
              style={{
                marginLeft: 6,
                fontSize: 9,
                padding: '2px 6px',
                borderRadius: 999,
                background: 'rgba(11,5,24,0.45)',
                color: C.gold,
                verticalAlign: 'middle',
              }}
            >
              SOON
            </span>
          </button>
        </div>
      </div>

      {/* ===================== BOTTOM NAV ===================== */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 2,
          padding: '4px 8px max(8px, env(safe-area-inset-bottom))',
          background: 'linear-gradient(180deg,rgba(28,16,62,0.0),rgba(18,10,42,0.95))',
          borderTop: '1px solid rgba(177,76,255,0.22)',
          zIndex: 3,
        }}
      >
        <NavItem icon="🛒" label="Shop" onClick={() => go('shop' as never)} />
        <NavItem icon="🏰" label="Towers" onClick={() => go('upgrades')} />
        <NavItem icon="👑" label="Home" active onClick={() => undefined} />
        <NavItem icon="📜" label="Quests" onClick={() => go('daily')} />
        <NavItem icon="🛡️" label="Guild" onClick={() => go('leaderboard')} />
      </nav>

      {/* ===================== TOAST ===================== */}
      {toast && (
        <div
          role="status"
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 92,
            transform: 'translateX(-50%)',
            padding: '10px 18px',
            borderRadius: 999,
            background: 'rgba(8,4,22,0.9)',
            border: '1px solid rgba(255,210,122,0.28)',
            color: C.gold,
            fontWeight: 700,
            fontSize: 13,
            whiteSpace: 'nowrap',
            zIndex: 5,
            boxShadow: '0 6px 16px rgba(7,3,18,0.55)',
          }}
        >
          {toast}
        </div>
      )}
    </div>
  )
}
