import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { AppBar, Tap } from '../components/Common'
import type { Settings } from '../lib/storage'

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <div className={'toggle' + (on ? ' on' : '')} onClick={onClick} role="switch" aria-checked={on}>
      <span />
    </div>
  )
}

export default function SettingsScreen() {
  const settings = useGameStore((s) => s.settings)
  const setSetting = useGameStore((s) => s.setSetting)
  const meta = useGameStore((s) => s.meta)
  const buyNoAds = useGameStore((s) => s.buyNoAds)
  const grantDailySpin = useGameStore((s) => s.grantDailySpin)
  const [spin, setSpin] = useState<number | null>(null)

  const rows: { key: keyof Settings; label: string; desc: string }[] = [
    { key: 'sound', label: 'Sound', desc: 'Combat & UI audio' },
    { key: 'haptics', label: 'Haptics', desc: 'Vibration feedback' },
    { key: 'autoFire', label: 'Auto-Fire', desc: 'Hold to auto-shoot at your aim' },
    { key: 'reducedMotion', label: 'Reduced Motion', desc: 'Fewer particles & effects' },
  ]

  return (
    <div className="screen">
      <AppBar title="Settings" />
      <div className="scroll col gap pad">
        <div className="panel col gap">
          {rows.map((r) => (
            <div key={r.key} className="row spread">
              <div className="col">
                <strong>{r.label}</strong>
                <span className="muted">{r.desc}</span>
              </div>
              <Toggle on={settings[r.key]} onClick={() => setSetting(r.key, !settings[r.key])} />
            </div>
          ))}
        </div>

        <div className="panel col gap">
          <strong className="display">Shop</strong>
          <div className="row spread">
            <span className="muted">Remove interstitial ads</span>
            <Tap className="btn" disabled={meta.noAds} onClick={buyNoAds}>
              {meta.noAds ? 'OWNED' : '$3.99'}
            </Tap>
          </div>
          <div className="row spread">
            <span className="muted">Daily free coin spin</span>
            <Tap
              className="btn secondary"
              onClick={() => setSpin(grantDailySpin())}
            >
              🎁 Spin
            </Tap>
          </div>
          {spin !== null && <div className="center" style={{ color: 'var(--coin)' }}>+{spin} coins!</div>}
        </div>

        <div className="panel col gap">
          <strong className="display">Account</strong>
          <span className="muted">Total runs: {meta.totalRuns}</span>
          <span className="muted">Player ID: local-{(meta.totalRuns * 7 + 1000).toString(36)}</span>
          <p className="muted" style={{ fontSize: 11 }}>
            Tower Swipe Defense v1.0.0 · No personal data leaves your device unless cloud sync is
            enabled. GDPR delete = clear app data.
          </p>
        </div>
      </div>
    </div>
  )
}
