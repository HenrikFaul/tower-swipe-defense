import { MAP_IMG_H, MAP_IMG_W } from '../data/maps'
import { hex } from './vec'
import { drawBeam } from './fx'
import { ENEMY_SPRITE, getImg, ready, TOWER_SPRITE } from '../lib/assets'
import type { IsoGame, PathEnemy, PlacedTower } from './isoGame'

// Beam tint per projectile kind (additive neon tracer).
const BEAM_COLOR: Record<string, string> = {
  arrow: '#FFD27A',
  cannon: '#FF8A3D',
  magic: '#B14CFF',
  ice: '#5CC8FF',
  poison: '#9CF06A',
  melee: '#FFB347',
}

// Solid fallback fill while the illustrated background decodes.
const MAP_FALLBACK: Record<string, string> = {
  'Green Forest': '#1d3a22',
  'Desert Ruins': '#5a4326',
  'Frozen Peaks': '#243a4d',
}

// Sprite footprint in *image-space* px (scaled by view.scale on screen so the
// art and the actors share one coordinate system). Tuned to the drawn plots.
const TOWER_W_IMG = 132
const ENEMY_W_IMG = 104
const BOSS_W_IMG = 210
const METEOR_R = 92 // mirrors IsoGame METEOR_R (px-space)

export function renderIso(ctx: CanvasRenderingContext2D, game: IsoGame) {
  const { w, h, view, map } = game
  const s = view.scale

  // 1) Illustrated battlefield — drawn with the SAME cover-fit transform the
  //    engine uses for path/plots, so towers sit on the drawn pads and enemies
  //    walk the drawn road. Falls back to a flat tone until the JPG decodes.
  const bgImg = getImg(map.bg)
  if (ready(bgImg)) {
    ctx.drawImage(bgImg, view.ox, view.oy, MAP_IMG_W * s, MAP_IMG_H * s)
  } else {
    ctx.fillStyle = MAP_FALLBACK[map.name] ?? '#16131f'
    ctx.fillRect(0, 0, w, h)
  }
  // gentle top/bottom vignette so the HUD chrome reads over the art
  const vg = ctx.createLinearGradient(0, 0, 0, h)
  vg.addColorStop(0, 'rgba(6,4,16,0.34)')
  vg.addColorStop(0.16, 'rgba(6,4,16,0.05)')
  vg.addColorStop(0.82, 'rgba(6,4,16,0.05)')
  vg.addColorStop(1, 'rgba(6,4,16,0.4)')
  ctx.fillStyle = vg
  ctx.fillRect(0, 0, w, h)

  const shake = game.shakeOffset
  ctx.save()
  ctx.translate(shake.x, shake.y)

  // 2) Direction chevrons along the drawn road (subtle, animated march).
  drawPathFlow(ctx, game, s)

  // 3) Build mode → glowing rings on every open plot.
  if (game.selectedBuild) {
    for (let i = 0; i < game.plotsPx.length; i++) {
      if (game.isPlotOccupied(i)) continue
      const p = game.plotsPx[i]
      const pulse = 0.55 + 0.25 * Math.sin(game.time * 4 + i)
      ctx.save()
      ctx.strokeStyle = `rgba(255,205,110,${pulse})`
      ctx.fillStyle = 'rgba(255,205,110,0.10)'
      ctx.lineWidth = 2.5 * s
      ctx.beginPath()
      ctx.ellipse(p.x, p.y, 26 * s, 15 * s, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.restore()
    }
  }

  // 4) Keep banner (lives flag) at the path end.
  drawKeepFlag(ctx, game.keepPos(), s, game.lives, game.time)

  // 5) Selected-tower range ring.
  const sel = game.towers.find((t) => t.id === game.selectedTowerId)
  if (sel) {
    const range = game.towerRange(sel)
    ctx.save()
    ctx.strokeStyle = 'rgba(92,200,255,0.85)'
    ctx.fillStyle = 'rgba(92,200,255,0.10)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(sel.sx, sel.sy, range, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }

  // 6) Actors — painter-sorted by screen-Y so lower entities overlap upper.
  const items: { y: number; fn: () => void }[] = []
  for (const t of game.towers) items.push({ y: t.sy, fn: () => drawTower(ctx, game, t, s) })
  for (const e of game.enemies) items.push({ y: e.sy + 0.5, fn: () => drawEnemy(ctx, game, e, s) })
  items.sort((a, b) => a.y - b.y)
  for (const it of items) it.fn()

  // 7) Projectiles as glowing beam tracers.
  for (const p of game.projectiles) {
    const col = BEAM_COLOR[p.kind] ?? hex(p.color)
    drawBeam(ctx, p.px, p.py, p.x, p.y, col, p.crit ? 4.5 : 3)
  }

  // 8) Particles (sparks / rings / smoke / damage text).
  drawParticles(ctx, game)

  // 9) Meteor aim reticle.
  if (game.aim) {
    const k = game.keepPos()
    ctx.save()
    ctx.setLineDash([9, 9])
    ctx.strokeStyle = 'rgba(255,140,60,0.95)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(k.x, k.y - 24 * s)
    ctx.lineTo(game.aim.x, game.aim.y)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.strokeStyle = 'rgba(255,90,40,0.7)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(game.aim.x, game.aim.y, METEOR_R, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }

  ctx.restore()

  // 10) Full-screen damage flash + low-lives danger frame.
  if (game.flash > 0) {
    ctx.fillStyle = `rgba(210,40,30,${0.25 * game.flash})`
    ctx.fillRect(0, 0, w, h)
  }
  if (game.lives > 0 && game.lives < 4) {
    const pulse = 0.3 + 0.25 * Math.sin(game.time * 6)
    ctx.strokeStyle = `rgba(220,40,30,${pulse})`
    ctx.lineWidth = 12
    ctx.strokeRect(6, 6, w - 12, h - 12)
  }
}

// ───────────────────────── actors ─────────────────────────

function drawTower(ctx: CanvasRenderingContext2D, game: IsoGame, t: PlacedTower, s: number) {
  const selected = game.selectedTowerId === t.id
  const img = getImg(TOWER_SPRITE[t.type])
  const width = TOWER_W_IMG * s * (1 + t.tier * 0.07)
  drawShadow(ctx, t.sx, t.sy, width * 0.34)
  if (selected) {
    ctx.strokeStyle = '#ffd27a'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.ellipse(t.sx, t.sy, width * 0.34, width * 0.17, 0, 0, Math.PI * 2)
    ctx.stroke()
  }
  const bob = Math.sin(t.bob * 1.6) * 1.2 * s
  if (t.flash > 0) {
    ctx.save()
    ctx.shadowColor = hex(t.def.accent)
    ctx.shadowBlur = 18 * t.flash
    drawSpriteImg(ctx, img, t.sx, t.sy + bob, width, false, 0.84)
    ctx.restore()
  } else {
    drawSpriteImg(ctx, img, t.sx, t.sy + bob, width, false, 0.84)
  }
  drawTierPips(ctx, t.sx, t.sy + 7 * s, s, t.tier)
}

function drawEnemy(ctx: CanvasRenderingContext2D, game: IsoGame, e: PathEnemy, s: number) {
  const img = getImg(ENEMY_SPRITE[e.type])
  const width = (e.def.boss ? BOSS_W_IMG : ENEMY_W_IMG) * s
  const hpFrac = Math.max(0, e.hp / e.maxHp)
  const bob = e.freezeT > 0 ? 0 : Math.abs(Math.sin(e.wobble * 1.3)) * 2 * s
  drawShadow(ctx, e.sx, e.sy, width * 0.32)
  ctx.save()
  if (e.freezeT > 0) ctx.filter = 'brightness(1.15) saturate(0.45)'
  else if (e.poisonT > 0) ctx.filter = 'hue-rotate(45deg) saturate(1.35)'
  else if (e.enraged) ctx.filter = 'brightness(1.1) saturate(1.4)'
  if (ready(img)) {
    drawSpriteImg(ctx, img, e.sx, e.sy - bob, width, e.faceLeft, 0.62)
  } else {
    ctx.fillStyle = hex(e.def.color)
    ctx.beginPath()
    ctx.arc(e.sx, e.sy - width * 0.3, width * 0.3, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
  if (e.hitFlash > 0) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.globalAlpha = e.hitFlash * 0.55
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(e.sx, e.sy - width * 0.34, width * 0.32, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
  if (e.shieldAura > 0) {
    ctx.strokeStyle = 'rgba(155,123,255,0.85)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(e.sx, e.sy - width * 0.36, width * 0.46, 0, Math.PI * 2)
    ctx.stroke()
  }
  if (hpFrac < 1) drawEnemyHp(ctx, e.sx, e.sy - width * 0.86, width * 0.74, hpFrac, !!e.def.boss, !!e.def.elite)
}

// ───────────────────────── helpers ─────────────────────────

function drawSpriteImg(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  width: number,
  faceLeft: boolean,
  anchorY: number,
) {
  if (!ready(img)) return
  const hgt = width * (img.naturalHeight / img.naturalWidth)
  ctx.save()
  ctx.translate(cx, cy)
  if (faceLeft) ctx.scale(-1, 1)
  ctx.drawImage(img, -width / 2, -hgt * anchorY, width, hgt)
  ctx.restore()
}

function drawShadow(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number) {
  ctx.fillStyle = 'rgba(0,0,0,0.34)'
  ctx.beginPath()
  ctx.ellipse(x, y + 3, rx, rx * 0.4, 0, 0, Math.PI * 2)
  ctx.fill()
}

function drawTierPips(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, tier: number) {
  for (let i = 0; i < tier; i++) {
    ctx.fillStyle = '#ffd27a'
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(x - (tier - 1) * 4 * s + i * 8 * s, y, 2.4 * s, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }
}

function drawEnemyHp(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, frac: number, boss: boolean, elite: boolean) {
  const hh = boss ? 5 : 3.4
  ctx.fillStyle = 'rgba(0,0,0,0.6)'
  ctx.fillRect(x - w / 2, y, w, hh)
  ctx.fillStyle = boss ? '#ff5a3c' : elite ? '#ffb347' : '#7bd16a'
  ctx.fillRect(x - w / 2, y, w * frac, hh)
}

function drawPathFlow(ctx: CanvasRenderingContext2D, game: IsoGame, s: number) {
  const path = game.pathPx
  if (path.length < 2) return
  const march = (game.time * 40) % 36
  ctx.save()
  ctx.fillStyle = 'rgba(255,240,210,0.18)'
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i]
    const b = path[i + 1]
    const segLen = Math.hypot(b.x - a.x, b.y - a.y)
    const ang = Math.atan2(b.y - a.y, b.x - a.x)
    for (let d = march % 36; d < segLen; d += 36) {
      const f = d / segLen
      const x = a.x + (b.x - a.x) * f
      const y = a.y + (b.y - a.y) * f
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(ang)
      ctx.beginPath()
      ctx.moveTo(5 * s, 0)
      ctx.lineTo(-3 * s, -3.5 * s)
      ctx.lineTo(-3 * s, 3.5 * s)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }
  }
  ctx.restore()
}

function drawKeepFlag(ctx: CanvasRenderingContext2D, p: { x: number; y: number }, s: number, lives: number, time: number) {
  ctx.save()
  ctx.translate(p.x, p.y)
  // protective glow ring around the objective
  const pulse = 1 + Math.sin(time * 2.4) * 0.1
  const g = ctx.createRadialGradient(0, 0, 4, 0, 0, 46 * s * pulse)
  g.addColorStop(0, 'rgba(92,200,255,0.28)')
  g.addColorStop(1, 'rgba(92,200,255,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.ellipse(0, 0, 44 * s * pulse, 26 * s * pulse, 0, 0, Math.PI * 2)
  ctx.fill()
  // banner pole + flag (color tracks remaining lives)
  ctx.strokeStyle = 'rgba(40,28,18,0.9)'
  ctx.lineWidth = 2.4 * s
  ctx.beginPath()
  ctx.moveTo(0, -8 * s)
  ctx.lineTo(0, -46 * s)
  ctx.stroke()
  const wave = Math.sin(time * 5) * 2 * s
  ctx.fillStyle = lives > 6 ? '#5EE08A' : lives > 3 ? '#FFB347' : '#FF4D5E'
  ctx.beginPath()
  ctx.moveTo(0, -46 * s)
  ctx.lineTo(18 * s + wave, -42 * s)
  ctx.lineTo(0, -34 * s)
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
