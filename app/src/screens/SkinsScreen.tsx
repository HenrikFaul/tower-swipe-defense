import { useGameStore } from '../store/gameStore'
import { AppBar, Tap } from '../components/Common'
import { SKINS } from '../data/upgrades'
import { hex } from '../engine/vec'
import { haptics } from '../lib/haptics'

export default function SkinsScreen() {
  const meta = useGameStore((s) => s.meta)
  const buySkin = useGameStore((s) => s.buySkin)
  const selectSkin = useGameStore((s) => s.selectSkin)

  return (
    <div className="screen">
      <AppBar title="Tower Skins" />
      <p className="muted pad" style={{ paddingTop: 0 }}>
        Each skin is more than cosmetic — it grants a unique battle ability.
      </p>
      <div className="scroll col gap pad" style={{ paddingTop: 0 }}>
        {SKINS.map((skin) => {
          const owned = meta.ownedSkins.includes(skin.id)
          const active = meta.currentSkin === skin.id
          const afford = meta.gems >= skin.price
          return (
            <div key={skin.id} className="li" style={active ? { borderColor: 'var(--accent)' } : undefined}>
              <div
                className="skin-swatch"
                style={{ background: `radial-gradient(circle at 40% 35%, ${hex(skin.projectileColor)}, ${hex(skin.color)})` }}
              />
              <div className="col" style={{ flex: 1 }}>
                <strong>{skin.name}</strong>
                <span className="muted">{skin.ability}</span>
              </div>
              {owned ? (
                <Tap
                  className={active ? 'btn' : 'btn secondary'}
                  onClick={() => {
                    selectSkin(skin.id)
                    haptics.light()
                  }}
                >
                  {active ? 'EQUIPPED' : 'EQUIP'}
                </Tap>
              ) : (
                <Tap
                  className="btn"
                  disabled={!afford}
                  onClick={() => {
                    if (buySkin(skin.id)) haptics.success()
                  }}
                >
                  💎 {skin.price}
                </Tap>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
