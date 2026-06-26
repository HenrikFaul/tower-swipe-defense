// Path-walking enemies with cute identities and special mechanics. Stats are
// multipliers on per-wave base HP / gold reward (see lib/balance.ts).

export type EnemyType =
  | 'slime'
  | 'imp'
  | 'brute'
  | 'shaman'
  | 'warlock'
  | 'golem'
  | 'ogre'
  | 'dragon'

export interface EnemyDef {
  type: EnemyType
  name: string
  hpMul: number
  speed: number // tiles / second
  rewardMul: number
  leak: number // lives lost if it reaches the keep
  radius: number
  color: number
  accent: number
  armor?: number // flat physical resist 0..1
  magicResist?: number // resist to magic (mage / meteor) 0..1
  shield?: number // aura granted to nearby allies 0..1
  healPerSec?: number // heals nearest damaged ally, fraction of max hp
  enrageBelow?: number // below this hp fraction, speed ×1.7
  splitInto?: { type: EnemyType; count: number } // spawns smaller foes on death
  boss?: boolean
  elite?: boolean
}

export const ENEMIES: Record<EnemyType, EnemyDef> = {
  slime: { type: 'slime', name: 'Slime', hpMul: 1, speed: 1.0, rewardMul: 1, leak: 1, radius: 15, color: 0x76c043, accent: 0x3f7d22, splitInto: { type: 'imp', count: 2 } },
  imp: { type: 'imp', name: 'Imp', hpMul: 0.45, speed: 2.0, rewardMul: 0.7, leak: 1, radius: 11, color: 0xe06d4a, accent: 0x8a2f1a },
  brute: { type: 'brute', name: 'Brute', hpMul: 4, speed: 0.55, rewardMul: 3, leak: 2, radius: 22, color: 0x8a8f99, accent: 0x4a4e57, armor: 0.3 },
  shaman: { type: 'shaman', name: 'Shaman', hpMul: 2, speed: 0.7, rewardMul: 2, leak: 1, radius: 17, color: 0xf0d27a, accent: 0xa07d2a, healPerSec: 0.05 },
  warlock: { type: 'warlock', name: 'Warlock', hpMul: 2.6, speed: 0.6, rewardMul: 3, leak: 1, radius: 18, color: 0x9a7bff, accent: 0x4a2f8a, shield: 0.25 },
  golem: { type: 'golem', name: 'Stone Golem', hpMul: 9, speed: 0.45, rewardMul: 7, leak: 3, radius: 26, color: 0x6f7a6a, accent: 0x39402f, armor: 0.45, elite: true },
  ogre: { type: 'ogre', name: 'Ogre Warlord', hpMul: 26, speed: 0.42, rewardMul: 28, leak: 6, radius: 30, color: 0xb0473a, accent: 0x5a1f18, boss: true, enrageBelow: 0.4 },
  dragon: { type: 'dragon', name: 'Ancient Dragon', hpMul: 85, speed: 0.5, rewardMul: 90, leak: 12, radius: 36, color: 0xd8632e, accent: 0x7a2a10, boss: true, armor: 0.4, enrageBelow: 0.3 },
}

// Eligible non-boss types as waves escalate (elites sprinkled in later waves).
export function enemyTypesForWave(wave: number): EnemyType[] {
  const pool: EnemyType[] = ['slime']
  if (wave >= 2) pool.push('imp')
  if (wave >= 4) pool.push('brute')
  if (wave >= 6) pool.push('shaman')
  if (wave >= 8) pool.push('warlock')
  if (wave >= 11) pool.push('golem')
  return pool
}
