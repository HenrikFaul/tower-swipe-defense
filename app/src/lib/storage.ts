// Local persistence (AI_PROMPT.md §4.4). meta_state is cached locally and is
// the source of truth offline; lib/cloud.ts optionally syncs to Supabase.

import type { TowerId } from '../data/towers'

const VERSION = 2
const KEY = `tsd:v${VERSION}`

export interface MetaState {
  coins: number // spent on permanent tower upgrades
  gems: number // premium, spent on relics
  towerLevels: Partial<Record<TowerId, number>>
  relics: string[]
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
  reducedMotion: boolean
  autoStart: boolean // auto-start the next wave after the build phase
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
  towerLevels: {},
  relics: [],
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
  reducedMotion: false,
  autoStart: false,
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
    /* storage full / unavailable */
  }
}
