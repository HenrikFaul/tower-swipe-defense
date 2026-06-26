import { useEffect, useRef } from 'react'

/**
 * HeroSplash — Panel 1 of the promo board.
 * Animated canvas splash: purple/red dragon silhouette breathing behind stone
 * towers that fire cyan/magenta/orange laser beams at incoming enemies, all
 * under a heavy vignette. On top sit the extruded CSS "TOWER SWIPE DEFENSE"
 * logo with a gold crown, the tagline, and a pulsing "TAP TO START".
 *
 * Self-contained: no store, no external libs, no images. All visuals are drawn
 * with Canvas 2D or styled inline so it can be dropped in anywhere.
 */

type HeroSplashProps = {
  onStart: () => void
}

// ---- palette (mirrors the design token system) -----------------------------
const COL = {
  bg700: '#1A0F3D',
  bg900: '#0B0518',
  bg500: '#321C6E',
  magenta: '#B14CFF',
  magentaDeep: '#5A1FB8',
  orange: '#FF7B00',
  orange2: '#FFB347',
  gold: '#FFD27A',
  cyan: '#3FE0FF',
  dragon: '#7A1E3A',
  dragonHi: '#FF4D5E',
} as const

const LASER_COLORS = [COL.cyan, COL.magenta, COL.orange2] as const

