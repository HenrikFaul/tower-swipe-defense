import { create } from 'zustand'
import { loadSave, persist, type LocalRun, type MetaState, type Settings } from '../lib/storage'
import { TOWERS, type TowerId } from '../data/towers'
import { RELICS, relicById } from '../data/relics'
import type { RunModifiers } from '../engine/isoGame'
import { setAudioEnabled } from '../lib/audio'
import { setHapticsEnabled } from '../lib/haptics'

export type Screen =
  | 'splash'
  | 'menu'
  | 'play'
  | 'upgrades'
  | 'daily'
  | 'rewards'
  | 'leaderboard'
  | 'settings'
  | 'shop'
  | 'worldmap'
  | 'battlepass'

export interface RunParams {
  mode: 'normal' | 'daily'
  seed: number
}

const BASE_LIVES = 20
const BASE_GOLD = 250

// Permanent tower upgrade: +8% damage per level, max 5, cost scales.
const TOWER_LEVEL_MAX = 5
export function towerLevelCost(level: number): number {
  return Math.floor(140 * Math.pow(1.55, level))
}

interface StoreState {
  screen: Screen
  meta: MetaState
  settings: Settings
  runs: LocalRun[]
  pendingRun: RunParams | null

  go: (s: Screen) => void
  startRun: (p: RunParams) => void

  buyTowerLevel: (id: TowerId) => boolean
  buyRelic: (id: string) => boolean
  buyNoAds: () => void
  grantDailySpin: () => number
  setSetting: <K extends keyof Settings>(k: K, v: Settings[K]) => void
  recordRun: (run: LocalRun, coins: number, gems: number, doubled: boolean) => void

  runModifiers: () => RunModifiers
}

function save(get: () => StoreState) {
  const s = get()
  persist({ meta: s.meta, settings: s.settings, runs: s.runs })
}

const initial = loadSave()
setAudioEnabled(initial.settings.sound)
setHapticsEnabled(initial.settings.haptics)

export const useGameStore = create<StoreState>((set, get) => ({
  screen: 'splash',
  meta: initial.meta,
  settings: initial.settings,
  runs: initial.runs,
  pendingRun: null,

  go: (screen) => set({ screen }),
  startRun: (p) => set({ pendingRun: p, screen: 'play' }),

  buyTowerLevel: (id) => {
    const { meta } = get()
    const level = meta.towerLevels[id] ?? 0
    if (level >= TOWER_LEVEL_MAX) return false
    const cost = towerLevelCost(level)
    if (meta.coins < cost) return false
    set({ meta: { ...meta, coins: meta.coins - cost, towerLevels: { ...meta.towerLevels, [id]: level + 1 } } })
    save(get)
    return true
  },

  buyRelic: (id) => {
    const { meta } = get()
    const relic = relicById(id)
    if (!relic || meta.relics.includes(id) || meta.gems < relic.price) return false
    set({ meta: { ...meta, gems: meta.gems - relic.price, relics: [...meta.relics, id] } })
    save(get)
    return true
  },

  buyNoAds: () => {
    set({ meta: { ...get().meta, noAds: true } })
    save(get)
  },

  grantDailySpin: () => {
    const reward = 50 + Math.floor(Math.random() * 451)
    const { meta } = get()
    set({ meta: { ...meta, coins: meta.coins + reward } })
    save(get)
    return reward
  },

  setSetting: (k, v) => {
    const settings = { ...get().settings, [k]: v }
    if (k === 'sound') setAudioEnabled(v as boolean)
    if (k === 'haptics') setHapticsEnabled(v as boolean)
    set({ settings })
    save(get)
  },

  recordRun: (run, coins, gems, doubled) => {
    const { meta, runs } = get()
    const totalCoins = doubled ? coins * 2 : coins
    const isDaily = run.mode === 'daily'
    const newRuns = [...runs, run].sort((a, b) => b.score - a.score).slice(0, 50)
    set({
      meta: {
        ...meta,
        coins: meta.coins + totalCoins,
        gems: meta.gems + gems,
        bestWave: Math.max(meta.bestWave, run.wave),
        bestScore: Math.max(meta.bestScore, run.score),
        totalRuns: meta.totalRuns + 1,
        dailyBestWave: isDaily ? Math.max(meta.dailyBestWave, run.wave) : meta.dailyBestWave,
        lastDailyDate: isDaily ? new Date().toISOString().slice(0, 10) : meta.lastDailyDate,
      },
      runs: newRuns,
    })
    save(get)
  },

  runModifiers: () => {
    const { meta } = get()
    const mods: RunModifiers = {
      dmgMul: 0,
      goldStart: BASE_GOLD,
      livesStart: BASE_LIVES,
      rangeMul: 0,
      goldMul: 0,
      fireRateMul: 0,
      interestBonus: 0,
      towerMetaLevels: meta.towerLevels,
    }
    for (const id of meta.relics) {
      const r = relicById(id)
      if (!r) continue
      const e = r.effect
      if (e.dmgMul) mods.dmgMul += e.dmgMul
      if (e.goldStart) mods.goldStart += e.goldStart
      if (e.livesStart) mods.livesStart += e.livesStart
      if (e.rangeMul) mods.rangeMul += e.rangeMul
      if (e.goldMul) mods.goldMul += e.goldMul
      if (e.fireRateMul) mods.fireRateMul += e.fireRateMul
      if (e.interestBonus) mods.interestBonus += e.interestBonus
    }
    return mods
  },
}))

export { TOWERS, RELICS, TOWER_LEVEL_MAX }
