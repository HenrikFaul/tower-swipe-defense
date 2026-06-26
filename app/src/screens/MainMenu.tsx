import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { CurrencyBar, Tap } from '../components/Common'
import { skinById } from '../data/upgrades'
import { dailySeed } from '../lib/rng'

// Animated tower vignette echoing the cover art.
function TowerVignette({ skinId }: { skinId: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current!
    const ctx = cv.getContext('2d')!
    let raf = 0
    let t = 0
    const skin = skinById(skinId)
    const draw = () => {
      const w = (cv.width = cv.clientWidth * devicePixelRatio)
      const h = (cv.height = cv.clientHeight * devicePixelRatio)
      ctx.clearRect(0, 0, w, h)
      const cx = w / 2
      const cy = h * 0.62
      const glow = ctx.createRadialGradient(cx, cy, 4, cx, cy, h * 0.5)
      glow.addColorStop(0, 'rgba(255,123,0,0.4)')
      glow.addColorStop(1, 'rgba(255,123,0,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)
      // orbiting embers
      for (let i = 0; i < 14; i++) {
        const a = t * 0.5 + (i / 14) * Math.PI * 2
        const r = 70 * devicePixelRatio + Math.sin(t + i) * 10
        ctx.fillStyle = `rgba(255,179,71,${0.3 + 0.3 * Math.sin(t + i)})`
        ctx.beginPath()
        ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.5, 3 * devicePixelRatio, 0, Math.PI * 2)
        ctx.fill()
      }
      // tower
      const R = 46 * devicePixelRatio
      ctx.fillStyle = '#2a2420'
      ctx.beginPath()
      ctx.arc(cx, cy + 8, R + 10, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#' + skin.color.toString(16).padStart(6, '0')
      ctx.strokeStyle = '#0c0a08'
      ctx.lineWidth = 4 * devicePixelRatio
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      const core = ctx.createRadialGradient(cx, cy, 2, cx, cy, 18 * devicePixelRatio)
      core.addColorStop(0, '#' + skin.projectileColor.toString(16).padStart(6, '0'))
      core.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = core
      ctx.beginPath()
      ctx.arc(cx, cy, 18 * devicePixelRatio, 0, Math.PI * 2)
      ctx.fill()
      t += 0.02
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [skinId])
  return <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} />
}

export default function MainMenu() {
  const go = useGameStore((s) => s.go)
  const startRun = useGameStore((s) => s.startRun)
  const skinId = useGameStore((s) => s.meta.currentSkin)
  const bestWave = useGameStore((s) => s.meta.bestWave)

  return (
    <div className="screen">
      <div className="hud-top">
        <span className="tag" style={{ alignSelf: 'center' }}>
          STRATEGY · SWIPE · ARCADE
        </span>
        <CurrencyBar />
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        <TowerVignette skinId={skinId} />
        <div
          style={{
            position: 'absolute',
            top: '14%',
            left: 0,
            right: 0,
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <h1 className="title-xl display" style={{ color: 'var(--surface)' }}>
            TOWER
            <br />
            SWIPE
          </h1>
          <div
            className="display"
            style={{ color: 'var(--accent)', letterSpacing: '0.5em', fontSize: 22, marginTop: 4 }}
          >
            DEFENSE
          </div>
          {bestWave > 0 && <div className="muted" style={{ marginTop: 10 }}>Best · Wave {bestWave}</div>}
        </div>
      </div>

      <div className="col gap pad">
        <Tap className="btn full" onClick={() => startRun({ mode: 'normal', seed: (Math.random() * 1e9) | 0 })}>
          ▶ PLAY
        </Tap>
        <div className="row gap">
          <Tap className="btn secondary full" onClick={() => go('upgrades')}>
            ⚒ UPGRADES
          </Tap>
          <Tap className="btn secondary full" onClick={() => go('skins')}>
            🛡 SKINS
          </Tap>
        </div>
        <div className="row gap">
          <Tap className="btn secondary full" onClick={() => startRun({ mode: 'daily', seed: dailySeed() })}>
            📅 DAILY
          </Tap>
          <Tap className="btn secondary full" onClick={() => go('leaderboard')}>
            🏆 RANKS
          </Tap>
          <Tap className="icon-btn" onClick={() => go('settings')} ariaLabel="Settings">
            ⚙
          </Tap>
        </div>
      </div>
    </div>
  )
}
