import { useGameStore } from './store/gameStore'
import HeroSplash from './screens/HeroSplash'
import MainMenuPro from './screens/MainMenuPro'
import PlayScreen from './screens/PlayScreen'
import SkillTreeUpgrades from './screens/SkillTreeUpgrades'
import DailyChallengeScreen from './screens/DailyChallengeScreen'
import DailyRewardsScreen from './screens/DailyRewardsScreen'
import LeaderboardScreen from './screens/LeaderboardScreen'
import SettingsScreen from './screens/SettingsScreen'
import ShopScreen from './screens/ShopScreen'
import WorldMapScreen from './screens/WorldMapScreen'
import BattlePassScreen from './screens/BattlePassScreen'

export default function App() {
  const screen = useGameStore((s) => s.screen)
  const go = useGameStore((s) => s.go)
  return (
    <div className="app-frame">
      {screen === 'splash' && <HeroSplash onStart={() => go('menu')} />}
      {screen === 'menu' && <MainMenuPro />}
      {screen === 'play' && <PlayScreen />}
      {screen === 'upgrades' && <SkillTreeUpgrades />}
      {screen === 'daily' && <DailyChallengeScreen />}
      {screen === 'rewards' && <DailyRewardsScreen />}
      {screen === 'leaderboard' && <LeaderboardScreen />}
      {screen === 'settings' && <SettingsScreen />}
      {screen === 'shop' && <ShopScreen />}
      {screen === 'worldmap' && <WorldMapScreen />}
      {screen === 'battlepass' && <BattlePassScreen />}
    </div>
  )
}
