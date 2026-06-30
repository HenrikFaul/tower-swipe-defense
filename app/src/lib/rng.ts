// Deterministic mulberry32 PRNG (AI_PROMPT.md §5.2). Same seed → same run,
// which is what makes the Daily Challenge fair across all players.
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Stable seed for "today" as the YYYYMMDD integer (UTC). This matches the
// server's daily-seed function byte-for-byte (`to_char(d,'YYYYMMDD')::bigint`),
// so an offline client and a server-synced client play the identical run.
export function dailySeed(date = new Date()): number {
  const y = date.getUTCFullYear()
  const m = date.getUTCMonth() + 1
  const d = date.getUTCDate()
  return y * 10000 + m * 100 + d // e.g. 2026-06-26 → 20260626
}

export function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10)
}
