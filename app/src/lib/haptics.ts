// Haptic feedback (AI_PROMPT.md §1.5). Uses the Capacitor Haptics plugin
// when running natively, falling back to the web Vibration API otherwise.
let enabled = true

export function setHapticsEnabled(on: boolean) {
  enabled = on
}

function vibrate(ms: number) {
  if (!enabled) return
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(ms)
    }
  } catch {
    /* no-op */
  }
}

export const haptics = {
  light: () => vibrate(8),
  medium: () => vibrate(18),
  heavy: () => vibrate(35),
  success: () => vibrate([0, 20, 40, 20] as unknown as number),
}
