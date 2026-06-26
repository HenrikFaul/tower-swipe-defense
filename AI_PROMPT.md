# Tower Swipe Defense — AI Fejlesztői Prompt

> **Tagline:** Swipe to Defend Your Tower!
> **Műfajok:** STRATEGY / ARCADE / DEFENSE / ROGUELITE-LIGHT
> **Cél hossz:** ~35 000 karakter, magyarul, technikailag teljes körű prompt.

Ez a prompt egy AI ügynöknek készíti elő a Tower Swipe Defense fejlesztését. React + PixiJS v8, Capacitor wrap, Lovable Cloud backend. Hibrid monetizáció (rewarded ads + IAP + battle pass).

---

## 1. Vízió, célközönség, design pillérek

A Tower Swipe Defense egy **„one-finger tower defense + slingshot aim"** hibrid. A játékos a torony közepéből csúzli-szerű drag-and-release ujjmozdulattal lő ellenségekre, amik 8 irányból támadnak. Roguelite-light: minden wave után **3 random upgrade** közül választasz, így minden run más. Hosszú wave-progresszió, boss-fight 10-enként, daily challenge szabadon választott seedeel.

### 1.1 Vízió-statement

> „A Tower Swipe Defense az a játék, amit a Pokó- vagy Among Us-kult egyszerűségével játszol — egy ujj, egy húzás, robbanások. De minden run tactikai döntés a roguelite upgrade-fa miatt, ezért 30 nap múlva még mindig mást próbálsz."

### 1.2 Célközönség

| Szegmens | % | Életkor |
|----------|---|---------|
| Mid-core casual | 50% | 15–35 |
| Strategy lover | 30% | 20–45 |
| Hyper-casual try | 20% | 10–18 |

### 1.3 Top célpiacok

USA, UK, Németország, India, Délkelet-Ázsia. Erős mid-core közönség, mediation-driven ad-revenue.

### 1.4 Design pillérek

- **One-finger always.** Az aim és tüzelés egyetlen drag-release.
- **Random run, sticky upgrades.** Minden run friss, de a meta-progress (skin, permanent boost) marad.
- **Boss minden 10-nél.** Ritmus + reward.
- **Daily challenge seed.** Mindenki ugyanazt a runt játssza, leaderboard.
- **No P2W.** IAP gyorsít vagy kozmetikai, de minden tartalom megszerezhető free-en.

### 1.5 Art & audio

- **Art:** stilizált medieval-fantasy felülnézet, izometrikus light. Mid-saturation: zöld mező, szürke kő-tornyok, fekete kontúrok. Ellenfelek: orc grunt, runner, troll tank, healer-cleric, archer, mage-boss-mini, dragon-boss.
- **Audio:** orchesztrális stinger, 100 BPM. Aim közben halk vonós drone. Tűz: kürt-tap. Boss-spawn: nagy timpani roll + chrominális glissando.
- **Haptika:** light tap minden lövésnél, medium hit-ütésnél, heavy boss-spawnnál és wave-clear-nél.

### 1.6 Brand

- **Színkód:** Primary `#3D2817`, Accent `#FF7B00`, Magic `#7B61FF`, Surface `#F4E9D6`.
- **Font:** „Cinzel" (display) + „Inter" (UI).
- **Ikon:** stilizált stone tower felülnézet, nyíl-csíkok kifelé, parázs-glow.

### 1.7 Versenytárs

| Versenytárs | Hiányosság | USP |
|-------------|------------|-----|
| Archero | Mozgás kell, nem one-finger | Tisztán swipe-aim |
| Bowmasters | Csak lőtér, nincs wave-progression | Tower defense progresszió |
| Bloons TD | Komplex grid, sok onboarding | 5 sec FTUE |
| Random Dice TD | Multiplayer, sok mechanika | Solo, single-finger, gyors |

### 1.8 KPI

| Metrika | Cél T1 | Cél T3 |
|---------|--------|--------|
| D1 | 40% | 32% |
| D7 | 18% | 12% |
| D30 | 7% | 3.5% |
| ARPDAU | 0.10 | 0.025 |
| Session length | 240 s | 180 s |

---

## 2. Core gameplay mechanika

### 2.1 Aim & shoot

