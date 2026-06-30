// POST /functions/v1/submit-run
// Anti-cheat validation (AI_PROMPT.md §4.2 / §5.6) then writes the run and,
// if valid, a leaderboard entry for the daily, weekly and all-time seasons.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, json } from '../_shared/cors.ts'

function maxPlausibleScore(wave: number): number {
  let total = 0
  for (let w = 1; w <= wave; w++) {
    const enemies = 5 + Math.floor(w / 3)
    const reward = 2 * Math.pow(1.05, w)
    total += enemies * reward * 12
    if (w % 10 === 0) {
      const hp = 10 * Math.pow(1.08, w)
      total += enemies * hp * 4 * 4
    }
  }
  return Math.floor(total * 5)
}

// A floor on how long a legitimate run to a given wave must take.
function expectedMinMs(wave: number): number {
  let s = 0
  for (let w = 1; w <= wave; w++) s += 8 + 0.3 * w
  return Math.floor(s * 1000 * 0.35) // generous lower bound
}

function isoWeek(d: Date): string {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  const day = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `weekly-W${String(week).padStart(2, '0')}-${date.getUTCFullYear()}`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'method' }, 405)

  try {
    const auth = req.headers.get('Authorization') ?? ''
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: auth } } },
    )
    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user
    if (!user) return json({ error: 'unauthorized' }, 401)

    const body = await req.json()
    const wave = Math.max(0, Math.floor(body.wave_reached ?? 0))
    const score = Math.max(0, Math.floor(body.score ?? 0))
    const durationMs = Math.max(0, Math.floor(body.duration_ms ?? 0))
    const mode = body.mode === 'daily' ? 'daily' : 'normal'

    let flag: string | null = null
    if (score > maxPlausibleScore(wave) * 1.05) flag = 'score_too_high'
    else if (durationMs < expectedMinMs(wave)) flag = 'too_fast'

    const validated = flag === null
    const today = new Date()

    const { error: runErr } = await supabase.from('runs').insert({
      user_id: user.id,
      mode,
      daily_seed: body.daily_seed ?? null,
      wave_reached: wave,
      score,
      duration_ms: durationMs,
      upgrades_taken: body.upgrades_taken ?? {},
      validated,
      flag_reason: flag,
    })
    if (runErr) return json({ error: runErr.message }, 400)

    if (validated) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('display_name, country_code')
        .eq('user_id', user.id)
        .maybeSingle()
      const name = prof?.display_name ?? 'Defender'
      const seasons = [
        `daily-${today.toISOString().slice(0, 10)}`,
        isoWeek(today),
        'alltime',
      ]
      for (const season of seasons) {
        await supabase.from('leaderboard_entries').insert({
          user_id: user.id,
          display_name: name,
          country_code: prof?.country_code ?? null,
          score,
          wave,
          mode,
          season,
        })
      }
    }

    return json({ ok: true, validated, flag })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
