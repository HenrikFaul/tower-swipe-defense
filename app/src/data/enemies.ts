import type { EnemyDef, EnemyType } from './types'

// Stats follow AI_PROMPT.md §2.3. HP/reward are multipliers on the
// per-wave base values; absolute numbers are derived in the spawner.
export const ENEMIES: Record<EnemyType, EnemyDef> = {
  grunt: {
    type: 'grunt',
    label: 'Grunt',
    hpMul: 1,
    speedMul: 1.0,
    rewardMul: 1,
    score: 10,
    radius: 18,
    color: 0x6fae5a,
  },
  runner: {
    type: 'runner',
    label: 'Runner',
    hpMul: 0.5,
    speedMul: 2.0,
    rewardMul: 0.7,
    score: 14,
    radius: 14,
    color: 0xc7d96a,
  },
  tank: {
    type: 'tank',
    label: 'Tank',
    hpMul: 4,
    speedMul: 0.5,
    rewardMul: 3,
    score: 40,
    radius: 26,
    color: 0x8a8f99,
    armor: 0.3,
  },
  healer: {
    type: 'healer',
    label: 'Cleric',
    hpMul: 2,
    speedMul: 0.7,
    rewardMul: 2,
    score: 30,
    radius: 19,
    color: 0xf0d27a,
    healPerSec: 0.05,
  },
  archer: {
    type: 'archer',
    label: 'Archer',
    hpMul: 1,
    speedMul: 0.7,
    rewardMul: 1.5,
    score: 25,
    radius: 17,
    color: 0xc98b5b,
    rangedDmg: 6,
  },
  mage: {
    type: 'mage',
    label: 'Mage',
    hpMul: 3,
    speedMul: 0.6,
    rewardMul: 4,
    score: 55,
    radius: 20,
    color: 0x9a7bff,
    shield: 0.25,
  },
  boss: {
    type: 'boss',
    label: 'Warlord',
    hpMul: 25,
    speedMul: 0.3,
    rewardMul: 30,
    score: 500,
    radius: 46,
    color: 0xb0473a,
    boss: true,
  },
  dragon: {
    type: 'dragon',
    label: 'Dragon',
    hpMul: 80,
    speedMul: 0.4,
    rewardMul: 100,
    score: 1500,
    radius: 58,
    color: 0xd8632e,
    boss: true,
    rangedDmg: 14,
  },
}

// Which non-boss types are eligible to spawn at a given wave.
export function enemyTypesForWave(wave: number): EnemyType[] {
  const pool: EnemyType[] = ['grunt']
  if (wave >= 2) pool.push('runner')
  if (wave >= 4) pool.push('tank')
  if (wave >= 6) pool.push('archer')
  if (wave >= 8) pool.push('healer')
  if (wave >= 12) pool.push('mage')
  return pool
}
