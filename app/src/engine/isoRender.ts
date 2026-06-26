import { isBuildable, isPath, KEEP, SPAWN } from '../data/maps'
import { TILE_H, TILE_W, TILE_LIFT, gridToScreen } from './iso'
import { hex } from './vec'
import type { IsoGame, PathEnemy, PlacedTower } from './isoGame'

const TYPE_GLYPH: Record<string, string> = {
  archer: '🏹',
  cannon: '💣',
  mage: '🔮',
  ice: '❄️',
  poison: '🧪',
  barracks: '🛡️',
}

export function renderIso(ctx: CanvasRenderingContext2D, game: IsoGame) {
  const { w, h, view } = game
  ctx.clearRect(0, 0, w, h)

  // sky / ground vignette
  const bg = ctx.createRadialGradient(w / 2, h * 0.46, 60, w / 2, h * 0.46, Math.max(w, h) * 0.8)
  bg.addColorStop(0, '#163a3d')
  bg.addColorStop(0.6, '#0e2629')
  bg.addColorStop(1, '#071316')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  const shake = game.shakeOffset
  ctx.save()
  ctx.translate(shake.x, shake.y)

  const s = view.scale
  const halfW = (TILE_W / 2) * s
  const halfH = (TILE_H / 2) * s
  const lift = TILE_LIFT * s

  // ---- tiles (back to front) ----
  const buildMode = !!game.selectedBuild
  for (let r = 0; r < game.map.rows; r++) {
    for (let c = 0; c < game.map.cols; c++) {
      const p = gridToScreen(c, r, view)
      const path = isPath(c, r)
      const top = path ? '#c0a06a' : '#5d913f'
      const left = path ? '#8f7345' : '#3f6a28'
      const right = path ? '#a98c58' : '#4e7d33'
      drawTile(ctx, p.x, p.y, halfW, halfH, lift, top, left, right)
      if (buildMode && isBuildable(game.map, c, r) && !game.towers.some((t) => t.c === c && t.r === r)) {
        ctx.strokeStyle = 'rgba(255,180,80,0.55)'
        ctx.lineWidth = 2
        diamond(ctx, p.x, p.y, halfW - 2, halfH - 2)
        ctx.stroke()
      }
    }
  }

  // spawn portal + keep
  drawPortal(ctx, gridToScreen(SPAWN.c, SPAWN.r, view), s)
  drawKeep(ctx, gridToScreen(KEEP.c, KEEP.r, view), s, game.lives)

  // ---- entities sorted by depth ----
  type Drawable = { depth: number; fn: () => void }
  const items: Drawable[] = []
  for (const t of game.towers) {
    items.push({ depth: t.c + t.r, fn: () => drawTower(ctx, game, t, s, lift) })
  }
  for (const e of game.enemies) {
    items.push({ depth: e.c + e.r + 0.5, fn: () => drawEnemy(ctx, game, e, s) })
  }
  items.sort((a, b) => a.depth - b.depth)
  for (const it of items) it.fn()

  // selected tower range ring (drawn above tiles, below projectiles)
  const sel = game.towers.find((t) => t.id === game.selectedTowerId)
  if (sel) {
    const sp = gridToScreen(sel.c, sel.r, view)
    const range = game.towerRange(sel)
    ctx.strokeStyle = 'rgba(255,210,122,0.7)'
    ctx.fillStyle = 'rgba(255,210,122,0.08)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.ellipse(sp.x, sp.y, range * TILE_W * 0.5 * s, range * TILE_H * 0.5 * s, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }

  // projectiles
  for (const p of game.projectiles) {
    ctx.fillStyle = hex(p.color)
    ctx.shadowColor = hex(p.color)
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.kind === 'cannon' ? 6 : 4, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.shadowBlur = 0

  // particles
  for (const pt of game.particles) {
    const a = Math.max(0, pt.life / pt.maxLife)
    if (pt.kind === 'text' && pt.text) {
      ctx.fillStyle = `rgba(255,210,122,${a})`
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(pt.text, pt.x, pt.y)
      continue
    }
    if (pt.kind === 'ring') {
      ctx.strokeStyle = `rgba(255,150,70,${a})`
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, (1 - a) * 34 + 6, 0, Math.PI * 2)
      ctx.stroke()
      continue
    }
    ctx.globalAlpha = a
    ctx.fillStyle = hex(pt.color)
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }

  // aim arc for the meteor power
  if (game.aim) {
    const start = gridToScreen(KEEP.c, KEEP.r, view)
    ctx.setLineDash([8, 8])
    ctx.strokeStyle = 'rgba(255,140,60,0.9)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(start.x, start.y - 20)
    ctx.lineTo(game.aim.x, game.aim.y)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.strokeStyle = 'rgba(255,140,60,0.9)'
    ctx.beginPath()
    ctx.arc(game.aim.x, game.aim.y, 26, 0, Math.PI * 2)
    ctx.stroke()
  }

  ctx.restore()

  if (game.flash > 0) {
    ctx.fillStyle = `rgba(210,40,30,${0.25 * game.flash})`
    ctx.fillRect(0, 0, w, h)
  }
}

function diamond(ctx: CanvasRenderingContext2D, x: number, y: number, hw: number, hh: number) {
  ctx.beginPath()
  ctx.moveTo(x, y - hh)
  ctx.lineTo(x + hw, y)
  ctx.lineTo(x, y + hh)
  ctx.lineTo(x - hw, y)
  ctx.closePath()
}

function drawTile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hw: number,
  hh: number,
  lift: number,
  top: string,
  left: string,
  right: string,
) {
  // left side face
  ctx.fillStyle = left
  ctx.beginPath()
  ctx.moveTo(x - hw, y)
  ctx.lineTo(x, y + hh)
  ctx.lineTo(x, y + hh + lift)
  ctx.lineTo(x - hw, y + lift)
  ctx.closePath()
  ctx.fill()
  // right side face
  ctx.fillStyle = right
  ctx.beginPath()
  ctx.moveTo(x + hw, y)
  ctx.lineTo(x, y + hh)
  ctx.lineTo(x, y + hh + lift)
  ctx.lineTo(x + hw, y + lift)
  ctx.closePath()
  ctx.fill()
  // top face
  ctx.fillStyle = top
  diamond(ctx, x, y, hw, hh)
  ctx.fill()
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'
  ctx.lineWidth = 1
  ctx.stroke()
}

