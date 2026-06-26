import type { UpgradeId, MetaUpgradeId } from '../data/types'
import { skinById } from '../data/upgrades'

export type UpgradeLevels = Partial<Record<UpgradeId, number>>

export interface RunConfig {
  skinId: string
  metaUpgrades: Partial<Record<MetaUpgradeId, number>>
  /** DDA compensation (AI_PROMPT.md §5.1) — applied for one wave-tier. */
  ddaDmgMul: number
  ddaEnemyHpMul: number
}

// Derived per-shot / per-tower combat stats from run upgrades + skin + meta.
export interface DerivedStats {
  baseDamage: number
  fireRate: number
  projectiles: number
  projectileSpeed: number
  projectileLife: number
  critChance: number
  critMul: number
  slowAura: number // 0..1 slow strength near tower (0 = none)
  slowAuraRange: number
  burn: number // dps applied on hit
  freezeChance: number
  chain: number // extra jumps
  chainRange: number
  vampiric: number // fraction of damage healed to tower
  magnetRange: number
  coinMul: number
  projectileColor: number
  applyBurnFromSkin: number
  applySlowFromSkin: number
}

const BASE = {
  damage: 14,
  fireRate: 2.2,
  projSpeed: 620,
  projLife: 1.15,
  critMul: 1.5,
}

export function deriveStats(levels: UpgradeLevels, cfg: RunConfig): DerivedStats {
  const lv = (id: UpgradeId) => levels[id] ?? 0
  const skin = skinById(cfg.skinId)

  const critBase = (cfg.metaUpgrades.critbase ?? 0) * 0.02
  const magnetBase = (cfg.metaUpgrades.magnetbase ?? 0) * 20

  const rangeMul = 1 + lv('range') * 0.1 + (skin.id === 'crystal' ? 0.1 : 0)
  const speedMul = skin.id === 'crystal' ? 1.1 : 1

  return {
    baseDamage: BASE.damage * (1 + lv('dmg') * 0.1) * cfg.ddaDmgMul,
    fireRate: BASE.fireRate * (1 + lv('firerate') * 0.08),
    projectiles: Math.min(5, 1 + lv('multishot')),
    projectileSpeed: BASE.projSpeed * speedMul,
    projectileLife: BASE.projLife * rangeMul,
    critChance: Math.min(0.25, lv('crit') * 0.05) + critBase,
    critMul: BASE.critMul + lv('critdmg') * 0.3,
    slowAura: lv('slow') > 0 ? 0.3 : 0,
    slowAuraRange: lv('slow') > 0 ? 120 + lv('slow') * 24 : 0,
    burn: lv('burn') * 4,
    freezeChance: lv('freeze') * 0.05,
    chain: lv('chain'),
    chainRange: 140,
    vampiric: lv('vampiric') * 0.05,
    magnetRange: (lv('magnet') > 0 ? 90 + lv('magnet') * 60 : 36) + magnetBase,
    coinMul: skin.id === 'jungle' ? 1.08 : 1,
    projectileColor: skin.projectileColor,
    applyBurnFromSkin: skin.id === 'volcano' ? 2 : 0,
    applySlowFromSkin: skin.id === 'ice' ? 0.12 : 0,
  }
}
