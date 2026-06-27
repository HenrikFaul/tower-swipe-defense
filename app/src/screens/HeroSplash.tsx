import { useEffect, useState } from 'react'
import { assetUrl, UI, preloadGameAssets } from '../lib/assets'

interface HeroSplashProps {
  onStart: () => void
}

// Full-bleed production splash art (logo + tagline are baked into the JPG).
// Doubles as the asset-preload gate so gameplay sprites are ready on first play.
export default function HeroSplash({ onStart }: HeroSplashProps) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let alive = true
    preloadGameAssets().then(() => {
      if (alive) setLoaded(true)
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <div
      className="screen"
      onClick={() => loaded && onStart()}
      style={{
        padding: 0,
        cursor: loaded ? 'pointer' : 'default',
        backgroundImage: `url(${assetUrl(UI.splash)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#0b0518',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          marginBottom: 'calc(env(safe-area-inset-bottom) + 7%)',
          textAlign: 'center',
          width: '100%',
        }}
      >
        {loaded ? (
          <div className="tap-start">TAP TO START</div>
        ) : (
          <div className="tap-loading">
            <span className="tap-spinner" /> Loading…
          </div>
        )}
      </div>
    </div>
  )
}