- **Drag origin:** a torony közepe.
- **Drag direction:** kifelé húzza az ujját → célzás (vektor irány = `target - origin`).
- **Drag length:** sebességmodulátor; max length cap = a torony sugara × 3. Vizuális feedback: trajectory arc (Bezier).
- **Release:** projectile indul, `velocity = direction · base_speed · upgrade_mul`.
- **Auto-fire mód (settings):** holdkor auto-tüzelés a célzott irányba minden `1 / fire_rate` sec.

### 2.2 Tower

- **Position:** képernyő közepe.
- **HP:** `H_tower = 100 + 20 · tower_level` (meta upgrade-elhető).
- **Visuals:** 3D-look 2D sprite + 4 tower-skin (stone, ice, jungle, volcano, crystal). Skin nem csak kozmetikai: speciális ability.

### 2.3 Ellenség-típusok

| Típus | HP | Speed | Reward | Special |
|-------|----|----|--------|---------|
| Grunt | base | 1.0 | base | — |
| Runner | 0.5× | 2.0 | 0.7× | — |
| Tank | 4× | 0.5 | 3× | armor: 30% DMG resist |
| Healer | 2× | 0.7 | 2× | heal nearest enemy +5%/sec |
| Archer | 1× | 0.7 | 1.5× | lő a toronyra range 4 |
| Mage-mini | 3× | 0.6 | 4× | shield buff csapatra |
| Boss | 25× | 0.3 | 30× | speciális ability |
| Dragon-boss | 80× | 0.4 | 100× | breath cone |

### 2.4 Wave-progression

- Wave duration: `8 + 0.3·w` sec, ellenség spawn `1 + floor(w/5)` per sec.
- Wave közti pause: 2 sec, upgrade modal pop-up.

### 2.5 Upgrade-fa (roguelite)

12 node, mindegyikből 5 szint. Példák:
- DMG (+10% per szint)
- Fire rate (+8% per szint)
- Multi-shot (+1 projektil, max 5)
- Range (+10%)
- Crit chance (+5%, max 25%)
- Crit DMG (+30%)
- Slow aura (range 3, slow 30%)
- Burn (DMG over time)
- Freeze (5% chance stop 1 sec)
- Lightning chain (jump 2 enemies)
- Vampiric (heal 5% DMG)
- Magnet (auto-collect coin range)

Wave közti shop: 3 random node + reroll (1 coin / rewarded ad).

### 2.6 Pontozás

- `score = Σ enemy_killed · enemy_score`.
- `bonus = wave² · 10` ha boss megölve.
- `combo_bonus`: 1.05× per consecutive headshot (no miss).

### 2.7 Edge case-ek

- Tornyot eltalálja archer → screen-flash + `H_tower -= dmg`.
- Tower HP < 20% → screen border vörösen pulzál.
- Tower HP = 0 → game over modal.
- Revive (rewarded ad): `H_tower = 50%`, folytatás.

### 2.8 Daily Challenge

Naponta egy seed, mindenki ugyanazt a runt játssza. Külön leaderboard. Reward: gem + skin-shard.

---

## 3. Frontend architektúra — React + PixiJS

### 3.1 Stack

- **React 19 + TS + Vite**
- **PixiJS v8 + @pixi/react** — 2D top-down, izometrikus light.
- **Zustand** — game state.
- **Howler.js** — audio.
- **Framer Motion** — UI tween.
- **idb-keyval** — local cache.
- **TanStack Query** — szerver state.

### 3.2 Projektstruktúra

```
src/games/tower-swipe-defense/app/
├── engine/
│   ├── AimSystem.ts                # drag → trajectory vektor
│   ├── ProjectileSystem.ts         # spawn, mozgás, collision
│   ├── EnemySpawner.ts             # wave-based spawn
│   ├── CollisionSystem.ts          # spatial hash
│   ├── UpgradeSystem.ts            # roguelite node
│   ├── WaveDirector.ts             # wave progression FSM
│   └── Audio.ts
├── components/
│   ├── TowerSprite.tsx
│   ├── EnemySprite.tsx
│   ├── ProjectileSprite.tsx
│   ├── TrajectoryGuide.tsx         # release közben arc
│   ├── ComboBanner.tsx
│   ├── UpgradeChoiceModal.tsx
│   ├── BossIntroModal.tsx
│   └── ResultsModal.tsx
├── screens/
│   ├── MainMenu.tsx
│   ├── PlayScreen.tsx
│   ├── UpgradesScreen.tsx          # meta upgrades
│   ├── SkinsScreen.tsx
│   ├── DailyChallengeScreen.tsx
│   ├── LeaderboardScreen.tsx
│   └── Settings.tsx
├── data/
│   ├── enemies.json
│   ├── upgrades.json
│   ├── waves.json
│   └── skins.json
├── store/
│   └── gameStore.ts
├── lib/
│   ├── rng.ts (mulberry32)
│   ├── ads.ts
│   ├── iap.ts
│   ├── analytics.ts
│   └── i18n.ts
```

