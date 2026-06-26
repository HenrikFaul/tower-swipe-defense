import type { UpgradeDef, UpgradeId, SkinDef, MetaUpgradeDef } from './types'

// Roguelite in-run upgrade tree — 12 nodes, 5 levels each (AI_PROMPT.md §2.5).
export const UPGRADES: Record<UpgradeId, UpgradeDef> = {
  dmg: { id: 'dmg', name: 'Power', desc: '+10% damage per level', icon: '⚔️', maxLevel: 5 },
  firerate: { id: 'firerate', name: 'Fire Rate', desc: '+8% auto fire rate', icon: '⚡', maxLevel: 5 },
  multishot: { id: 'multishot', name: 'Multi-shot', desc: '+1 projectile (max 5)', icon: '🎯', maxLevel: 4 },
  range: { id: 'range', name: 'Range', desc: '+10% projectile reach', icon: '📏', maxLevel: 5 },
  crit: { id: 'crit', name: 'Crit Chance', desc: '+5% crit (max 25%)', icon: '✨', maxLevel: 5 },
  critdmg: { id: 'critdmg', name: 'Crit Damage', desc: '+30% crit damage', icon: '💥', maxLevel: 5 },
  slow: { id: 'slow', name: 'Slow Aura', desc: 'Slows enemies near tower', icon: '🌀', maxLevel: 5 },
  burn: { id: 'burn', name: 'Burn', desc: 'Damage over time on hit', icon: '🔥', maxLevel: 5 },
  freeze: { id: 'freeze', name: 'Freeze', desc: 'Chance to stop enemies 1s', icon: '❄️', maxLevel: 5 },
  chain: { id: 'chain', name: 'Lightning', desc: 'Chains to nearby enemies', icon: '🔗', maxLevel: 5 },
  vampiric: { id: 'vampiric', name: 'Vampiric', desc: 'Heal tower on damage', icon: '🩸', maxLevel: 5 },
  magnet: { id: 'magnet', name: 'Magnet', desc: 'Auto-collect coins', icon: '🧲', maxLevel: 5 },
}

export const UPGRADE_IDS = Object.keys(UPGRADES) as UpgradeId[]

// Tower skins — cosmetic + a passive ability (AI_PROMPT.md §2.2).
export const SKINS: SkinDef[] = [
  { id: 'stone', name: 'Stone Keep', ability: 'Balanced. +0% baseline.', color: 0x9aa0a6, projectileColor: 0xffd27a, price: 0 },
  { id: 'ice', name: 'Frost Spire', ability: 'Projectiles slow enemies 12%.', color: 0x8fd4ff, projectileColor: 0xaee9ff, price: 120 },
  { id: 'jungle', name: 'Jungle Totem', ability: '+8% coin drops.', color: 0x6fae5a, projectileColor: 0xb6f06a, price: 180 },
  { id: 'volcano', name: 'Volcano Forge', ability: 'Projectiles apply minor burn.', color: 0xd8632e, projectileColor: 0xff8a3d, price: 240 },
  { id: 'crystal', name: 'Crystal Bastion', ability: '+10% projectile speed & range.', color: 0x9a7bff, projectileColor: 0xc7b3ff, price: 320 },
]

export function skinById(id: string): SkinDef {
  return SKINS.find((s) => s.id === id) ?? SKINS[0]
}

// Permanent meta upgrades, bought between runs with coins (AI_PROMPT.md §2.2 / §4.1).
export const META_UPGRADES: Record<string, MetaUpgradeDef> = {
  towerhp: { id: 'towerhp', name: 'Tower Health', desc: '+20 max HP per level', maxLevel: 10, baseCost: 150, costMul: 1.5 },
  startcoins: { id: 'startcoins', name: 'War Chest', desc: '+40 starting coins per run', maxLevel: 8, baseCost: 120, costMul: 1.5 },
  critbase: { id: 'critbase', name: 'Keen Eye', desc: '+2% base crit chance', maxLevel: 5, baseCost: 200, costMul: 1.6 },
  magnetbase: { id: 'magnetbase', name: 'Lodestone', desc: 'Larger base coin pickup', maxLevel: 5, baseCost: 160, costMul: 1.5 },
  reviveheal: { id: 'reviveheal', name: 'Second Wind', desc: '+10% revive HP per level', maxLevel: 5, baseCost: 220, costMul: 1.6 },
}

export const META_UPGRADE_IDS = Object.keys(META_UPGRADES)

export function metaUpgradeCost(def: MetaUpgradeDef, level: number): number {
  return Math.floor(def.baseCost * Math.pow(def.costMul, level))
}
