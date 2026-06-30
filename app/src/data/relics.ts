// RELICS tab (cover screen 3) — permanent passive boosts bought with gems.
export interface RelicDef {
  id: string
  name: string
  icon: string
  desc: string
  price: number // gems
  // gameplay effect, read by the engine at run start
  effect: {
    dmgMul?: number
    goldStart?: number
    livesStart?: number
    rangeMul?: number
    goldMul?: number
    fireRateMul?: number
    interestBonus?: number
  }
}

export const RELICS: RelicDef[] = [
  { id: 'sharpened', name: 'Sharpened Sigil', icon: '⚔️', desc: '+10% tower damage', price: 120, effect: { dmgMul: 0.1 } },
  { id: 'warchest', name: 'War Chest', icon: '🪙', desc: '+100 starting gold', price: 100, effect: { goldStart: 100 } },
  { id: 'rampart', name: 'Rampart', icon: '🧱', desc: '+5 starting lives', price: 160, effect: { livesStart: 5 } },
  { id: 'eagle', name: "Eagle's Eye", icon: '🦅', desc: '+8% tower range', price: 140, effect: { rangeMul: 0.08 } },
  { id: 'midas', name: 'Midas Touch', icon: '✨', desc: '+12% gold from kills', price: 180, effect: { goldMul: 0.12 } },
  { id: 'overload', name: 'Overload Core', icon: '⚡', desc: '+8% fire rate', price: 200, effect: { fireRateMul: 0.08 } },
  { id: 'banker', name: "Banker's Seal", icon: '🏦', desc: '+5% interest per wave', price: 170, effect: { interestBonus: 0.05 } },
  { id: 'bulwark', name: 'Bulwark', icon: '🛡️', desc: '+8 starting lives', price: 240, effect: { livesStart: 8 } },
]

export function relicById(id: string): RelicDef | undefined {
  return RELICS.find((r) => r.id === id)
}
