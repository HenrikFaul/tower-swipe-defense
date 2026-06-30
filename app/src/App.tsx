import { useGameStore } from './store/gameStore'
import HeroSplash from './screens/HeroSplash'
import MainMenuPro from './screens/MainMenuPro'
import PlayScreen from './screens/PlayScreen'
import SkillTreeView from './screens/SkillTreeView'
import DailyChallengeScreen from './screens/DailyChallengeScreen'
import DailyRewardsPremium from './screens/DailyRewardsPremium'
import LeaderboardScreen from './screens/LeaderboardScreen'
import SettingsScreen from './screens/SettingsScreen'
import ShopPremium from './screens/ShopPremium'
import WorldMapScreen from './screens/WorldMapScreen'
import BattlePassPremium from './screens/BattlePassPremium'

export default function App() {
  const screen = useGameStore((s) => s.screen)
  const go = useGameStore((s) => s.go)
  return (
    <div className="app-frame">
      {screen === 'splash' && <HeroSplash onStart={() => go('menu')} />}
      {screen === 'menu' && <MainMenuPro />}
      {screen === 'play' && <PlayScreen />}
      {screen === 'upgrades' && <SkillTreeView onBack={() => go('menu')} />}
      {screen === 'daily' && <DailyChallengeScreen />}
      {screen === 'rewards' && <DailyRewardsPremium />}
      {screen === 'leaderboard' && <LeaderboardScreen />}
      {screen === 'settings' && <SettingsScreen />}
      {screen === 'shop' && <ShopPremium />}
      {screen === 'worldmap' && <WorldMapScreen />}
      {screen === 'battlepass' && <BattlePassPremium />}
    </div>
  )
}
