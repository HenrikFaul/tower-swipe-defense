import { ENEMIES, enemyTypesForWave, type EnemyDef, type EnemyType } from '../data/enemies'
import { rollDamage, TOWERS, type TowerDef, type TowerId } from '../data/towers'
import { isBuildable, keepOf, pickMap, spawnOf, type GameMap } from '../data/maps'
import { POWERS, type PowerId } from '../data/powers'
import { waveCoinDrop, waveEnemyCount, waveEnemyHp } from '../lib/balance'
import { mulberry32 } from '../lib/rng'
import { playSfx } from '../lib/audio'
import { haptics } from '../lib/haptics'
import { gridToScreen, screenToGrid, type IsoView } from './iso'

export type Phase = 'build' | 'wave' | 'cleared' | 'gameover' | 'paused'
export type TargetMode = 'first' | 'last' | 'strong' | 'close'
export const TARGET_MODES: TargetMode[] = ['first', 'last', 'strong', 'close']
export const TARGET_LABEL: Record<TargetMode, string> = {
  first: 'First',
  last: 'Last',
  strong: 'Strong',
  close: 'Close',
}

export interface PlacedTower {
  id: number
  type: TowerId
  def: TowerDef
  c: number
  r: number
  tier: number
  metaBonus: number
  fireRateMul: number
  cd: number
  angle: number
  flash: number
  bob: number
  targetMode: TargetMode
  totalKills: number
}

export interface PathEnemy {
  id: number
  type: EnemyType
  def: EnemyDef
  hp: number
  maxHp: number
  prog: number
  c: number
  r: number
  baseSpeed: number
  slowT: number
  freezeT: number
  poisonDps: number
  poisonT: number
  burnDps: number
  burnT: number
  shieldAura: number
  reward: number
  hitFlash: number
  enraged: boolean
  wobble: number
  noSplit?: boolean
}

interface Proj {
  x: number
  y: number
  target: PathEnemy | null
  tc: number
  tr: number
  speed: number
  dmg: number
  crit: boolean
  magic: boolean
  kind: TowerDef['projectile']
  color: number
  splash?: number
  slow?: { amount: number; dur: number }
  poison?: { dps: number; dur: number }
  burn?: { dps: number; dur: number }
  pierceShield?: boolean
  life: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: number
  kind: 'spark' | 'ring' | 'text' | 'smoke' | 'crit'
  text?: string
}

export interface RunModifiers {
  dmgMul: number
  goldStart: number
  livesStart: number
  rangeMul: number
  goldMul: number
  fireRateMul: number
  interestBonus: number
  towerMetaLevels: Partial<Record<TowerId, number>>
}

export interface WavePreviewItem {
  type: EnemyType
  count: number
}

export interface Hud {
  phase: Phase
  mapName: string
  wave: number
  lives: number
  gold: number
  score: number
  coinsEarned: number
  speed: number
  selectedBuild: TowerId | null
  selectedTowerId: number | null
  selectedTowerInfo: {
    type: TowerId
    tier: number
    maxTier: boolean
    upgradeCost: number
    sellValue: number
    targetMode: TargetMode
  } | null
  buildCosts: Record<TowerId, number>
  enemiesLeft: number
  bossLabel: string | null
  bossHpFrac: number
  preview: WavePreviewItem[]
  powers: { id: PowerId; cd: number; ready: boolean; active: boolean }[]
  cleared: { wave: number; stars: number; coins: number; gems: number; interest: number } | null
  result: { wave: number; score: number; coins: number } | null
  fps: number
}

let enemySeq = 1
let towerSeq = 1

const METEOR_RADIUS = 1.7
const METEOR_DMG = 130

export class IsoGame {
  phase: Phase = 'build'
  map: GameMap
  view: IsoView = { ox: 0, oy: 0, scale: 1 }
  w = 0
  h = 0
  speed = 1

  towers: PlacedTower[] = []
  enemies: PathEnemy[] = []
  projectiles: Proj[] = []
  particles: Particle[] = []