### 3.3 Render loop

```ts
app.ticker.add((dt) => {
  aimSystem.update(dt);
  enemySpawner.update(dt);
  enemySystem.update(dt);
  projectileSystem.update(dt);
  collisionSystem.tick();
  waveDirector.update(dt);
});
```

### 3.4 Aim system

```ts
class AimSystem {
  origin = { x: cw/2, y: ch/2 };
  current?: { x: number; y: number };
  onPointerDown(e: FederatedPointerEvent) {
    this.current = { x: e.global.x, y: e.global.y };
  }
  onPointerMove(e: FederatedPointerEvent) {
    if (!this.current) return;
    this.current = { x: e.global.x, y: e.global.y };
  }
  onPointerUp() {
    if (!this.current) return;
    const dir = subtract(this.current, this.origin);
    const len = magnitude(dir);
    const v = normalize(dir);
    spawnProjectile(this.origin, v, baseSpeed * Math.min(len / maxLen, 1));
    this.current = undefined;
  }
}
```

### 3.5 Performance

- **Pool:** projektil pool 300 db, ellenség pool 100 db, particle pool 256.
- **Spatial hash:** cell = 64 px, projektil-enemy collision O(1) átlag.
- **Texture atlas:** 1024×1024 minden sprite-hoz.
- **Auto-LOD:** ha FPS < 30, particle off, shadow off, trail off.

### 3.6 Reszponzív

Mobile-first 9:16; tablet: HUD szélesebb, mező magasabb.

### 3.7 Accessibility

- Reduced motion: trajectory arc kevesebb particle.
- Color-blind safe enemy markers (typing-icon).
- TalkBack: HP, wave-szám live region.

### 3.8 Audio rendszer

Sprite-sheet: `shoot, hit, crit, enemy_dead, wave_clear, boss_intro, lose, win, ui_tap`.

### 3.9 Példa: `EnemySprite.tsx`

```tsx
export function EnemySprite({ enemy }: { enemy: Enemy }) {
  const tex = useTexture(`/atlas/enemies/${enemy.type}.png`);
  return (
    <pixiSprite
      texture={tex}
      anchor={0.5}
      x={enemy.x}
      y={enemy.y}
      rotation={Math.atan2(-enemy.vy, -enemy.vx)}
      tint={enemy.frozen ? 0x99CCFF : 0xFFFFFF}
    />
  );
}
```

---

## 4. Backend és adat-persistencia (Lovable Cloud)

### 4.1 Adattáblák

