# Tower Swipe Defense — App

A fully playable, native-Android (Capacitor) build of **Tower Swipe Defense**,
implementing the gameplay, UI/UX, frontend and backend described in
[`../AI_PROMPT.md`](../AI_PROMPT.md) and [`../README.md`](../README.md).

> **One swipe. A hundred waves.** Drag from the tower like a slingshot, release
> to fire, kill enemies for coins, pick a random roguelite upgrade each wave,
> and survive as long as you can. Boss every 10 waves, dragon every 30.

## Stack

| Layer      | Choice | Notes |
|------------|--------|-------|
| Frontend   | React 18 + TypeScript + Vite | Screens, HUD, modals |
| Engine     | Custom Canvas 2D game loop | Tower, slingshot aim, projectiles, enemies, particles — 60 fps, deterministic RNG |
| State      | Zustand + localStorage | Meta progression, settings, local leaderboard |
| Native     | Capacitor 6 (Android) | Wraps the web bundle into an APK |
| Backend    | Supabase / Lovable Cloud | See [`../supabase`](../supabase) — SQL schema + Edge Functions |

> The spec names PixiJS; this build uses a hand-written Canvas 2D renderer so it
> compiles and runs with zero heavy/native-binary dependencies while hitting the
> same 60 fps / `<50` entity budget and identical visual direction.

## Run in a browser (development)

```bash
cd app
npm install
npm run dev      # http://localhost:5173
```

`npm run build` type-checks and produces an optimized bundle in `dist/`
(~61 kB gzipped). `npm run preview` serves the production build.

## Build the Android APK

The Android SDK / Google Maven are **blocked inside the Claude sandbox**, so the
APK is built in CI where that access exists.

### Option A — GitHub Actions (recommended)

Every push that touches `app/**` runs
[`.github/workflows/android-build.yml`](../.github/workflows/android-build.yml).
Download the `tower-swipe-defense-apk` artifact from the workflow run, or create
a GitHub Release to attach the APK to it automatically. You can also trigger it
manually via **Actions → Build Android APK → Run workflow**.

### Option B — Local machine with Android SDK

```bash
cd app
npm install
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
# → android/app/build/outputs/apk/debug/app-debug.apk
```

Install on a device: `adb install -r app-debug.apk`.

## Backend (optional cloud sync)

The game is fully playable offline. To enable leaderboard / daily-seed sync:

1. Apply [`../supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql)
   and deploy the functions in [`../supabase/functions`](../supabase/functions).
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (e.g. in `app/.env`).
   `lib/cloud.ts` then pushes runs and pulls the daily seed; otherwise it's a no-op.

## Project structure

```
app/src/
├── engine/      # game.ts (sim), render.ts (canvas), stats.ts, vec.ts
├── screens/     # MainMenu, Play, Upgrades, Skins, Daily, Leaderboard, Settings
├── components/  # Common, GameModals (boss intro, shop, results, pause)
├── store/       # gameStore.ts (Zustand + persistence + economy)
├── data/        # enemies, upgrades, skins, types
├── lib/         # rng, balance, audio, haptics, storage, cloud
└── styles/      # global.css (brand palette, components)
```

## Feature checklist (from the spec)

- ✅ Slingshot drag-and-release aim with power-scaled projectiles + trajectory guide
- ✅ 8-direction wave spawns, formulas `H(w)=10·1.08^w`, `N(w)=5+⌊w/3⌋`, `D(w)=2·1.05^w`
- ✅ 7 enemy types + dragon boss, with armor / heal / ranged / shield specials
- ✅ Boss every 10 waves (dragon every 30) with intro modal + boss HP bar
- ✅ 12-node roguelite upgrade tree, 3 random choices + rewarded reroll between waves
- ✅ Combo multiplier, score + boss bonus `wave²·10`
- ✅ Tower HP, damage flash, low-HP red pulse, game over, rewarded revive
- ✅ Meta progression: coins, gems, 5 permanent upgrades, 5 skins (each with an ability)
- ✅ Daily Challenge with deterministic seed + AI flavor line + daily leaderboard
- ✅ Settings: sound, haptics, auto-fire, reduced-motion; no-ads + daily spin
- ✅ DDA compensation after repeated failures on a wave
- ✅ Supabase schema + submit-run anti-cheat / daily-seed / validate-iap / grant-ad-reward
```