  wave = 0
  lives: number
  gold: number
  score = 0
  coinsEarned = 0

  selectedBuild: TowerId | null = null
  selectedTowerId: number | null = null

  private spawnQueue: EnemyType[] = []
  private spawnTimer = 0
  private spawnInterval = 0.9

  // powers
  private meteorCd = 0
  private freezeCd = 0
  private goldRushCd = 0
  private goldRushT = 0
  aim: { x: number; y: number } | null = null
  private aimActive = false
  private downPt: { x: number; y: number } | null = null
  private downCell: { c: number; r: number } | null = null
  private dragMoved = false

  private mods: RunModifiers
  private rng: () => number
  private onChange: () => void
  private clearedWaveNo = 0
  private lastReward = { coins: 0, gems: 0, interest: 0 }
  private prevPhase: Phase = 'build'
  private fpsAcc = 0
  private fpsN = 0
  fps = 60
  shake = 0
  flash = 0
  time = 0

  constructor(opts: { seed: number; mods: RunModifiers; onChange: () => void }) {
    this.mods = opts.mods
    this.rng = mulberry32(opts.seed)
    this.onChange = opts.onChange
    this.lives = opts.mods.livesStart
    this.gold = opts.mods.goldStart
    this.map = pickMap(opts.seed)
  }

  resize(w: number, h: number) {
    this.w = w
    this.h = h
    const { cols, rows } = this.map
    const totalW = (cols + rows) * 32
    const scale = Math.min(1.15, (w * 0.96) / totalW)
    const gridH = (cols - 1 + rows - 1) * 16 * scale
    const cy = (118 + (h - 150)) / 2
    this.view = { ox: w / 2, oy: cy - gridH / 2, scale }
  }

  start() {
    this.beginBuild(1)
  }

  setSpeed(s: number) {
    this.speed = s
    this.onChange()
  }

  // ---- HUD ---------------------------------------------------------------
  getHud(): Hud {
    const costs = {} as Record<TowerId, number>
    for (const id of Object.keys(TOWERS) as TowerId[]) costs[id] = TOWERS[id].tiers[0].upgradeCost
    const sel = this.towers.find((t) => t.id === this.selectedTowerId) ?? null
    let selInfo: Hud['selectedTowerInfo'] = null
    if (sel) {
      const maxTier = sel.tier >= sel.def.tiers.length - 1
      selInfo = {
        type: sel.type,
        tier: sel.tier,
        maxTier,
        upgradeCost: maxTier ? 0 : sel.def.tiers[sel.tier + 1].upgradeCost,
        sellValue: this.sellValue(sel),
        targetMode: sel.targetMode,
      }
    }
    const boss = this.enemies.find((e) => e.def.boss)
    return {
      phase: this.phase,
      mapName: this.map.name,
      wave: this.wave,
      lives: Math.max(0, this.lives),
      gold: Math.floor(this.gold),
      score: Math.floor(this.score),
      coinsEarned: Math.floor(this.coinsEarned),
      speed: this.speed,
      selectedBuild: this.selectedBuild,
      selectedTowerId: this.selectedTowerId,
      selectedTowerInfo: selInfo,
      buildCosts: costs,
      enemiesLeft: this.enemies.length + this.spawnQueue.length,
      bossLabel: boss ? boss.def.name : null,
      bossHpFrac: boss ? Math.max(0, boss.hp / boss.maxHp) : 0,
      preview: this.phase === 'build' ? this.previewWave(this.wave) : [],
      powers: [
        { id: 'meteor', cd: Math.max(0, this.meteorCd), ready: this.meteorCd <= 0, active: false },
        { id: 'freeze', cd: Math.max(0, this.freezeCd), ready: this.freezeCd <= 0, active: false },
        { id: 'goldrush', cd: Math.max(0, this.goldRushCd), ready: this.goldRushCd <= 0, active: this.goldRushT > 0 },
      ],
      cleared:
        this.phase === 'cleared'
          ? { wave: this.clearedWaveNo, stars: this.starsFor(), coins: this.lastReward.coins, gems: this.lastReward.gems, interest: this.lastReward.interest }
          : null,
      result:
        this.phase === 'gameover'
          ? { wave: this.wave, score: Math.floor(this.score), coins: Math.floor(this.coinsEarned) }
          : null,
      fps: Math.round(this.fps),
    }
  }

