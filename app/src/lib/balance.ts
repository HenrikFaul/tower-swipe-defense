// Progression formulas from README.md "Progresszió és nehézség" and
// AI_PROMPT.md §2.4 / §4.2. Kept in one place so the client and the
// anti-cheat edge function stay in sync.

/** Per-enemy HP at a given wave: H(w) = 10 * 1.08^w. */
export function waveEnemyHp(wave: number): number {
  return 10 * Math.pow(1.08, wave)
}

/** Enemies in a wave: N(w) = 5 + floor(w/3). */
export function waveEnemyCount(wave: number): number {
  return 5 + Math.floor(wave / 3)
}

/** Base coin drop per kill: D(w) = 2 * 1.05^w. */
export function waveCoinDrop(wave: number): number {
  return 2 * Math.pow(1.05, wave)
}

/** Boss HP on a boss wave: H_boss = N(w) * H(w) * 4. */
export function bossHp(wave: number): number {
  return waveEnemyCount(wave) * waveEnemyHp(wave) * 4
}

export function isBossWave(wave: number): boolean {
  return wave % 10 === 0
}

/** Dragon boss replaces the warlord on these milestone waves. */
export function isDragonWave(wave: number): boolean {
  return wave % 30 === 0
}

/** Spawns per second: 1 + floor(w/5). */
export function waveSpawnRate(wave: number): number {
  return 1 + Math.floor(wave / 5)
}

/** Theoretical max plausible score — mirrors submit-run anti-cheat. */
export function maxPlausibleScore(wave: number): number {
  let total = 0
  for (let w = 1; w <= wave; w++) {
    const enemies = 5 + Math.floor(w / 3)
    const reward = 2 * Math.pow(1.05, w)
    total += enemies * reward * 12 // score weight per enemy, generous
    if (w % 10 === 0) total += bossHp(w) * 4
  }
  return Math.floor(total * 5)
}
