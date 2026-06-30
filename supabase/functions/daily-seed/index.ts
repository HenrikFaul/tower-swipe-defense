// GET /functions/v1/daily-seed
// Returns today's shared daily-challenge seed, generating it on first call
// (AI_PROMPT.md §4.2). The same seed feeds the client's mulberry32 RNG so
// every player gets an identical run.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, json } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY')!,
    )
    // Pass an explicit UTC date so the row key, the seed, and the reported date
    // all derive from one agreed value (independent of the DB session timezone).
    const today = new Date().toISOString().slice(0, 10)
    const { data, error } = await supabase.rpc('ensure_daily_seed', { d: today })
    if (error) return json({ error: error.message }, 400)
    return json({ date: today, seed: Number(data) })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