  private starsFor(): number {
    const frac = this.lives / this.mods.livesStart
    if (frac >= 0.85) return 3
    if (frac >= 0.5) return 2
    return 1
  }

  previewWave(wave: number): WavePreviewItem[] {
    const counts = new Map<EnemyType, number>()
    const isBoss = wave % 10 === 0
    const n = waveEnemyCount(wave)
    const pool = enemyTypesForWave(wave)
    // deterministic-ish preview using a temp rng seeded by wave
    const r = mulberry32(wave * 2654435761)
    for (let i = 0; i < n; i++) {
      const t = pool[Math.floor(r() * pool.length)]
      counts.set(t, (counts.get(t) ?? 0) + 1)
    }
    if (isBoss) {
      const b: EnemyType = wave % 30 === 0 ? 'dragon' : 'ogre'
      counts.set(b, (counts.get(b) ?? 0) + 1)
    }
    return [...counts.entries()].map(([type, count]) => ({ type, count }))
  }

  // ---- wave lifecycle ----------------------------------------------------
  private beginBuild(wave: number) {
    this.wave = wave
    this.phase = 'build'
    this.onChange()
  }

  startWave() {
    if (this.phase !== 'build') return
    this.phase = 'wave'
    this.buildSpawnQueue(this.wave)
    this.spawnTimer = 0
    this.selectedBuild = null
    this.onChange()
  }

  private buildSpawnQueue(wave: number) {
    const isBoss = wave % 10 === 0
    const q: EnemyType[] = []
    const count = waveEnemyCount(wave)
    for (let i = 0; i < count; i++) q.push(this.pickType(wave))
    if (isBoss) q.push(wave % 30 === 0 ? 'dragon' : 'ogre')
    this.spawnInterval = isBoss ? 0.7 : Math.max(0.42, 0.95 - wave * 0.02)
    this.spawnQueue = q
  }

  private pickType(wave: number): EnemyType {
    const pool = enemyTypesForWave(wave)
    return pool[Math.floor(this.rng() * pool.length)]
  }

  private spawnEnemy(type: EnemyType, prog = 0, hpScale = 1, noSplit = false) {
    const def = ENEMIES[type]
    const baseHp = waveEnemyHp(this.wave) * def.hpMul * (def.boss ? 1.4 : 1) * hpScale
    const sp = spawnOf(this.map)
    const e: PathEnemy = {
      id: enemySeq++,
      type,
      def,
      hp: baseHp,
      maxHp: baseHp,
      prog,
      c: sp.c,
      r: sp.r,
      baseSpeed: def.speed,
      slowT: 0,
      freezeT: 0,
      poisonDps: 0,
      poisonT: 0,
      burnDps: 0,
      burnT: 0,
      shieldAura: 0,
      reward: waveCoinDrop(this.wave) * def.rewardMul * hpScale,
      hitFlash: 0,
      enraged: false,
      wobble: this.rng() * Math.PI * 2,
      noSplit,
    }
    this.enemies.push(e)
  }

  private clearWave() {
    this.phase = 'cleared'
    this.clearedWaveNo = this.wave
    const stars = this.starsFor()
    const interest = Math.min(150, Math.floor(this.gold * (0.1 + this.mods.interestBonus)))
    this.gold += interest
    const coins = 40 + this.wave * 12 + stars * 30
    const gems = this.wave % 10 === 0 ? 12 : stars >= 3 ? 2 : 0
    this.lastReward = { coins, gems, interest }
    this.coinsEarned += coins
    playSfx('win')
    haptics.success()
    this.onChange()
  }

  continueAfterClear() {
    if (this.phase !== 'cleared') return
    this.beginBuild(this.wave + 1)
  }

