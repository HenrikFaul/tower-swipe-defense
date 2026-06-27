# Tower Swipe Defense — Production Asset Manifest

Ezek a fájlok a **referenciakép (10-paneles one-pager) alapján** elkészített, **közvetlenül APK-ba beépíthető** játékasszetek. Stílus: stylized 3D mobile game (Clash Royale / Random Dice / Rush Royale szerű), vibráló paletta, vastag sötétlila/fekete kontúr, glossy highlightok. A Capacitor-alapú APK `assets/public/assets/` mappájába (vagy a webview `public/assets/game/`) helyezhetők.

## Mappa-struktúra

```
assets/
├── backgrounds/   # Teljes-képernyő háttér JPG-k (1088×1920, 9:16)
├── towers/        # Torony sprite-ok (1024×1024, transzparens PNG)
├── enemies/       # Ellenfél + boss sprite-ok (1024×1024, transzparens PNG)
├── ui/            # HUD, gombok, ikonok, panelek, logó (transzparens PNG)
└── fx/            # Lövedékek és effekt-spritesheetek (transzparens PNG)
```

## Backgrounds (full-bleed, JPG, 1088×1920)

| Fájl | Használat a játékban | Referencia panel |
|------|---------------------|------------------|
| `backgrounds/splash_screen.jpg` | Indító splash + Hero (Play Store feature graphic alap) | #1 Hero Splash |
| `backgrounds/main_menu_bg.jpg` | Főmenü háttér; alsó harmad üres a CTA gomboknak | #2 Main Menu |
| `backgrounds/map_green_forest.jpg` | Chapter 1 gameplay térkép, kör tower-plot pontokkal | #3 + #9 (Green Forest) |
| `backgrounds/map_desert_ruins.jpg` | Chapter 2 gameplay térkép | #9 Desert Ruins |
| `backgrounds/map_frozen_peaks.jpg` | Chapter 3 gameplay térkép | #9 Frozen Peaks |
| `backgrounds/world_map.jpg` | World map / chapter-választó képernyő | #9 World Map |

## Towers (sprite, PNG-alpha, 1024×1024, 3/4 isometric)

| Fájl | In-game név | Alapköltség | Szerep |
|------|-------------|-------------|--------|
| `towers/tower_cannon.png` | Cannon | 100 | AoE splash |
| `towers/tower_ice.png` | Ice Tower | 120 | Slow / freeze |
| `towers/tower_laser.png` | Laser | 150 | Sustained DPS beam |
| `towers/tower_arrow.png` | Ballista | 100 | Pierce single-target |
| `towers/tower_magic.png` | Magic | 100 | Magic DMG, ignores armor |

Mindegyik sprite **upgrade-szintenként** újraszínezhető (tint) vagy 3 evolution variánsban exportálható ugyanezen mesh-szel.

## Enemies (sprite, PNG-alpha, 1024×1024)

