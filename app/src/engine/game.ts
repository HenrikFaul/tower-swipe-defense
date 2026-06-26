import type { EnemyType, UpgradeId } from '../data/types'
import { ENEMIES, enemyTypesForWave } from '../data/enemies'
import { UPGRADE_IDS, UPGRADES } from '../data/upgrades'
import {
  bossHp,
  isBossWave,
  isDragonWave,
  waveCoinDrop,
  waveEnemyCount,
  waveEnemyHp,
  waveSpawnRate,
} from '../lib/balance'
import { playSfx } from '../lib/audio'
import { haptics } from '../lib/haptics'
import { mulberry32 } from '../lib/rng'
import { clamp, dist, norm, type Vec } from './vec'
import { deriveStats, type DerivedStats, type RunConfig, type UpgradeLevels } from './stats'

export type Phase = 'idle' | 'bossintro' | 'playing' | 'shop' | 'gameover' | 'paused'

interface Enemy {
  id: number
  type: EnemyType
  x: number
  y: number
  hp: number
  maxHp: number
  speed: number
  radius: number
  color: number
  reward: number
  score: number
  armor: number
  healPerSec: number
  rangedDmg: number
  shield: number // mage: strength of the shield aura it projects to allies
  boss: boolean
  frozen: number // seconds remaining stopped
  slowT: number // seconds remaining slowed
  burnDps: number
  burnT: number
  rangeCd: number
  hitFlash: number
  shieldAura: number // transient: best shield % from nearby mages this frame
}

interface Projectile {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  dmg: number
  crit: boolean
  burn: number
  freeze: number
  chainsLeft: number
  slow: number
  hitIds: Set<number>
  color: number
  active: boolean
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
  kind: 'spark' | 'coin' | 'ring' | 'text'
  text?: string
}

export interface Hud {
  phase: Phase
  wave: number
  coins: number
  score: number
  hp: number
  maxHp: number
  combo: number
  comboMul: number
  enemiesAlive: number
  shopChoices: UpgradeId[]
  upgradeLevels: UpgradeLevels
  bossLabel: string | null
  bossHpFrac: number
  reviveUsed: boolean
  result: { wave: number; score: number; coins: number; durationMs: number } | null
  fps: number
}

export interface GameOptions {
  width: number
  height: number
  seed: number
  mode: 'normal' | 'daily'
  config: RunConfig
  maxHp: number
  startCoins: number
  autoFire: boolean
  reducedMotion: boolean
  reviveHealPct: number
  onChange: () => void
}

let enemyIdSeq = 1

export class Game {
  phase: Phase = 'idle'
  w: number
  h: number
  origin: Vec
  towerRadius = 42

  private opts: GameOptions
  private rng: () => number
  private stats: DerivedStats
  private levels: UpgradeLevels = {}

  enemies: Enemy[] = []
  projectiles: Projectile[] = []
  particles: Particle[] = []

  wave = 0
  coins: number
  score = 0
  hp: number
  maxHp: number
  combo = 0
  reviveUsed = false

  // wave control
  private spawnTarget = 0
  private spawnedCount = 0
  private spawnAcc = 0
  private spawnInterval = 1
  private waveActive = false
  shopChoices: UpgradeId[] = []
  bossLabel: string | null = null
  private bossRef: Enemy | null = null

  // aim
  private pointerDown = false
  aimStart: Vec | null = null
  aimCurrent: Vec | null = null
  private autoFireCd = 0
  private maxDrag: number

  // misc
  private startTime = 0
  private elapsedMs = 0
  private shake = 0
  flash = 0
  private fpsAcc = 0
  private fpsFrames = 0
  fps = 60

  constructor(opts: GameOptions) {
    this.opts = opts
    this.w = opts.width
    this.h = opts.height
    this.origin = { x: opts.width / 2, y: opts.height / 2 }
    this.rng = mulberry32(opts.seed)
    this.stats = deriveStats(this.levels, opts.config)
    this.coins = opts.startCoins
    this.maxHp = opts.maxHp
    this.hp = opts.maxHp
    this.maxDrag = this.towerRadius * 3
  }

  resize(w: number, h: number) {
    this.w = w
    this.h = h
    this.origin = { x: w / 2, y: h / 2 }
  }

  start() {
    this.startTime = performance.now()
    this.beginWaveTransition(1)
  }