function rgba(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

// ---- scene model ------------------------------------------------------------
type Tower = { x: number; y: number; color: string; phase: number }
type Enemy = { x: number; y: number; r: number; hue: number; wob: number }
type Spark = { x: number; y: number; vx: number; vy: number; life: number; color: string }

const TWO_PI = Math.PI * 2

export default function HeroSplash({ onStart }: HeroSplashProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0
    let H = 0
    let dpr = 1

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let towers: Tower[] = []
    const enemies: Enemy[] = []
    const sparks: Spark[] = []

    const resize = (): void => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = Math.max(1, rect.width)
      H = Math.max(1, rect.height)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // three stone towers along the lower third
      towers = [
        { x: W * 0.2, y: H * 0.78, color: LASER_COLORS[0], phase: 0 },
        { x: W * 0.5, y: H * 0.84, color: LASER_COLORS[1], phase: 1.4 },
        { x: W * 0.8, y: H * 0.78, color: LASER_COLORS[2], phase: 2.7 },
      ]

      // a few drifting enemies up top
      enemies.length = 0
      const huePool = [320, 280, 20]
      for (let i = 0; i < 5; i++) {
        enemies.push({
          x: W * (0.12 + 0.18 * i),
          y: H * (0.34 + 0.06 * Math.sin(i)),
          r: 10 + (i % 3) * 3,
          hue: huePool[i % huePool.length],
          wob: i * 1.3,
        })
      }
    }

    // ---- draw helpers -------------------------------------------------------
    const drawBackground = (t: number): void => {
      // radial purple bloom over a navy/void base
      const g = ctx.createRadialGradient(
        W * 0.5,
        H * 0.2,
        0,
        W * 0.5,
        H * 0.2,
        Math.max(W, H) * 0.95,
      )
      g.addColorStop(0, COL.bg500)
      g.addColorStop(0.45, COL.bg700)
      g.addColorStop(1, COL.bg900)
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)

      // soft drifting ambient orbs
      ctx.globalCompositeOperation = 'lighter'
      for (let i = 0; i < 3; i++) {
        const ox = W * (0.3 + 0.2 * i) + Math.sin(t * 0.0004 + i) * 24
        const oy = H * (0.25 + 0.05 * i) + Math.cos(t * 0.0005 + i) * 18
        const og = ctx.createRadialGradient(ox, oy, 0, ox, oy, 120)
        og.addColorStop(0, rgba(i === 1 ? COL.orange : COL.magenta, 0.18))
        og.addColorStop(1, rgba(COL.magenta, 0))
        ctx.fillStyle = og
        ctx.beginPath()
        ctx.arc(ox, oy, 120, 0, TWO_PI)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    const drawDragon = (t: number): void => {
      const breathe = reduced ? 0 : Math.sin(t * 0.0016) * 0.5 + 0.5
      const cx = W * 0.5
      const cy = H * 0.42
      const s = Math.min(W, H) * 0.0016

      ctx.save()
      ctx.translate(cx, cy)

      // body glow halo behind silhouette
      ctx.globalCompositeOperation = 'lighter'
      const halo = ctx.createRadialGradient(0, -20, 0, 0, -20, 240 * s * 100)
      halo.addColorStop(0, rgba(COL.dragonHi, 0.16 + breathe * 0.12))
      halo.addColorStop(1, rgba(COL.dragon, 0))
      ctx.fillStyle = halo
      ctx.beginPath()
      ctx.arc(0, -20, 240, 0, TWO_PI)
      ctx.fill()
      ctx.globalCompositeOperation = 'source-over'

      // silhouette body (dark red/purple)
      ctx.fillStyle = rgba(COL.dragon, 0.92)
      ctx.beginPath()
      // wings
      const wingLift = (reduced ? 0 : Math.sin(t * 0.002)) * 22
      ctx.moveTo(0, -10)
      ctx.quadraticCurveTo(-150, -120 - wingLift, -210, -30 - wingLift)
      ctx.quadraticCurveTo(-150, -40, -70, 0)
      ctx.quadraticCurveTo(-150, 30, -200, 70 + wingLift)
      ctx.quadraticCurveTo(-130, 60, 0, 30)
      ctx.quadraticCurveTo(130, 60, 200, 70 + wingLift)
      ctx.quadraticCurveTo(150, 30, 70, 0)
      ctx.quadraticCurveTo(150, -40, 210, -30 - wingLift)
      ctx.quadraticCurveTo(150, -120 - wingLift, 0, -10)
      ctx.closePath()
      ctx.fill()

      // head + neck
      ctx.beginPath()
      ctx.moveTo(0, -10)
      ctx.quadraticCurveTo(20, -70, 8, -110)
      ctx.quadraticCurveTo(40, -120, 52, -98)
      ctx.quadraticCurveTo(60, -80, 30, -64)
      ctx.quadraticCurveTo(28, -30, 0, -10)
      ctx.closePath()
      ctx.fill()

      // rim light along the spine
      ctx.strokeStyle = rgba(COL.dragonHi, 0.55 + breathe * 0.3)
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(8, -108)
      ctx.quadraticCurveTo(22, -60, 0, -8)
      ctx.stroke()

      // glowing eye
      ctx.globalCompositeOperation = 'lighter'
      ctx.fillStyle = rgba(COL.orange2, 0.9)
      ctx.shadowColor = COL.orange
      ctx.shadowBlur = 18
      ctx.beginPath()
      ctx.arc(34, -92, 3.4, 0, TWO_PI)
      ctx.fill()

      // fire breath puff
      if (!reduced) {
        const fire = (Math.sin(t * 0.0016) + 1) * 0.5
        const fg = ctx.createRadialGradient(56, -96, 0, 70 + fire * 14, -98, 40)
        fg.addColorStop(0, rgba(COL.orange2, 0.55 * fire))
        fg.addColorStop(0.5, rgba(COL.orange, 0.3 * fire))
        fg.addColorStop(1, rgba(COL.orange, 0))
        ctx.fillStyle = fg
        ctx.beginPath()
        ctx.arc(70 + fire * 14, -98, 40, 0, TWO_PI)
        ctx.fill()
      }
      ctx.shadowBlur = 0
      ctx.globalCompositeOperation = 'source-over'
      ctx.restore()
    }

    const drawEnemies = (t: number): void => {
      for (const e of enemies) {
        const wob = reduced ? 0 : Math.sin(t * 0.002 + e.wob) * 4
        const x = e.x
        const y = e.y + wob
        ctx.save()
        ctx.globalCompositeOperation = 'lighter'
        const g = ctx.createRadialGradient(x, y, 0, x, y, e.r * 1.8)
        g.addColorStop(0, `hsla(${e.hue},90%,65%,0.9)`)
        g.addColorStop(1, `hsla(${e.hue},90%,55%,0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, y, e.r * 1.8, 0, TWO_PI)
        ctx.fill()
        ctx.globalCompositeOperation = 'source-over'
        ctx.fillStyle = `hsl(${e.hue},70%,45%)`
        ctx.beginPath()
        ctx.arc(x, y, e.r, 0, TWO_PI)
        ctx.fill()
        ctx.restore()
      }
    }

    const drawTower = (tw: Tower): void => {
      const baseW = 34
      const baseH = 46
      const x = tw.x
      const y = tw.y
      ctx.save()
      // stone body
      const grad = ctx.createLinearGradient(x - baseW / 2, y, x + baseW / 2, y)
      grad.addColorStop(0, '#3A2E55')
      grad.addColorStop(0.5, '#5A4C7A')
      grad.addColorStop(1, '#2A2042')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.moveTo(x - baseW / 2, y)
      ctx.lineTo(x - baseW / 2 + 4, y - baseH)
      ctx.lineTo(x + baseW / 2 - 4, y - baseH)
      ctx.lineTo(x + baseW / 2, y)
      ctx.closePath()
      ctx.fill()

      // battlement teeth
      ctx.fillStyle = '#6A5A8C'
      for (let i = 0; i < 3; i++) {
        const tx = x - baseW / 2 + 6 + i * 10
        ctx.fillRect(tx, y - baseH - 6, 6, 6)
      }
      // glowing crystal core (color of its laser)
      ctx.globalCompositeOperation = 'lighter'
      ctx.fillStyle = rgba(tw.color, 0.9)
      ctx.shadowColor = tw.color
      ctx.shadowBlur = 16
      ctx.beginPath()
      ctx.arc(x, y - baseH * 0.55, 6, 0, TWO_PI)
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.globalCompositeOperation = 'source-over'
      ctx.restore()
    }

    const drawBeam = (tw: Tower, target: Enemy, intensity: number): void => {
      const sx = tw.x
      const sy = tw.y - 46 * 0.55
      const tx = target.x
      const ty = target.y
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      // wide faint halo
      ctx.strokeStyle = rgba(tw.color, 0.3 * intensity)
      ctx.lineWidth = 9
      ctx.shadowColor = tw.color
      ctx.shadowBlur = 18
      ctx.beginPath()
      ctx.moveTo(sx, sy)
      ctx.lineTo(tx, ty)
      ctx.stroke()
      // bright thin core
      ctx.strokeStyle = rgba('#FFFFFF', 0.9 * intensity)
      ctx.lineWidth = 2.5
      ctx.shadowBlur = 8
      ctx.beginPath()
      ctx.moveTo(sx, sy)
      ctx.lineTo(tx, ty)
      ctx.stroke()
      // impact flash
      const fg = ctx.createRadialGradient(tx, ty, 0, tx, ty, 16)
      fg.addColorStop(0, rgba('#FFFFFF', 0.8 * intensity))
      fg.addColorStop(0.4, rgba(tw.color, 0.5 * intensity))
      fg.addColorStop(1, rgba(tw.color, 0))
      ctx.fillStyle = fg
      ctx.beginPath()
      ctx.arc(tx, ty, 16, 0, TWO_PI)
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.globalCompositeOperation = 'source-over'
      ctx.restore()
    }

    const spawnSparks = (x: number, y: number, color: string): void => {
      for (let i = 0; i < 6; i++) {
        const a = Math.random() * TWO_PI
        const sp = 0.6 + Math.random() * 1.4
        sparks.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 1,
          color,
        })
      }
    }

    const drawSparks = (dt: number): void => {
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx * dt * 0.06
        s.y += s.vy * dt * 0.06
        s.life -= dt * 0.002
        if (s.life <= 0) {
          sparks.splice(i, 1)
          continue
        }
        ctx.fillStyle = rgba(s.color, s.life)
        ctx.beginPath()
        ctx.arc(s.x, s.y, 1.6 * s.life + 0.4, 0, TWO_PI)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
      ctx.restore()
    }

    const drawVignette = (): void => {
      const g = ctx.createRadialGradient(
        W * 0.5,
        H * 0.42,
        Math.min(W, H) * 0.3,
        W * 0.5,
        H * 0.42,
        Math.max(W, H) * 0.75,
      )
      g.addColorStop(0, 'rgba(11,5,24,0)')
      g.addColorStop(1, 'rgba(11,5,24,0.85)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)
    }

    // ---- main loop ----------------------------------------------------------
    let last = performance.now()
    const FIRE_PERIOD = 1500 // ms per tower cycle

    const frame = (now: number): void => {
      const dt = Math.min(48, now - last)
      last = now

      drawBackground(now)
      drawDragon(now)
      drawEnemies(now)

      for (const tw of towers) drawTower(tw)

      // beams: each tower fires on its own cadence at a chosen enemy
      towers.forEach((tw, i) => {
        const cyc = ((now + tw.phase * 400) % FIRE_PERIOD) / FIRE_PERIOD
        // beam is "on" for the first 40% of the cycle
        if (cyc < 0.4 && enemies.length > 0) {
          const target = enemies[(i * 2 + Math.floor(now / FIRE_PERIOD)) % enemies.length]
          const intensity = reduced ? 0.7 : 1 - cyc / 0.4
          drawBeam(tw, target, Math.max(0.25, intensity))
          if (!reduced && cyc < 0.06) spawnSparks(target.x, target.y, tw.color)
        }
      })

      drawSparks(dt)
      drawVignette()

      rafRef.current = requestAnimationFrame(frame)
    }

    resize()
    window.addEventListener('resize', resize)
    rafRef.current = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Tap to start"
      onClick={onStart}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onStart()
        }
      }}
      style={styles.root}
    >
      <canvas ref={canvasRef} style={styles.canvas} />

      <div style={styles.overlay}>
        <div style={styles.logoWrap}>
          <div style={styles.crown} aria-hidden>
            👑
          </div>
          <div style={styles.logo}>
            <span style={styles.lineWhite}>TOWER</span>
            <span style={styles.lineGold}>SWIPE</span>
            <span style={styles.lineWhite}>DEFENSE</span>
          </div>
          <div style={styles.tagline}>SWIPE. AIM. DEFEND.</div>
          <div style={styles.taglineSub}>ONE FINGER. ENDLESS ACTION!</div>
        </div>

        <div style={styles.tapWrap}>
          <div style={styles.tapText}>TAP TO START</div>
        </div>
      </div>

      <style>{KEYFRAMES}</style>
    </div>
  )
}

// ---- inline styles ----------------------------------------------------------
const styles: Record<string, React.CSSProperties> = {
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: 0,
    overflow: 'hidden',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    cursor: 'pointer',
    background: '#0B0518',
  },
  canvas: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    display: 'block',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '40px 20px 56px',
    pointerEvents: 'none',
  },
  logoWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '4vh',
    textAlign: 'center',
  },
  crown: {
    fontSize: 40,
    lineHeight: 1,
    marginBottom: -6,
    filter: 'drop-shadow(0 0 14px rgba(255,210,122,0.75))',
    animation: 'crownBob 2.6s ease-in-out infinite',
  },
  logo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    fontFamily: "'Cinzel', Georgia, serif",
    fontWeight: 800,
    letterSpacing: '0.04em',
    lineHeight: 0.96,
  },
  lineWhite: {
    fontSize: 'clamp(34px, 11vw, 56px)',
    color: '#FFFFFF',
    textShadow:
      '0 2px 0 #5A1FB8, 0 4px 0 #3A1380, 0 6px 0 #2A0E60, 0 8px 14px rgba(0,0,0,0.55), 0 0 24px rgba(177,76,255,0.5)',
  },
  lineGold: {
    fontSize: 'clamp(40px, 13vw, 64px)',
    backgroundImage:
      'linear-gradient(180deg, #FFF3C4 0%, #FFD27A 40%, #FF9E2C 70%, #FF7B00 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
    filter:
      'drop-shadow(0 3px 0 #B85600) drop-shadow(0 6px 10px rgba(0,0,0,0.5)) drop-shadow(0 0 22px rgba(255,140,60,0.7))',
  },
  tagline: {
    marginTop: 14,
    fontFamily: "'Cinzel', Georgia, serif",
    fontWeight: 700,
    fontSize: 'clamp(13px, 4vw, 17px)',
    letterSpacing: '0.16em',
    color: '#F2ECFF',
    textShadow: '0 0 12px rgba(177,76,255,0.6)',
  },
  taglineSub: {
    marginTop: 3,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 700,
    fontSize: 'clamp(11px, 3.4vw, 14px)',
    letterSpacing: '0.1em',
    color: '#FFB347',
    textShadow: '0 0 10px rgba(255,123,0,0.55)',
  },
  tapWrap: {
    display: 'flex',
    justifyContent: 'center',
    animation: 'tapPulse 1.4s ease-in-out infinite',
  },
  tapText: {
    fontFamily: "'Cinzel', Georgia, serif",
    fontWeight: 800,
    fontSize: 'clamp(16px, 5vw, 22px)',
    letterSpacing: '0.18em',
    color: '#FFD27A',
    padding: '10px 26px',
    borderRadius: 999,
    border: '2px solid rgba(255,210,122,0.45)',
    background: 'rgba(40,24,84,0.5)',
    textShadow: '0 0 16px rgba(255,210,122,0.85)',
    boxShadow:
      '0 0 18px rgba(255,210,122,0.35), inset 0 0 12px rgba(255,179,71,0.25)',
  },
}

const KEYFRAMES = `
@keyframes tapPulse {
  0%, 100% { opacity: 0.65; transform: scale(0.98); }
  50%      { opacity: 1;    transform: scale(1.04); }
}
@keyframes crownBob {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50%      { transform: translateY(-5px) rotate(2deg); }
}
@media (prefers-reduced-motion: reduce) {
  @keyframes tapPulse { 0%,100% { opacity: 0.85; transform: none; } }
  @keyframes crownBob { 0%,100% { transform: none; } }
}
`
