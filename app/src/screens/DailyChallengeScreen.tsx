import { useGameStore } from '../store/gameStore'
import { AppBar, Tap } from '../components/Common'
import { dailySeed, todayKey } from '../lib/rng'

const FLAVORS = [
  'The Quaking Mage wants to topple your tower today. Will you survive?',
  'A horde marches under a blood moon. Hold the line!',
  'Runners flood the field at dawn. Reflexes decide everything.',
  'The Dragon stirs. Today rewards the bold.',
  'Tanks roll in formation. Pierce their armor!',
]

export default function DailyChallengeScreen() {
  const startRun = useGameStore((s) => s.startRun)
  const meta = useGameStore((s) => s.meta)
  const seed = dailySeed()
  const flavor = FLAVORS[seed % FLAVORS.length]
  const playedToday = meta.lastDailyDate === todayKey()

  return (
    <div className="screen">
      <AppBar title="Daily Challenge" />
      <div className="scroll col gap pad">
        <div className="panel center col gap">
          <div className="tag">{todayKey()}</div>
          <div style={{ fontSize: 48 }}>📅</div>
          <h3 className="display" style={{ margin: 0 }}>
            Seed #{seed.toString(16).slice(0, 6).toUpperCase()}
          </h3>
          <p className="muted" style={{ margin: 0 }}>
            {flavor}
          </p>
          <p className="muted" style={{ margin: 0 }}>
            Everyone plays the exact same run today. Climb the daily leaderboard!
          </p>
        </div>

        <div className="panel row spread">
          <div className="col">
            <span className="muted">Your best today</span>
            <strong className="display" style={{ fontSize: 20 }}>
              {playedToday ? `Wave ${meta.dailyBestWave}` : 'Not played'}
            </strong>
          </div>
          <span className="chip gem">Reward 💎 + shard</span>
        </div>

        <Tap className="btn full" onClick={() => startRun({ mode: 'daily', seed })}>
          ▶ PLAY DAILY
        </Tap>
      </div>
    </div>
  )
}