  getHud(): Hud {
    return {
      phase: this.phase,
      wave: this.wave,
      coins: Math.floor(this.coins),
      score: Math.floor(this.score),
      hp: Math.max(0, Math.ceil(this.hp)),
      maxHp: this.maxHp,
      combo: this.combo,
      comboMul: this.comboMul(),
      enemiesAlive: this.enemies.length,
      shopChoices: this.shopChoices,
      upgradeLevels: { ...this.levels },
      bossLabel: this.bossLabel,
      bossHpFrac: this.bossRef ? clamp(this.bossRef.hp / this.bossRef.maxHp, 0, 1) : 0,
      reviveUsed: this.reviveUsed,
      result:
        this.phase === 'gameover'
          ? {
              wave: this.wave,
              score: Math.floor(this.score),
              coins: Math.floor(this.coins),
              durationMs: Math.floor(this.elapsedMs),
            }
          : null,
      fps: Math.round(this.fps),
    }
  }

  private comboMul(): number {
    return Math.min(3, Math.pow(1.05, this.combo))
  }

  private recompute() {
    this.stats = deriveStats(this.levels, this.opts.config)
  }

  // ---- wave lifecycle ---------------------------------------------------
  private beginWaveTransition(wave: number) {
    this.wave = wave
    if (isBossWave(wave)) {
      this.bossLabel = isDragonWave(wave) ? ENEMIES.dragon.label : ENEMIES.boss.label
      this.phase = 'bossintro'
      playSfx('boss_intro')
      haptics.heavy()
      this.opts.onChange()
    } else {
      this.bossLabel = null
      this.startWave(wave)
    }
  }

  /** Called by UI after the boss intro modal is dismissed. */
  beginBossWave() {
    if (this.phase !== 'bossintro') return
    this.startWave(this.wave)
  }

  private startWave(wave: number) {
    this.phase = 'playing'
    this.waveActive = true
    this.spawnedCount = 0
    this.spawnAcc = 0
    if (isBossWave(wave)) {
      this.spawnTarget = 1
      this.spawnInterval = 0.1
    } else {
      this.spawnTarget = waveEnemyCount(wave)
      this.spawnInterval = 1 / waveSpawnRate(wave)
    }
    this.opts.onChange()
  }

  private spawnEnemy() {
    const angle = this.rng() * Math.PI * 2
    const d = Math.max(this.w, this.h) * 0.62
    const x = this.origin.x + Math.cos(angle) * d
    const y = this.origin.y + Math.sin(angle) * d

    let type: EnemyType
    if (isBossWave(this.wave)) {
      type = isDragonWave(this.wave) ? 'dragon' : 'boss'
    } else {
      const pool = enemyTypesForWave(this.wave)
      type = pool[Math.floor(this.rng() * pool.length)]
    }
    const def = ENEMIES[type]
    const baseHp = def.boss ? bossHp(this.wave) * (type === 'dragon' ? 3.2 : 1) : waveEnemyHp(this.wave) * def.hpMul
    const hp = baseHp * this.opts.config.ddaEnemyHpMul
    const baseSpeed = 26 // px/sec baseline for grunt
    const e: Enemy = {
      id: enemyIdSeq++,
      type,
      x,
      y,
      hp,
      maxHp: hp,
      speed: baseSpeed * def.speedMul,
      radius: def.radius,
      color: def.color,
      reward: waveCoinDrop(this.wave) * def.rewardMul * this.stats.coinMul,
      score: def.score,
      armor: def.armor ?? 0,
      healPerSec: def.healPerSec ?? 0,
      rangedDmg: def.rangedDmg ?? 0,
      shield: def.shield ?? 0,
      boss: !!def.boss,
      frozen: 0,
      slowT: 0,
      burnDps: 0,
      burnT: 0,
      rangeCd: 1.5,
      hitFlash: 0,
      shieldAura: 0,
    }
    this.enemies.push(e)
    if (e.boss) this.bossRef = e
  }

  // ---- input ------------------------------------------------------------
  pointerDownAt(p: Vec) {
    if (this.phase !== 'playing') return
    this.pointerDown = true
    this.aimStart = { ...this.origin }
    this.aimCurrent = p
  }

  pointerMoveAt(p: Vec) {
    if (!this.pointerDown) return
    this.aimCurrent = p
  }

  pointerUp() {
    if (!this.pointerDown) {
      return
    }
    this.pointerDown = false
    if (this.phase === 'playing' && this.aimCurrent && !this.opts.autoFire) {
      this.fireToward(this.aimCurrent, true)
    }
    this.aimStart = null
    this.aimCurrent = null
  }

