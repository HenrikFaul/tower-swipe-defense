import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { Game, type Hud } from '../engine/game'
import { render } from '../engine/render'
import { BossIntroModal, PauseModal, ResultsModal, ShopModal } from '../components/GameModals'
import { playSfx } from '../lib/audio'
import { submitRun } from '../lib/cloud'

export default function PlayScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Game | null>(null)
  const recordedRef = useRef(false)

  const pendingRun = useGameStore((s) => s.pendingRun)
  const go = useGameStore((s) => s.go)
  const recordRun = useGameStore((s) => s.recordRun)
  const store = useGameStore

  const [hud, setHud] = useState<Hud | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current!
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d', { alpha: false })!
    const run = pendingRun ?? { mode: 'normal' as const, seed: (Math.random() * 1e9) | 0 }

    const s = store.getState()
    const dda = s.ddaForWave()
    const game = new Game({
      width: wrap.clientWidth,
      height: wrap.clientHeight,
      seed: run.seed,
      mode: run.mode,
      config: {
        skinId: s.meta.currentSkin,
        metaUpgrades: s.meta.metaUpgrades,
        ddaDmgMul: dda.ddaDmgMul,
        ddaEnemyHpMul: dda.ddaEnemyHpMul,
      },
      maxHp: s.maxHpForRun(),
      startCoins: s.startCoinsForRun(),
      autoFire: s.settings.autoFire,
      reducedMotion: s.settings.reducedMotion,
      reviveHealPct: s.reviveHealPct(),
      onChange: () => setHud(game.getHud()),
    })
    gameRef.current = game

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const resize = () => {
      const w = wrap.clientWidth
      const h = wrap.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      game.resize(w, h)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    // pointer input
    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const down = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId)
      game.pointerDownAt(toLocal(e))
    }
    const move = (e: PointerEvent) => game.pointerMoveAt(toLocal(e))
    const up = () => game.pointerUp()
    canvas.addEventListener('pointerdown', down)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerup', up)
    canvas.addEventListener('pointercancel', up)

    game.start()
    setHud(game.getHud())

    // render + sim loop
    let raf = 0
    let last = performance.now()
    const frame = (now: number) => {
      const dt = now - last
      last = now
      game.update(dt)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      render(ctx, game, s.meta.currentSkin, s.settings.reducedMotion)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    // lightweight HUD refresh (numbers) ~12fps
    const hudTimer = window.setInterval(() => setHud(game.getHud()), 90)

    // pause when app backgrounded
    const onVis = () => {
      if (document.hidden) game.pause()
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(hudTimer)
      ro.disconnect()
      canvas.removeEventListener('pointerdown', down)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', up)
      canvas.removeEventListener('pointercancel', up)
      document.removeEventListener('visibilitychange', onVis)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const game = gameRef.current

  const finalize = (doubled: boolean, died: boolean) => {
    const g = gameRef.current
    if (!g || recordedRef.current) {
      go('menu')
      return
    }
    recordedRef.current = true
    const s = store.getState()
    const earned = Math.max(0, Math.floor(g.coins) - s.startCoinsForRun())
    const run = {
      mode: pendingRun?.mode ?? ('normal' as const),
      wave: g.wave,
      score: Math.floor(g.score),
      durationMs: g.getElapsedMs(),
      date: new Date().toISOString(),
    }
    recordRun(run, earned, doubled, died)
    // Best-effort cloud submission for the online leaderboard (no-op offline).
    const upgrades = g.getHud().upgradeLevels as unknown as Record<string, number>
    void submitRun(run, upgrades, pendingRun?.seed)
    playSfx('win')
    go('menu')
  }

  const hpFrac = hud ? hud.hp / hud.maxHp : 1
  const comboBig = hud && hud.comboMul > 1.25

  return (
    <div className="screen" ref={wrapRef} style={{ padding: 0 }}>
      <canvas ref={canvasRef} style={{ display: 'block', touchAction: 'none' }} />

      {hud && (
        <>
          <div className="hud-top">
            <div className="col gap" style={{ gap: 6, width: '46%' }}>
              <div className="wave-pill">WAVE {hud.wave}</div>
              <div className={'hpbar' + (hpFrac < 0.25 ? ' low' : '')}>
                <span style={{ width: `${Math.max(0, hpFrac * 100)}%` }} />
              </div>
            </div>
            <div className="row gap" style={{ alignItems: 'flex-start' }}>
              <span className="chip coin">🪙 {hud.coins.toLocaleString()}</span>
              <button
                className="icon-btn"
                aria-label="Pause"
                onClick={() => gameRef.current?.pause()}
              >
                ⏸
              </button>
            </div>
          </div>

          {/* boss hp bar */}
          {hud.bossLabel && hud.phase === 'playing' && hud.bossHpFrac > 0 && (
            <div style={{ position: 'absolute', top: 92, left: 24, right: 24, zIndex: 5 }}>
              <div className="center tag" style={{ color: 'var(--bad)' }}>
                {hud.bossLabel}
              </div>
              <div className="hpbar low">
                <span style={{ width: `${hud.bossHpFrac * 100}%` }} />
              </div>
            </div>
          )}

          {comboBig && <div className="combo-banner">COMBO ×{hud.comboMul.toFixed(2)}</div>}

          <div className="fps">{hud.fps} fps</div>

          {game && hud.phase === 'bossintro' && <BossIntroModal game={game} hud={hud} />}
          {game && hud.phase === 'shop' && (
            <ShopModal game={game} hud={hud} onReroll={() => game.reroll()} />
          )}
          {game && hud.phase === 'paused' && (
            <PauseModal game={game} onQuit={() => finalize(false, false)} />
          )}
          {game && hud.phase === 'gameover' && (
            <ResultsModal
              hud={hud}
              reviveHealPct={store.getState().reviveHealPct()}
              onRevive={() => game.revive()}
              onClaim={(doubled) => finalize(doubled, true)}
            />
          )}
        </>
      )}
    </div>
  )
}
