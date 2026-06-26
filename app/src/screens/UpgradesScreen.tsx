import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { AppBar, Tap } from '../components/Common'
import { META_UPGRADES, META_UPGRADE_IDS, metaUpgradeCost } from '../data/upgrades'
import type { MetaUpgradeId } from '../data/types'
import { haptics } from '../lib/haptics'

export default function UpgradesScreen() {
  const meta = useGameStore((s) => s.meta)
  const buy = useGameStore((s) => s.buyMetaUpgrade)
  const [flash, setFlash] = useState<string | null>(null)

  return (
    <div className="screen">
      <AppBar title="Upgrades" />
      <p className="muted pad" style={{ paddingTop: 0 }}>
        Permanent improvements bought with coins. They persist across every run.
      </p>
      <div className="scroll col gap pad" style={{ paddingTop: 0 }}>
        {META_UPGRADE_IDS.map((id) => {
          const def = META_UPGRADES[id as MetaUpgradeId]
          const level = meta.metaUpgrades[id as MetaUpgradeId] ?? 0
          const maxed = level >= def.maxLevel
          const cost = metaUpgradeCost(def, level)
          const afford = meta.coins >= cost
          return (
            <div key={id} className="li">
              <span className="ic">⚒</span>
              <div className="col" style={{ flex: 1 }}>
                <strong>{def.name}</strong>
                <span className="muted">{def.desc}</span>
                <div className="row" style={{ gap: 4, marginTop: 6 }}>
                  {Array.from({ length: def.maxLevel }).map((_, i) => (
                    <span
                      key={i}
                      style={{
                        width: 14,
                        height: 6,
                        borderRadius: 3,
                        background: i < level ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
                      }}
                    />
                  ))}
                </div>
              </div>
              <Tap
                className="btn"
                disabled={maxed || !afford}
                onClick={() => {
                  if (buy(id as MetaUpgradeId)) {
                    haptics.success()
                    setFlash(id)
                    setTimeout(() => setFlash(null), 300)
                  }
                }}
              >
                {maxed ? 'MAX' : `🪙 ${cost}`}
              </Tap>
              {flash === id && <span style={{ position: 'absolute' }} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
