import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { AppBar } from '../components/Common'

type Tab = 'alltime' | 'daily'

// Local leaderboard from this device's runs. When Supabase is configured
// (see lib/cloud.ts) these are also pushed to the cloud leaderboard.
export default function LeaderboardScreen() {
  const runs = useGameStore((s) => s.runs)
  const meta = useGameStore((s) => s.meta)
  const [tab, setTab] = useState<Tab>('alltime')

  const filtered = runs
    .filter((r) => (tab === 'daily' ? r.mode === 'daily' : true))
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)

  return (
    <div className="screen">
      <AppBar title="Leaderboard" />
      <div className="tabs" style={{ marginBottom: 12 }}>
        <div className={'tab' + (tab === 'alltime' ? ' active' : '')} onClick={() => setTab('alltime')}>
          All-Time
        </div>
        <div className={'tab' + (tab === 'daily' ? ' active' : '')} onClick={() => setTab('daily')}>
          Daily
        </div>
      </div>

      <div className="panel row spread pad" style={{ margin: '0 16px 12px' }}>
        <div className="col">
          <span className="muted">Best wave</span>
          <strong className="display" style={{ fontSize: 22 }}>
            {meta.bestWave}
          </strong>
        </div>
        <div className="col" style={{ textAlign: 'right' }}>
          <span className="muted">Best score</span>
          <strong className="display" style={{ fontSize: 22 }}>
            {meta.bestScore.toLocaleString()}
          </strong>
        </div>
      </div>

      <div className="scroll col gap pad" style={{ paddingTop: 0 }}>
        {filtered.length === 0 && <p className="muted center">No runs yet. Go defend your tower!</p>}
        {filtered.map((r, i) => (
          <div key={i} className="li">
            <span className="ic" style={{ color: i < 3 ? 'var(--accent-2)' : 'var(--text-dim)' }}>
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
            </span>
            <div className="col" style={{ flex: 1 }}>
              <strong>Wave {r.wave}</strong>
              <span className="muted">
                {r.mode === 'daily' ? 'Daily · ' : ''}
                {new Date(r.date).toLocaleDateString()}
              </span>
            </div>
            <span className="chip">🏆 {r.score.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
