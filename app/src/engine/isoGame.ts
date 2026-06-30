import { ENEMIES, enemyTypesForWave, type EnemyDef, type EnemyType } from '../data/enemies'
import { rollDamage, TOWERS, type TowerDef, type TowerId } from '../data/towers'
import { MAP_IMG_H, MAP_IMG_W, pickMap, type GameMap } from '../data/maps'
import { POWERS, type PowerId } from '../data/powers'
import { waveCoinDrop, waveEnemyCount, waveEnemyHp } from '../lib/balance'
import { mulberry32 } from '../lib/rng'
import { playSfx } from '../lib/audio'
import { haptics } from '../lib/haptics'

export type Phase = 'build' | 'wave' | 'cleared' | 'gameover' | 'paused'
export type TargetMode = 'first' | 'last' | 'strong' | 'close'
export const TARGET_MODES: TargetMode[] = ['first', 'last', 'strong', 'close']
export const TARGET_LABEL: Record<TargetMode, string> = { first: 'First', last: 'Last', strong: 'Strong', close: 'Close' }

interface Vec {
  x: number
  y: number
}

export interface PlacedTower {
  id: number
  type: TowerId
  def: TowerDef
  plot: number
  sx: number
  sy: number
  tier: number
  metaBonus: number
  fireRateMul: number
  cd: number
  angle: number
  flash: number
  bob: number
  targetMode: TargetMode
}

export interface PathEnemy {
  id: number
  type: EnemyType
  def: EnemyDef
  hp: number
  maxHp: number
  dist: number
  sx: number
  sy: number
  faceLeft: boolean
  speedPx: number
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
  px: number
  py: number
  target: PathEnemy | null
  tx: number
  ty: number
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

// pixel-space tuning (canvas units = CSS px)
const SPEED_PX = 46 // enemy px/sec per speed unit
const RANGE_PX = 44 // px per range "tile"
const AURA_PX = 95 // shield/heal aura radius
const METEOR_R = 92
const PLOT_TAP_R = 36
const METEOR_DMG_K = 2.6

export class IsoGame {
  phase: Phase = 'build'
  map: GameMap
  view = { ox: 0, oy: 0, scale: 1 }
  w = 0
  h = 0
  speed = 1

  towers: PlacedTower[] = []
  enemies: PathEnemy[] = []
  projectiles: Proj[] = []
  particles: Particle[] = []

  // geometry (screen px), recomputed on resize
  pathPx: Vec[] = []
  plotsPx: Vec[] = []
  private segLen: number[] = []
  private pathLen = 0
  private occupied = new Set<number>()

  wave = 0
  lives: number
  gold: number
  score = 0
  coinsEarned = 0
  gemsEarned = 0

  selectedBuild: TowerId | null = null
  selectedTowerId: number | null = null

  private spawnQueue: EnemyType[] = []
  private spawnTimer = 0
  private spawnInterval = 0.9

  private meteorCd = 0
  private freezeCd = 0
  private goldRushCd = 0
  private goldRushT = 0
  aim: Vec | null = null
  private aimActive = false
  private downPt: Vec | null = null
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
    const scale = Math.max(w / MAP_IMG_W, h / MAP_IMG_H)
    this.view = { ox: (w - MAP_IMG_W * scale) / 2, oy: (h - MAP_IMG_H * scale) / 2, scale }
    this.recomputeGeometry()
  }

  private norm(nx: number, ny: number): Vec {
    return { x: this.view.ox + nx * MAP_IMG_W * this.view.scale, y: this.view.oy + ny * MAP_IMG_H * this.view.scale }
  }

  private recomputeGeometry() {
    this.pathPx = this.map.path.map((p) => this.norm(p.x, p.y))
    this.plotsPx = this.map.plots.map((p) => this.norm(p.x, p.y))
    this.segLen = []
    this.pathLen = 0
    for (let i = 0; i < this.pathPx.length - 1; i++) {
      const a = this.pathPx[i]
      const b = this.pathPx[i + 1]
      const len = Math.hypot(b.x - a.x, b.y - a.y)
      this.segLen.push(len)
      this.pathLen += len
    }
    // reposition existing towers/enemies onto the new screen geometry
    for (const t of this.towers) {
      const p = this.plotsPx[t.plot]
      if (p) {
        t.sx = p.x
        t.sy = p.y
      }
    }
    for (const e of this.enemies) this.placeEnemy(e)
  }

