import { defineConfig } from 'vite'

// Deployed to https://pardo.github.io/tetris/ via the docs/ folder.
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/tetris/' : '/',
  server: {
    // Allow tunneling through ngrok during local testing.
    allowedHosts: ['.ngrok-free.app', '.ngrok.app', '.ngrok.io']
  },
  build: {
    outDir: 'docs',
    emptyOutDir: true
  }
})