  // ---- input -------------------------------------------------------------
  setBuild(id: TowerId | null) {
    this.selectedBuild = id
    this.selectedTowerId = null
    playSfx('ui_tap')
    this.onChange()
  }

  pointerDown(x: number, y: number) {
    this.downPt = { x, y }
    this.dragMoved = false
    const g = screenToGrid(x, y, this.view)
    this.downCell = { c: Math.round(g.c), r: Math.round(g.r) }
    if (!this.selectedBuild && this.meteorCd <= 0) {
      this.aimActive = true
      this.aim = { x, y }
    }
  }

  pointerMove(x: number, y: number) {
    if (this.downPt && Math.hypot(x - this.downPt.x, y - this.downPt.y) > 10) this.dragMoved = true
    if (this.aimActive) this.aim = { x, y }
  }

  pointerUp(x: number, y: number) {
    const wasAiming = this.aimActive
    this.aimActive = false
    const cell = this.downCell
    this.downCell = null
    this.downPt = null
    if (wasAiming && this.dragMoved && this.meteorCd <= 0) {
      this.castMeteor(x, y)
      this.aim = null
      return
    }
    this.aim = null
    if (this.dragMoved || !cell) return
    const { c, r } = cell
    const existing = this.towers.find((t) => t.c === c && t.r === r)
    if (this.selectedBuild) {
      if (existing) this.selectTower(existing)
      else if (isBuildable(this.map, c, r)) this.placeTower(c, r, this.selectedBuild)
      return
    }
    if (existing) this.selectTower(existing)
    else {
      this.selectedTowerId = null
      this.onChange()
    }
  }

  private selectTower(t: PlacedTower) {
    this.selectedTowerId = t.id
    this.selectedBuild = null
    playSfx('ui_tap')
    this.onChange()
  }

  private placeTower(c: number, r: number, type: TowerId) {
    const def = TOWERS[type]
    const cost = def.tiers[0].upgradeCost
    if (this.gold < cost) {
      haptics.heavy()
      return
    }
    this.gold -= cost
    const metaLevel = this.mods.towerMetaLevels[type] ?? 0
    this.towers.push({
      id: towerSeq++,
      type,
      def,
      c,
      r,
      tier: 0,
      metaBonus: metaLevel * 0.08 + this.mods.dmgMul,
      fireRateMul: this.mods.fireRateMul,
      cd: 0,
      angle: 0,
      flash: 0,
      bob: this.rng() * Math.PI * 2,
      targetMode: 'first',
      totalKills: 0,
    })
    const s = this.towerScreen(c, r)
    this.spawnParticle(s.x, s.y - 10, def.accent, 'ring')
    playSfx('ui_tap')
    haptics.light()
    if (this.gold < cost) this.selectedBuild = null
    this.onChange()
  }

  upgradeSelected() {
    const t = this.towers.find((x) => x.id === this.selectedTowerId)
    if (!t || t.tier >= t.def.tiers.length - 1) return
    const cost = t.def.tiers[t.tier + 1].upgradeCost
    if (this.gold < cost) {
      haptics.heavy()
      return
    }
    this.gold -= cost
    t.tier++
    const s = this.towerScreen(t.c, t.r)
    this.spawnParticle(s.x, s.y - 16, t.def.accent, 'ring')
    playSfx('wave_clear')
    haptics.medium()
    this.onChange()
  }

  cycleTarget() {
    const t = this.towers.find((x) => x.id === this.selectedTowerId)
    if (!t) return
    const i = TARGET_MODES.indexOf(t.targetMode)
    t.targetMode = TARGET_MODES[(i + 1) % TARGET_MODES.length]
    playSfx('ui_tap')
    this.onChange()
  }

  private sellValue(t: PlacedTower): number {
    let spent = 0
    for (let i = 0; i <= t.tier; i++) spent += t.def.tiers[i].upgradeCost
    return Math.floor(spent * 0.6)
  }

