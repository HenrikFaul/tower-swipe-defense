// Optional cloud sync to the Supabase/Lovable-Cloud backend (AI_PROMPT.md §4).
// Stays a no-op unless VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are set,
// so the game is fully playable offline. The Edge Functions and SQL schema
// live in /supabase.
//
// Auth: the edge functions identify the player via auth.getUser(), which needs
// a real user JWT (the anon key is not a user). We obtain one with an
// anonymous sign-in (must be enabled in the Supabase project) and cache it.

import type { LocalRun } from './storage'

const URL = import.meta.env.VITE_SUPABASE_URL
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY
const TOKEN_KEY = 'tsd:sb_token'

export function cloudEnabled(): boolean {
  return !!URL && !!ANON
}

let cachedToken: string | null = null

async function getAccessToken(forceNew = false): Promise<string | null> {
  if (!cloudEnabled()) return null
  if (!forceNew) {
    if (cachedToken) return cachedToken
    const stored = localStorage.getItem(TOKEN_KEY)
    if (stored) {
      cachedToken = stored
      return stored
    }
  }
  try {
    const res = await fetch(`${URL}/auth/v1/signup`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: ANON as string },
      body: JSON.stringify({ data: {}, gotrue_meta_security: {} }),
    })
    const json = (await res.json()) as { access_token?: string; session?: { access_token?: string } }
    const token = json.access_token ?? json.session?.access_token ?? null
    if (token) {
      cachedToken = token
      localStorage.setItem(TOKEN_KEY, token)
    }
    return token
  } catch {
    return null
  }
}

async function authedFetch(path: string, init: RequestInit, retry = true): Promise<Response | null> {
  const token = await getAccessToken()
  if (!token) return null
  const res = await fetch(`${URL}${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      'content-type': 'application/json',
      apikey: ANON as string,
      authorization: `Bearer ${token}`,
    },
  })
  if (res.status === 401 && retry) {
    // token likely expired — re-authenticate once
    cachedToken = null
    localStorage.removeItem(TOKEN_KEY)
    await getAccessToken(true)
    return authedFetch(path, init, false)
  }
  return res
}

/** Fire-and-forget run submission to the anti-cheat / leaderboard function. */
export async function submitRun(
  run: LocalRun,
  upgradesTaken: Record<string, number>,
  dailySeed?: number,
): Promise<void> {
  if (!cloudEnabled()) return
  try {
    await authedFetch('/functions/v1/submit-run', {
      method: 'POST',
      body: JSON.stringify({
        mode: run.mode,
        daily_seed: run.mode === 'daily' ? dailySeed ?? null : null,
        wave_reached: run.wave,
        score: run.score,
        duration_ms: run.durationMs,
        upgrades_taken: upgradesTaken,
      }),
    })
  } catch {
    /* offline — best-effort, ignore */
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
