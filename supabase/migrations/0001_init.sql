-- Tower Swipe Defense — backend schema (AI_PROMPT.md §4.1).
-- Run with: supabase db push   (or apply via the Supabase MCP apply_migration)

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Defender',
  country_code text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
drop policy if exists "self" on public.profiles;
create policy "self" on public.profiles for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- meta_state (coins, gems, progression) — server is authoritative on conflict
-- ---------------------------------------------------------------------------
create table if not exists public.meta_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  coins bigint not null default 0,
  gems int not null default 0,
  tower_level int not null default 1,
  owned_skins text[] not null default array['stone'],
  current_skin text not null default 'stone',
  meta_upgrades jsonb not null default '{}'::jsonb,
  best_wave int not null default 0,
  total_runs int not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.meta_state enable row level security;
grant select, insert, update on public.meta_state to authenticated;
grant all on public.meta_state to service_role;
drop policy if exists "self" on public.meta_state;
create policy "self" on public.meta_state for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- runs — every completed run, validated by the submit-run edge function
-- ---------------------------------------------------------------------------
create table if not exists public.runs (
  id bigserial primary key,
  user_id uuid not null references auth.users(id),
  mode text not null,
  daily_seed bigint,
  wave_reached int not null,
  score bigint not null,
  duration_ms int not null,
  upgrades_taken jsonb not null default '{}'::jsonb,
  validated boolean not null default false,
  flag_reason text,
  created_at timestamptz not null default now()
);
alter table public.runs enable row level security;
grant select, insert on public.runs to authenticated;
grant all on public.runs to service_role;
drop policy if exists "self r" on public.runs;
create policy "self r" on public.runs for select to authenticated using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- daily_challenge — one shared seed per day
-- ---------------------------------------------------------------------------
create table if not exists public.daily_challenge (
  date date primary key,
  seed bigint not null,
  created_at timestamptz not null default now()
);
alter table public.daily_challenge enable row level security;
grant select on public.daily_challenge to authenticated, anon;
grant all on public.daily_challenge to service_role;
drop policy if exists "public read" on public.daily_challenge;
create policy "public read" on public.daily_challenge for select to authenticated, anon using (true);

-- ---------------------------------------------------------------------------
-- leaderboard_entries — daily / weekly / alltime seasons
-- ---------------------------------------------------------------------------
create table if not exists public.leaderboard_entries (
  id bigserial primary key,
  user_id uuid not null references auth.users(id),
  display_name text not null,
  country_code text,
  score bigint not null,
  wave int not null,
  mode text not null,
  season text not null,
  created_at timestamptz not null default now()
);
create index if not exists leaderboard_season_score_idx
  on public.leaderboard_entries (season, score desc);
alter table public.leaderboard_entries enable row level security;
grant select on public.leaderboard_entries to authenticated, anon;
grant all on public.leaderboard_entries to service_role;
drop policy if exists "public read" on public.leaderboard_entries;
create policy "public read" on public.leaderboard_entries for select to authenticated, anon using (true);

-- ---------------------------------------------------------------------------
-- iap_receipts / ad_events
-- ---------------------------------------------------------------------------
create table if not exists public.iap_receipts (
  id bigserial primary key,
  user_id uuid not null references auth.users(id),
  product_id text not null,
  store text not null,
  receipt text not null,
  state text not null default 'pending',
  created_at timestamptz not null default now()
);
alter table public.iap_receipts enable row level security;
grant select, insert on public.iap_receipts to authenticated;
grant all on public.iap_receipts to service_role;
drop policy if exists "self r" on public.iap_receipts;
drop policy if exists "self i" on public.iap_receipts;
create policy "self r" on public.iap_receipts for select to authenticated using (auth.uid() = user_id);
create policy "self i" on public.iap_receipts for insert to authenticated with check (auth.uid() = user_id);

create table if not exists public.ad_events (
  id bigserial primary key,
  user_id uuid not null references auth.users(id),
  placement text not null,
  state text not null,
  created_at timestamptz not null default now()
);
alter table public.ad_events enable row level security;
grant insert on public.ad_events to authenticated;
grant all on public.ad_events to service_role;
drop policy if exists "self i" on public.ad_events;
create policy "self i" on public.ad_events for insert to authenticated with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- helper: deterministic daily seed (hash of yyyymmdd), idempotent insert
-- ---------------------------------------------------------------------------
create or replace function public.ensure_daily_seed(d date default current_date)
returns bigint
language plpgsql
security definer
as $$
declare
  s bigint;
begin
  select seed into s from public.daily_challenge where date = d;
  if s is null then
    -- YYYYMMDD as an integer — identical to the client's rng.dailySeed(), so
    -- offline and server-synced players get the exact same deterministic run.
    s := to_char(d, 'YYYYMMDD')::bigint;
    insert into public.daily_challenge(date, seed) values (d, s)
      on conflict (date) do nothing;
    select seed into s from public.daily_challenge where date = d;
  end if;
  return s;
end;
$$;
grant execute on function public.ensure_daily_seed(date) to authenticated, anon, service_role;

-- ---------------------------------------------------------------------------
-- helper: atomically grant currency / skins to the calling user, creating the
-- meta_state row if absent. Runs as definer so edge functions can rely on it
-- regardless of whether a row exists yet (fixes silent no-op UPDATEs and the
-- read-modify-write lost-update race for IAP / ad rewards).
-- ---------------------------------------------------------------------------
create or replace function public.grant_rewards(
  p_coins bigint default 0,
  p_gems int default 0,
  p_skin text default null
)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.meta_state (user_id, coins, gems, owned_skins)
  values (
    auth.uid(),
    greatest(p_coins, 0),
    greatest(p_gems, 0),
    case when p_skin is null then array['stone'] else array['stone', p_skin] end
  )
  on conflict (user_id) do update
  set coins = public.meta_state.coins + greatest(p_coins, 0),
      gems = public.meta_state.gems + greatest(p_gems, 0),
      owned_skins = case
        when p_skin is null or p_skin = any(public.meta_state.owned_skins)
          then public.meta_state.owned_skins
        else array_append(public.meta_state.owned_skins, p_skin)
      end,
      updated_at = now();
end;
$$;
grant execute on function public.grant_rewards(bigint, int, text) to authenticated, service_role;