  sellSelected() {
    const idx = this.towers.findIndex((x) => x.id === this.selectedTowerId)
    if (idx < 0) return
    this.gold += this.sellValue(this.towers[idx])
    this.towers.splice(idx, 1)
    this.selectedTowerId = null
    playSfx('enemy_dead')
    this.onChange()
  }

  // ---- powers ------------------------------------------------------------
  private castMeteor(x: number, y: number) {
    this.meteorCd = POWERS.meteor.cooldown
    const g = screenToGrid(x, y, this.view)
    let hits = 0
    for (const e of [...this.enemies]) {
      if (Math.hypot(e.c - g.c, e.r - g.r) <= METEOR_RADIUS) {
        this.damageEnemy(e, METEOR_DMG, true, true)
        if (e.hp <= 0) this.killEnemy(e, this.enemies.indexOf(e))
        hits++
      }
    }
    for (let i = 0; i < 22; i++) this.spawnParticle(x, y, 0xff8a3d, 'spark')
    this.spawnParticle(x, y, 0xffd27a, 'ring')
    this.spawnParticle(x, y, 0x000000, 'smoke')
    this.shake = 1
    playSfx('boss_intro')
    haptics.heavy()
    if (hits === 0) this.spawnText(x, y - 10, 'MISS')
    this.onChange()
  }

  castFreeze() {
    if (this.freezeCd > 0 || this.phase !== 'wave') return
    this.freezeCd = POWERS.freeze.cooldown
    for (const e of this.enemies) e.freezeT = Math.max(e.freezeT, 3)
    for (const e of this.enemies) {
      const s = this.enemyScreen(e)
      this.spawnParticle(s.x, s.y, 0xaee9ff, 'spark')
    }
    playSfx('crit')
    haptics.medium()
    this.onChange()
  }

  castGoldRush() {
    if (this.goldRushCd > 0) return
    this.goldRushCd = POWERS.goldrush.cooldown
    this.goldRushT = 7
    this.gold += 60
    playSfx('wave_clear')
    haptics.medium()
    this.onChange()
  }

  // ---- pause -------------------------------------------------------------
  pause() {
    if (this.phase === 'wave' || this.phase === 'build') {
      this.prevPhase = this.phase
      this.phase = 'paused'
      this.onChange()
    }
  }
  resume() {
    if (this.phase === 'paused') {
      this.phase = this.prevPhase
      this.onChange()
    }
  }

  // ---- helpers -----------------------------------------------------------
  towerScreen(c: number, r: number) {
    return gridToScreen(c, r, this.view)
  }
  private enemyScreen(e: PathEnemy) {
    return gridToScreen(e.c, e.r, this.view)
  }
  towerRange(t: PlacedTower): number {
    return t.def.tiers[t.tier].range * (1 + this.mods.rangeMul)
  }

  // ---- simulation --------------------------------------------------------
  update(dtMs: number) {
    const dt = Math.min(0.05, dtMs / 1000)
    this.fpsAcc += dtMs
    this.fpsN++
    if (this.fpsAcc >= 500) {
      this.fps = (this.fpsN * 1000) / this.fpsAcc
      this.fpsAcc = 0
      this.fpsN = 0
    }
    const steps = this.phase === 'wave' ? this.speed : 1
    for (let i = 0; i < steps; i++) this.step(dt)
  }

  private step(dt: number) {
    this.time += dt
    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt * 4)
    if (this.flash > 0) this.flash = Math.max(0, this.flash - dt * 2)
    if (this.meteorCd > 0) this.meteorCd = Math.max(0, this.meteorCd - dt)
    if (this.freezeCd > 0) this.freezeCd = Math.max(0, this.freezeCd - dt)
    if (this.goldRushCd > 0) this.goldRushCd = Math.max(0, this.goldRushCd - dt)
    if (this.goldRushT > 0) this.goldRushT = Math.max(0, this.goldRushT - dt)
    this.updateParticles(dt)
    for (const t of this.towers) t.bob += dt

    if (this.phase !== 'wave') return

