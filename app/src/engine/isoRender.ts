import { isPath, keepOf, spawnOf } from '../data/maps'
import { TILE_H, TILE_W, TILE_LIFT, gridToScreen } from './iso'
import { hex } from './vec'
import drawBackground from './background'
import { drawTowerSprite } from './spritesTowers'
import { drawEnemySprite } from './spritesEnemies'
import { drawBeam } from './fx'
import { ENEMY_SPRITE, getImg, MAP_BG, ready, TOWER_SPRITE } from '../lib/assets'
import type { IsoGame, PathEnemy, PlacedTower } from './isoGame'

const THEME_KEY: Record<string, string> = {
  Meadow: 'meadow',
  Canyon: 'canyon',
  Frostland: 'frost',
  Ashlands: 'ashlands',
}

const BEAM_COLOR: Record<string, string> = {
  arrow: '#FFD27A',
  cannon: '#FF8A3D',
  magic: '#B14CFF',
  ice: '#5CC8FF',
  poison: '#9CF06A',
  melee: '#FFB347',
}

export function renderIso(ctx: CanvasRenderingContext2D, game: IsoGame) {
  const { w, h, view, map } = game

  // Real illustrated battlefield backdrop (darkened so the board reads),
  // falling back to the procedural parallax until the image decodes.
  const bgImg = getImg(MAP_BG[map.name] ?? MAP_BG.Meadow)
  if (ready(bgImg)) {
    drawCover(ctx, bgImg, w, h)
    ctx.fillStyle = 'rgba(8,6,24,0.5)'
    ctx.fillRect(0, 0, w, h)
  } else {
    drawBackground(ctx, w, h, THEME_KEY[map.name] ?? 'meadow', game.time)
  }

  const shake = game.shakeOffset
  ctx.save()
  ctx.translate(shake.x, shake.y)

  const s = view.scale
  const halfW = (TILE_W / 2) * s
  const halfH = (TILE_H / 2) * s
  const lift = TILE_LIFT * s
  const buildMode = !!game.selectedBuild
  const th = map.theme

  // isometric board tiles
  for (let r = 0; r < map.rows; r++) {
    for (let c = 0; c < map.cols; c++) {
      const p = gridToScreen(c, r, view)
      const path = isPath(map, c, r)
      drawTile(ctx, p.x, p.y, halfW, halfH, lift, path ? th.pathTop : th.grassTop, path ? th.pathL : th.grassL, path ? th.pathR : th.grassR)
      if (buildMode && !path && !game.towers.some((t) => t.c === c && t.r === r)) {
        ctx.strokeStyle = 'rgba(255,180,80,0.7)'
        ctx.lineWidth = 2
        diamond(ctx, p.x, p.y, halfW - 2, halfH - 2)
        ctx.stroke()
      }
    }
  }

  drawPathArrows(ctx, game, s)
  drawPortal(ctx, gridToScreen(spawnOf(map).c, spawnOf(map).r, view), s, game.time)
  drawKeep(ctx, gridToScreen(keepOf(map).c, keepOf(map).r, view), s, game.lives)

  // selected tower range ring
  const sel = game.towers.find((t) => t.id === game.selectedTowerId)
  if (sel) {
    const sp = gridToScreen(sel.c, sel.r, view)
    const range = game.towerRange(sel)
    ctx.strokeStyle = 'rgba(92,200,255,0.8)'
    ctx.fillStyle = 'rgba(92,200,255,0.10)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.ellipse(sp.x, sp.y, range * TILE_W * 0.5 * s, range * TILE_H * 0.5 * s, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }

  // entities sorted by depth → detailed sprites
  const items: { depth: number; fn: () => void }[] = []
  for (const t of game.towers) {
    const p = gridToScreen(t.c, t.r, view)
    const img = getImg(TOWER_SPRITE[t.type])
    items.push({
      depth: t.c + t.r,
      fn: () => {
        const selected = game.selectedTowerId === t.id
        if (ready(img)) {
          const wdt = 82 * s * (1 + t.tier * 0.08)
          drawShadow(ctx, p.x, p.y, wdt * 0.32)
          const bob = Math.sin(t.bob * 1.6) * 1.2 * s
          drawSpriteImg(ctx, img, p.x, p.y + bob, wdt, false, 0.74)
          drawTierPips(ctx, p.x, p.y, s, t.tier)
          if (selected) {
            ctx.strokeStyle = '#ffd27a'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.ellipse(p.x, p.y + 4 * s, 26 * s, 13 * s, 0, 0, Math.PI * 2)
            ctx.stroke()
          }
        } else {
          drawTowerSprite(ctx, t.type, p.x, p.y, 30 * s, {
            tier: t.tier,
            flash: t.flash,
            angle: t.angle,
            selected,
            time: game.time,
          })
        }
      },
    })
  }
  for (const e of game.enemies) {
    const p = gridToScreen(e.c, e.r, view)
    const seg = Math.min(map.path.length - 2, Math.floor(e.prog))
    const a = gridToScreen(map.path[seg].c, map.path[seg].r, view)
    const b = gridToScreen(map.path[seg + 1].c, map.path[seg + 1].r, view)
    const faceLeft = b.x - a.x < 0
    const img = getImg(ENEMY_SPRITE[e.type])
    items.push({
      depth: e.c + e.r + 0.5,
      fn: () => {
        const hpFrac = Math.max(0, e.hp / e.maxHp)
        if (ready(img)) {
          const wdt = e.def.radius * s * (e.def.boss ? 4.8 : 3.7)
          const bob = e.freezeT > 0 ? 0 : Math.abs(Math.sin(e.wobble * 1.3)) * 2 * s
          drawShadow(ctx, p.x, p.y, wdt * 0.34)
          ctx.save()
          if (e.freezeT > 0) ctx.filter = 'brightness(1.1) saturate(0.4)'
          else if (e.poisonT > 0) ctx.filter = 'hue-rotate(40deg) saturate(1.3)'
          drawSpriteImg(ctx, img, p.x, p.y - bob, wdt, faceLeft, 0.62)
          ctx.restore()
          if (e.shieldAura > 0) {
            ctx.strokeStyle = 'rgba(155,123,255,0.8)'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.arc(p.x, p.y - wdt * 0.32, wdt * 0.5, 0, Math.PI * 2)
            ctx.stroke()
          }
          if (hpFrac < 1) drawEnemyHp(ctx, p.x, p.y - wdt * 0.78, wdt * 0.7, hpFrac, !!e.def.boss, !!e.def.elite)
        } else {
          drawEnemySprite(ctx, e.type, p.x, p.y, e.def.radius * s * 0.12, {
            hpFrac,
            faceLeft,
            wobble: e.wobble,
            frozen: e.freezeT > 0,
            poisoned: e.poisonT > 0,
            enraged: e.enraged,
            shield: e.shieldAura > 0,
            boss: !!e.def.boss,
            time: game.time,
          })
        }
      },
    })
  }
  items.sort((a, b) => a.depth - b.depth)
  for (const it of items) it.fn()

  // projectiles as glowing beam tracers
  for (const p of game.projectiles) {
    const col = BEAM_COLOR[p.kind] ?? hex(p.color)
    drawBeam(ctx, p.px, p.py, p.x, p.y, col, p.crit ? 4.5 : 3)
  }

  drawParticles(ctx, game)

  if (game.aim) {
    const k = gridToScreen(keepOf(map).c, keepOf(map).r, view)
    ctx.setLineDash([8, 8])
    ctx.strokeStyle = 'rgba(255,140,60,0.95)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(k.x, k.y - 20)
    ctx.lineTo(game.aim.x, game.aim.y)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.strokeStyle = 'rgba(255,90,40,0.6)'
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

// ---------- raster sprite helpers ----------
function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const ir = img.naturalWidth / img.naturalHeight
  const cr = w / h
  let dw = w
  let dh = h
  if (ir > cr) {
    dh = h
    dw = h * ir
  } else {
    dw = w
    dh = w / ir
  }
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
}

function drawSpriteImg(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  width: number,
  faceLeft: boolean,
  anchorY: number,
) {
  const hgt = width * (img.naturalHeight / img.naturalWidth)
  ctx.save()
  ctx.translate(cx, cy)
  if (faceLeft) ctx.scale(-1, 1)
  ctx.drawImage(img, -width / 2, -hgt * anchorY, width, hgt)
  ctx.restore()
}

function drawShadow(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number) {
  ctx.fillStyle = 'rgba(0,0,0,0.32)'
  ctx.beginPath()
  ctx.ellipse(x, y + 3, rx, rx * 0.42, 0, 0, Math.PI * 2)
  ctx.fill()
}

function drawTierPips(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, tier: number) {
  for (let i = 0; i < tier; i++) {
    ctx.fillStyle = '#ffd27a'
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(x - (tier - 1) * 4 * s + i * 8 * s, y + 9 * s, 2.4 * s, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }
}

function drawEnemyHp(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, frac: number, boss: boolean, elite: boolean) {
  ctx.fillStyle = 'rgba(0,0,0,0.55)'
  ctx.fillRect(x - w / 2, y, w, 4)
  ctx.fillStyle = boss ? '#ff5a3c' : elite ? '#ffb347' : '#7bd16a'
  ctx.fillRect(x - w / 2, y, w * frac, 4)
}

// ---------- board helpers ----------
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
  ctx.strokeStyle = 'rgba(0,0,0,0.14)'
  ctx.lineWidth = 1
  ctx.stroke()
}

function drawPathArrows(ctx: CanvasRenderingContext2D, game: IsoGame, s: number) {
  const path = game.map.path
  ctx.fillStyle = 'rgba(255,255,255,0.22)'
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

function drawPortal(ctx: CanvasRenderingContext2D, p: { x: number; y: number }, s: number, time: number) {
  ctx.save()
  ctx.translate(p.x, p.y - 6 * s)
  const pulse = 1 + Math.sin(time * 3) * 0.12
  const g = ctx.createRadialGradient(0, 0, 2, 0, 0, 24 * s * pulse)
  g.addColorStop(0, 'rgba(177,76,255,0.95)')
  g.addColorStop(1, 'rgba(177,76,255,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.ellipse(0, 0, 22 * s * pulse, 13 * s * pulse, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(220,180,255,0.85)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.ellipse(0, 0, 14 * s, 8 * s, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

function drawKeep(ctx: CanvasRenderingContext2D, p: { x: number; y: number }, s: number, lives: number) {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.beginPath()
  ctx.ellipse(0, 4 * s, 22 * s, 11 * s, 0, 0, Math.PI * 2)
  ctx.fill()
  // glowing base
  const glowG = ctx.createRadialGradient(0, -10 * s, 4, 0, -10 * s, 40 * s)
  glowG.addColorStop(0, 'rgba(92,200,255,0.4)')
  glowG.addColorStop(1, 'rgba(92,200,255,0)')
  ctx.fillStyle = glowG
  ctx.fillRect(-40 * s, -50 * s, 80 * s, 60 * s)
  ctx.fillStyle = '#5a468c'
  ctx.fillRect(-17 * s, -36 * s, 34 * s, 38 * s)
  ctx.fillStyle = '#3a2c5e'
  ctx.fillRect(-17 * s, -36 * s, 11 * s, 38 * s)
  ctx.fillStyle = '#7a5fb8'
  for (let i = 0; i < 4; i++) ctx.fillRect(-17 * s + i * 9.5 * s, -42 * s, 6 * s, 8 * s)
  ctx.fillStyle = 'rgba(255,210,122,0.9)'
  ctx.fillRect(-3 * s, -22 * s, 6 * s, 9 * s)
  ctx.strokeStyle = '#FFD27A'
  ctx.lineWidth = 2 * s
  ctx.beginPath()
  ctx.moveTo(0, -42 * s)
  ctx.lineTo(0, -56 * s)
  ctx.stroke()
  ctx.fillStyle = lives > 6 ? '#5EE08A' : '#FF4D5E'
  ctx.beginPath()
  ctx.moveTo(0, -56 * s)
  ctx.lineTo(13 * s, -52 * s)
  ctx.lineTo(0, -48 * s)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawParticles(ctx: CanvasRenderingContext2D, game: IsoGame) {
  for (const pt of game.particles) {
    const a = Math.max(0, pt.life / pt.maxLife)
    if (pt.kind === 'text' || pt.kind === 'crit') {
      ctx.fillStyle = pt.kind === 'crit' ? `rgba(255,123,58,${a})` : `rgba(255,225,150,${a})`
      ctx.font = `bold ${pt.size}px Inter, sans-serif`
      ctx.textAlign = 'center'
      ctx.shadowColor = pt.kind === 'crit' ? 'rgba(255,90,40,0.9)' : 'rgba(0,0,0,0.6)'
      ctx.shadowBlur = pt.kind === 'crit' ? 12 : 4
      ctx.fillText(pt.text ?? '', pt.x, pt.y)
      ctx.shadowBlur = 0
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
    // spark — additive glow
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.globalAlpha = a
    ctx.fillStyle = hex(pt.color)
    ctx.shadowColor = hex(pt.color)
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}
