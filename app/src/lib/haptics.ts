// Haptic feedback (AI_PROMPT.md §1.5). Uses the web Vibration API, which works
// inside the Android System WebView (the app declares android.permission.VIBRATE).
// Swap in @capacitor/haptics here if richer native patterns are needed.
let enabled = true

export function setHapticsEnabled(on: boolean) {
  enabled = on
}

function vibrate(pattern: number | number[]) {
  if (!enabled) return
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  } catch {
    /* no-op */
  }
}

export const haptics = {
  light: () => vibrate(8),
  medium: () => vibrate(18),
  heavy: () => vibrate(35),
  success: () => vibrate([0, 20, 40, 20]),
}
