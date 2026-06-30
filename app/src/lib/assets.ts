// Real raster game assets (from /assets, bundled under public/assets/game).
// Provides URL resolution, a lazy HTMLImageElement cache, and a preloader.

const BASE = `${import.meta.env.BASE_URL}assets/game/`

export function assetUrl(rel: string): string {
  return BASE + rel
}

// engine tower id → sprite file
export const TOWER_SPRITE: Record<string, string> = {
  archer: 'towers/tower_arrow.png',
  cannon: 'towers/tower_cannon.png',
  mage: 'towers/tower_magic.png',
  ice: 'towers/tower_ice.png',
  poison: 'towers/tower_laser.png',
  barracks: 'towers/tower_arrow.png',
}

// engine enemy id → sprite file
export const ENEMY_SPRITE: Record<string, string> = {
  slime: 'enemies/enemy_grunt.png',
  imp: 'enemies/enemy_runner.png',
  brute: 'enemies/enemy_tank.png',
  shaman: 'enemies/enemy_healer.png',
  warlock: 'enemies/enemy_ranged.png',
  golem: 'enemies/enemy_tank.png',
  ogre: 'enemies/boss_inferno_dragon.png',
  dragon: 'enemies/boss_inferno_dragon.png',
}

// map theme name → full-screen background
export const MAP_BG: Record<string, string> = {
  Meadow: 'backgrounds/map_green_forest.jpg',
  Canyon: 'backgrounds/map_desert_ruins.jpg',
  Frostland: 'backgrounds/map_frozen_peaks.jpg',
  Ashlands: 'backgrounds/map_desert_ruins.jpg',
}

export const UI = {
  logo: 'ui/logo.png',
  splash: 'backgrounds/splash_screen.jpg',
  mainMenu: 'backgrounds/main_menu_bg.jpg',
  worldMap: 'backgrounds/world_map.jpg',
  currency: 'ui/icons_currency.png',
  chest: 'ui/icon_chest.png',
  bannerVictory: 'ui/banner_victory.png',
}

const cache = new Map<string, HTMLImageElement>()

/** Lazily create + cache an Image for a relative asset path. */
export function getImg(rel: string): HTMLImageElement {
  let img = cache.get(rel)
  if (!img) {
    img = new Image()
    img.decoding = 'async'
    img.src = assetUrl(rel)
    cache.set(rel, img)
  }
  return img
}

/** True when the image is decoded and safe to draw. */
export function ready(img: HTMLImageElement | undefined | null): img is HTMLImageElement {
  return !!img && img.complete && img.naturalWidth > 0
}

/** Preload the gameplay-critical assets; resolves when all settled. */
export function preloadGameAssets(): Promise<void> {
  const rels = new Set<string>([
    ...Object.values(TOWER_SPRITE),
    ...Object.values(ENEMY_SPRITE),
    ...Object.values(MAP_BG),
    UI.logo,
    UI.mainMenu,
    UI.worldMap,
    UI.currency,
    UI.chest,
    UI.bannerVictory,
  ])
  return Promise.all(
    [...rels].map(
      (rel) =>
        new Promise<void>((resolve) => {
          const img = getImg(rel)
          if (img.complete && img.naturalWidth > 0) return resolve()
          img.addEventListener('load', () => resolve(), { once: true })
          img.addEventListener('error', () => resolve(), { once: true })
        }),
    ),
  ).then(() => undefined)
}
