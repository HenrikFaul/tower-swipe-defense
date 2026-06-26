import { ENEMIES, enemyTypesForWave, type EnemyDef, type EnemyType } from '../data/enemies'
import { rollDamage, TOWERS, type TowerDef, type TowerId } from '../data/towers'
import { isBuildable, KEEP, MAP, type GameMap } from '../data/maps'
import { waveCoinDrop, waveEnemyCount, waveEnemyHp } from '../lib/balance'
import { mulberry32 } from '../lib/rng'
import { playSfx } from '../lib/audio'
import { haptics } from '../lib/haptics'
import { gridToScreen, screenToGrid, type IsoView } from './iso'

export type Phase = 'build' | 'wave' | 'cleared' | 'gameover' | 'paused'

export interface PlacedTower {
  id: number
  type: TowerId
  def: TowerDef
  c: number
  r: number
  tier: number // 0..2 in-run upgrade tier
  metaBonus: number // permanent damage multiplier bonus (e.g. 0.1)
  cd: number
  angle: number
  flash: number
}

export interface PathEnemy {
  id: number
  type: EnemyType
  def: EnemyDef
  hp: number
  maxHp: number
  prog: number // float index along path
  c: number
  r: number
  speed: number
  slowT: number
  dotDps: number
  dotT: number
  shieldAura: number
  reward: number
  hitFlash: number
}

interface Proj {
  x: number
  y: number
  target: PathEnemy | null
  tc: number
  tr: number
  speed: number
  dmg: number
  kind: TowerDef['projectile']
  color: number
  splash?: number
  slow?: { amount: number; dur: number }
  dot?: { dps: number; dur: number }
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
  kind: 'spark' | 'ring' | 'text' | 'smoke'
  text?: string
}

export interface RunModifiers {
  dmgMul: number
  goldStart: number
  livesStart: number
  rangeMul: number
  goldMul: number
  towerMetaLevels: Partial<Record<TowerId, number>>
}

export interface Hud {
  phase: Phase
  wave: number
  lives: number
  gold: number
  score: number
  coinsEarned: number
  selectedBuild: TowerId | null
  selectedTowerId: number | null
  selectedTowerInfo: {
    type: TowerId
    tier: number
    maxTier: boolean
    upgradeCost: number
    sellValue: number
  } | null
  buildCosts: Record<TowerId, number>
  enemiesLeft: number
  bossLabel: string | null
  bossHpFrac: number
  cleared: { wave: number; stars: number; coins: number; gems: number } | null
  result: { wave: number; score: number; coins: number } | null
  powerCd: number
  powerReady: boolean
  fps: number
}

let enemySeq = 1
let towerSeq = 1

const POWER_COOLDOWN = 14
const POWER_RADIUS = 1.6
const POWER_DMG = 120

export class IsoGame {
  phase: Phase = 'build'
  map: GameMap = MAP
  view: IsoView = { ox: 0, oy: 0, scale: 1 }
  w = 0
  h = 0

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

  // wave control
  private spawnQueue: EnemyType[] = []
  private spawnTimer = 0
  private spawnInterval = 0.9
  bossLabel: string | null = null

  // power (swipe-to-aim hero ability)
  powerCd = 0
  aim: { x: number; y: number } | null = null
  private aimActive = false
  private downPt: { x: number; y: number } | null = null
  private downCell: { c: number; r: number } | null = null
  private dragMoved = false

  private mods: RunModifiers
  private rng: () => number
  private onChange: () => void
  private startedClearedWave = 0
  private fpsAcc = 0
  private fpsN = 0
  fps = 60
  shake = 0
  flash = 0

  constructor(opts: { seed: number; mods: RunModifiers; onChange: () => void }) {
    this.mods = opts.mods
    this.rng = mulberry32(opts.seed)
    this.onChange = opts.onChange
    this.lives = opts.mods.livesStart
    this.gold = opts.mods.goldStart
  }

  resize(w: number, h: number) {
    this.w = w
    this.h = h
    const { cols, rows } = this.map
    const totalW = (cols + rows) * 32 // TILE_W/2 = 32
    const scale = Math.min(1.15, (w * 0.96) / totalW)
    const gridH = (cols - 1 + rows - 1) * 16 * scale // TILE_H/2 = 16
    const availTop = 118
    const availBottom = h - 132
    const cy = (availTop + availBottom) / 2
    this.view = {
      ox: w / 2,
      oy: cy - gridH / 2,
      scale,
    }
  }

