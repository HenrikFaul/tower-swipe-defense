// Multiple battlefields with themed tile palettes. Each map is a fixed grid
// with a serpentine enemy path from spawn → keep; non-path tiles are buildable.
import { cellKey, type Cell } from '../engine/iso'

export interface Theme {
  name: string
  grassTop: string
  grassL: string
  grassR: string
  pathTop: string
  pathL: string
  pathR: string
  bg0: string
  bg1: string
  bg2: string
  ambient: string // floaty particle color
}

export interface GameMap {
  name: string
  theme: Theme
  cols: number
  rows: number
  path: Cell[]
  pathKeys: Set<string>
}

const meadow: Theme = {
  name: 'Meadow', grassTop: '#5d913f', grassL: '#3f6a28', grassR: '#4e7d33',
  pathTop: '#c0a06a', pathL: '#8f7345', pathR: '#a98c58',
  bg0: '#163a3d', bg1: '#0e2629', bg2: '#071316', ambient: 'rgba(180,240,140,0.5)',
}
const canyon: Theme = {
  name: 'Canyon', grassTop: '#b07a45', grassL: '#7d522b', grassR: '#945f33',
  pathTop: '#d9b87e', pathL: '#a07a44', pathR: '#bf9a5c',
  bg0: '#3a2418', bg1: '#241410', bg2: '#140a08', ambient: 'rgba(255,200,120,0.5)',
}
const frost: Theme = {
  name: 'Frostland', grassTop: '#9fc6d6', grassL: '#6f97a8', grassR: '#84acbd',
  pathTop: '#dfeef5', pathL: '#a9c4d2', pathR: '#c4dbe6',
  bg0: '#1d3a47', bg1: '#122733', bg2: '#08151d', ambient: 'rgba(200,235,255,0.6)',
}
const volcano: Theme = {
  name: 'Ashlands', grassTop: '#4a3b3b', grassL: '#2e2424', grassR: '#3a2d2d',
  pathTop: '#7a3a2a', pathL: '#521f16', pathR: '#682b1e',
  bg0: '#3a1612', bg1: '#220c0a', bg2: '#120605', ambient: 'rgba(255,140,60,0.6)',
}

function mk(name: string, theme: Theme, cols: number, rows: number, path: Cell[]): GameMap {
  return { name, theme, cols, rows, path, pathKeys: new Set(path.map((p) => cellKey(p.c, p.r))) }
}

const PATH_MEADOW: Cell[] = [
  { c: 0, r: 1 }, { c: 1, r: 1 }, { c: 2, r: 1 }, { c: 3, r: 1 }, { c: 4, r: 1 }, { c: 5, r: 1 }, { c: 6, r: 1 }, { c: 7, r: 1 },
  { c: 7, r: 2 }, { c: 7, r: 3 },
  { c: 6, r: 3 }, { c: 5, r: 3 }, { c: 4, r: 3 }, { c: 3, r: 3 }, { c: 2, r: 3 }, { c: 1, r: 3 },
  { c: 1, r: 4 }, { c: 1, r: 5 },
  { c: 2, r: 5 }, { c: 3, r: 5 }, { c: 4, r: 5 }, { c: 5, r: 5 }, { c: 6, r: 5 }, { c: 7, r: 5 },
  { c: 7, r: 6 }, { c: 7, r: 7 },
  { c: 6, r: 7 }, { c: 5, r: 7 }, { c: 4, r: 7 }, { c: 3, r: 7 }, { c: 2, r: 7 }, { c: 1, r: 7 }, { c: 0, r: 7 },
]

const PATH_CANYON: Cell[] = [
  { c: 1, r: 0 }, { c: 1, r: 1 }, { c: 1, r: 2 }, { c: 1, r: 3 }, { c: 1, r: 4 }, { c: 1, r: 5 }, { c: 1, r: 6 }, { c: 1, r: 7 },
  { c: 2, r: 7 }, { c: 3, r: 7 },
  { c: 3, r: 6 }, { c: 3, r: 5 }, { c: 3, r: 4 }, { c: 3, r: 3 }, { c: 3, r: 2 }, { c: 3, r: 1 },
  { c: 4, r: 1 }, { c: 5, r: 1 },
  { c: 5, r: 2 }, { c: 5, r: 3 }, { c: 5, r: 4 }, { c: 5, r: 5 }, { c: 5, r: 6 }, { c: 5, r: 7 },
  { c: 6, r: 7 }, { c: 7, r: 7 },
  { c: 7, r: 6 }, { c: 7, r: 5 }, { c: 7, r: 4 }, { c: 7, r: 3 }, { c: 7, r: 2 }, { c: 7, r: 1 }, { c: 7, r: 0 },
]

const PATH_FROST: Cell[] = [
  { c: 0, r: 0 }, { c: 1, r: 0 }, { c: 2, r: 0 }, { c: 3, r: 0 }, { c: 4, r: 0 },
  { c: 4, r: 1 }, { c: 4, r: 2 }, { c: 4, r: 3 },
  { c: 3, r: 3 }, { c: 2, r: 3 }, { c: 1, r: 3 }, { c: 0, r: 3 },
  { c: 0, r: 4 }, { c: 0, r: 5 }, { c: 0, r: 6 },
  { c: 1, r: 6 }, { c: 2, r: 6 }, { c: 3, r: 6 }, { c: 4, r: 6 }, { c: 5, r: 6 }, { c: 6, r: 6 },
  { c: 6, r: 5 }, { c: 6, r: 4 }, { c: 6, r: 3 }, { c: 6, r: 2 }, { c: 6, r: 1 },
  { c: 7, r: 1 }, { c: 8, r: 1 },
  { c: 8, r: 2 }, { c: 8, r: 3 }, { c: 8, r: 4 }, { c: 8, r: 5 }, { c: 8, r: 6 }, { c: 8, r: 7 }, { c: 8, r: 8 },
]

const PATH_VOLCANO: Cell[] = [
  { c: 0, r: 4 }, { c: 1, r: 4 }, { c: 2, r: 4 },
  { c: 2, r: 3 }, { c: 2, r: 2 },
  { c: 3, r: 2 }, { c: 4, r: 2 }, { c: 5, r: 2 }, { c: 6, r: 2 },
  { c: 6, r: 3 }, { c: 6, r: 4 }, { c: 6, r: 5 }, { c: 6, r: 6 },
  { c: 5, r: 6 }, { c: 4, r: 6 }, { c: 3, r: 6 },
  { c: 3, r: 5 }, { c: 3, r: 4 }, { c: 4, r: 4 },
]

export const MAPS: GameMap[] = [
  mk('Meadow', meadow, 9, 9, PATH_MEADOW),
  mk('Canyon', canyon, 9, 9, PATH_CANYON),
  mk('Frostland', frost, 9, 9, PATH_FROST),
  mk('Ashlands', volcano, 9, 9, PATH_VOLCANO),
]

export function pickMap(seed: number): GameMap {
  return MAPS[Math.abs(seed) % MAPS.length]
}

export function isPath(map: GameMap, c: number, r: number): boolean {
  return map.pathKeys.has(cellKey(c, r))
}

export function isBuildable(map: GameMap, c: number, r: number): boolean {
  if (c < 0 || r < 0 || c >= map.cols || r >= map.rows) return false
  return !isPath(map, c, r)
}

export const spawnOf = (map: GameMap): Cell => map.path[0]
export const keepOf = (map: GameMap): Cell => map.path[map.path.length - 1]
