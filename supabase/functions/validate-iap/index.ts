// POST /functions/v1/validate-iap
// Receipt validation entrypoint (AI_PROMPT.md §4.2 / §6.4). Wire the TODO
// branches to the Google Play Developer API / Apple verifyReceipt before
// going live; the IAP catalog mirrors AI_PROMPT.md §6.3.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, json } from '../_shared/cors.ts'

const CATALOG: Record<string, { coins?: number; gems?: number; noAds?: boolean; skin?: string }> = {
  'coins.small': { coins: 500 },
  'coins.medium': { coins: 3000 },
  'coins.large': { coins: 15000 },
  'gems.small': { gems: 100 },
  'gems.large': { gems: 2500 },
  'starter.pack': { coins: 500, skin: 'volcano', noAds: true },
  'noads': { noAds: true },
  'battlepass.s1': { gems: 300 },
  'skin.bundle.crystal': { skin: 'crystal' },
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

    const { product_id, store, receipt } = await req.json()
    const product = CATALOG[product_id]
    if (!product) return json({ error: 'unknown_product' }, 400)

    // TODO: real verification.
    //  - store === 'google' → Google Play Developer API purchases.products.get
    //  - store === 'apple'  → POST to https://buy.itunes.apple.com/verifyReceipt
    const verified = typeof receipt === 'string' && receipt.length > 0

    await supabase.from('iap_receipts').insert({
      user_id: user.id,
      product_id,
      store: store ?? 'unknown',
      receipt: receipt ?? '',
      state: verified ? 'verified' : 'invalid',
    })
    if (!verified) return json({ ok: false, error: 'invalid_receipt' }, 400)

    // Atomic, row-creating grant (avoids no-op UPDATE for users without a
    // meta_state row and the read-modify-write lost-update race).
    const { error: grantErr } = await supabase.rpc('grant_rewards', {
      p_coins: product.coins ?? 0,
      p_gems: product.gems ?? 0,
      p_skin: product.skin ?? null,
    })
    if (grantErr) return json({ error: grantErr.message }, 400)

    return json({ ok: true, granted: product })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