  start() {
    this.beginBuild(1)
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
      }
    }
    const boss = this.enemies.find((e) => e.def.boss)
    return {
      phase: this.phase,
      wave: this.wave,
      lives: Math.max(0, this.lives),
      gold: Math.floor(this.gold),
      score: Math.floor(this.score),
      coinsEarned: Math.floor(this.coinsEarned),
      selectedBuild: this.selectedBuild,
      selectedTowerId: this.selectedTowerId,
      selectedTowerInfo: selInfo,
      buildCosts: costs,
      enemiesLeft: this.enemies.length + this.spawnQueue.length,
      bossLabel: boss ? boss.def.name : null,
      bossHpFrac: boss ? Math.max(0, boss.hp / boss.maxHp) : 0,
      cleared:
        this.phase === 'cleared'
          ? {
              wave: this.startedClearedWave,
              stars: this.starsFor(),
              coins: this.lastReward.coins,
              gems: this.lastReward.gems,
            }
          : null,
      result:
        this.phase === 'gameover'
          ? { wave: this.wave, score: Math.floor(this.score), coins: Math.floor(this.coinsEarned) }
          : null,
      powerCd: Math.max(0, this.powerCd),
      powerReady: this.powerCd <= 0,
      fps: Math.round(this.fps),
    }
  }

  private lastReward = { coins: 0, gems: 0 }

  private starsFor(): number {
    const frac = this.lives / this.mods.livesStart
    if (frac >= 0.85) return 3
    if (frac >= 0.5) return 2
    return 1
  }

  // ---- wave lifecycle ----------------------------------------------------
  private beginBuild(wave: number) {
    this.wave = wave
    this.phase = 'build'
    this.bossLabel = null
    this.onChange()
  }

  startWave() {
    if (this.phase !== 'build') return
    this.phase = 'wave'
    this.buildSpawnQueue(this.wave)
    this.spawnTimer = 0
    this.selectedBuild = null
    this.selectedTowerId = null
    this.onChange()
  }

  private buildSpawnQueue(wave: number) {
    const isBoss = wave % 10 === 0
    const q: EnemyType[] = []
    if (isBoss) {
      const count = waveEnemyCount(wave)
      for (let i = 0; i < count; i++) q.push(this.pickType(wave))
      q.push(wave % 30 === 0 ? 'dragon' : 'ogre')
      this.spawnInterval = 0.7
    } else {
      const count = waveEnemyCount(wave)
      for (let i = 0; i < count; i++) q.push(this.pickType(wave))
      this.spawnInterval = Math.max(0.45, 0.95 - wave * 0.02)
    }
    this.spawnQueue = q
  }

  private pickType(wave: number): EnemyType {
    const pool = enemyTypesForWave(wave)
    return pool[Math.floor(this.rng() * pool.length)]
  }

  private spawnEnemy(type: EnemyType) {
    const def = ENEMIES[type]
    const baseHp = waveEnemyHp(this.wave) * def.hpMul * (def.boss ? 1.4 : 1)
    const e: PathEnemy = {
      id: enemySeq++,
      type,
      def,
      hp: baseHp,
      maxHp: baseHp,
      prog: 0,
      c: this.map.path[0].c,
      r: this.map.path[0].r,
      speed: def.speed,
      slowT: 0,
      dotDps: 0,
      dotT: 0,
      shieldAura: 0,
      reward: waveCoinDrop(this.wave) * def.rewardMul,
      hitFlash: 0,
    }
    this.enemies.push(e)
  }

  private clearWave() {
    this.phase = 'cleared'
    this.startedClearedWave = this.wave
    const stars = this.starsFor()
    const coins = 40 + this.wave * 12 + stars * 30
    const gems = this.wave % 10 === 0 ? 12 : stars >= 3 ? 2 : 0
    this.lastReward = { coins, gems }
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
    if (!this.selectedBuild && this.powerCd <= 0) {
      // begin aiming the meteor power
      this.aimActive = true
      this.aim = { x, y }
    }
  }

  pointerMove(x: number, y: number) {
    if (this.downPt) {
      if (Math.hypot(x - this.downPt.x, y - this.downPt.y) > 10) this.dragMoved = true
    }
    if (this.aimActive) this.aim = { x, y }
  }

  pointerUp(x: number, y: number) {
    const wasAiming = this.aimActive
    this.aimActive = false
    const cell = this.downCell
    this.downCell = null
    this.downPt = null

    if (wasAiming && this.dragMoved && this.powerCd <= 0) {
      this.firePower(x, y)
      this.aim = null
      return
    }
    this.aim = null
    if (this.dragMoved || !cell) return

    // a tap
    const { c, r } = cell
    const existing = this.towers.find((t) => t.c === c && t.r === r)
    if (this.selectedBuild) {
      if (existing) {
        this.selectTower(existing)
      } else if (isBuildable(this.map, c, r)) {
        this.placeTower(c, r, this.selectedBuild)
      }
      return
    }
    if (existing) {
      this.selectTower(existing)
    } else {
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
      cd: 0,
      angle: 0,
      flash: 0,
    })
    this.spawnParticle(this.towerScreen(c, r).x, this.towerScreen(c, r).y - 10, def.accent, 'ring')
    playSfx('ui_tap')
    haptics.light()
    // Keep the build selection active so several towers can be placed quickly;
    // tap a placed tower to select & upgrade it.
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
    this.spawnParticle(this.towerScreen(t.c, t.r).x, this.towerScreen(t.c, t.r).y - 16, t.def.accent, 'ring')
    playSfx('wave_clear')
    haptics.medium()
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
    const t = this.towers[idx]
    this.gold += this.sellValue(t)
    this.towers.splice(idx, 1)
    this.selectedTowerId = null
    playSfx('enemy_dead')
    this.onChange()
  }

  private firePower(x: number, y: number) {
    this.powerCd = POWER_COOLDOWN
    const g = screenToGrid(x, y, this.view)
    let hits = 0
    for (const e of this.enemies) {
      if (Math.hypot(e.c - g.c, e.r - g.r) <= POWER_RADIUS) {
        this.damageEnemy(e, POWER_DMG, true)
        hits++
      }
    }
    for (let i = 0; i < 18; i++) this.spawnParticle(x, y, 0xff8a3d, 'spark')
    this.spawnParticle(x, y, 0xffd27a, 'ring')
    this.shake = 1
    playSfx('boss_intro')
    haptics.heavy()
    if (hits === 0) this.spawnText(x, y - 10, 'MISS')
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
  private prevPhase: Phase = 'build'
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

  towerRange(t: PlacedTower): number {
    return t.def.tiers[t.tier].range * (1 + this.mods.rangeMul)
  }

  private enemyScreen(e: PathEnemy) {
    return gridToScreen(e.c, e.r, this.view)
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
    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt * 4)
    if (this.flash > 0) this.flash = Math.max(0, this.flash - dt * 2)
    if (this.powerCd > 0) this.powerCd = Math.max(0, this.powerCd - dt)
    this.updateParticles(dt)

    if (this.phase !== 'wave') return

    // spawn
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
    if (this.spawnQueue.length === 0 && this.enemies.length === 0) {
      this.clearWave()
    }
  }

  private updateEnemies(dt: number) {
    // shield auras from warlocks
    for (const e of this.enemies) e.shieldAura = 0
    for (const m of this.enemies) {
      if (!m.def.shield) continue
      for (const ally of this.enemies) {
        if (Math.hypot(m.c - ally.c, m.r - ally.r) < 2.2) {
          ally.shieldAura = Math.max(ally.shieldAura, m.def.shield)
        }
      }
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i]
      if (e.hitFlash > 0) e.hitFlash = Math.max(0, e.hitFlash - dt * 6)

      if (e.dotT > 0) {
        e.dotT -= dt
        this.damageEnemy(e, e.dotDps * dt, false)
        if (e.hp <= 0) {
          this.killEnemy(e, i)
          continue
        }
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

      // move along path
      let sp = e.speed
      if (e.slowT > 0) {
        e.slowT -= dt
        sp *= 0.55
      }
      e.prog += sp * dt
      const path = this.map.path
      if (e.prog >= path.length - 1) {
        // reached keep
        this.lives -= e.def.leak
        this.flash = 1
        this.shake = Math.max(this.shake, 0.5)
        haptics.medium()
        this.spawnParticle(this.towerScreen(KEEP.c, KEEP.r).x, this.towerScreen(KEEP.c, KEEP.r).y, 0xff5a3c, 'ring')
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

  private updateTowers(dt: number) {
    for (const t of this.towers) {
      if (t.flash > 0) t.flash = Math.max(0, t.flash - dt * 6)
      t.cd -= dt
      const tier = t.def.tiers[t.tier]
      const range = this.towerRange(t)
      // target: enemy furthest along path within range
      let best: PathEnemy | null = null
      let bestProg = -1
      for (const e of this.enemies) {
        const d = Math.hypot(e.c - t.c, e.r - t.r)
        if (d <= range && e.prog > bestProg) {
          bestProg = e.prog
          best = e
        }
      }
      if (best) {
        const bs = this.enemyScreen(best)
        const ts = this.towerScreen(t.c, t.r)
        t.angle = Math.atan2(bs.y - ts.y, bs.x - ts.x)
      }
      if (t.cd <= 0 && best) {
        t.cd = tier.cd
        t.flash = 1
        const dmg = rollDamage(tier, this.rng) * (1 + t.metaBonus)
        if (t.def.melee) {
          this.damageEnemy(best, dmg, false)
          this.spawnParticle(this.enemyScreen(best).x, this.enemyScreen(best).y, t.def.accent, 'spark')
          if (best.hp <= 0) this.killEnemy(best, this.enemies.indexOf(best))
        } else {
          const ts = this.towerScreen(t.c, t.r)
          this.projectiles.push({
            x: ts.x,
            y: ts.y - 18,
            target: best,
            tc: best.c,
            tr: best.r,
            speed: t.def.projectile === 'cannon' ? 360 : 520,
            dmg,
            kind: t.def.projectile,
            color: t.def.accent,
            splash: t.def.splash,
            slow: t.def.slow,
            dot: t.def.dot,
            pierceShield: t.def.pierceShield,
            life: 2,
          })
          playSfx('shoot')
        }
      }
    }
  }

  private updateProjectiles(dt: number) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i]
      p.life -= dt
      if (p.target && this.enemies.includes(p.target)) {
        const es = this.enemyScreen(p.target)
        p.tc = p.target.c
        p.tr = p.target.r
        const dx = es.x - p.x
        const dy = es.y - p.y
        const d = Math.hypot(dx, dy)
        if (d < 10 || p.life <= 0) {
          this.projectileHit(p)
          this.projectiles.splice(i, 1)
          continue
        }
        p.x += (dx / d) * p.speed * dt
        p.y += (dy / d) * p.speed * dt
      } else {
        // target gone — fly to last known cell then expire
        const es = gridToScreen(p.tc, p.tr, this.view)
        const dx = es.x - p.x
        const dy = es.y - p.y
        const d = Math.hypot(dx, dy)
        if (d < 12 || p.life <= 0) {
          this.projectileHit(p)
          this.projectiles.splice(i, 1)
          continue
        }
        p.x += (dx / d) * p.speed * dt
        p.y += (dy / d) * p.speed * dt
      }
    }
  }

  private projectileHit(p: Proj) {
    this.spawnParticle(p.x, p.y, p.color, 'spark')
    if (p.kind === 'cannon') {
      this.spawnParticle(p.x, p.y, 0xffb066, 'ring')
      playSfx('hit')
    }
    const applyTo = (e: PathEnemy) => {
      this.damageEnemy(e, p.dmg, !!p.pierceShield)
      if (p.slow) e.slowT = Math.max(e.slowT, p.slow.dur)
      if (p.dot) {
        e.dotDps = Math.max(e.dotDps, p.dot.dps)
        e.dotT = Math.max(e.dotT, p.dot.dur)
      }
      e.hitFlash = 1
      if (e.hp <= 0) this.killEnemy(e, this.enemies.indexOf(e))
    }
    if (p.splash && p.target) {
      const cx = p.target.c
      const cy = p.target.r
      for (const e of [...this.enemies]) {
        if (Math.hypot(e.c - cx, e.r - cy) <= p.splash) applyTo(e)
      }
    } else if (p.target && this.enemies.includes(p.target)) {
      applyTo(p.target)
    }
  }

  private damageEnemy(e: PathEnemy, raw: number, ignoreShield: boolean) {
    let dmg = raw
    if (e.def.armor) dmg *= 1 - e.def.armor
    if (!ignoreShield && e.shieldAura > 0) dmg *= 1 - e.shieldAura
    e.hp -= dmg
  }

  private killEnemy(e: PathEnemy, index: number) {
    if (index < 0) return
    this.enemies.splice(index, 1)
    const gold = e.reward * (1 + this.mods.goldMul)
    this.gold += gold
    this.score += Math.round(e.maxHp)
    const s = this.enemyScreen(e)
    this.spawnParticle(s.x, s.y, e.def.color, 'spark')
    this.spawnText(s.x, s.y - 12, `+${Math.round(gold)}`)
    playSfx('enemy_dead')
    if (e.def.boss) {
      this.shake = 1
      haptics.heavy()
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
    const n = kind === 'spark' ? 5 : 1
    for (let i = 0; i < n; i++) {
      const a = this.rng() * Math.PI * 2
      const sp = kind === 'ring' ? 0 : 30 + this.rng() * 90
      this.particles.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: kind === 'ring' ? 0.4 : 0.5,
        maxLife: kind === 'ring' ? 0.4 : 0.5,
        size: kind === 'ring' ? 10 : 2 + this.rng() * 3,
        color,
        kind,
      })
    }
  }

  private spawnText(x: number, y: number, text: string) {
    this.particles.push({ x, y, vx: 0, vy: -36, life: 0.8, maxLife: 0.8, size: 13, color: 0xffd27a, kind: 'text', text })
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
      if (p.kind === 'spark') p.vy += 120 * dt
    }
  }

  get shakeOffset() {
    if (this.shake <= 0) return { x: 0, y: 0 }
    const s = this.shake * 6
    return { x: (this.rng() - 0.5) * s, y: (this.rng() - 0.5) * s }
  }
}
