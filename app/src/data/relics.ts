// RELICS tab (cover screen 3) — permanent passive boosts bought with gems.
export interface RelicDef {
  id: string
  name: string
  icon: string
  desc: string
  price: number // gems
  // gameplay effect, read by the engine at run start
  effect: { dmgMul?: number; goldStart?: number; livesStart?: number; rangeMul?: number; goldMul?: number }
}

export const RELICS: RelicDef[] = [
  { id: 'sharpened', name: 'Sharpened Sigil', icon: '⚔️', desc: '+10% tower damage', price: 120, effect: { dmgMul: 0.1 } },
  { id: 'warchest', name: 'War Chest', icon: '🪙', desc: '+100 starting gold', price: 100, effect: { goldStart: 100 } },
  { id: 'rampart', name: 'Rampart', icon: '🧱', desc: '+5 starting lives', price: 160, effect: { livesStart: 5 } },
  { id: 'eagle', name: "Eagle's Eye", icon: '🦅', desc: '+8% tower range', price: 140, effect: { rangeMul: 0.08 } },
  { id: 'midas', name: 'Midas Touch', icon: '✨', desc: '+12% gold from kills', price: 180, effect: { goldMul: 0.12 } },
]

export function relicById(id: string): RelicDef | undefined {
  return RELICS.find((r) => r.id === id)
}
