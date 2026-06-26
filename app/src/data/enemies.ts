// Path-walking enemies for the isometric tower defense. Stats are multipliers
// on the per-wave base HP / gold reward (see lib/balance.ts).

export type EnemyType =
  | 'slime'
  | 'imp'
  | 'brute'
  | 'shaman'
  | 'warlock'
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
  armor?: number // flat damage resist 0..1
  shield?: number // aura granted to nearby allies 0..1
  healPerSec?: number // heals nearest damaged ally, fraction of its max hp
  boss?: boolean
}

export const ENEMIES: Record<EnemyType, EnemyDef> = {
  slime: { type: 'slime', name: 'Slime', hpMul: 1, speed: 1.0, rewardMul: 1, leak: 1, radius: 15, color: 0x76c043, accent: 0x3f7d22 },
  imp: { type: 'imp', name: 'Imp', hpMul: 0.55, speed: 1.9, rewardMul: 0.8, leak: 1, radius: 12, color: 0xe06d4a, accent: 0x8a2f1a },
  brute: { type: 'brute', name: 'Brute', hpMul: 4, speed: 0.55, rewardMul: 3, leak: 2, radius: 22, color: 0x8a8f99, accent: 0x4a4e57, armor: 0.3 },
  shaman: { type: 'shaman', name: 'Shaman', hpMul: 2, speed: 0.7, rewardMul: 2, leak: 1, radius: 17, color: 0xf0d27a, accent: 0xa07d2a, healPerSec: 0.05 },
  warlock: { type: 'warlock', name: 'Warlock', hpMul: 2.6, speed: 0.6, rewardMul: 3, leak: 1, radius: 18, color: 0x9a7bff, accent: 0x4a2f8a, shield: 0.25 },
  ogre: { type: 'ogre', name: 'Ogre Boss', hpMul: 26, speed: 0.42, rewardMul: 28, leak: 6, radius: 30, color: 0xb0473a, accent: 0x5a1f18, boss: true },
  dragon: { type: 'dragon', name: 'Dragon', hpMul: 85, speed: 0.5, rewardMul: 90, leak: 12, radius: 36, color: 0xd8632e, accent: 0x7a2a10, boss: true },
}

// Eligible non-boss types as waves escalate.
export function enemyTypesForWave(wave: number): EnemyType[] {
  const pool: EnemyType[] = ['slime']
  if (wave >= 2) pool.push('imp')
  if (wave >= 4) pool.push('brute')
  if (wave >= 6) pool.push('shaman')
  if (wave >= 9) pool.push('warlock')
  return pool
}
