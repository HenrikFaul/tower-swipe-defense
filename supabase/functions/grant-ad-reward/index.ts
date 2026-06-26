// POST /functions/v1/grant-ad-reward
// Rewarded-ad SSV callback (AI_PROMPT.md §4.2 / §6.1). Records the ad event
// and grants the placement reward to the player's meta_state.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, json } from '../_shared/cors.ts'

const REWARDS: Record<string, { coins?: number; gems?: number }> = {
  double_coins: {},
  daily_spin: { coins: 250 },
  free_skin_spin: {},
  revive: {},
  reroll_shop: {},
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

    const { placement } = await req.json()
    const reward = REWARDS[placement]
    if (!reward) return json({ error: 'unknown_placement' }, 400)

    await supabase.from('ad_events').insert({
      user_id: user.id,
      placement,
      state: 'rewarded',
    })

    if (reward.coins || reward.gems) {
      const { data: meta } = await supabase
        .from('meta_state')
        .select('coins, gems')
        .eq('user_id', user.id)
        .maybeSingle()
      await supabase
        .from('meta_state')
        .update({
          coins: (meta?.coins ?? 0) + (reward.coins ?? 0),
          gems: (meta?.gems ?? 0) + (reward.gems ?? 0),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
    }

    return json({ ok: true, placement, reward })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
