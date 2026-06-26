import { useState } from 'react'
import { useGameStore, towerLevelCost, TOWER_LEVEL_MAX } from '../store/gameStore'
import { AppBar, Tap } from '../components/Common'
import { TOWERS, TOWER_IDS } from '../data/towers'
import { RELICS } from '../data/relics'
import { haptics } from '../lib/haptics'

type Tab = 'towers' | 'relics'

export default function UpgradesScreen() {
  const meta = useGameStore((s) => s.meta)
  const buyTowerLevel = useGameStore((s) => s.buyTowerLevel)
  const buyRelic = useGameStore((s) => s.buyRelic)
  const [tab, setTab] = useState<Tab>('towers')

  return (
    <div className="screen">
      <AppBar title="Upgrades" />
      <div className="tabs" style={{ marginBottom: 10 }}>
        <div className={'tab' + (tab === 'towers' ? ' active' : '')} onClick={() => setTab('towers')}>TOWERS</div>
        <div className={'tab' + (tab === 'relics' ? ' active' : '')} onClick={() => setTab('relics')}>RELICS</div>
      </div>

      <div className="scroll col gap pad" style={{ paddingTop: 0 }}>
        {tab === 'towers' &&
          TOWER_IDS.map((id) => {
            const def = TOWERS[id]
            const t0 = def.tiers[0]
            const level = meta.towerLevels[id] ?? 0
            const maxed = level >= TOWER_LEVEL_MAX
            const cost = towerLevelCost(level)
            const afford = meta.coins >= cost
            return (
              <div key={id} className="li">
                <span className="ic">{def.icon}</span>
                <div className="col" style={{ flex: 1, gap: 4 }}>
                  <strong>{def.name}</strong>
                  <div className="row" style={{ gap: 6 }}>
                    <span className="stat-pill">⚔ {t0.dmgMin}-{t0.dmgMax}</span>
                    <span className="stat-pill">⏱ {t0.cd}s</span>
                    <span className="stat-pill">◎ {t0.range.toFixed(1)}</span>
                  </div>
                  <div className="row" style={{ gap: 4, marginTop: 2 }}>
                    {Array.from({ length: TOWER_LEVEL_MAX }).map((_, i) => (
                      <span key={i} style={{ width: 16, height: 6, borderRadius: 3, background: i < level ? 'var(--accent)' : 'rgba(255,255,255,0.15)' }} />
                    ))}
                  </div>
                </div>
                <Tap
                  className="btn"
                  disabled={maxed || !afford}
                  onClick={() => {
                    if (buyTowerLevel(id)) haptics.success()
                  }}
                >
                  {maxed ? 'MAX' : `🪙 ${cost}`}
                </Tap>
              </div>
            )
          })}

        {tab === 'relics' &&
          RELICS.map((r) => {
            const owned = meta.relics.includes(r.id)
            const afford = meta.gems >= r.price
            return (
              <div key={r.id} className="li">
                <span className="ic">{r.icon}</span>
                <div className="col" style={{ flex: 1 }}>
                  <strong>{r.name}</strong>
                  <span className="muted">{r.desc}</span>
                </div>
                <Tap
                  className={owned ? 'btn secondary' : 'btn'}
                  disabled={owned || !afford}
                  onClick={() => {
                    if (buyRelic(r.id)) haptics.success()
                  }}
                >
                  {owned ? 'OWNED' : `💎 ${r.price}`}
                </Tap>
              </div>
            )
          })}
      </div>

      <div className="row spread pad" style={{ borderTop: '1px solid var(--panel-line)' }}>
        <span className="chip coin">🪙 {meta.coins.toLocaleString()}</span>
        <span className="chip gem">💎 {meta.gems.toLocaleString()}</span>
      </div>
    </div>
  )
}
