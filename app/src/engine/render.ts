import { ENEMIES } from '../data/enemies'
import { skinById } from '../data/upgrades'
import { hex, norm } from './vec'
import type { Game } from './game'

// Color-blind-safe-ish enemy glyphs (AI_PROMPT.md §3.7).
const GLYPH: Record<string, string> = {
  grunt: '',
  runner: '»',
  tank: '◆',
  healer: '+',
  archer: '↟',
  mage: '✦',
  boss: '☠',
  dragon: '🐉',
}

export function render(ctx: CanvasRenderingContext2D, game: Game, skinId: string, reducedMotion: boolean) {
  const { w, h, origin } = game
  ctx.save()

  // background — dark teal radial, matching cover art
  const bg = ctx.createRadialGradient(origin.x, origin.y, 60, origin.x, origin.y, Math.max(w, h) * 0.75)
  bg.addColorStop(0, '#143033')
  bg.addColorStop(0.55, '#0E2326')
  bg.addColorStop(1, '#081417')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  const shake = game.shakeOffset
  ctx.translate(shake.x, shake.y)

  drawGrid(ctx, game)

  // tower range / aura hint ring
  ctx.strokeStyle = 'rgba(255,123,0,0.10)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(origin.x, origin.y, 230, 0, Math.PI * 2)
  ctx.stroke()

  drawAim(ctx, game)
  drawParticles(ctx, game, reducedMotion)
  drawEnemies(ctx, game)
  drawProjectiles(ctx, game)
  drawTower(ctx, game, skinId)

  ctx.restore()

  // damage flash overlay
  if (game.flash > 0) {
    ctx.fillStyle = `rgba(220,40,30,${0.28 * game.flash})`
    ctx.fillRect(0, 0, w, h)
  }
  // low-hp red border pulse (< 20%)
  if (game.hp / game.maxHp < 0.2 && game.hp > 0) {
    const pulse = 0.35 + 0.25 * Math.sin(performance.now() / 160)
    ctx.strokeStyle = `rgba(220,40,30,${pulse})`
    ctx.lineWidth = 14
    ctx.strokeRect(7, 7, w - 14, h - 14)
  }
}

function drawGrid(ctx: CanvasRenderingContext2D, game: Game) {
  const { w, h, origin } = game
  ctx.strokeStyle = 'rgba(120,180,170,0.06)'
  ctx.lineWidth = 1
  const step = 56
  for (let x = origin.x % step; x < w; x += step) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, h)
    ctx.stroke()
  }
  for (let y = origin.y % step; y < h; y += step) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }
}

function drawTower(ctx: CanvasRenderingContext2D, game: Game, skinId: string) {
  const { origin, towerRadius } = game
  const skin = skinById(skinId)
  // glow
  const glow = ctx.createRadialGradient(origin.x, origin.y, 4, origin.x, origin.y, towerRadius * 2.2)
  glow.addColorStop(0, 'rgba(255,123,0,0.35)')
  glow.addColorStop(1, 'rgba(255,123,0,0)')
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(origin.x, origin.y, towerRadius * 2.2, 0, Math.PI * 2)
  ctx.fill()

  // base platform
  ctx.fillStyle = '#2a2420'
  ctx.beginPath()
  ctx.arc(origin.x, origin.y + 6, towerRadius + 8, 0, Math.PI * 2)
  ctx.fill()

  // tower body
  ctx.fillStyle = hex(skin.color)
  ctx.strokeStyle = '#0c0a08'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(origin.x, origin.y, towerRadius, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  // crenellations
  ctx.fillStyle = 'rgba(0,0,0,0.25)'
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    ctx.beginPath()
    ctx.arc(origin.x + Math.cos(a) * towerRadius, origin.y + Math.sin(a) * towerRadius, 5, 0, Math.PI * 2)
    ctx.fill()
  }
  // ember core
  const core = ctx.createRadialGradient(origin.x, origin.y, 2, origin.x, origin.y, 16)
  core.addColorStop(0, hex(skin.projectileColor))
  core.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = core
  ctx.beginPath()
  ctx.arc(origin.x, origin.y, 16, 0, Math.PI * 2)
  ctx.fill()
}

function drawAim(ctx: CanvasRenderingContext2D, game: Game) {
  if (!game.aimCurrent) return
  const o = game.origin
  const c = game.aimCurrent
  const dir = norm({ x: c.x - o.x, y: c.y - o.y })
  const len = Math.min(Math.hypot(c.x - o.x, c.y - o.y), game.towerRadius * 3)
  const power = Math.min(len / (game.towerRadius * 3), 1)

  // trajectory arc (dashed)
  ctx.save()
  ctx.setLineDash([10, 10])
  ctx.strokeStyle = `rgba(255,210,122,${0.45 + power * 0.4})`
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(o.x, o.y)
  const far = 260 * (0.5 + power)
  ctx.lineTo(o.x + dir.x * far, o.y + dir.y * far)
  ctx.stroke()
  ctx.restore()

  // power dot at tip
  ctx.fillStyle = '#ffb347'
  ctx.beginPath()
  ctx.arc(o.x + dir.x * far, o.y + dir.y * far, 5 + power * 4, 0, Math.PI * 2)
  ctx.fill()
}

function drawEnemies(ctx: CanvasRenderingContext2D, game: Game) {
  for (const e of game.enemies) {
    const def = ENEMIES[e.type]
    const tint = e.frozen > 0 ? '#9CD8FF' : e.slowT > 0 ? '#bcd9e6' : hex(e.color)
    ctx.fillStyle = tint
    ctx.strokeStyle = '#0c0a08'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    if (e.hitFlash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${e.hitFlash * 0.6})`
      ctx.beginPath()
      ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2)
      ctx.fill()
    }

    // glyph
    const g = GLYPH[e.type]
    if (g) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)'
      ctx.font = `${Math.round(e.radius)}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(g, e.x, e.y)
    }

    // hp bar
    if (e.hp < e.maxHp) {
      const bw = e.radius * 2
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.fillRect(e.x - bw / 2, e.y - e.radius - 9, bw, 4)
      ctx.fillStyle = def.boss ? '#ff5a3c' : '#7bd16a'
      ctx.fillRect(e.x - bw / 2, e.y - e.radius - 9, bw * Math.max(0, e.hp / e.maxHp), 4)
    }
  }
}

function drawProjectiles(ctx: CanvasRenderingContext2D, game: Game) {
  for (const p of game.projectiles) {
    ctx.fillStyle = hex(p.color)
    ctx.shadowColor = hex(p.color)
    ctx.shadowBlur = 12
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.crit ? 7 : 5, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.shadowBlur = 0
}

function drawParticles(ctx: CanvasRenderingContext2D, game: Game, _reducedMotion: boolean) {
  for (const p of game.particles) {
    const a = Math.max(0, p.life / p.maxLife)
    if (p.kind === 'text' && p.text) {
      ctx.fillStyle = `rgba(255,210,122,${a})`
      ctx.font = 'bold 15px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(p.text, p.x, p.y)
      continue
    }
    if (p.kind === 'ring') {
      ctx.strokeStyle = `rgba(255,123,0,${a})`
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(p.x, p.y, (1 - a) * 30 + 6, 0, Math.PI * 2)
      ctx.stroke()
      continue
    }
    ctx.fillStyle = hex(p.color)
    ctx.globalAlpha = a
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }
}