  private fireToward(target: Vec, scaleByDrag: boolean) {
    const dir = norm({ x: target.x - this.origin.x, y: target.y - this.origin.y })
    if (!isFinite(dir.x)) return
    const dragLen = scaleByDrag ? Math.hypot(target.x - this.origin.x, target.y - this.origin.y) : this.maxDrag
    const power = clamp(dragLen / this.maxDrag, 0.45, 1)
    const speed = this.stats.projectileSpeed * power
    const n = this.stats.projectiles
    const spread = 0.16
    for (let i = 0; i < n; i++) {
      const off = n === 1 ? 0 : (i - (n - 1) / 2) * spread
      const a = Math.atan2(dir.y, dir.x) + off
      const isCrit = this.rng() < this.stats.critChance
      const dmg = this.stats.baseDamage * (isCrit ? this.stats.critMul : 1)
      this.projectiles.push({
        x: this.origin.x,
        y: this.origin.y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        life: this.stats.projectileLife,
        dmg,
        crit: isCrit,
        burn: this.stats.burn + this.stats.applyBurnFromSkin,
        freeze: this.stats.freezeChance,
        chainsLeft: this.stats.chain,
        slow: this.stats.applySlowFromSkin,
        hitIds: new Set<number>(),
        color: this.stats.projectileColor,
        active: true,
      })
    }
    playSfx('shoot')
    haptics.light()
  }

  // ---- shop -------------------------------------------------------------
  private openShop() {
    this.phase = 'shop'
    this.shopChoices = this.rollShop()
    playSfx('wave_clear')
    haptics.success()
    this.opts.onChange()
  }

  private rollShop(): UpgradeId[] {
    const available = UPGRADE_IDS.filter((id) => (this.levels[id] ?? 0) < UPGRADES[id].maxLevel)
    const pool = available.length >= 3 ? available : UPGRADE_IDS.slice()
    const picks: UpgradeId[] = []
    const work = pool.slice()
    while (picks.length < 3 && work.length > 0) {
      const i = Math.floor(this.rng() * work.length)
      picks.push(work.splice(i, 1)[0])
    }
    return picks
  }

  /** UI calls this for the rewarded "reroll" placement. */
  reroll() {
    if (this.phase !== 'shop') return
    this.shopChoices = this.rollShop()
    playSfx('ui_tap')
    this.opts.onChange()
  }

  pickUpgrade(id: UpgradeId) {
    if (this.phase !== 'shop') return
    this.levels[id] = Math.min(UPGRADES[id].maxLevel, (this.levels[id] ?? 0) + 1)
    this.recompute()
    this.shopChoices = []
    this.beginWaveTransition(this.wave + 1)
  }

  skipShop() {
    if (this.phase !== 'shop') return
    this.shopChoices = []
    this.beginWaveTransition(this.wave + 1)
  }

  // ---- game over / revive ----------------------------------------------
  private gameOver() {
    this.phase = 'gameover'
    this.waveActive = false
    playSfx('lose')
    haptics.heavy()
    this.opts.onChange()
  }

  revive() {
    if (this.phase !== 'gameover' || this.reviveUsed) return
    this.reviveUsed = true
    this.hp = this.maxHp * this.opts.reviveHealPct
    this.enemies = []
    this.projectiles = []
    this.bossRef = null
    // Re-run the current wave from a clean slate. Without resetting the spawn
    // counters the wave would instantly satisfy the clear condition on the next
    // tick — skipping a boss fight and granting an unearned boss bonus.
    this.startWave(this.wave)
  }

  pause() {
    if (this.phase === 'playing') this.phase = 'paused'
    this.opts.onChange()
  }

  resume() {
    if (this.phase === 'paused') this.phase = 'playing'
    this.opts.onChange()
  }

  // ---- simulation -------------------------------------------------------
  update(dtMs: number) {
    const dt = Math.min(0.05, dtMs / 1000)
    this.fpsAcc += dtMs
    this.fpsFrames++
    if (this.fpsAcc >= 500) {
      this.fps = (this.fpsFrames * 1000) / this.fpsAcc
      this.fpsAcc = 0
      this.fpsFrames = 0
    }
    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt * 4)
    if (this.flash > 0) this.flash = Math.max(0, this.flash - dt * 2)
    this.updateParticles(dt)

    if (this.phase !== 'playing') return
    this.elapsedMs = performance.now() - this.startTime

    // spawning
    if (this.waveActive && this.spawnedCount < this.spawnTarget) {
      this.spawnAcc += dt
      while (this.spawnAcc >= this.spawnInterval && this.spawnedCount < this.spawnTarget) {
        this.spawnAcc -= this.spawnInterval
        this.spawnEnemy()
        this.spawnedCount++
      }
    }

    // auto-fire
    if (this.opts.autoFire && this.pointerDown && this.aimCurrent) {
      this.autoFireCd -= dt
      if (this.autoFireCd <= 0) {
        this.fireToward(this.aimCurrent, false)
        this.autoFireCd = 1 / this.stats.fireRate
      }
    }

