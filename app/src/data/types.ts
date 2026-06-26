// Shared domain types for Tower Swipe Defense.

export type EnemyType =
  | 'grunt'
  | 'runner'
  | 'tank'
  | 'healer'
  | 'archer'
  | 'mage'
  | 'boss'
  | 'dragon'

export interface EnemyDef {
  type: EnemyType
  label: string
  /** Multiplier on the wave base HP H(w) = 10 * 1.08^w. */
  hpMul: number
  /** Tiles/sec-ish base speed multiplier (1.0 = grunt baseline). */
  speedMul: number
  /** Coin reward multiplier on the wave base drop D(w) = 2 * 1.05^w. */
  rewardMul: number
  /** Score awarded on kill. */
  score: number
  radius: number
  color: number
  /** 30% incoming damage resist. */
  armor?: number
  /** Heals nearby allies by this fraction of their max HP per second. */
  healPerSec?: number
  /** Fires at the tower from range; damage per shot. */
  rangedDmg?: number
  /** Grants a fractional damage shield to nearby allies. */
  shield?: number
  /** Boss flag — triggers intro + heavy reward + abilities. */
  boss?: boolean
}

export type UpgradeId =
  | 'dmg'
  | 'firerate'
  | 'multishot'
  | 'range'
  | 'crit'
  | 'critdmg'
  | 'slow'
  | 'burn'
  | 'freeze'
  | 'chain'
  | 'vampiric'
  | 'magnet'

export interface UpgradeDef {
  id: UpgradeId
  name: string
  desc: string
  icon: string
  maxLevel: number
}

export interface SkinDef {
  id: string
  name: string
  ability: string
  /** Cosmetic + gameplay tint of the tower core / projectiles. */
  color: number
  projectileColor: number
  price: number // gems; 0 = owned by default
}

export type MetaUpgradeId = 'towerhp' | 'startcoins' | 'critbase' | 'magnetbase' | 'reviveheal'

export interface MetaUpgradeDef {
  id: MetaUpgradeId
  name: string
  desc: string
  maxLevel: number
  baseCost: number
  costMul: number
}