  private posAtDist(d: number): { x: number; y: number; seg: number } {
    if (this.pathPx.length === 0) return { x: 0, y: 0, seg: 0 }
    if (d <= 0) return { x: this.pathPx[0].x, y: this.pathPx[0].y, seg: 0 }
    let acc = 0
    for (let i = 0; i < this.segLen.length; i++) {
      if (acc + this.segLen[i] >= d) {
        const f = this.segLen[i] > 0 ? (d - acc) / this.segLen[i] : 0
        const a = this.pathPx[i]
        const b = this.pathPx[i + 1]
        return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, seg: i }
      }
      acc += this.segLen[i]
    }
    const last = this.pathPx[this.pathPx.length - 1]
    return { x: last.x, y: last.y, seg: this.segLen.length - 1 }
  }

  private placeEnemy(e: PathEnemy) {
    const p = this.posAtDist(e.dist)
    e.sx = p.x
    e.sy = p.y
    const a = this.pathPx[p.seg]
    const b = this.pathPx[Math.min(this.pathPx.length - 1, p.seg + 1)]
    e.faceLeft = b.x - a.x < 0
  }

  start() {
    this.beginBuild(1)
  }

  setSpeed(s: number) {
    this.speed = s
    this.onChange()
  }

  keepPos(): Vec {
    return this.pathPx[this.pathPx.length - 1] ?? { x: this.w / 2, y: this.h / 2 }
  }
  spawnPos(): Vec {
    return this.pathPx[0] ?? { x: this.w / 2, y: 0 }
  }
  isPlotOccupied(i: number): boolean {
    return this.occupied.has(i)
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
      result: this.phase === 'gameover' ? { wave: this.wave, score: Math.floor(this.score), coins: Math.floor(this.coinsEarned) } : null,
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
    const count = isBoss ? Math.ceil(waveEnemyCount(wave) / 2) : waveEnemyCount(wave)
    for (let i = 0; i < count; i++) q.push(this.pickType(wave))
    if (isBoss) q.push(wave % 30 === 0 ? 'dragon' : 'ogre')
    this.spawnInterval = isBoss ? 0.7 : Math.max(0.42, 0.95 - wave * 0.02)
    this.spawnQueue = q
  }

  private pickType(wave: number): EnemyType {
    const pool = enemyTypesForWave(wave)
    return pool[Math.floor(this.rng() * pool.length)]
  }

  private spawnEnemy(type: EnemyType, dist = 0, hpScale = 1, noSplit = false) {
    const def = ENEMIES[type]
    const baseHp = waveEnemyHp(this.wave) * def.hpMul * (def.boss ? 1.4 : 1) * hpScale
    const e: PathEnemy = {
      id: enemySeq++,
      type,
      def,
      hp: baseHp,
      maxHp: baseHp,
      dist,
      sx: 0,
      sy: 0,
      faceLeft: false,
      speedPx: def.speed * SPEED_PX,
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
    this.placeEnemy(e)
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
    this.gemsEarned += gems
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
    if (!this.selectedBuild && this.meteorCd <= 0 && this.phase === 'wave') {
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
    this.downPt = null
    if (wasAiming && this.dragMoved && this.meteorCd <= 0) {
      this.castMeteor(x, y)
      this.aim = null
      return
    }
    this.aim = null
    if (this.dragMoved) return

    // tap → nearest plot
    let best = -1
    let bestD = PLOT_TAP_R
    for (let i = 0; i < this.plotsPx.length; i++) {
      const d = Math.hypot(this.plotsPx[i].x - x, this.plotsPx[i].y - y)
      if (d < bestD) {
        bestD = d
        best = i
      }
    }
    if (best < 0) {
      this.selectedTowerId = null
      this.onChange()
      return
    }
    const existing = this.towers.find((t) => t.plot === best)
    if (existing) {
      this.selectTower(existing)
    } else if (this.selectedBuild) {
      this.placeTower(best, this.selectedBuild)
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

  private placeTower(plot: number, type: TowerId) {
    const def = TOWERS[type]
    const cost = def.tiers[0].upgradeCost
    if (this.gold < cost) {
      haptics.heavy()
      return
    }
    this.gold -= cost
    this.occupied.add(plot)
    const metaLevel = this.mods.towerMetaLevels[type] ?? 0
    const p = this.plotsPx[plot]
    this.towers.push({
      id: towerSeq++,
      type,
      def,
      plot,
      sx: p.x,
      sy: p.y,
      tier: 0,
      metaBonus: metaLevel * 0.08 + this.mods.dmgMul,
      fireRateMul: this.mods.fireRateMul,
      cd: 0,
      angle: 0,
      flash: 0,
      bob: this.rng() * Math.PI * 2,
      targetMode: 'first',
    })
    this.spawnParticle(p.x, p.y - 10, def.accent, 'ring')
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
    this.spawnParticle(t.sx, t.sy - 16, t.def.accent, 'ring')
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
    const t = this.towers[idx]
    this.gold += this.sellValue(t)
    this.occupied.delete(t.plot)
    this.towers.splice(idx, 1)
    this.selectedTowerId = null
    playSfx('enemy_dead')
    this.onChange()
  }

  // ---- powers ------------------------------------------------------------
  private castMeteor(x: number, y: number) {
    if (this.phase !== 'wave') return
    this.meteorCd = POWERS.meteor.cooldown
    const dmg = waveEnemyHp(this.wave) * METEOR_DMG_K + 80
    let hits = 0
    for (const e of [...this.enemies]) {
      if (Math.hypot(e.sx - x, e.sy - y) <= METEOR_R) {
        this.damageEnemy(e, dmg, true, true)
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
    for (const e of this.enemies) {
      e.freezeT = Math.max(e.freezeT, 3)
      this.spawnParticle(e.sx, e.sy, 0xaee9ff, 'spark')
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

  towerRange(t: PlacedTower): number {
    return t.def.tiers[t.tier].range * RANGE_PX * (1 + this.mods.rangeMul)
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
    for (const e of this.enemies) e.shieldAura = 0
    for (const m of this.enemies) {
      if (!m.def.shield) continue
      for (const ally of this.enemies) {
        if (Math.hypot(m.sx - ally.sx, m.sy - ally.sy) < AURA_PX) ally.shieldAura = Math.max(ally.shieldAura, m.def.shield)
      }
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i]
      if (e.hitFlash > 0) e.hitFlash = Math.max(0, e.hitFlash - dt * 6)
      e.wobble += dt * 6

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

      if (!e.enraged && e.def.enrageBelow && e.hp / e.maxHp < e.def.enrageBelow) {
        e.enraged = true
        this.spawnText(e.sx, e.sy - 16, 'ENRAGED!')
      }

      if (e.def.healPerSec) {
        let tgt: PathEnemy | null = null
        let bd = AURA_PX
        for (const o of this.enemies) {
          if (o === e || o.hp >= o.maxHp) continue
          const d = Math.hypot(e.sx - o.sx, e.sy - o.sy)
          if (d < bd) {
            bd = d
            tgt = o
          }
        }
        if (tgt) tgt.hp = Math.min(tgt.maxHp, tgt.hp + tgt.maxHp * e.def.healPerSec * dt)
      }

      if (e.freezeT > 0) {
        e.freezeT -= dt
      } else {
        let sp = e.speedPx
        if (e.enraged) sp *= 1.7
        if (e.slowT > 0) {
          e.slowT -= dt
          sp *= 0.5
        }
        e.dist += sp * dt
        if (e.dist >= this.pathLen) {
          this.lives -= e.def.leak
          this.flash = 1
          this.shake = Math.max(this.shake, 0.5)
          haptics.medium()
          const k = this.keepPos()
          this.spawnParticle(k.x, k.y, 0xff5a3c, 'ring')
          this.enemies.splice(i, 1)
          continue
        }
        this.placeEnemy(e)
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
      if (best) t.angle = Math.atan2(best.sy - t.sy, best.sx - t.sx)
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
          this.projectiles.push({
            x: t.sx,
            y: t.sy - 22,
            px: t.sx,
            py: t.sy - 22,
            target: best,
            tx: best.sx,
            ty: best.sy,
            speed: t.def.projectile === 'cannon' ? 360 : 560,
            dmg,
            crit,
            magic: !!t.def.magic,
            kind: t.def.projectile,
            color: t.def.accent,
            splash: t.def.splash ? t.def.splash * RANGE_PX : undefined,
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
      const d = Math.hypot(e.sx - t.sx, e.sy - t.sy)
      if (d > range) continue
      let s: number
      switch (t.targetMode) {
        case 'first': s = e.dist; break
        case 'last': s = -e.dist; break
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
    this.spawnParticle(e.sx, e.sy, t.def.accent, 'spark')
    if (crit) this.spawnText(e.sx, e.sy - 14, Math.round(dmg).toString(), true)
    if (e.hp <= 0) this.killEnemy(e, this.enemies.indexOf(e))
  }

  private updateProjectiles(dt: number) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i]
      p.life -= dt
      const alive = p.target && this.enemies.includes(p.target)
      const ex = alive ? p.target!.sx : p.tx
      const ey = alive ? p.target!.sy : p.ty
      if (alive) {
        p.tx = p.target!.sx
        p.ty = p.target!.sy
      }
      const dx = ex - p.x
      const dy = ey - p.y
      const d = Math.hypot(dx, dy)
      if (d < (alive ? 12 : 14) || p.life <= 0) {
        this.projectileHit(p)
        this.projectiles.splice(i, 1)
        continue
      }
      p.px = p.x
      p.py = p.y
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
        if (e.slowT > 0) {
          e.freezeT = Math.max(e.freezeT, 0.6)
          e.slowT = 0
        } else {
          e.slowT = p.slow.dur
        }
      }
      if (p.poison) {
        e.poisonDps = p.poison.dps * (e.poisonT > 0 ? 1.25 : 1)
        e.poisonT = Math.max(e.poisonT, p.poison.dur)
      }
      if (p.burn) {
        e.burnDps = Math.max(e.burnDps, p.burn.dps)
        e.burnT = Math.max(e.burnT, p.burn.dur)
      }
      e.hitFlash = 1
      if (p.crit) this.spawnText(e.sx, e.sy - 16, Math.round(p.dmg).toString(), true)
      if (e.hp <= 0) this.killEnemy(e, this.enemies.indexOf(e))
    }
    if (p.splash) {
      this.spawnParticle(p.x, p.y, 0xffb066, 'ring')
      this.spawnParticle(p.x, p.y, 0x777777, 'smoke')
      for (const e of [...this.enemies]) {
        if (Math.hypot(e.sx - p.tx, e.sy - p.ty) <= p.splash) apply(e)
      }
    } else {
      let tgt = p.target && this.enemies.includes(p.target) ? p.target : null
      if (!tgt) {
        let bd = 28
        for (const e of this.enemies) {
          const d = Math.hypot(e.sx - p.tx, e.sy - p.ty)
          if (d < bd) {
            bd = d
            tgt = e
          }
        }
      }
      if (tgt) apply(tgt)
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
    for (let i = 0; i < 4; i++) this.spawnParticle(e.sx, e.sy, e.def.color, 'spark')
    this.spawnText(e.sx, e.sy - 12, `+${Math.round(gold)}`)
    playSfx('enemy_dead')
    if (e.def.splitInto && !e.noSplit && this.wave >= 3) {
      for (let i = 0; i < e.def.splitInto.count; i++) {
        this.spawnEnemy(e.def.splitInto.type, Math.max(0, e.dist - 8 * i), 0.6, true)
      }
    }
    if (e.def.boss) {
      this.shake = 1
      haptics.heavy()
      for (let i = 0; i < 16; i++) this.spawnParticle(e.sx, e.sy, e.def.accent, 'spark')
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

  get shakeOffset(): Vec {
    if (this.shake <= 0) return { x: 0, y: 0 }
    const s = this.shake * 6
    const t = this.time
    return { x: Math.sin(t * 91.7) * s, y: Math.cos(t * 73.3) * s }
  }
}