    this.updateEnemies(dt)
    this.updateProjectiles(dt)

    // wave clear?
    if (this.waveActive && this.spawnedCount >= this.spawnTarget && this.enemies.length === 0) {
      this.waveActive = false
      this.bossRef = null
      // boss bonus
      if (isBossWave(this.wave)) {
        this.score += this.wave * this.wave * 10
      }
      this.openShop()
    }
  }

  private updateEnemies(dt: number) {
    const waveBaseSpeedScale = 1

    // Mage shield aura — a mage grants a damage shield to the team nearby
    // (spec §2.3). Recomputed each frame so it lapses when the mage dies.
    for (const e of this.enemies) e.shieldAura = 0
    for (const m of this.enemies) {
      if (m.shield <= 0) continue
      for (const ally of this.enemies) {
        if (dist(m, ally) < 170) ally.shieldAura = Math.max(ally.shieldAura, m.shield)
      }
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i]
      if (e.hitFlash > 0) e.hitFlash = Math.max(0, e.hitFlash - dt * 6)

      // burn DoT
      if (e.burnT > 0) {
        e.burnT -= dt
        this.damageEnemy(e, e.burnDps * dt, false, false)
        if (e.hp <= 0) {
          this.killEnemy(e, i)
          continue
        }
      }

      // status timers
      if (e.frozen > 0) {
        e.frozen -= dt
      } else {
        if (e.slowT > 0) e.slowT -= dt
        // slow aura near tower
        const dTower = dist(e, this.origin)
        let speed = e.speed * waveBaseSpeedScale
        if (this.stats.slowAura > 0 && dTower < this.stats.slowAuraRange) {
          speed *= 1 - this.stats.slowAura
        }
        if (e.slowT > 0) speed *= 0.55

        const dir = norm({ x: this.origin.x - e.x, y: this.origin.y - e.y })
        e.x += dir.x * speed * dt
        e.y += dir.y * speed * dt
      }

      // healer aura — heal only the single nearest damaged ally (spec §2.3)
      if (e.healPerSec > 0) {
        let target: Enemy | null = null
        let bestD = 110
        for (const other of this.enemies) {
          if (other === e || other.hp >= other.maxHp) continue
          const d = dist(e, other)
          if (d < bestD) {
            bestD = d
            target = other
          }
        }
        if (target) {
          target.hp = Math.min(target.maxHp, target.hp + target.maxHp * e.healPerSec * dt)
        }
      }

      // ranged attack on tower (archer / dragon)
      if (e.rangedDmg > 0) {
        const dTower = dist(e, this.origin)
        if (dTower < 360) {
          e.rangeCd -= dt
          if (e.rangeCd <= 0) {
            e.rangeCd = e.boss ? 1.6 : 2.4
            this.damageTower(e.rangedDmg)
            this.spawnParticle(this.origin.x, this.origin.y, 0xff5a3c, 'ring')
          }
        }
      }

      // contact with tower
      const contact = dist(e, this.origin)
      if (contact <= this.towerRadius + e.radius - 6) {
        const dmg = e.boss ? 30 : 6 + e.maxHp * 0.04
        this.damageTower(dmg)
        this.spawnParticle(e.x, e.y, 0xff7b00, 'ring')
        this.enemies.splice(i, 1)
        if (e === this.bossRef) this.bossRef = null
        this.combo = 0
      }
    }
  }

  private updateProjectiles(dt: number) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i]
      if (!p.active) {
        this.projectiles.splice(i, 1)
        continue
      }
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.life -= dt
      if (
        p.life <= 0 ||
        p.x < -40 ||
        p.y < -40 ||
        p.x > this.w + 40 ||
        p.y > this.h + 40
      ) {
        // miss → combo break only if it never hit anything
        if (p.hitIds.size === 0) this.combo = 0
        this.projectiles.splice(i, 1)
        continue
      }
      // collision
      for (let j = 0; j < this.enemies.length; j++) {
        const e = this.enemies[j]
        if (p.hitIds.has(e.id)) continue
        if (dist(p, e) <= e.radius + 5) {
          this.onProjectileHit(p, e)
          break
        }
      }
    }
  }

  private onProjectileHit(p: Projectile, e: Enemy) {
    p.hitIds.add(e.id)
    this.damageEnemy(e, p.dmg, p.crit, true)
    e.hitFlash = 1
    if (p.burn > 0) {
      e.burnDps = p.burn
      e.burnT = 2.5
    }
    if (p.slow > 0) e.slowT = Math.max(e.slowT, 1.2)
    if (p.freeze > 0 && this.rng() < p.freeze) e.frozen = Math.max(e.frozen, 1)

    // vampiric heal
    if (this.stats.vampiric > 0 && this.hp < this.maxHp) {
      this.hp = Math.min(this.maxHp, this.hp + p.dmg * this.stats.vampiric)
    }

    this.spawnParticle(p.x, p.y, p.crit ? 0xffd27a : 0xffffff, 'spark')
    playSfx(p.crit ? 'crit' : 'hit')

    const dead = e.hp <= 0
    if (dead) {
      const idx = this.enemies.indexOf(e)
      if (idx >= 0) this.killEnemy(e, idx)
    }

    // chain lightning
    if (p.chainsLeft > 0) {
      const next = this.findChainTarget(e, p.hitIds)
      if (next) {
        p.chainsLeft--
        const d = norm({ x: next.x - p.x, y: next.y - p.y })
        const sp = Math.hypot(p.vx, p.vy)
        p.vx = d.x * sp
        p.vy = d.y * sp
        p.life = Math.max(p.life, 0.4)
        this.spawnParticle(p.x, p.y, 0x9ad0ff, 'spark')
        return
      }
    }
    p.active = false
  }

  private findChainTarget(from: Enemy, exclude: Set<number>): Enemy | null {
    let best: Enemy | null = null
    let bestD = this.stats.chainRange
    for (const e of this.enemies) {
      if (exclude.has(e.id)) continue
      const d = dist(from, e)
      if (d < bestD) {
        bestD = d
        best = e
      }
    }
    return best
  }

  private damageEnemy(e: Enemy, raw: number, _crit: boolean, fromShot: boolean) {
    let dmg = raw
    if (e.armor > 0) dmg *= 1 - e.armor
    if (e.shieldAura > 0) dmg *= 1 - e.shieldAura
    e.hp -= dmg
    if (fromShot) {
      this.combo++
    }
  }

  private killEnemy(e: Enemy, index: number) {
    this.enemies.splice(index, 1)
    if (e === this.bossRef) this.bossRef = null
    const gained = e.reward
    this.coins += gained
    this.score += e.score * this.comboMul()
    playSfx('enemy_dead')
    this.spawnParticle(e.x, e.y, e.color, 'spark')
    this.spawnParticle(e.x, e.y, 0xffd27a, 'coin')
    this.spawnText(e.x, e.y - 14, `+${Math.round(gained)}`)
    if (e.boss) {
      this.shake = 1
      haptics.heavy()
    }
  }

  private damageTower(dmg: number) {
    if (this.phase !== 'playing') return
    this.hp -= dmg
    this.flash = 1
    this.shake = Math.max(this.shake, 0.5)
    haptics.medium()
    if (this.hp <= 0) {
      this.hp = 0
      this.gameOver()
    }
  }

  // ---- particles --------------------------------------------------------
  private spawnParticle(x: number, y: number, color: number, kind: Particle['kind']) {
    if (this.opts.reducedMotion && kind === 'spark') {
      // fewer particles under reduced motion
      if (this.rng() < 0.5) return
    }
    const count = kind === 'spark' ? 6 : kind === 'coin' ? 1 : 1
    for (let i = 0; i < count; i++) {
      const a = this.rng() * Math.PI * 2
      const sp = kind === 'ring' ? 0 : 40 + this.rng() * 120
      this.particles.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - (kind === 'coin' ? 80 : 0),
        life: kind === 'ring' ? 0.4 : 0.5,
        maxLife: kind === 'ring' ? 0.4 : 0.5,
        size: kind === 'ring' ? 8 : 3 + this.rng() * 3,
        color,
        kind,
      })
    }
  }

  private spawnText(x: number, y: number, text: string) {
    if (this.opts.reducedMotion) return
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: -40,
      life: 0.8,
      maxLife: 0.8,
      size: 14,
      color: 0xffd27a,
      kind: 'text',
      text,
    })
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
      if (p.kind === 'spark') p.vy += 160 * dt
      if (p.kind === 'coin') {
        // drift toward tower (magnet)
        const d = norm({ x: this.origin.x - p.x, y: this.origin.y - p.y })
        p.vx += d.x * 600 * dt
        p.vy += d.y * 600 * dt
      }
    }
  }

  get shakeOffset(): Vec {
    if (this.shake <= 0) return { x: 0, y: 0 }
    const s = this.shake * 8
    return { x: (this.rng() - 0.5) * s, y: (this.rng() - 0.5) * s }
  }

  getElapsedMs() {
    return Math.floor(this.elapsedMs)
  }
}
