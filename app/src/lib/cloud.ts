// Optional cloud sync to the Supabase/Lovable-Cloud backend (AI_PROMPT.md §4).
// Stays a no-op unless VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are set,
// so the game is fully playable fully offline. The Edge Functions and SQL
// schema live in /supabase.

import type { LocalRun } from './storage'

const URL = import.meta.env.VITE_SUPABASE_URL
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY

export function cloudEnabled(): boolean {
  return !!URL && !!ANON
}

/** Fire-and-forget run submission to the anti-cheat / leaderboard function. */
export async function submitRun(run: LocalRun, upgradesTaken: Record<string, number>) {
  if (!cloudEnabled()) return
  try {
    await fetch(`${URL}/functions/v1/submit-run`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        apikey: ANON as string,
        authorization: `Bearer ${ANON}`,
      },
      body: JSON.stringify({
        mode: run.mode,
        wave_reached: run.wave,
        score: run.score,
        duration_ms: run.durationMs,
        upgrades_taken: upgradesTaken,
      }),
    })
  } catch {
    /* offline — ignore, server is best-effort */
  }
}

export async function fetchDailySeed(): Promise<number | null> {
  if (!cloudEnabled()) return null
  try {
    const res = await fetch(`${URL}/functions/v1/daily-seed`, {
      headers: { apikey: ANON as string, authorization: `Bearer ${ANON}` },
    })
    const json = (await res.json()) as { seed?: number }
    return json.seed ?? null
  } catch {
    return null
  }
}
