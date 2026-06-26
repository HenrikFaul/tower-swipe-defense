import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { CurrencyBar, Tap } from '../components/Common'
import { dailySeed } from '../lib/rng'

// Dramatic castle-silhouette vignette against an amber moon (cover mockup 1).
function CastleScene() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current!
    const ctx = cv.getContext('2d')!
    let raf = 0
    let t = 0
    const draw = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      cv.width = cv.clientWidth * dpr
      cv.height = cv.clientHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const W = cv.clientWidth
      const H = cv.clientHeight

      // night sky
      const sky = ctx.createLinearGradient(0, 0, 0, H)
      sky.addColorStop(0, '#0c2024')
      sky.addColorStop(0.6, '#0a1a1e')
      sky.addColorStop(1, '#06100f')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, W, H)

      // moon
      const mx = W * 0.5
      const my = H * 0.34
      const glow = ctx.createRadialGradient(mx, my, 10, mx, my, H * 0.42)
      glow.addColorStop(0, 'rgba(255,150,40,0.95)')
      glow.addColorStop(0.35, 'rgba(255,120,20,0.5)')
      glow.addColorStop(1, 'rgba(255,120,20,0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(mx, my, H * 0.42, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#ffb24d'
      ctx.beginPath()
      ctx.arc(mx, my, Math.min(W, H) * 0.17, 0, Math.PI * 2)
      ctx.fill()

      // castle silhouette
      const baseY = H * 0.62
      ctx.fillStyle = '#070f10'
      // wall
      ctx.fillRect(W * 0.2, baseY - 30, W * 0.6, H * 0.3)
      const tower = (cx: number, tw: number, th: number) => {
        ctx.fillRect(cx - tw / 2, baseY - th, tw, th + H * 0.3)
        // pointed roof
        ctx.beginPath()
        ctx.moveTo(cx - tw / 2 - 3, baseY - th)
        ctx.lineTo(cx, baseY - th - tw * 1.1)
        ctx.lineTo(cx + tw / 2 + 3, baseY - th)
        ctx.closePath()
        ctx.fill()
      }
      tower(W * 0.5, W * 0.16, H * 0.32) // central keep
      tower(W * 0.3, W * 0.1, H * 0.2)
      tower(W * 0.7, W * 0.1, H * 0.2)
      tower(W * 0.22, W * 0.07, H * 0.13)
      tower(W * 0.78, W * 0.07, H * 0.13)
      // battlements on the wall
      for (let i = 0; i < 10; i++) {
        const bx = W * 0.2 + (i / 10) * W * 0.6
        ctx.fillRect(bx, baseY - 38, W * 0.03, 10)
      }
      // tiny lit windows
      ctx.fillStyle = 'rgba(255,170,60,0.85)'
      ctx.fillRect(W * 0.49, baseY - H * 0.2, 5, 8)
      ctx.fillRect(W * 0.5, baseY - H * 0.14, 5, 8)

      // bats
      ctx.strokeStyle = 'rgba(0,0,0,0.8)'
      ctx.lineWidth = 2
      for (let i = 0; i < 7; i++) {
        const bx = mx + Math.sin(t * 0.5 + i) * 80 + (i - 3) * 26
        const by = my - 40 + Math.cos(t * 0.6 + i * 1.3) * 30
        ctx.beginPath()
        ctx.moveTo(bx - 6, by)
        ctx.quadraticCurveTo(bx - 3, by - 4, bx, by)
        ctx.quadraticCurveTo(bx + 3, by - 4, bx + 6, by)
        ctx.stroke()
      }

      t += 0.02
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} />
}

export default function MainMenu() {
  const go = useGameStore((s) => s.go)
  const startRun = useGameStore((s) => s.startRun)
  const bestWave = useGameStore((s) => s.meta.bestWave)

  return (
    <div className="screen">
      <div className="hud-top">
        <span className="tag" style={{ alignSelf: 'center' }}>STRATEGY · SWIPE · ARCADE</span>
        <CurrencyBar />
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        <CastleScene />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: '6%', textAlign: 'center', pointerEvents: 'none' }}>
          <h1 className="display" style={{ fontSize: '13vw', lineHeight: 0.86, margin: 0, color: 'var(--surface)', textShadow: '0 4px 18px rgba(0,0,0,0.7)' }}>
            TOWER
            <br />
            <span style={{ color: 'var(--accent)' }}>SWIPE</span>
          </h1>
          <div className="display" style={{ color: 'var(--surface)', letterSpacing: '0.55em', fontSize: 20, marginTop: 2 }}>
            DEFENSE
          </div>
          {bestWave > 0 && <div className="muted" style={{ marginTop: 8 }}>Best · Wave {bestWave}</div>}
        </div>
      </div>

      <div className="col gap pad">
        <Tap className="btn full" onClick={() => startRun({ mode: 'normal', seed: (Math.random() * 1e9) | 0 })}>
          ▶ PLAY
        </Tap>
        <div className="row gap">
          <Tap className="btn secondary full" onClick={() => go('upgrades')}>🏰 TOWERS</Tap>
          <Tap className="btn secondary full" onClick={() => go('upgrades')}>⬆ UPGRADES</Tap>
          <Tap className="btn secondary full" onClick={() => go('settings')}>🛒 SHOP</Tap>
        </div>
        <div className="row gap">
          <Tap className="btn secondary full" onClick={() => startRun({ mode: 'daily', seed: dailySeed() })}>📅 DAILY</Tap>
          <Tap className="btn secondary full" onClick={() => go('leaderboard')}>🏆 RANKS</Tap>
          <Tap className="icon-btn" onClick={() => go('settings')} ariaLabel="Settings">⚙</Tap>
        </div>
      </div>
    </div>
  )
}