```sql
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Defender',
  country_code text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "self" on public.profiles for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.meta_state (
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
grant select, insert, update on public.meta_state to authenticated;
grant all on public.meta_state to service_role;
alter table public.meta_state enable row level security;
create policy "self" on public.meta_state for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.runs (
  id bigserial primary key,
  user_id uuid not null references auth.users(id),
  mode text not null,                  -- 'normal','daily'
  daily_seed bigint,
  wave_reached int not null,
  score bigint not null,
  duration_ms int not null,
  upgrades_taken jsonb not null,
  validated boolean not null default false,
  flag_reason text,
  created_at timestamptz not null default now()
);
grant select, insert on public.runs to authenticated;
grant all on public.runs to service_role;
alter table public.runs enable row level security;
create policy "self r" on public.runs for select to authenticated using (auth.uid() = user_id);

create table public.daily_challenge (
  date date primary key,
  seed bigint not null,
  created_at timestamptz not null default now()
);
grant select on public.daily_challenge to authenticated, anon;
grant all on public.daily_challenge to service_role;
alter table public.daily_challenge enable row level security;
create policy "public read" on public.daily_challenge for select to authenticated, anon using (true);

create table public.leaderboard_entries (
  id bigserial primary key,
  user_id uuid not null references auth.users(id),
  display_name text not null,
  country_code text,
  score bigint not null,
  wave int not null,
  mode text not null,
  season text not null,                -- 'daily-2026-06-25','weekly-W26','alltime'
  created_at timestamptz not null default now()
);
create index on public.leaderboard_entries (season, score desc);
grant select on public.leaderboard_entries to authenticated, anon;
grant all on public.leaderboard_entries to service_role;
alter table public.leaderboard_entries enable row level security;
create policy "public read" on public.leaderboard_entries for select to authenticated, anon using (true);

create table public.iap_receipts (
  id bigserial primary key,
  user_id uuid not null references auth.users(id),
  product_id text not null,
  store text not null,
  receipt text not null,
  state text not null default 'pending',
  created_at timestamptz not null default now()
);
grant select, insert on public.iap_receipts to authenticated;
grant all on public.iap_receipts to service_role;
alter table public.iap_receipts enable row level security;
create policy "self r" on public.iap_receipts for select to authenticated using (auth.uid() = user_id);
create policy "self i" on public.iap_receipts for insert to authenticated with check (auth.uid() = user_id);

create table public.ad_events (
  id bigserial primary key,
  user_id uuid not null references auth.users(id),
  placement text not null,
  state text not null,
  created_at timestamptz not null default now()
);
grant insert on public.ad_events to authenticated;
grant all on public.ad_events to service_role;
alter table public.ad_events enable row level security;
create policy "self i" on public.ad_events for insert to authenticated with check (auth.uid() = user_id);
```

### 4.2 Edge Functions

`POST /functions/v1/submit-run` — anti-cheat check + leaderboard insert (daily, weekly, alltime).

```ts
function maxPlausibleScore(wave: number): number {
  // Sok szám crunch — adott formulából számolt elméleti felső határ.
  let total = 0;
  for (let w = 1; w <= wave; w++) {
    const enemies = 5 + Math.floor(w / 3);
    const hp = 10 * Math.pow(1.08, w);
    const reward = 2 * Math.pow(1.05, w);
    total += enemies * reward;
    if (w % 10 === 0) total += hp * 4 * 30; // boss
  }
  return Math.floor(total * 5); // generous combo cap
}
```

`GET /functions/v1/daily-seed` — visszaadja a mai daily seed-et (auto-generálódik napi cron-nal).

`POST /functions/v1/validate-iap` — Google/Apple receipt validáció.

`POST /functions/v1/grant-ad-reward` — rewarded SSV callback.

`POST /functions/v1/save-ghost-replay` — top-10 replay tárolása Storage-ban (lehetséges későbbi feature).

### 4.3 Auth flow

Anonim auto-login → optional email upgrade. Friend-rendszer későbbi sprintben.

### 4.4 Local persistence

`meta_state` lokálisan IndexedDB-ben. Run végén push szerverre Edge Functionön át. Konfliktus: server wins.

---

## 5. AI és intelligencia rétegek

### 5.1 DDA wave-balansz

A wave-hardness funkció megfigyelten balanszolódik a Live Ops-ban: a Remote Config a `enemy_hp_mult` és `enemy_speed_mul` paramétert szabályozza (alapból 1.0). Ha a global D7 csökken egy ÚJ wave-tier elérésekor, csökkentik.

Per-user DDA: ha 3× ugyanazon a wave-en bukik a user, a következő futás `+15% DMG, −10% enemy HP` az adott tier-ig.

### 5.2 Procedurális spawn (seed)

Determinisztikus mulberry32 RNG, daily seed esetén minden játékosnál azonos.

```ts
function spawnEnemy(wave: number, rng: () => number): Enemy {
  const types = enemyTypesForWave(wave);
  const t = types[Math.floor(rng() * types.length)];
  const angle = rng() * Math.PI * 2;
  const dist = 600;
  return makeEnemy({ type: t, x: cw/2 + Math.cos(angle)*dist, y: ch/2 + Math.sin(angle)*dist });
}
```

### 5.3 AI-driven boss-mechanika