    if (this.spawnQueue.length > 0) {
      this.spawnTimer -= dt
      if (this.spawnTimer <= 0) {
        this.spawnTimer = this.spawnInterval
        this.spawnEnemy(this.spawnQueue.shift()!)
      }
    }

    this.updateEnemies(dt)
    this.updateTowers(dt)
    this.updateProjectiles(dt)

    if (this.lives <= 0) {
      this.gameOver()
      return
    }
    if (this.spawnQueue.length === 0 && this.enemies.length === 0) this.clearWave()
  }

  private updateEnemies(dt: number) {
    // warlock shield auras
    for (const e of this.enemies) e.shieldAura = 0
    for (const m of this.enemies) {
      if (!m.def.shield) continue
      for (const ally of this.enemies) {
        if (Math.hypot(m.c - ally.c, m.r - ally.r) < 2.2) ally.shieldAura = Math.max(ally.shieldAura, m.def.shield)
      }
    }

    const path = this.map.path
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i]
      if (e.hitFlash > 0) e.hitFlash = Math.max(0, e.hitFlash - dt * 6)
      e.wobble += dt * 6

      // damage over time
      if (e.poisonT > 0) {
        e.poisonT -= dt
        this.damageEnemy(e, e.poisonDps * dt, false, false)
      }
      if (e.burnT > 0) {
        e.burnT -= dt
        this.damageEnemy(e, e.burnDps * dt, false, false)
      }
      if (e.hp <= 0) {
        this.killEnemy(e, i)
        continue
      }

      // enrage
      if (!e.enraged && e.def.enrageBelow && e.hp / e.maxHp < e.def.enrageBelow) {
        e.enraged = true
        const s = this.enemyScreen(e)
        this.spawnText(s.x, s.y - 16, 'ENRAGED!')
      }

      // healer
      if (e.def.healPerSec) {
        let tgt: PathEnemy | null = null
        let bd = 2.4
        for (const o of this.enemies) {
          if (o === e || o.hp >= o.maxHp) continue
          const d = Math.hypot(e.c - o.c, e.r - o.r)
          if (d < bd) {
            bd = d
            tgt = o
          }
        }
        if (tgt) tgt.hp = Math.min(tgt.maxHp, tgt.hp + tgt.maxHp * e.def.healPerSec * dt)
      }

      // movement
      if (e.freezeT > 0) {
        e.freezeT -= dt
      } else {
        let sp = e.baseSpeed
        if (e.enraged) sp *= 1.7
        if (e.slowT > 0) {
          e.slowT -= dt
          sp *= 0.5
        }
        e.prog += sp * dt
        if (e.prog >= path.length - 1) {
          this.lives -= e.def.leak
          this.flash = 1
          this.shake = Math.max(this.shake, 0.5)
          haptics.medium()
          const k = this.towerScreen(keepOf(this.map).c, keepOf(this.map).r)
          this.spawnParticle(k.x, k.y, 0xff5a3c, 'ring')
          this.enemies.splice(i, 1)
          continue
        }
        const seg = Math.floor(e.prog)
        const f = e.prog - seg
        const a = path[seg]
        const b = path[Math.min(path.length - 1, seg + 1)]
        e.c = a.c + (b.c - a.c) * f
        e.r = a.r + (b.r - a.r) * f
      }
    }
  }

  private updateTowers(dt: number) {
    for (const t of this.towers) {
      if (t.flash > 0) t.flash = Math.max(0, t.flash - dt * 6)
      t.cd -= dt
      const tier = t.def.tiers[t.tier]
      const range = this.towerRange(t)
      const best = this.pickTarget(t, range)
      if (best) {
        const bs = this.enemyScreen(best)
        const ts = this.towerScreen(t.c, t.r)
        t.angle = Math.atan2(bs.y - ts.y, bs.x - ts.x)
      }
      const cd = tier.cd / (1 + t.fireRateMul)
      if (t.cd <= 0 && best) {
        t.cd = cd
        t.flash = 1
        let dmg = rollDamage(tier, this.rng) * (1 + t.metaBonus)
        let crit = false
        if (t.def.crit && this.rng() < t.def.crit.chance) {
          crit = true
          dmg *= t.def.crit.mult
        }
        if (t.def.melee) {
          this.dealMelee(t, best, dmg, crit)
        } else {
          const ts = this.towerScreen(t.c, t.r)
          this.projectiles.push({
            x: ts.x,
            y: ts.y - 18,
            target: best,
            tc: best.c,
            tr: best.r,
            speed: t.def.projectile === 'cannon' ? 360 : 540,
            dmg,
            crit,
            magic: !!t.def.magic,
            kind: t.def.projectile,
            color: t.def.accent,
            splash: t.def.splash,
            slow: t.def.slow,
            poison: t.def.dot,
            burn: t.def.burn,
            pierceShield: t.def.pierceShield,
            life: 2,
          })
          playSfx('shoot')
        }
      }
    }
  }

  private pickTarget(t: PlacedTower, range: number): PathEnemy | null {
    let best: PathEnemy | null = null
    let score = -Infinity
    for (const e of this.enemies) {
      const d = Math.hypot(e.c - t.c, e.r - t.r)
      if (d > range) continue
      let s: number
      switch (t.targetMode) {
        case 'first': s = e.prog; break
        case 'last': s = -e.prog; break
        case 'strong': s = e.hp; break
        case 'close': s = -d; break
      }
      if (s > score) {
        score = s
        best = e
      }
    }
    return best
  }

  private dealMelee(t: PlacedTower, e: PathEnemy, dmg: number, crit: boolean) {
    this.damageEnemy(e, dmg, false, false)
    const s = this.enemyScreen(e)
    this.spawnParticle(s.x, s.y, t.def.accent, 'spark')
    if (crit) this.spawnText(s.x, s.y - 14, Math.round(dmg).toString(), true)
    if (e.hp <= 0) this.killEnemy(e, this.enemies.indexOf(e))
  }

  private updateProjectiles(dt: number) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i]
      p.life -= dt
      const targetAlive = p.target && this.enemies.includes(p.target)
      const es = targetAlive ? this.enemyScreen(p.target!) : gridToScreen(p.tc, p.tr, this.view)
      if (targetAlive) {
        p.tc = p.target!.c
        p.tr = p.target!.r
      }
      const dx = es.x - p.x
      const dy = es.y - p.y
      const d = Math.hypot(dx, dy)
      if (d < (targetAlive ? 10 : 12) || p.life <= 0) {
        this.projectileHit(p)
        this.projectiles.splice(i, 1)
        continue
      }
      p.x += (dx / d) * p.speed * dt
      p.y += (dy / d) * p.speed * dt
      if (p.kind === 'cannon' && this.rng() < 0.4) this.spawnParticle(p.x, p.y, 0x999999, 'smoke')
    }
  }

  private projectileHit(p: Proj) {
    this.spawnParticle(p.x, p.y, p.color, 'spark')
    const apply = (e: PathEnemy) => {
      this.damageEnemy(e, p.dmg, p.magic, !!p.pierceShield)
      if (p.slow) {
        // double-slow → brief freeze (synergy)
        if (e.slowT > 0) e.freezeT = Math.max(e.freezeT, 0.6)
        e.slowT = Math.max(e.slowT, p.slow.dur)
      }
      if (p.poison) {
        e.poisonDps = Math.max(e.poisonDps, p.poison.dps) + (e.poisonT > 0 ? p.poison.dps * 0.25 : 0)
        e.poisonT = Math.max(e.poisonT, p.poison.dur)
      }
      if (p.burn) {
        e.burnDps = Math.max(e.burnDps, p.burn.dps)
        e.burnT = Math.max(e.burnT, p.burn.dur)
      }
      e.hitFlash = 1
      if (p.crit) {
        const s = this.enemyScreen(e)
        this.spawnText(s.x, s.y - 16, Math.round(p.dmg).toString(), true)
      }
      if (e.hp <= 0) this.killEnemy(e, this.enemies.indexOf(e))
    }
    if (p.splash && (p.target || true)) {
      const cx = p.tc
      const cy = p.tr
      this.spawnParticle(p.x, p.y, 0xffb066, 'ring')
      this.spawnParticle(p.x, p.y, 0x777777, 'smoke')
      for (const e of [...this.enemies]) {
        if (Math.hypot(e.c - cx, e.r - cy) <= p.splash) apply(e)
      }
    } else if (p.target && this.enemies.includes(p.target)) {
      apply(p.target)
    }
  }

  private damageEnemy(e: PathEnemy, raw: number, magic: boolean, ignoreShield: boolean) {
    let dmg = raw
    if (magic) {
      if (e.def.magicResist) dmg *= 1 - e.def.magicResist
    } else if (e.def.armor) dmg *= 1 - e.def.armor
    if (!ignoreShield && e.shieldAura > 0) dmg *= 1 - e.shieldAura
    e.hp -= dmg
  }

  private killEnemy(e: PathEnemy, index: number) {
    if (index < 0) return
    this.enemies.splice(index, 1)
    const mult = (this.goldRushT > 0 ? 2 : 1) * (1 + this.mods.goldMul)
    const gold = e.reward * mult
    this.gold += gold
    this.score += Math.round(e.maxHp)
    const s = this.enemyScreen(e)
    for (let i = 0; i < 4; i++) this.spawnParticle(s.x, s.y, e.def.color, 'spark')
    this.spawnText(s.x, s.y - 12, `+${Math.round(gold)}`)
    playSfx('enemy_dead')
    // split mechanic
    if (e.def.splitInto && !e.noSplit) {
      for (let i = 0; i < e.def.splitInto.count; i++) {
        this.spawnEnemy(e.def.splitInto.type, Math.max(0, e.prog - 0.15 * i), 1, true)
      }
    }
    if (e.def.boss) {
      this.shake = 1
      haptics.heavy()
      for (let i = 0; i < 16; i++) this.spawnParticle(s.x, s.y, e.def.accent, 'spark')
    }
  }

  private gameOver() {
    this.phase = 'gameover'
    playSfx('lose')
    haptics.heavy()
    this.onChange()
  }

  // ---- particles ---------------------------------------------------------
  private spawnParticle(x: number, y: number, color: number, kind: Particle['kind']) {
    const a = this.rng() * Math.PI * 2
    const sp = kind === 'ring' ? 0 : kind === 'smoke' ? 14 + this.rng() * 20 : 30 + this.rng() * 110
    this.particles.push({
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - (kind === 'smoke' ? 30 : 0),
      life: kind === 'ring' ? 0.4 : kind === 'smoke' ? 0.7 : 0.5,
      maxLife: kind === 'ring' ? 0.4 : kind === 'smoke' ? 0.7 : 0.5,
      size: kind === 'ring' ? 10 : kind === 'smoke' ? 6 + this.rng() * 6 : 2 + this.rng() * 3,
      color,
      kind,
    })
  }

  private spawnText(x: number, y: number, text: string, crit = false) {
    this.particles.push({ x, y, vx: 0, vy: -36, life: crit ? 0.9 : 0.8, maxLife: crit ? 0.9 : 0.8, size: crit ? 18 : 13, color: crit ? 0xff7b3a : 0xffd27a, kind: crit ? 'crit' : 'text', text })
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.life -= dt
      if (p.life <= 0) {
        this.particles.splice(i, 1)
        continue
      }
      p.x += p.vx * dt
      p.y += p.vy * dt
      if (p.kind === 'spark') p.vy += 130 * dt
      if (p.kind === 'smoke') {
        p.vy -= 20 * dt
        p.size += 14 * dt
      }
    }
  }

  get shakeOffset() {
    if (this.shake <= 0) return { x: 0, y: 0 }
    const s = this.shake * 6
    return { x: (this.rng() - 0.5) * s, y: (this.rng() - 0.5) * s }
  }
}
