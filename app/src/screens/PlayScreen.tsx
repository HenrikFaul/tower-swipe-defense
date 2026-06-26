import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { IsoGame, type Hud } from '../engine/isoGame'
import { renderIso } from '../engine/isoRender'
import { TOWERS, TOWER_IDS, type TowerId } from '../data/towers'
import { VictoryModal, PauseModal, GameOverModal } from '../components/IsoModals'
import { playSfx } from '../lib/audio'
import { submitRun } from '../lib/cloud'

export default function PlayScreen() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<IsoGame | null>(null)
  const recordedRef = useRef(false)

  const pendingRun = useGameStore((s) => s.pendingRun)
  const settings = useGameStore((s) => s.settings)
  const go = useGameStore((s) => s.go)
  const recordRun = useGameStore((s) => s.recordRun)
  const runModifiers = useGameStore((s) => s.runModifiers)

  const [hud, setHud] = useState<Hud | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current!
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d', { alpha: false })!
    const run = pendingRun ?? { mode: 'normal' as const, seed: (Math.random() * 1e9) | 0 }

    const game = new IsoGame({
      seed: run.seed,
      mods: runModifiers(),
      onChange: () => setHud(game.getHud()),
    })
    gameRef.current = game

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const resize = () => {
      const cw = wrap.clientWidth
      const ch = wrap.clientHeight
      canvas.width = cw * dpr
      canvas.height = ch * dpr
      canvas.style.width = cw + 'px'
      canvas.style.height = ch + 'px'
      game.resize(cw, ch)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    const toLocal = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const down = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId)
      const p = toLocal(e)
      game.pointerDown(p.x, p.y)
    }
    const move = (e: PointerEvent) => {
      const p = toLocal(e)
      game.pointerMove(p.x, p.y)
    }
    const up = (e: PointerEvent) => {
      const p = toLocal(e)
      game.pointerUp(p.x, p.y)
    }
    canvas.addEventListener('pointerdown', down)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerup', up)
    canvas.addEventListener('pointercancel', up)

    game.start()
    setHud(game.getHud())

    let raf = 0
    let last = performance.now()
    const frame = (now: number) => {
      const dt = now - last
      last = now
      game.update(dt)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      renderIso(ctx, game)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    const hudTimer = window.setInterval(() => setHud(game.getHud()), 90)
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

  const finalize = (doubled: boolean) => {
    const g = gameRef.current
    if (!g || recordedRef.current) {
      go('menu')
      return
    }
    recordedRef.current = true
    const run = {
      mode: pendingRun?.mode ?? ('normal' as const),
      wave: g.wave,
      score: Math.floor(g.score),
      durationMs: 0,
      date: new Date().toISOString(),
    }
    recordRun(run, Math.floor(g.coinsEarned), 0, doubled)
    void submitRun(run, {}, pendingRun?.seed)
    playSfx('ui_tap')
    go('menu')
  }

  return (
    <div className="screen" ref={wrapRef} style={{ padding: 0 }}>
      <canvas ref={canvasRef} style={{ display: 'block', touchAction: 'none' }} />

      {hud && (
        <>
          {/* top HUD */}
          <div className="hud-top">
            <div className="wave-pill">
              WAVE {hud.wave}
              <span style={{ opacity: 0.6, fontSize: 12 }}> /∞</span>
            </div>
            <div className="row gap">
              <span className="chip" style={{ color: '#ff8a7a' }}>❤ {hud.lives}</span>
              <span className="chip coin">🪙 {hud.gold}</span>
              <button className="icon-btn" aria-label="Pause" onClick={() => game?.pause()}>
                ⏸
              </button>
            </div>
          </div>

          {hud.bossLabel && (hud.phase === 'wave') && hud.bossHpFrac > 0 && (
            <div style={{ position: 'absolute', top: 84, left: 24, right: 24, zIndex: 5 }}>
              <div className="center tag" style={{ color: 'var(--bad)' }}>{hud.bossLabel}</div>
              <div className="hpbar low">
                <span style={{ width: `${hud.bossHpFrac * 100}%` }} />
              </div>
            </div>
          )}

          {/* power button */}
          <button
            className="power-btn"
            aria-label="Meteor power"
            disabled={!hud.powerReady}
            onClick={() => { /* swipe to aim on the field; tap shows hint */ }}
          >
            <span>☄️</span>
            {!hud.powerReady && <span className="cd">{Math.ceil(hud.powerCd)}</span>}
          </button>

          {/* bottom controls: tower panel or build cards, plus START WAVE */}
          {(hud.phase === 'build' || hud.phase === 'wave') && (
            <div className="build-bar">
              {hud.selectedTowerInfo ? (
                <div className="tower-panel">
                  <div className="col" style={{ flex: 1 }}>
                    <strong>{TOWERS[hud.selectedTowerInfo.type].name}</strong>
                    <span className="muted">Tier {hud.selectedTowerInfo.tier + 1}</span>
                  </div>
                  <button
                    className="btn"
                    disabled={hud.selectedTowerInfo.maxTier || hud.gold < hud.selectedTowerInfo.upgradeCost}
                    onClick={() => game?.upgradeSelected()}
                  >
                    {hud.selectedTowerInfo.maxTier ? 'MAX' : `⬆ 🪙${hud.selectedTowerInfo.upgradeCost}`}
                  </button>
                  <button className="btn secondary" onClick={() => game?.sellSelected()}>
                    💰 {hud.selectedTowerInfo.sellValue}
                  </button>
                </div>
              ) : (
                <div className="build-cards">
                  {TOWER_IDS.map((id: TowerId) => {
                    const def = TOWERS[id]
                    const cost = hud.buildCosts[id]
                    const sel = hud.selectedBuild === id
                    const afford = hud.gold >= cost
                    return (
                      <button
                        key={id}
                        className={'build-card' + (sel ? ' sel' : '') + (afford ? '' : ' poor')}
                        onClick={() => game?.setBuild(sel ? null : id)}
                      >
                        <span className="bi">{def.icon}</span>
                        <span className="bc">🪙{cost}</span>
                      </button>
                    )
                  })}
                </div>
              )}
              {hud.phase === 'build' && (
                <button className="btn start-wave" onClick={() => game?.startWave()}>
                  ▶ START WAVE {hud.wave}
                </button>
              )}
            </div>
          )}

          {hud.phase === 'paused' && game && <PauseModal game={game} onQuit={() => finalize(false)} />}
          {hud.phase === 'cleared' && game && <VictoryModal game={game} hud={hud} />}
          {hud.phase === 'gameover' && <GameOverModal hud={hud} onClaim={(d) => finalize(d)} />}

          <div className="fps">{hud.fps} fps</div>
          {settings.reducedMotion && null}
        </>
      )}
    </div>
  )
}