Boss-fight minden 10. wave-nél. Speciális mechanika, AI-driven prompttal generálható (változatosság):

```ts
// generate-boss-pattern.ts
const prompt = `Wave: ${w}. Generate a boss attack pattern as JSON:
{
  hpMul: 1.0-5.0,
  abilities: [{name, cooldownSec, dmg, areaRadius, telegraph: true/false}],
  totalCount: 1-3 abilities,
  difficulty: 'medium' | 'hard'
}`;
```

Cache 7 nap, hogy tudjuk reusable.

### 5.4 Roguelite upgrade-balansz

A node-ok power-szintjét egy `balancer.ts` skript szimulál: 1000 Monte-Carlo run, várt élettartam minden upgrade-pick-szekvenciára. Cél: minden node legalább `0.9× — 1.1×` median life-time, ne legyenek dominant strategies.

### 5.5 Churn prediction

Edge cron:
- `days_since_last_session ≥ 3 && best_wave ≥ 20` → push „A tornyod hiányol! +500 coin gift" + win-back IAP.
- `days_since_last_session ≥ 7` → comeback gift modal.

### 5.6 Anti-cheat

- `score > maxPlausibleScore(wave) * 1.05` → flag.
- `duration_ms < expected_min(wave)` → flag.
- 24h-ban >50 run → manual review.
- Több ország 1h alatt → flag.

### 5.7 Daily challenge AI-generated boss flavor

A daily challenge boss-egy AI-generated „flavor sentence"-szel jön: „A Rezgő Mage ma akarja elpusztítani a tornyot. Túléled?" (lokalizálva 8 nyelvre).

### 5.8 Hint system

Ha 30 sec inaktív aim közben → kis pulzáló nyíl arrow mutatja a legközelebbi enemyt.

---

## 6. Monetizáció

### 6.1 Rewarded placement-ek

| Key | Trigger | Reward |
|-----|---------|--------|
| `revive` | game over | 50% HP, folytatás | 1×/run |
| `double_coins` | results | 2× coin | 1×/run |
| `reroll_shop` | upgrade modal | reroll 3 nodes | 3×/run |
| `daily_spin` | menu | 50–500 coin | 1×/24h |
| `free_skin_spin` | shop | common skin spin | 1×/24h |

### 6.2 Interstitial

- Csak game over → main menu, capping 90 sec.
- D0 nem mutat.

### 6.3 IAP

| Product ID | Tier | Ár | Tartalom |
|------------|------|----|----|
| `coins.small` | cons | 0.99 | 500 |
| `coins.medium` | cons | 4.99 | 3000 |
| `coins.large` | cons | 19.99 | 15000 |
| `gems.small` | cons | 0.99 | 100 |
| `gems.large` | cons | 19.99 | 2500 |
| `starter.pack` | non-cons | 4.99 | 500 coin + 1 skin + 1 perm upgrade + remove-ads-7d |
| `noads` | non-cons | 3.99 | nincs interstitial |
| `battlepass.s1` | non-cons | 9.99/szezon | 30 step progresszió |
| `skin.bundle.crystal` | non-cons | 4.99 | crystal tower + 3 trail |

### 6.4 Receipt validáció

Edge function-ben, Google Play Developer API + Apple verifyReceipt.

### 6.5 FTUE → első IAP funnel

| Lépés | Esemény | Cél |
|-------|---------|-----|
| App open | `app_open` | 100% |
| First shoot | `first_shoot` | ≥ 95% |
| First wave clear | `wave_clear w=1` | ≥ 90% |
| Reach wave 10 (boss) | `boss_defeated w=10` | ≥ 55% |
| First rewarded | `rwd_completed` | ≥ 38% |
| First IAP impression | `iap_impression starter_pack` | ≥ 27% |
| First IAP purchase | `iap_purchase` | ≥ 2.5% |

### 6.6 A/B test

- `starter_pack_price` 4.99 vs 6.99.
- `interstitial_cap` 60 vs 90 sec.
- `enemy_hp_mult` 1.0 vs 0.9 (DDA gentle vs strict).

### 6.7 Analytics

- `aim_started`, `shot_fired`, `enemy_killed`, `wave_clear`, `boss_intro`, `boss_defeated`, `upgrade_picked`, `tower_destroyed`, `revive_offered`, `revive_taken`.
- minden ad/IAP esemény.

