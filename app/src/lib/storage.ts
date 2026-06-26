// Local persistence (AI_PROMPT.md §4.4). meta_state is cached locally and
// is the source of truth offline; an optional cloud sync layer
// (lib/cloud.ts) pushes runs to Supabase when configured.

import type { MetaUpgradeId } from '../data/types'

const VERSION = 1
const KEY = `tsd:v${VERSION}`

export interface MetaState {
  coins: number
  gems: number
  towerLevel: number
  ownedSkins: string[]
  currentSkin: string
  metaUpgrades: Partial<Record<MetaUpgradeId, number>>
  bestWave: number
  bestScore: number
  totalRuns: number
  noAds: boolean
  lastDailyDate: string | null
  dailyBestWave: number
}

export interface Settings {
  sound: boolean
  haptics: boolean
  autoFire: boolean
  reducedMotion: boolean
}

export interface LocalRun {
  mode: 'normal' | 'daily'
  wave: number
  score: number
  durationMs: number
  date: string
}

export interface SaveData {
  meta: MetaState
  settings: Settings
  runs: LocalRun[]
}

export const defaultMeta: MetaState = {
  coins: 0,
  gems: 0,
  towerLevel: 1,
  ownedSkins: ['stone'],
  currentSkin: 'stone',
  metaUpgrades: {},
  bestWave: 0,
  bestScore: 0,
  totalRuns: 0,
  noAds: false,
  lastDailyDate: null,
  dailyBestWave: 0,
}

export const defaultSettings: Settings = {
  sound: true,
  haptics: true,
  autoFire: false,
  reducedMotion: false,
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { meta: { ...defaultMeta }, settings: { ...defaultSettings }, runs: [] }
    const parsed = JSON.parse(raw) as Partial<SaveData>
    return {
      meta: { ...defaultMeta, ...parsed.meta },
      settings: { ...defaultSettings, ...parsed.settings },
      runs: parsed.runs ?? [],
    }
  } catch {
    return { meta: { ...defaultMeta }, settings: { ...defaultSettings }, runs: [] }
  }
}

export function persist(data: SaveData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    /* storage full / unavailable — ignore */
  }
}
