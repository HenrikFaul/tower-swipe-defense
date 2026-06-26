// Six tower types from the cover's UPGRADES list, with stats & gold costs.
// Each upgrades through 3 tiers in-run; permanent (meta) levels add a flat bonus.

export type TowerId = 'archer' | 'cannon' | 'mage' | 'ice' | 'poison' | 'barracks'

export interface TowerTier {
  dmgMin: number
  dmgMax: number
  cd: number // seconds between attacks
  range: number // in tiles
  upgradeCost: number // gold to reach this tier (tier 0 = build cost)
}

export interface TowerDef {
  id: TowerId
  name: string
  icon: string
  blurb: string
  color: number // body
  accent: number // roof / projectile
  projectile: 'arrow' | 'cannon' | 'magic' | 'ice' | 'poison' | 'melee'
  splash?: number // AoE radius in tiles (cannon)
  slow?: { amount: number; dur: number } // ice
  dot?: { dps: number; dur: number } // poison
  pierceShield?: boolean // mage ignores shields
  melee?: boolean // barracks: short-range garrison
  tiers: TowerTier[] // index 0 = built, 1,2 = upgrades
}

export const TOWERS: Record<TowerId, TowerDef> = {
  archer: {
    id: 'archer',
    name: 'Archer Tower',
    icon: '🏹',
    blurb: 'Fast single-target arrows.',
    color: 0x8a6a44,
    accent: 0xffd27a,
    projectile: 'arrow',
    tiers: [
      { dmgMin: 12, dmgMax: 18, cd: 1.6, range: 2.7, upgradeCost: 100 },
      { dmgMin: 20, dmgMax: 30, cd: 1.3, range: 3.0, upgradeCost: 120 },
      { dmgMin: 34, dmgMax: 50, cd: 1.0, range: 3.4, upgradeCost: 220 },
    ],
  },
  cannon: {
    id: 'cannon',
    name: 'Cannon Tower',
    icon: '💣',
    blurb: 'Splash damage to clustered foes.',
    color: 0x5b6470,
    accent: 0xff8a3d,
    projectile: 'cannon',
    splash: 1.2,
    tiers: [
      { dmgMin: 25, dmgMax: 45, cd: 2.2, range: 2.4, upgradeCost: 150 },
      { dmgMin: 45, dmgMax: 75, cd: 2.0, range: 2.6, upgradeCost: 180 },
      { dmgMin: 80, dmgMax: 120, cd: 1.8, range: 2.9, upgradeCost: 320 },
    ],
  },
  mage: {
    id: 'mage',
    name: 'Mage Tower',
    icon: '🔮',
    blurb: 'High magic damage, ignores shields.',
    color: 0x6d4ea8,
    accent: 0xc7b3ff,
    projectile: 'magic',
    pierceShield: true,
    tiers: [
      { dmgMin: 30, dmgMax: 60, cd: 2.5, range: 2.9, upgradeCost: 180 },
      { dmgMin: 55, dmgMax: 100, cd: 2.3, range: 3.1, upgradeCost: 220 },
      { dmgMin: 95, dmgMax: 160, cd: 2.0, range: 3.4, upgradeCost: 380 },
    ],
  },
  ice: {
    id: 'ice',
    name: 'Ice Tower',
    icon: '❄️',
    blurb: 'Chills and slows enemies.',
    color: 0x4f86b0,
    accent: 0xaee9ff,
    projectile: 'ice',
    slow: { amount: 0.45, dur: 1.6 },
    tiers: [
      { dmgMin: 10, dmgMax: 20, cd: 1.8, range: 2.5, upgradeCost: 140 },
      { dmgMin: 18, dmgMax: 32, cd: 1.6, range: 2.7, upgradeCost: 170 },
      { dmgMin: 30, dmgMax: 50, cd: 1.4, range: 3.0, upgradeCost: 300 },
    ],
  },
  poison: {
    id: 'poison',
    name: 'Poison Tower',
    icon: '🧪',
    blurb: 'Rapid hits that poison over time.',
    color: 0x4f8a4a,
    accent: 0xb6f06a,
    projectile: 'poison',
    dot: { dps: 8, dur: 3 },
    tiers: [
      { dmgMin: 5, dmgMax: 12, cd: 1.0, range: 2.3, upgradeCost: 100 },
      { dmgMin: 9, dmgMax: 20, cd: 0.9, range: 2.5, upgradeCost: 140 },
      { dmgMin: 16, dmgMax: 34, cd: 0.8, range: 2.8, upgradeCost: 260 },
    ],
  },
  barracks: {
    id: 'barracks',
    name: 'Barracks',
    icon: '🛡️',
    blurb: 'Garrison that strikes nearby foes.',
    color: 0x9a4b3a,
    accent: 0xffb347,
    projectile: 'melee',
    melee: true,
    tiers: [
      { dmgMin: 14, dmgMax: 22, cd: 1.1, range: 1.6, upgradeCost: 160 },
      { dmgMin: 24, dmgMax: 38, cd: 1.0, range: 1.8, upgradeCost: 190 },
      { dmgMin: 40, dmgMax: 64, cd: 0.9, range: 2.0, upgradeCost: 340 },
    ],
  },
}

export const TOWER_IDS = Object.keys(TOWERS) as TowerId[]

export function rollDamage(t: TowerTier, rng: () => number): number {
  return t.dmgMin + rng() * (t.dmgMax - t.dmgMin)
}
