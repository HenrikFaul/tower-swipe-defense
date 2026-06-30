import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Tower Swipe Defense — web build is wrapped by Capacitor for Android.
// Relative base so the bundle works from the file:// / capacitor:// origin.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    host: true,
    port: 5173,
  },
})
