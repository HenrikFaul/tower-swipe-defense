// Map-native battlefields: the enemy PATH and build PLOTS are authored in
// normalized (0..1) coordinates that trace the real illustrated background art
// (assets/backgrounds/map_*.jpg, 1088×1920). The engine converts these to
// screen pixels with the same cover-fit transform used to draw the background,
// so towers sit on the drawn plots and enemies walk the drawn road.
//
// Coordinates were calibrated against a normalized grid overlaid on each
// background (scratchpad/grid_*.png), so plots land on the drawn pads and the
// path follows the drawn road centerline.

export interface Pt {
  x: number
  y: number
}

export interface GameMap {
  name: string
  bg: string // assets.ts relative path
  path: Pt[] // spawn → keep, traces the drawn road
  plots: Pt[] // buildable tower pads (drawn circular plots)
}

export const MAP_IMG_W = 1088
export const MAP_IMG_H = 1920

const GREEN: GameMap = {
  name: 'Green Forest',
  bg: 'backgrounds/map_green_forest.jpg',
  path: [
    { x: 0.55, y: 0.02 }, { x: 0.47, y: 0.08 }, { x: 0.41, y: 0.13 }, { x: 0.37, y: 0.16 },
    { x: 0.4, y: 0.2 }, { x: 0.5, y: 0.225 }, { x: 0.57, y: 0.25 }, { x: 0.55, y: 0.28 },
    { x: 0.47, y: 0.295 }, { x: 0.41, y: 0.33 }, { x: 0.42, y: 0.39 }, { x: 0.45, y: 0.44 },
    { x: 0.46, y: 0.485 }, { x: 0.52, y: 0.53 }, { x: 0.53, y: 0.585 }, { x: 0.47, y: 0.63 },
    { x: 0.42, y: 0.665 }, { x: 0.45, y: 0.72 }, { x: 0.47, y: 0.78 }, { x: 0.44, y: 0.83 },
    { x: 0.48, y: 0.89 }, { x: 0.52, y: 0.97 },
  ],
  plots: [
    { x: 0.4, y: 0.135 }, { x: 0.545, y: 0.165 }, { x: 0.66, y: 0.205 }, { x: 0.485, y: 0.225 },
    { x: 0.665, y: 0.295 }, { x: 0.5, y: 0.35 }, { x: 0.27, y: 0.385 }, { x: 0.625, y: 0.4 },
    { x: 0.585, y: 0.55 }, { x: 0.305, y: 0.605 }, { x: 0.725, y: 0.63 }, { x: 0.62, y: 0.685 },
    { x: 0.27, y: 0.74 }, { x: 0.85, y: 0.745 }, { x: 0.45, y: 0.82 }, { x: 0.625, y: 0.85 },
  ],
}

const DESERT: GameMap = {
  name: 'Desert Ruins',
  bg: 'backgrounds/map_desert_ruins.jpg',
  path: [
    { x: 0.5, y: 0.16 }, { x: 0.5, y: 0.2 }, { x: 0.46, y: 0.24 }, { x: 0.42, y: 0.28 },
    { x: 0.43, y: 0.31 }, { x: 0.5, y: 0.34 }, { x: 0.57, y: 0.36 }, { x: 0.56, y: 0.4 },
    { x: 0.48, y: 0.43 }, { x: 0.43, y: 0.46 }, { x: 0.46, y: 0.5 }, { x: 0.54, y: 0.53 },
    { x: 0.59, y: 0.57 }, { x: 0.55, y: 0.61 }, { x: 0.46, y: 0.63 }, { x: 0.4, y: 0.67 },
    { x: 0.42, y: 0.71 }, { x: 0.5, y: 0.74 }, { x: 0.55, y: 0.78 }, { x: 0.52, y: 0.82 },
    { x: 0.47, y: 0.86 }, { x: 0.49, y: 0.93 },
  ],
  plots: [
    { x: 0.38, y: 0.205 }, { x: 0.63, y: 0.205 }, { x: 0.19, y: 0.305 }, { x: 0.47, y: 0.32 },
    { x: 0.81, y: 0.355 }, { x: 0.3, y: 0.45 }, { x: 0.56, y: 0.435 }, { x: 0.5, y: 0.575 },
    { x: 0.49, y: 0.72 }, { x: 0.72, y: 0.785 },
  ],
}

const FROZEN: GameMap = {
  name: 'Frozen Peaks',
  bg: 'backgrounds/map_frozen_peaks.jpg',
  path: [
    { x: 0.5, y: 0.03 }, { x: 0.47, y: 0.1 }, { x: 0.53, y: 0.15 }, { x: 0.57, y: 0.19 },
    { x: 0.56, y: 0.24 }, { x: 0.5, y: 0.27 }, { x: 0.43, y: 0.3 }, { x: 0.4, y: 0.34 },
    { x: 0.43, y: 0.38 }, { x: 0.47, y: 0.42 }, { x: 0.45, y: 0.46 }, { x: 0.4, y: 0.49 },
    { x: 0.42, y: 0.53 }, { x: 0.46, y: 0.57 }, { x: 0.5, y: 0.62 }, { x: 0.5, y: 0.66 },
    { x: 0.45, y: 0.7 }, { x: 0.44, y: 0.75 }, { x: 0.47, y: 0.8 }, { x: 0.49, y: 0.85 },
    { x: 0.47, y: 0.91 }, { x: 0.47, y: 0.97 },
  ],
  plots: [
    { x: 0.71, y: 0.135 }, { x: 0.46, y: 0.2 }, { x: 0.69, y: 0.215 }, { x: 0.27, y: 0.285 },
    { x: 0.62, y: 0.295 }, { x: 0.2, y: 0.385 }, { x: 0.57, y: 0.43 }, { x: 0.38, y: 0.625 },
    { x: 0.64, y: 0.7 }, { x: 0.28, y: 0.8 }, { x: 0.62, y: 0.83 },
  ],
}

export const MAPS: GameMap[] = [GREEN, DESERT, FROZEN]

export function pickMap(seed: number): GameMap {
  return MAPS[Math.abs(seed) % MAPS.length]
}
