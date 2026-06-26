import { useState } from 'react'
import type { Hud, IsoGame } from '../engine/isoGame'
import { Tap } from './Common'

export function VictoryModal({ game, hud }: { game: IsoGame; hud: Hud }) {
  const c = hud.cleared!
  return (
    <div className="overlay">
      <div className="modal center">
        <h1 className="display" style={{ fontSize: 34, margin: '2px 0 6px' }}>
          WAVE {c.wave}
          <br />
          CLEARED
        </h1>
        <div className="stars">
          {'★'.repeat(c.stars)}
          <span style={{ opacity: 0.25 }}>{'★'.repeat(3 - c.stars)}</span>
        </div>
        <div className="tag" style={{ marginTop: 10 }}>
          REWARDS
        </div>
        <div className="row gap" style={{ justifyContent: 'center', margin: '8px 0 16px' }}>
          <span className="chip coin">🪙 {c.coins}</span>
          {c.gems > 0 && <span className="chip gem">💎 {c.gems}</span>}
        </div>
        <div className="crate">🎁</div>
        <Tap className="btn full" onClick={() => game.continueAfterClear()}>
          CONTINUE
        </Tap>
      </div>
    </div>
  )
}

export function PauseModal({ game, onQuit }: { game: IsoGame; onQuit: () => void }) {
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

export function GameOverModal({
  hud,
  onClaim,
}: {
  hud: Hud
  onClaim: (doubled: boolean) => void
}) {
  const [claimed, setClaimed] = useState(false)
  const r = hud.result!
  return (
    <div className="overlay">
      <div className="modal center">
        <div className="tag" style={{ color: 'var(--bad)' }}>
          THE KEEP HAS FALLEN
        </div>
        <h1 className="display" style={{ fontSize: 38, margin: '6px 0' }}>
          WAVE {r.wave}
        </h1>
        <div className="row gap" style={{ justifyContent: 'center', margin: '12px 0' }}>
          <span className="chip">🏆 {r.score.toLocaleString()}</span>
          <span className="chip coin">🪙 {r.coins.toLocaleString()}</span>
        </div>
        {!claimed ? (
          <div className="col gap">
            <Tap
              className="btn full"
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
          </div>
        ) : (
          <div className="muted">Rewards claimed!</div>
        )}
      </div>
    </div>
  )
}
