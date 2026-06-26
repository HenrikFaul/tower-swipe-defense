// Battlefield layout: a fixed grid with a serpentine enemy path from the spawn
// portal to the player's keep. Non-path tiles are buildable.
import { cellKey, type Cell } from '../engine/iso'

export interface GameMap {
  cols: number
  rows: number
  path: Cell[] // ordered waypoints (cell centers) spawn → keep
}

// 9×9 serpentine — reads as a clear winding road on the isometric diorama.
const PATH: Cell[] = [
  { c: 0, r: 1 }, { c: 1, r: 1 }, { c: 2, r: 1 }, { c: 3, r: 1 }, { c: 4, r: 1 }, { c: 5, r: 1 }, { c: 6, r: 1 }, { c: 7, r: 1 },
  { c: 7, r: 2 }, { c: 7, r: 3 },
  { c: 6, r: 3 }, { c: 5, r: 3 }, { c: 4, r: 3 }, { c: 3, r: 3 }, { c: 2, r: 3 }, { c: 1, r: 3 },
  { c: 1, r: 4 }, { c: 1, r: 5 },
  { c: 2, r: 5 }, { c: 3, r: 5 }, { c: 4, r: 5 }, { c: 5, r: 5 }, { c: 6, r: 5 }, { c: 7, r: 5 },
  { c: 7, r: 6 }, { c: 7, r: 7 },
  { c: 6, r: 7 }, { c: 5, r: 7 }, { c: 4, r: 7 }, { c: 3, r: 7 }, { c: 2, r: 7 }, { c: 1, r: 7 }, { c: 0, r: 7 },
]

export const MAP: GameMap = { cols: 9, rows: 9, path: PATH }

const pathSet = new Set(PATH.map((p) => cellKey(p.c, p.r)))

export function isPath(c: number, r: number): boolean {
  return pathSet.has(cellKey(c, r))
}

export function isBuildable(map: GameMap, c: number, r: number): boolean {
  if (c < 0 || r < 0 || c >= map.cols || r >= map.rows) return false
  if (isPath(c, r)) return false
  return true
}

export const SPAWN: Cell = PATH[0]
export const KEEP: Cell = PATH[PATH.length - 1]
