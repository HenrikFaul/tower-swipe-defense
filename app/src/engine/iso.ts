// Isometric (2:1 diamond) projection helpers for the stylized-3D battlefield.

export const TILE_W = 64 // diamond width
export const TILE_H = 32 // diamond height (2:1)
export const TILE_LIFT = 14 // raised-tile thickness for the floating-island look

export interface Cell {
  c: number // column
  r: number // row
}

export interface IsoView {
  ox: number // screen-space origin x (where grid 0,0 projects)
  oy: number
  scale: number
}

/** Grid (col,row, optional fractional) → screen pixels (top face center). */
export function gridToScreen(c: number, r: number, v: IsoView): { x: number; y: number } {
  return {
    x: v.ox + (c - r) * (TILE_W / 2) * v.scale,
    y: v.oy + (c + r) * (TILE_H / 2) * v.scale,
  }
}

/** Screen pixels → nearest grid cell (inverse projection, ignoring lift). */
export function screenToGrid(x: number, y: number, v: IsoView): { c: number; r: number } {
  const dx = (x - v.ox) / v.scale
  const dy = (y - v.oy) / v.scale
  const c = (dx / (TILE_W / 2) + dy / (TILE_H / 2)) / 2
  const r = (dy / (TILE_H / 2) - dx / (TILE_W / 2)) / 2
  return { c, r }
}

/** Painter's-order depth key (back tiles first). */
export function depth(c: number, r: number): number {
  return c + r
}

export const cellKey = (c: number, r: number) => `${c},${r}`
