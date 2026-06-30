// Hero abilities (the "one-finger swipe" identity lives in Meteor).
export type PowerId = 'meteor' | 'freeze' | 'goldrush'

export interface PowerDef {
  id: PowerId
  name: string
  icon: string
  cooldown: number
  desc: string
}

export const POWERS: Record<PowerId, PowerDef> = {
  meteor: { id: 'meteor', name: 'Meteor', icon: '☄️', cooldown: 14, desc: 'Swipe to call a meteor — heavy magic AoE.' },
  freeze: { id: 'freeze', name: 'Frost Nova', icon: '❄️', cooldown: 28, desc: 'Freeze every enemy for 3s.' },
  goldrush: { id: 'goldrush', name: 'Gold Rush', icon: '🪙', cooldown: 24, desc: 'Double kill gold for 7s + instant bonus.' },
}
