import { create } from 'zustand'
import {
  loadSave,
  persist,
  type LocalRun,
  type MetaState,
  type Settings,
} from '../lib/storage'
import {
  META_UPGRADES,
  metaUpgradeCost,
  skinById,
  SKINS,
} from '../data/upgrades'
import type { MetaUpgradeId } from '../data/types'
import { setAudioEnabled } from '../lib/audio'
import { setHapticsEnabled } from '../lib/haptics'

export type Screen =
  | 'menu'
  | 'play'
  | 'upgrades'
  | 'skins'
  | 'daily'
  | 'leaderboard'
  | 'settings'

export interface RunParams {
  mode: 'normal' | 'daily'
  seed: number
}

interface StoreState {
  screen: Screen
  meta: MetaState
  settings: Settings
  runs: LocalRun[]
  /** how many times the player has failed on each wave (DDA, AI_PROMPT §5.1) */
  waveDeaths: Record<number, number>
  pendingRun: RunParams | null

  go: (s: Screen) => void
  startRun: (p: RunParams) => void

  // economy
  buyMetaUpgrade: (id: MetaUpgradeId) => boolean
  buySkin: (id: string) => boolean
  selectSkin: (id: string) => void
  buyNoAds: () => void
  grantDailySpin: () => number

  // settings
  setSetting: <K extends keyof Settings>(k: K, v: Settings[K]) => void

  // run results — `died` distinguishes a tower-fall (counts toward DDA) from
  // a voluntary quit (does not).
  recordRun: (run: LocalRun, coinsEarned: number, doubled: boolean, died: boolean) => void

  ddaForWave: () => { ddaDmgMul: number; ddaEnemyHpMul: number }
  maxHpForRun: () => number
  startCoinsForRun: () => number
  reviveHealPct: () => number
}

function save(get: () => StoreState) {
  const s = get()
  persist({ meta: s.meta, settings: s.settings, runs: s.runs })
}

const initial = loadSave()
setAudioEnabled(initial.settings.sound)
setHapticsEnabled(initial.settings.haptics)

export const useGameStore = create<StoreState>((set, get) => ({
  screen: 'menu',
  meta: initial.meta,
  settings: initial.settings,
  runs: initial.runs,
  waveDeaths: {},
  pendingRun: null,

  go: (screen) => set({ screen }),

  startRun: (p) => set({ pendingRun: p, screen: 'play' }),

  buyMetaUpgrade: (id) => {
    const { meta } = get()
    const def = META_UPGRADES[id]
    const level = meta.metaUpgrades[id] ?? 0
    if (level >= def.maxLevel) return false
    const cost = metaUpgradeCost(def, level)
    if (meta.coins < cost) return false
    set({
      meta: {
        ...meta,
        coins: meta.coins - cost,
        metaUpgrades: { ...meta.metaUpgrades, [id]: level + 1 },
      },
    })
    save(get)
    return true
  },

  buySkin: (id) => {
    const { meta } = get()
    const skin = skinById(id)
    if (meta.ownedSkins.includes(id)) return false
    if (meta.gems < skin.price) return false
    set({
      meta: {
        ...meta,
        gems: meta.gems - skin.price,
        ownedSkins: [...meta.ownedSkins, id],
        currentSkin: id,
      },
    })
    save(get)
    return true
  },

  selectSkin: (id) => {
    const { meta } = get()
    if (!meta.ownedSkins.includes(id)) return
    set({ meta: { ...meta, currentSkin: id } })
    save(get)
  },

  buyNoAds: () => {
    set({ meta: { ...get().meta, noAds: true } })
    save(get)
  },

  grantDailySpin: () => {
    const reward = 50 + Math.floor(Math.random() * 451) // 50–500
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

  recordRun: (run, coinsEarned, doubled, died) => {
    const { meta, runs, waveDeaths } = get()
    const total = doubled ? coinsEarned * 2 : coinsEarned
    const isDaily = run.mode === 'daily'
    const newRuns = [...runs, run]
      .sort((a, b) => b.score - a.score)
      .slice(0, 50)
    const newBestWave = Math.max(meta.bestWave, run.wave)

    // DDA bookkeeping (AI_PROMPT §5.1): the compensation must be per-tier and
    // temporary. Drop death counts for any wave the player has now cleared
    // (< the best wave reached), and only register a new failure on a genuine
    // tower-fall — not a voluntary quit.
    const nextDeaths: Record<number, number> = {}
    for (const [w, c] of Object.entries(waveDeaths)) {
      if (Number(w) >= newBestWave) nextDeaths[Number(w)] = c
    }
    if (died) nextDeaths[run.wave] = (nextDeaths[run.wave] ?? 0) + 1

    set({
      meta: {
        ...meta,
        coins: meta.coins + total,
        gems: meta.gems + (run.wave >= 10 ? Math.floor(run.wave / 10) * 2 : 0),
        bestWave: newBestWave,
        bestScore: Math.max(meta.bestScore, run.score),
        totalRuns: meta.totalRuns + 1,
        dailyBestWave: isDaily ? Math.max(meta.dailyBestWave, run.wave) : meta.dailyBestWave,
        lastDailyDate: isDaily ? new Date().toISOString().slice(0, 10) : meta.lastDailyDate,
      },
      runs: newRuns,
      waveDeaths: nextDeaths,
    })
    save(get)
  },

  ddaForWave: () => {
    const { waveDeaths, meta } = get()
    // Stuck = ≥3 failures on a wave the player still hasn't cleared.
    const stuck = Object.entries(waveDeaths).some(
      ([w, c]) => c >= 3 && Number(w) > meta.bestWave - 1,
    )
    return stuck ? { ddaDmgMul: 1.15, ddaEnemyHpMul: 0.9 } : { ddaDmgMul: 1, ddaEnemyHpMul: 1 }
  },

  maxHpForRun: () => {
    const { meta } = get()
    return 100 + 20 * meta.towerLevel + (meta.metaUpgrades.towerhp ?? 0) * 20
  },

  startCoinsForRun: () => {
    const { meta } = get()
    return (meta.metaUpgrades.startcoins ?? 0) * 40
  },

  reviveHealPct: () => {
    const { meta } = get()
    return 0.5 + (meta.metaUpgrades.reviveheal ?? 0) * 0.1
  },
}))

export { SKINS }