function drawPortal(ctx: CanvasRenderingContext2D, p: { x: number; y: number }, s: number) {
  ctx.save()
  ctx.translate(p.x, p.y - 6 * s)
  const g = ctx.createRadialGradient(0, 0, 2, 0, 0, 22 * s)
  g.addColorStop(0, 'rgba(123,97,255,0.9)')
  g.addColorStop(1, 'rgba(123,97,255,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.ellipse(0, 0, 20 * s, 12 * s, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawKeep(ctx: CanvasRenderingContext2D, p: { x: number; y: number }, s: number, lives: number) {
  ctx.save()
  ctx.translate(p.x, p.y)
  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)'
  ctx.beginPath()
  ctx.ellipse(0, 4 * s, 20 * s, 10 * s, 0, 0, Math.PI * 2)
  ctx.fill()
  // body
  ctx.fillStyle = '#8a8f99'
  ctx.fillRect(-16 * s, -34 * s, 32 * s, 36 * s)
  ctx.fillStyle = '#6a6f79'
  ctx.fillRect(-16 * s, -34 * s, 10 * s, 36 * s)
  // battlements
  ctx.fillStyle = '#9aa0a6'
  for (let i = 0; i < 4; i++) ctx.fillRect(-16 * s + i * 9 * s, -40 * s, 6 * s, 8 * s)
  // flag
  ctx.strokeStyle = '#caa15a'
  ctx.lineWidth = 2 * s
  ctx.beginPath()
  ctx.moveTo(0, -40 * s)
  ctx.lineTo(0, -54 * s)
  ctx.stroke()
  ctx.fillStyle = lives > 5 ? '#ff7b00' : '#e0452e'
  ctx.beginPath()
  ctx.moveTo(0, -54 * s)
  ctx.lineTo(12 * s, -50 * s)
  ctx.lineTo(0, -46 * s)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawTower(ctx: CanvasRenderingContext2D, game: IsoGame, t: PlacedTower, s: number, lift: number) {
  const p = gridToScreen(t.c, t.r, game.view)
  const selected = game.selectedTowerId === t.id
  ctx.save()
  ctx.translate(p.x, p.y)
  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.28)'
  ctx.beginPath()
  ctx.ellipse(0, 2 * s, 16 * s, 8 * s, 0, 0, Math.PI * 2)
  ctx.fill()
  // stone base
  ctx.fillStyle = '#6b675f'
  ctx.beginPath()
  ctx.moveTo(0, -6 * s + lift)
  ctx.lineTo(15 * s, 1 * s + lift)
  ctx.lineTo(0, 8 * s + lift)
  ctx.lineTo(-15 * s, 1 * s + lift)
  ctx.closePath()
  ctx.fill()
  // body
  const bodyH = (24 + t.tier * 6) * s
  const grad = ctx.createLinearGradient(0, -bodyH, 0, 0)
  grad.addColorStop(0, hex(lightenHex(t.def.color, 40)))
  grad.addColorStop(1, hex(t.def.color))
  ctx.fillStyle = grad
  roundRect(ctx, -11 * s, -bodyH, 22 * s, bodyH, 6 * s)
  ctx.fill()
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'
  ctx.lineWidth = 1.5
  ctx.stroke()
  // roof / orb
  ctx.fillStyle = hex(t.def.accent)
  ctx.beginPath()
  if (t.def.id === 'mage' || t.def.id === 'ice') {
    ctx.arc(0, -bodyH - 4 * s, 8 * s, 0, Math.PI * 2)
  } else {
    ctx.moveTo(-13 * s, -bodyH + 2 * s)
    ctx.lineTo(0, -bodyH - 14 * s)
    ctx.lineTo(13 * s, -bodyH + 2 * s)
    ctx.closePath()
  }
  ctx.fill()
  // muzzle flash
  if (t.flash > 0.3 && !t.def.melee) {
    ctx.fillStyle = `rgba(255,220,150,${t.flash})`
    ctx.beginPath()
    ctx.arc(Math.cos(t.angle) * 14 * s, -bodyH + 6 * s + Math.sin(t.angle) * 6 * s, 5 * s, 0, Math.PI * 2)
    ctx.fill()
  }
  // tier pips
  for (let i = 0; i < t.tier; i++) {
    ctx.fillStyle = '#ffd27a'
    ctx.beginPath()
    ctx.arc(-6 * s + i * 6 * s, -bodyH - (t.def.id === 'mage' || t.def.id === 'ice' ? 16 : -2) * s, 1.6 * s, 0, Math.PI * 2)
    ctx.fill()
  }
  // type glyph
  ctx.font = `${Math.round(13 * s)}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(TYPE_GLYPH[t.type] ?? '', 0, -bodyH * 0.5)
  if (selected) {
    ctx.strokeStyle = '#ffd27a'
    ctx.lineWidth = 2
    roundRect(ctx, -13 * s, -bodyH - 4 * s, 26 * s, bodyH + 8 * s, 7 * s)
    ctx.stroke()
  }
  ctx.restore()
}

function drawEnemy(ctx: CanvasRenderingContext2D, game: IsoGame, e: PathEnemy, s: number) {
  const p = gridToScreen(e.c, e.r, game.view)
  const rad = e.def.radius * s
  ctx.save()
  ctx.translate(p.x, p.y - rad * 0.4)
  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)'
  ctx.beginPath()
  ctx.ellipse(0, rad * 0.6, rad * 0.9, rad * 0.45, 0, 0, Math.PI * 2)
  ctx.fill()
  // body
  const body = e.slowT > 0 ? '#bcd9e6' : hex(e.def.color)
  ctx.fillStyle = body
  ctx.strokeStyle = hex(e.def.accent)
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(0, 0, rad, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  if (e.hitFlash > 0) {
    ctx.fillStyle = `rgba(255,255,255,${e.hitFlash * 0.6})`
    ctx.beginPath()
    ctx.arc(0, 0, rad, 0, Math.PI * 2)
    ctx.fill()
  }
  // shield ring
  if (e.shieldAura > 0) {
    ctx.strokeStyle = 'rgba(155,123,255,0.8)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(0, 0, rad + 3, 0, Math.PI * 2)
    ctx.stroke()
  }
  // eyes
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(-rad * 0.35, -rad * 0.15, rad * 0.22, 0, Math.PI * 2)
  ctx.arc(rad * 0.35, -rad * 0.15, rad * 0.22, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#161616'
  ctx.beginPath()
  ctx.arc(-rad * 0.3, -rad * 0.12, rad * 0.1, 0, Math.PI * 2)
  ctx.arc(rad * 0.4, -rad * 0.12, rad * 0.1, 0, Math.PI * 2)
  ctx.fill()
  // hp bar
  if (e.hp < e.maxHp) {
    const bw = rad * 2.1
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(-bw / 2, -rad - 9, bw, 4)
    ctx.fillStyle = e.def.boss ? '#ff5a3c' : '#7bd16a'
    ctx.fillRect(-bw / 2, -rad - 9, bw * Math.max(0, e.hp / e.maxHp), 4)
  }
  ctx.restore()
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function lightenHex(n: number, amt: number): number {
  const r = Math.min(255, ((n >> 16) & 255) + amt)
  const g = Math.min(255, ((n >> 8) & 255) + amt)
  const b = Math.min(255, (n & 255) + amt)
  return (r << 16) | (g << 8) | b
}