### 6.8 LTV

`LTV(30) ≥ 0.9 USD T1`, `≥ 0.25 T3`.

---

## 7. ASO, lokalizáció, performance, launch

### 7.1 ASO

| Piac | Primary | Secondary |
|------|---------|-----------|
| US | `tower defense`, `swipe shoot`, `archer hero` | `slingshot`, `roguelike td` |
| UK | `tower defense`, `slingshot td` | `arcade defender` |
| DE | `turm verteidigung`, `pfeil schießen` | `roguelike td` |
| IN | `टावर डिफेंस`, `तीर` | `archery game` |
| ID | `pertahanan menara`, `pemanah` | `arcade td` |

### 7.2 Store-listing

- **Title:** Tower Swipe Defense
- **Subtitle:** One swipe. Hundred waves.
- **Screenshot order:** Boss intro → Multi-shot in action → Upgrade choice → Victory wave 50 → Daily leaderboard
- **Video preview:** Wave-progression montage (10 → 25 → 50), boss-defeat highlight.

### 7.3 Lokalizáció

Top 8: EN, DE, ES, PT-BR, IT, FR, ID, JA. AI-pretranslate + emberi review.

### 7.4 Viralitás

- Share VICTORY képernyő (wave-számmal).
- Daily challenge: „A barátod 35-ig jutott — verd meg".
- Boss-defeat replay-share (auto-record 10 sec clip).

### 7.5 Push notification

| Trigger | Időzítés |
|---------|----------|
| Daily challenge ready | local 09:00 |
| Daily leaderboard final | local 22:00 |
| Friend overtook | realtime (cap 2/day) |
| Win-back 3d | local 18:00 |

### 7.6 Soft launch

- Piac: Fülöp-szigetek, Lengyelország, Vietnám.
- 3 hét, 200 USD/nap UA.
- Gate: D1 ≥ 37%, D7 ≥ 16%, ARPDAU ≥ 0.04.

### 7.7 Global launch checklist

- [ ] Privacy & terms URL
- [ ] Age rating 9+ (mild fantasy violence)
- [ ] GDPR consent
- [ ] Account-delete endpoint
- [ ] App-thinning
- [ ] Crash reporting (Sentry)
- [ ] Push cert
- [ ] Localized screenshots (8 nyelv)
- [ ] Seasonal icon (Halloween dragon)

### 7.8 KPI

| Metrika | T1 | T3 |
|---------|----|----|
| D1 | 40% | 32% |
| D7 | 18% | 12% |
| D30 | 7% | 3.5% |
| ARPDAU | 0.10 | 0.025 |
| Session length | 240 s | 180 s |

### 7.9 Performance budget

| Eszköz | RAM | FPS | Cold start |
|--------|-----|-----|------------|
| Android low | 280 MB | 30 | < 4s |
| Android mid | 400 MB | 60 | < 2.5s |
| iPhone SE 2 | 360 MB | 60 | < 2s |

### 7.10 QA

- 8 device-class.
- Stress test: 100+ enemy + 50 projectile + boss aoe.
- Network throttle (3G).
- Background mid-wave.
- Battery saver auto 30 FPS.

### 7.11 GDPR / COPPA

- 9+ rating, COPPA nem kötelező US-ben.
- GDPR consent + delete endpoint.
- CCPA opt-out.

### 7.12 Post-launch roadmap

- +4 hét: Halloween dragon-boss event.
- +8 hét: Battle Pass S1.
- +12 hét: Co-op 2-tower mode (béta).
- +16 hét: New tower-skin (crystal) + új ability.
- +24 hét: PvP-arena (asszinkron ghost).

---

## Záró megjegyzés a fejlesztő AI számára

Sprintek:
1. Pixi stage + tower + aim + 1 enemy type + collision.
2. Wave director + 5 enemy + scoring + game over.
3. Upgrade choice modal + 12 node + balance pass.
4. Boss fight (10-enként) + audio + particle.
5. Lovable Cloud auth + leaderboard + daily seed.
6. IAP + rewarded + analytics + ASO assets.

Sikeres ha: 60 FPS mid-range, D1 ≥ 35% soft-launch, crash-free ≥ 99.3%.
