import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.towerswipe.defense',
  appName: 'Tower Swipe Defense',
  webDir: 'dist',
  backgroundColor: '#0E1B1E',
  android: {
    backgroundColor: '#0E1B1E',
    allowMixedContent: false,
  },
  server: {
    androidScheme: 'https',
  },
}

export default config
