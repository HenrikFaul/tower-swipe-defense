import { useState } from 'react'
import type { Game, Hud } from '../engine/game'
import { UPGRADES } from '../data/upgrades'
import { Tap } from './Common'

export function BossIntroModal({ game, hud }: { game: Game; hud: Hud }) {
  return (
    <div className="overlay">
      <div className="modal center">
        <div className="tag" style={{ color: 'var(--bad)' }}>
          WAVE {hud.wave} · BOSS
        </div>
        <div style={{ fontSize: 56, margin: '8px 0' }}>{hud.bossLabel === 'Dragon' ? '🐉' : '☠️'}</div>
        <h2 className="display" style={{ margin: '0 0 6px' }}>
          {hud.bossLabel}
        </h2>
        <p className="muted" style={{ marginTop: 0 }}>
          A mighty foe approaches the tower. Hold the line!
        </p>
        <Tap className="btn full" onClick={() => game.beginBossWave()}>
          ⚔ BEGIN FIGHT
        </Tap>
      </div>
    </div>
  )
}

export function ShopModal({
  game,
  hud,
  onReroll,
}: {
  game: Game
  hud: Hud
  onReroll: () => void
}) {
  return (
    <div className="overlay">
      <div className="modal">
        <div className="center">
          <div className="tag">WAVE {hud.wave} CLEARED</div>
          <h2 className="display" style={{ margin: '4px 0 14px' }}>
            Choose an Upgrade
          </h2>
        </div>
        <div className="col gap">
          {hud.shopChoices.map((id) => {
            const def = UPGRADES[id]
            const lvl = hud.upgradeLevels[id] ?? 0
            return (
              <button key={id} className="choice" onClick={() => game.pickUpgrade(id)}>
                <span className="ic">{def.icon}</span>
                <span className="col">
                  <strong>{def.name}</strong>
                  <span className="muted">{def.desc}</span>
                </span>
                <span className="lvl">
                  Lv {lvl}/{def.maxLevel}
                </span>
              </button>
            )
          })}
        </div>
        <div className="row gap" style={{ marginTop: 14 }}>
          <Tap className="btn secondary full" onClick={onReroll}>
            🔄 Reroll (Ad)
          </Tap>
          <Tap className="btn ghost" onClick={() => game.skipShop()}>
            Skip ›
          </Tap>
        </div>
      </div>
    </div>
  )
}

export function PauseModal({ game, onQuit }: { game: Game; onQuit: () => void }) {
  return (
    <div className="overlay">
      <div className="modal center">
        <h2 className="display">Paused</h2>
        <div className="col gap" style={{ marginTop: 12 }}>
          <Tap className="btn full" onClick={() => game.resume()}>
            ▶ Resume
          </Tap>
          <Tap className="btn secondary full" onClick={onQuit}>
            ⌂ Quit to Menu
          </Tap>
        </div>
      </div>
    </div>
  )
}

export function ResultsModal({
  hud,
  reviveHealPct,
  onRevive,
  onClaim,
}: {
  hud: Hud
  reviveHealPct: number
  onRevive: () => void
  onClaim: (doubled: boolean) => void
}) {
  const [claimed, setClaimed] = useState(false)
  const r = hud.result!
  const stars = Math.min(3, Math.floor(r.wave / 10) + 1)
  return (
    <div className="overlay">
      <div className="modal center">
        <div className="tag" style={{ color: 'var(--bad)' }}>
          TOWER FALLEN
        </div>
        <h1 className="display" style={{ fontSize: 40, margin: '6px 0' }}>
          WAVE {r.wave}
        </h1>
        <div className="stars">{'★'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
        <div className="row gap" style={{ justifyContent: 'center', margin: '14px 0' }}>
          <span className="chip">🏆 {r.score.toLocaleString()}</span>
          <span className="chip coin">🪙 {r.coins.toLocaleString()}</span>
        </div>
        <div className="col gap">
          {!hud.reviveUsed && (
            <Tap className="btn full" onClick={onRevive}>
              ❤ Revive ({Math.round(reviveHealPct * 100)}% HP · Ad)
            </Tap>
          )}
          {!claimed ? (
            <>
              <Tap
                className="btn secondary full"
                onClick={() => {
                  setClaimed(true)
                  onClaim(true)
                }}
              >
                ▶▶ Double Coins (Ad)
              </Tap>
              <Tap
                className="btn ghost"
                onClick={() => {
                  setClaimed(true)
                  onClaim(false)
                }}
              >
                Claim & Continue ›
              </Tap>
            </>
          ) : (
            <div className="muted">Rewards claimed!</div>
          )}
        </div>
      </div>
    </div>
  )
}
