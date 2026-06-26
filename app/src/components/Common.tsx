import type { ReactNode } from 'react'
import { useGameStore, type Screen } from '../store/gameStore'
import { playSfx } from '../lib/audio'
import { haptics } from '../lib/haptics'

export function CurrencyBar() {
  const coins = useGameStore((s) => s.meta.coins)
  const gems = useGameStore((s) => s.meta.gems)
  return (
    <div className="row gap">
      <span className="chip coin">🪙 {Math.floor(coins).toLocaleString()}</span>
      <span className="chip gem">💎 {gems.toLocaleString()}</span>
    </div>
  )
}

export function AppBar({ title, to = 'menu' }: { title: string; to?: Screen }) {
  const go = useGameStore((s) => s.go)
  return (
    <div className="appbar">
      <button
        className="icon-btn"
        aria-label="Back"
        onClick={() => {
          playSfx('ui_tap')
          haptics.light()
          go(to)
        }}
      >
        ‹
      </button>
      <h2 className="display">{title}</h2>
      <div style={{ marginLeft: 'auto' }}>
        <CurrencyBar />
      </div>
    </div>
  )
}

export function Tap({
  children,
  onClick,
  className = 'btn',
  disabled,
  ariaLabel,
}: {
  children: ReactNode
  onClick: () => void
  className?: string
  disabled?: boolean
  ariaLabel?: string
}) {
  return (
    <button
      className={className}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={() => {
        playSfx('ui_tap')
        haptics.light()
        onClick()
      }}
    >
      {children}
    </button>
  )
}
