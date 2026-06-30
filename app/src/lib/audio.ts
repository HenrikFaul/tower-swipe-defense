// Lightweight WebAudio synth — no asset files (keeps the APK tiny and
// avoids missing-bundle risk). Covers the AI_PROMPT.md §3.8 sprite set:
// shoot, hit, crit, enemy_dead, wave_clear, boss_intro, lose, win, ui_tap.

type SfxName =
  | 'shoot'
  | 'hit'
  | 'crit'
  | 'enemy_dead'
  | 'wave_clear'
  | 'boss_intro'
  | 'lose'
  | 'win'
  | 'ui_tap'

let ctx: AudioContext | null = null
let enabled = true

function ac(): AudioContext | null {
  if (!enabled) return null
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function setAudioEnabled(on: boolean) {
  enabled = on
}

function tone(
  freq: number,
  dur: number,
  type: OscillatorType,
  gain: number,
  slideTo?: number,
) {
  const a = ac()
  if (!a) return
  const t = a.currentTime
  const osc = a.createOscillator()
  const g = a.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g)
  g.connect(a.destination)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

export function playSfx(name: SfxName) {
  switch (name) {
    case 'shoot':
      tone(420, 0.12, 'triangle', 0.12, 240)
      break
    case 'hit':
      tone(180, 0.08, 'square', 0.10, 120)
      break
    case 'crit':
      tone(660, 0.16, 'sawtooth', 0.14, 320)
      break
    case 'enemy_dead':
      tone(300, 0.16, 'triangle', 0.12, 80)
      break
    case 'wave_clear':
      tone(523, 0.14, 'sine', 0.16)
      setTimeout(() => tone(784, 0.22, 'sine', 0.16), 110)
      break
    case 'boss_intro':
      tone(70, 0.7, 'sawtooth', 0.22, 50)
      setTimeout(() => tone(110, 0.5, 'square', 0.16, 70), 120)
      break
    case 'lose':
      tone(300, 0.5, 'sawtooth', 0.18, 70)
      break
    case 'win':
      tone(523, 0.14, 'sine', 0.18)
      setTimeout(() => tone(659, 0.14, 'sine', 0.18), 120)
      setTimeout(() => tone(880, 0.3, 'sine', 0.2), 240)
      break
    case 'ui_tap':
      tone(520, 0.05, 'sine', 0.08)
      break
  }
}
