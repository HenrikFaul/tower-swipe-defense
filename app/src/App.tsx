import { useGameStore } from './store/gameStore'
import MainMenu from './screens/MainMenu'
import PlayScreen from './screens/PlayScreen'
import UpgradesScreen from './screens/UpgradesScreen'
import DailyChallengeScreen from './screens/DailyChallengeScreen'
import LeaderboardScreen from './screens/LeaderboardScreen'
import SettingsScreen from './screens/SettingsScreen'

export default function App() {
  const screen = useGameStore((s) => s.screen)
  return (
    <div className="app-frame">
      {screen === 'menu' && <MainMenu />}
      {screen === 'play' && <PlayScreen />}
      {screen === 'upgrades' && <UpgradesScreen />}
      {screen === 'daily' && <DailyChallengeScreen />}
      {screen === 'leaderboard' && <LeaderboardScreen />}
      {screen === 'settings' && <SettingsScreen />}
    </div>
  )
}