| Fájl | Típus | HP/Speed profil |
|------|-------|-----------------|
| `enemies/enemy_grunt.png` | Grunt | low HP, közepes speed |
| `enemies/enemy_runner.png` | Runner | very low HP, high speed |
| `enemies/enemy_tank.png` | Tank | high HP, low speed, armor |
| `enemies/enemy_ranged.png` | Ranged Skeleton | lő a tornyokra |
| `enemies/enemy_healer.png` | Healer | gyógyítja a szomszédokat |
| `enemies/boss_inferno_dragon.png` | **Boss: Inferno Dragon** | wave 10/20/30/…; multi-phase (#6 Boss Fight) |

## UI (PNG-alpha)

| Fájl | Használat |
|------|-----------|
| `ui/logo.png` | TOWER SWIPE DEFENSE logó (splash, főmenü, store icon, ASO) |
| `ui/app_icon.png` | 1024×1024 mester app icon (iOS/Android adaptive icon forrás) |
| `ui/buttons_sheet.png` | 6 CTA gomb mintakészlet (START/ENDLESS/CO-OP/NEXT/RETRY/CLAIM) — 9-slice forrás |
| `ui/panels_sheet.png` | 4 dialog/HUD frame — 9-slice forrás modálokhoz |
| `ui/icons_currency.png` | Gem · Coin · Heart · Energy (HUD-ba szeletelve) |
| `ui/icon_chest.png` | Reward chest (Daily, Battle Pass, Victory) |
| `ui/icon_battlepass.png` | Battle Pass shield-emblem (#8) |
| `ui/skill_icons.png` | 9 skill node ikon (#5 Upgrade & Skill Tree) |
| `ui/banner_victory.png` | Victory + 3-star banner (#10 Victory screen) |
| `ui/daily_reward_panel.png` | Daily Rewards háttér (#7) — slotokba placeholder-ek |
| `ui/avatars.png` | Player avatar készlet (4 hős portré) |

## FX

| Fájl | Tartalom |
|------|----------|
| `fx/projectiles_and_effects.png` | Spritesheet: cannonball, arrow, laser, magic orb, ice shard, explosion, lightning, smoke puff, gold spark |

## Integrációs útmutató AI fejlesztőnek

**Capacitor + Pixi.js / Phaser javasolt pipeline:**

1. Másold a `src/games/tower-swipe-defense/assets/` mappát a webview `public/assets/game/` alá.
2. **Sheet-szeletelés**: `buttons_sheet.png`, `panels_sheet.png`, `icons_currency.png`, `skill_icons.png`, `avatars.png`, `fx/projectiles_and_effects.png`, `enemies` sheetek — `texturepacker` vagy kézi rács alapján bontsd egyedi frame-ekre, generálj `.atlas.json`-t.
3. **9-slice**: a `panels_sheet.png` és `buttons_sheet.png` egyes panelei `Pixi.NineSlicePlane` / CSS `border-image` kompatibilis méretarányúak.
4. **App icon**: az `ui/app_icon.png`-ből generálj iOS `AppIcon.appiconset` (20–1024px) és Android adaptive icon (`mipmap-*`, 108dp foreground) változatokat.
5. **Splash screen**: a `backgrounds/splash_screen.jpg` Capacitor `@capacitor/splash-screen` `splash.png` alapja (resize: 2732×2732 center-crop).
6. **Tower upgrade variants**: minden `tower_*.png` 3 szintű upgrade-hez tint-shaderrel színezhető (Lv1 base, Lv2 +20% brightness + gold trim overlay, Lv3 prismatic glow).
7. **Animációk**: a sprite-ok statikusak — az animációt **DragonBones / Spine bone-rigging** vagy Pixi `Container` skew/scale + particle FX adja (lövedék kibocsátás `fx/projectiles_and_effects.png`-ből).
8. **Lokalizáció**: a `banner_victory.png` és `daily_reward_panel.png` tartalmaz hardcoded angol szót — ha lokalizálni kell, a tipográfia újra-renderelhető az SDF font + alfa-mask alapján (vagy hagyd vizuális branding-elemnek).

## ASO / Store assets

- **Feature graphic (1024×500)**: `backgrounds/splash_screen.jpg` letterbox-crop.
- **App icon (512×512)**: `ui/app_icon.png` downscale.
- **Screenshot mock (1080×1920)**: a `backgrounds/main_menu_bg.jpg` + `ui/logo.png` + `ui/buttons_sheet.png` rétegelt kompozíció (a referenciakép 2-es paneljének rekonstrukciója).

## Forrás

Ezek az asszetek a feltöltött **10-paneles reference one-pager** (és a kísérő `tower-swipe-defense.apk` Capacitor webview tartalmának) alapján készültek, hogy a játékot fejlesztő AI ügynök **közvetlenül beépítheti** ezeket a végleges APK build pipeline-ba — nem mockup-ok, hanem termék-szintű végleges art assetek.