import { isPath, keepOf, spawnOf } from '../data/maps'
import { TILE_H, TILE_W, TILE_LIFT, gridToScreen } from './iso'
import { hex } from './vec'
import type { IsoGame, PathEnemy, PlacedTower } from './isoGame'

let bgCache: { key: string; grad: CanvasGradient } | null = null

export function renderIso(ctx: CanvasRenderingContext2D, game: IsoGame) {
  const { w, h, view, map } = game
  const th = map.theme
  ctx.clearRect(0, 0, w, h)

  // cache the background gradient (only changes on resize / theme change)
  const key = `${w}x${h}|${th.name}`
  if (!bgCache || bgCache.key !== key) {
    const g = ctx.createRadialGradient(w / 2, h * 0.46, 60, w / 2, h * 0.46, Math.max(w, h) * 0.85)
    g.addColorStop(0, th.bg0)
    g.addColorStop(0.6, th.bg1)
    g.addColorStop(1, th.bg2)
    bgCache = { key, grad: g }
  }
  ctx.fillStyle = bgCache.grad
  ctx.fillRect(0, 0, w, h)

  // ambient floaties
  drawAmbient(ctx, game)

  const shake = game.shakeOffset
  ctx.save()
  ctx.translate(shake.x, shake.y)

  const s = view.scale
  const halfW = (TILE_W / 2) * s
  const halfH = (TILE_H / 2) * s
  const lift = TILE_LIFT * s
  const buildMode = !!game.selectedBuild

  // tiles back-to-front
  for (let r = 0; r < map.rows; r++) {
    for (let c = 0; c < map.cols; c++) {
      const p = gridToScreen(c, r, view)
      const path = isPath(map, c, r)
      drawTile(ctx, p.x, p.y, halfW, halfH, lift, path ? th.pathTop : th.grassTop, path ? th.pathL : th.grassL, path ? th.pathR : th.grassR)
      if (buildMode && !path && !game.towers.some((t) => t.c === c && t.r === r)) {
        ctx.strokeStyle = 'rgba(255,180,80,0.6)'
        ctx.lineWidth = 2
        diamond(ctx, p.x, p.y, halfW - 2, halfH - 2)
        ctx.stroke()
      }
    }
  }

  drawPathArrows(ctx, game, s)
  drawPortal(ctx, gridToScreen(spawnOf(map).c, spawnOf(map).r, view), s, game.time)
  drawKeep(ctx, gridToScreen(keepOf(map).c, keepOf(map).r, view), s, game.lives)

  // selected range ring (under entities)
  const sel = game.towers.find((t) => t.id === game.selectedTowerId)
  if (sel) {
    const sp = gridToScreen(sel.c, sel.r, view)
    const range = game.towerRange(sel)
    ctx.strokeStyle = 'rgba(255,210,122,0.75)'
    ctx.fillStyle = 'rgba(255,210,122,0.08)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.ellipse(sp.x, sp.y, range * TILE_W * 0.5 * s, range * TILE_H * 0.5 * s, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }

  // entities by depth
  const items: { depth: number; fn: () => void }[] = []
  for (const t of game.towers) items.push({ depth: t.c + t.r, fn: () => drawTower(ctx, game, t, s) })
  for (const e of game.enemies) items.push({ depth: e.c + e.r + 0.5, fn: () => drawEnemy(ctx, game, e, s) })
  items.sort((a, b) => a.depth - b.depth)
  for (const it of items) it.fn()

  // projectiles
  for (const p of game.projectiles) {
    ctx.fillStyle = hex(p.color)
    ctx.shadowColor = hex(p.color)
    ctx.shadowBlur = p.crit ? 16 : 10
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.kind === 'cannon' ? 6 : p.crit ? 6 : 4, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.shadowBlur = 0

  drawParticles(ctx, game)

  if (game.aim) {
    const k = gridToScreen(keepOf(map).c, keepOf(map).r, view)
    ctx.setLineDash([8, 8])
    ctx.strokeStyle = 'rgba(255,140,60,0.9)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(k.x, k.y - 20)
    ctx.lineTo(game.aim.x, game.aim.y)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.arc(game.aim.x, game.aim.y, 30, 0, Math.PI * 2)
    ctx.stroke()
    // meteor target radius
    ctx.strokeStyle = 'rgba(255,90,40,0.5)'
    ctx.beginPath()
    ctx.ellipse(game.aim.x, game.aim.y, 1.7 * TILE_W * 0.5 * s, 1.7 * TILE_H * 0.5 * s, 0, 0, Math.PI * 2)
    ctx.stroke()
  }

  ctx.restore()

  if (game.flash > 0) {
    ctx.fillStyle = `rgba(210,40,30,${0.25 * game.flash})`
    ctx.fillRect(0, 0, w, h)
  }
  if (game.lives / 8 < 1 && game.lives > 0) {
    const pulse = 0.3 + 0.25 * Math.sin(performance.now() / 160)
    ctx.strokeStyle = `rgba(220,40,30,${pulse})`
    ctx.lineWidth = 12
    ctx.strokeRect(6, 6, w - 12, h - 12)
  }
}

// ---------- helpers ----------
function diamond(ctx: CanvasRenderingContext2D, x: number, y: number, hw: number, hh: number) {
  ctx.beginPath()
  ctx.moveTo(x, y - hh)
  ctx.lineTo(x + hw, y)
  ctx.lineTo(x, y + hh)
  ctx.lineTo(x - hw, y)
  ctx.closePath()
}

function drawTile(ctx: CanvasRenderingContext2D, x: number, y: number, hw: number, hh: number, lift: number, top: string, left: string, right: string) {
  ctx.fillStyle = left
  ctx.beginPath()
  ctx.moveTo(x - hw, y)
  ctx.lineTo(x, y + hh)
  ctx.lineTo(x, y + hh + lift)
  ctx.lineTo(x - hw, y + lift)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = right
  ctx.beginPath()
  ctx.moveTo(x + hw, y)
  ctx.lineTo(x, y + hh)
  ctx.lineTo(x, y + hh + lift)
  ctx.lineTo(x + hw, y + lift)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = top
  diamond(ctx, x, y, hw, hh)
  ctx.fill()
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'
  ctx.lineWidth = 1
  ctx.stroke()
}

function drawPathArrows(ctx: CanvasRenderingContext2D, game: IsoGame, s: number) {
  const path = game.map.path
  ctx.fillStyle = 'rgba(255,255,255,0.18)'
  for (let i = 0; i < path.length - 1; i += 2) {
    const a = gridToScreen(path[i].c, path[i].r, game.view)
    const b = gridToScreen(path[i + 1].c, path[i + 1].r, game.view)
    const mx = (a.x + b.x) / 2
    const my = (a.y + b.y) / 2
    const ang = Math.atan2(b.y - a.y, b.x - a.x)
    ctx.save()
    ctx.translate(mx, my)
    ctx.rotate(ang)
    ctx.beginPath()
    ctx.moveTo(5 * s, 0)
    ctx.lineTo(-3 * s, -4 * s)
    ctx.lineTo(-3 * s, 4 * s)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
}

function drawAmbient(ctx: CanvasRenderingContext2D, game: IsoGame) {
  const { w, h } = game
  const n = 18
  ctx.fillStyle = game.map.theme.ambient
  for (let i = 0; i < n; i++) {
    const t = game.time * 0.3 + i * 1.7
    const x = ((i * 97.13 + t * 14) % (w + 40)) - 20
    const y = ((i * 53.7 + Math.sin(t) * 30 + t * 8) % (h + 40)) - 20
    ctx.globalAlpha = 0.25 + 0.2 * Math.sin(t * 2)
    ctx.beginPath()
    ctx.arc(x, y, 1.6, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

function drawPortal(ctx: CanvasRenderingContext2D, p: { x: number; y: number }, s: number, time: number) {
  ctx.save()
  ctx.translate(p.x, p.y - 6 * s)
  const pulse = 1 + Math.sin(time * 3) * 0.1
  const g = ctx.createRadialGradient(0, 0, 2, 0, 0, 24 * s * pulse)
  g.addColorStop(0, 'rgba(150,110,255,0.95)')
  g.addColorStop(1, 'rgba(150,110,255,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.ellipse(0, 0, 22 * s * pulse, 13 * s * pulse, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(200,170,255,0.8)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.ellipse(0, 0, 14 * s, 8 * s, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

function drawKeep(ctx: CanvasRenderingContext2D, p: { x: number; y: number }, s: number, lives: number) {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.fillStyle = 'rgba(0,0,0,0.3)'
  ctx.beginPath()
  ctx.ellipse(0, 4 * s, 22 * s, 11 * s, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#8a8f99'
  ctx.fillRect(-17 * s, -36 * s, 34 * s, 38 * s)
  ctx.fillStyle = '#6a6f79'
  ctx.fillRect(-17 * s, -36 * s, 11 * s, 38 * s)
  ctx.fillStyle = '#9aa0a6'
  for (let i = 0; i < 4; i++) ctx.fillRect(-17 * s + i * 9.5 * s, -42 * s, 6 * s, 8 * s)
  ctx.fillStyle = 'rgba(255,170,60,0.85)'
  ctx.fillRect(-3 * s, -22 * s, 6 * s, 9 * s)
  ctx.strokeStyle = '#caa15a'
  ctx.lineWidth = 2 * s
  ctx.beginPath()
  ctx.moveTo(0, -42 * s)
  ctx.lineTo(0, -56 * s)
  ctx.stroke()
  ctx.fillStyle = lives > 6 ? '#7bd16a' : '#e0452e'
  ctx.beginPath()
  ctx.moveTo(0, -56 * s)
  ctx.lineTo(13 * s, -52 * s)
  ctx.lineTo(0, -48 * s)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

// ---------- towers ----------
function drawTower(ctx: CanvasRenderingContext2D, game: IsoGame, t: PlacedTower, s: number) {
  const p = gridToScreen(t.c, t.r, game.view)
  const selected = game.selectedTowerId === t.id
  const bob = Math.sin(t.bob * 1.5) * 1.2 * s
  ctx.save()
  ctx.translate(p.x, p.y + bob)
  ctx.fillStyle = 'rgba(0,0,0,0.3)'
  ctx.beginPath()
  ctx.ellipse(0, 2 * s - bob, 17 * s, 8 * s, 0, 0, Math.PI * 2)
  ctx.fill()
  // stone base
  ctx.fillStyle = '#6b675f'
  ctx.beginPath()
  ctx.moveTo(0, -6 * s)
  ctx.lineTo(16 * s, 1 * s)
  ctx.lineTo(0, 8 * s)
  ctx.lineTo(-16 * s, 1 * s)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = 'rgba(0,0,0,0.3)'
  ctx.stroke()

  const bodyH = (26 + t.tier * 7) * s
  const col = t.def.color
  const acc = t.def.accent
  const grad = ctx.createLinearGradient(0, -bodyH, 0, 0)
  grad.addColorStop(0, hex(lighten(col, 45)))
  grad.addColorStop(1, hex(col))

  switch (t.type) {
    case 'archer': {
      ctx.fillStyle = grad
      roundRect(ctx, -10 * s, -bodyH, 20 * s, bodyH, 5 * s)
      ctx.fill()
      // battlements
      ctx.fillStyle = hex(lighten(col, 20))
      for (let i = 0; i < 3; i++) ctx.fillRect(-10 * s + i * 7 * s, -bodyH - 4 * s, 5 * s, 5 * s)
      // bow archer
      ctx.strokeStyle = hex(acc)
      ctx.lineWidth = 2 * s
      ctx.beginPath()
      ctx.arc(0, -bodyH - 2 * s, 6 * s, -0.6, 0.6)
      ctx.stroke()
      break
    }
    case 'cannon': {
      ctx.fillStyle = grad
      roundRect(ctx, -12 * s, -bodyH * 0.8, 24 * s, bodyH * 0.8, 6 * s)
      ctx.fill()
      // barrel pointing at angle
      ctx.save()
      ctx.translate(0, -bodyH * 0.7)
      ctx.rotate(t.angle * 0.3)
      ctx.fillStyle = '#2b2b2b'
      roundRect(ctx, -3 * s, -16 * s, 7 * s, 18 * s, 3 * s)
      ctx.fill()
      ctx.fillStyle = hex(acc)
      ctx.beginPath()
      ctx.arc(0.5 * s, -16 * s, 3.5 * s, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
      break
    }
    case 'mage': {
      ctx.fillStyle = grad
      roundRect(ctx, -9 * s, -bodyH, 18 * s, bodyH, 5 * s)
      ctx.fill()
      // floating orb
      const oy = -bodyH - 8 * s + Math.sin(t.bob * 2) * 2 * s
      ctx.fillStyle = hex(acc)
      ctx.shadowColor = hex(acc)
      ctx.shadowBlur = 14
      ctx.beginPath()
      ctx.arc(0, oy, 7 * s, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
      // runes
      ctx.fillStyle = 'rgba(255,255,255,0.5)'
      for (let i = 0; i < 3; i++) {
        const a = t.bob + (i / 3) * Math.PI * 2
        ctx.beginPath()
        ctx.arc(Math.cos(a) * 11 * s, oy + Math.sin(a) * 5 * s, 1.5 * s, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    }
    case 'ice': {
      // crystal spire
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.moveTo(0, -bodyH - 8 * s)
      ctx.lineTo(9 * s, -bodyH * 0.4)
      ctx.lineTo(6 * s, 2 * s)
      ctx.lineTo(-6 * s, 2 * s)
      ctx.lineTo(-9 * s, -bodyH * 0.4)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.2 * Math.sin(t.bob * 3)})`
      ctx.beginPath()
      ctx.moveTo(0, -bodyH - 6 * s)
      ctx.lineTo(4 * s, -bodyH * 0.45)
      ctx.lineTo(-4 * s, -bodyH * 0.45)
      ctx.closePath()
      ctx.fill()
      break
    }
    case 'poison': {
      ctx.fillStyle = grad
      roundRect(ctx, -11 * s, -bodyH * 0.7, 22 * s, bodyH * 0.7, 6 * s)
      ctx.fill()
      // cauldron bubbles
      ctx.fillStyle = hex(acc)
      ctx.beginPath()
      ctx.ellipse(0, -bodyH * 0.7, 11 * s, 5 * s, 0, 0, Math.PI * 2)
      ctx.fill()
      for (let i = 0; i < 3; i++) {
        const by = -bodyH * 0.7 - ((t.bob * 12 + i * 9) % 18) * s
        ctx.globalAlpha = 0.7
        ctx.beginPath()
        ctx.arc((i - 1) * 5 * s, by, 2.2 * s, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      break
    }
    case 'barracks': {
      // tent
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.moveTo(0, -bodyH)
      ctx.lineTo(14 * s, 2 * s)
      ctx.lineTo(-14 * s, 2 * s)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = 'rgba(0,0,0,0.25)'
      ctx.beginPath()
      ctx.moveTo(0, -bodyH)
      ctx.lineTo(0, 2 * s)
      ctx.lineTo(-14 * s, 2 * s)
      ctx.closePath()
      ctx.fill()
      // flag
      ctx.strokeStyle = '#caa15a'
      ctx.lineWidth = 1.5 * s
      ctx.beginPath()
      ctx.moveTo(0, -bodyH)
      ctx.lineTo(0, -bodyH - 12 * s)
      ctx.stroke()
      ctx.fillStyle = hex(acc)
      ctx.beginPath()
      ctx.moveTo(0, -bodyH - 12 * s)
      ctx.lineTo(9 * s, -bodyH - 9 * s)
      ctx.lineTo(0, -bodyH - 6 * s)
      ctx.closePath()
      ctx.fill()
      break
    }
  }

  if (t.flash > 0.3 && !t.def.melee) {
    ctx.fillStyle = `rgba(255,230,170,${t.flash})`
    ctx.beginPath()
    ctx.arc(Math.cos(t.angle) * 12 * s, -bodyH + 4 * s, 4 * s, 0, Math.PI * 2)
    ctx.fill()
  }
  // tier pips
  for (let i = 0; i < t.tier; i++) {
    ctx.fillStyle = '#ffd27a'
    ctx.beginPath()
    ctx.arc(-5 * s + i * 5 * s, 6 * s, 2 * s, 0, Math.PI * 2)
    ctx.fill()
  }
  if (selected) {
    ctx.strokeStyle = '#ffd27a'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.ellipse(0, -bodyH * 0.45, 16 * s, bodyH * 0.7, 0, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.restore()
}

// ---------- enemies ----------
function drawEnemy(ctx: CanvasRenderingContext2D, game: IsoGame, e: PathEnemy, s: number) {
  const p = gridToScreen(e.c, e.r, game.view)
  const rad = e.def.radius * s
  // facing from path
  const seg = Math.min(game.map.path.length - 2, Math.floor(e.prog))
  const a = gridToScreen(game.map.path[seg].c, game.map.path[seg].r, game.view)
  const b = gridToScreen(game.map.path[seg + 1].c, game.map.path[seg + 1].r, game.view)
  const faceLeft = b.x - a.x < 0
  const bob = e.freezeT > 0 ? 0 : Math.abs(Math.sin(e.wobble)) * rad * 0.14
  ctx.save()
  ctx.translate(p.x, p.y - rad * 0.45 - bob)
  ctx.fillStyle = 'rgba(0,0,0,0.3)'
  ctx.beginPath()
  ctx.ellipse(0, rad * 0.65 + bob, rad * 0.95, rad * 0.45, 0, 0, Math.PI * 2)
  ctx.fill()
  if (faceLeft) ctx.scale(-1, 1)

  const frozen = e.freezeT > 0
  const poisoned = e.poisonT > 0
  let body = hex(e.def.color)
  if (frozen) body = '#bfe6f5'
  else if (e.slowT > 0) body = '#bcd9e6'
  else if (poisoned) body = blend(e.def.color, 0x9bf06a, 0.3)

  // enraged aura
  if (e.enraged) {
    ctx.strokeStyle = `rgba(255,80,40,${0.5 + 0.3 * Math.sin(game.time * 10)})`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(0, 0, rad + 4, 0, Math.PI * 2)
    ctx.stroke()
  }
  if (e.shieldAura > 0) {
    ctx.strokeStyle = 'rgba(155,123,255,0.8)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(0, 0, rad + 3, 0, Math.PI * 2)
    ctx.stroke()
  }

  drawCreature(ctx, e, rad, body)

  if (e.hitFlash > 0) {
    ctx.fillStyle = `rgba(255,255,255,${e.hitFlash * 0.6})`
    ctx.beginPath()
    ctx.arc(0, 0, rad, 0, Math.PI * 2)
    ctx.fill()
  }
  if (frozen) {
    ctx.fillStyle = 'rgba(180,230,255,0.35)'
    ctx.fillRect(-rad, -rad, rad * 2, rad * 2)
    ctx.strokeStyle = 'rgba(220,245,255,0.8)'
    ctx.lineWidth = 1.5
    ctx.strokeRect(-rad, -rad, rad * 2, rad * 2)
  }
  if (faceLeft) ctx.scale(-1, 1)

  if (e.hp < e.maxHp) {
    const bw = rad * 2.1
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(-bw / 2, -rad - 10, bw, 4)
    ctx.fillStyle = e.def.boss ? '#ff5a3c' : e.def.elite ? '#ffb347' : '#7bd16a'
    ctx.fillRect(-bw / 2, -rad - 10, bw * Math.max(0, e.hp / e.maxHp), 4)
  }
  if (poisoned) {
    ctx.fillStyle = 'rgba(150,240,100,0.9)'
    ctx.beginPath()
    ctx.arc(rad * 0.7, -rad * 0.6, 2, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

function drawCreature(ctx: CanvasRenderingContext2D, e: PathEnemy, rad: number, body: string) {
  ctx.fillStyle = body
  ctx.strokeStyle = hex(e.def.accent)
  ctx.lineWidth = 2
  const t = e.type
  if (t === 'slime') {
    const sq = 1 + Math.sin(e.wobble) * 0.12
    ctx.beginPath()
    ctx.ellipse(0, 0, rad, rad / sq, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  } else if (t === 'imp') {
    ctx.beginPath()
    ctx.arc(0, 0, rad, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = hex(e.def.accent)
    ctx.beginPath()
    ctx.moveTo(-rad * 0.6, -rad * 0.7)
    ctx.lineTo(-rad * 0.3, -rad * 1.2)
    ctx.lineTo(-rad * 0.1, -rad * 0.7)
    ctx.moveTo(rad * 0.6, -rad * 0.7)
    ctx.lineTo(rad * 0.3, -rad * 1.2)
    ctx.lineTo(rad * 0.1, -rad * 0.7)
    ctx.fill()
  } else if (t === 'brute' || t === 'golem') {
    roundRectPath(ctx, -rad, -rad, rad * 2, rad * 2, rad * 0.3)
    ctx.fill()
    ctx.stroke()
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'
    ctx.beginPath()
    ctx.moveTo(-rad, 0)
    ctx.lineTo(rad, 0)
    ctx.stroke()
  } else if (t === 'shaman') {
    ctx.beginPath()
    ctx.arc(0, 0, rad, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.strokeStyle = '#caa15a'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(rad * 0.8, rad)
    ctx.lineTo(rad * 0.8, -rad * 1.3)
    ctx.stroke()
    ctx.fillStyle = '#ffe08a'
    ctx.beginPath()
    ctx.arc(rad * 0.8, -rad * 1.3, 3, 0, Math.PI * 2)
    ctx.fill()
  } else if (t === 'warlock') {
    // hooded
    ctx.beginPath()
    ctx.moveTo(0, -rad * 1.2)
    ctx.lineTo(rad, rad * 0.8)
    ctx.lineTo(-rad, rad * 0.8)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  } else if (t === 'ogre') {
    ctx.beginPath()
    ctx.arc(0, 0, rad, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.moveTo(-rad * 0.2, rad * 0.2)
    ctx.lineTo(-rad * 0.05, rad * 0.5)
    ctx.lineTo(-rad * 0.35, rad * 0.5)
    ctx.fill()
  } else if (t === 'dragon') {
    // wings
    ctx.fillStyle = hex(e.def.accent)
    const flap = Math.sin(e.wobble) * rad * 0.3
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(-rad * 1.6, -rad * 0.6 + flap)
    ctx.lineTo(-rad * 0.8, rad * 0.2)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(rad * 1.6, -rad * 0.6 + flap)
    ctx.lineTo(rad * 0.8, rad * 0.2)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = body
    ctx.beginPath()
    ctx.arc(0, 0, rad, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }

  // eyes (most creatures)
  if (t !== 'warlock') {
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(-rad * 0.32, -rad * 0.12, rad * 0.22, 0, Math.PI * 2)
    ctx.arc(rad * 0.32, -rad * 0.12, rad * 0.22, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#161616'
    ctx.beginPath()
    ctx.arc(-rad * 0.27, -rad * 0.1, rad * 0.1, 0, Math.PI * 2)
    ctx.arc(rad * 0.37, -rad * 0.1, rad * 0.1, 0, Math.PI * 2)
    ctx.fill()
  } else {
    ctx.fillStyle = '#ff6a4a'
    ctx.beginPath()
    ctx.arc(-rad * 0.25, -rad * 0.1, rad * 0.12, 0, Math.PI * 2)
    ctx.arc(rad * 0.25, -rad * 0.1, rad * 0.12, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawParticles(ctx: CanvasRenderingContext2D, game: IsoGame) {
  for (const pt of game.particles) {
    const a = Math.max(0, pt.life / pt.maxLife)
    if (pt.kind === 'text' || pt.kind === 'crit') {
      ctx.fillStyle = pt.kind === 'crit' ? `rgba(255,123,58,${a})` : `rgba(255,210,122,${a})`
      ctx.font = `bold ${pt.size}px Inter, sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText(pt.text ?? '', pt.x, pt.y)
      continue
    }
    if (pt.kind === 'ring') {
      ctx.strokeStyle = `rgba(255,150,70,${a})`
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, (1 - a) * 36 + 6, 0, Math.PI * 2)
      ctx.stroke()
      continue
    }
    if (pt.kind === 'smoke') {
      ctx.globalAlpha = a * 0.5
      ctx.fillStyle = hex(pt.color)
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
      continue
    }
    ctx.globalAlpha = a
    ctx.fillStyle = hex(pt.color)
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  roundRectPath(ctx, x, y, w, h, r)
}
function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function lighten(n: number, amt: number): number {
  const r = Math.min(255, ((n >> 16) & 255) + amt)
  const g = Math.min(255, ((n >> 8) & 255) + amt)
  const b = Math.min(255, (n & 255) + amt)
  return (r << 16) | (g << 8) | b
}
function blend(a: number, b: number, t: number): string {
  const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255
  const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const bl = Math.round(ab + (bb - ab) * t)
  return hex((r << 16) | (g << 8) | bl)
}
