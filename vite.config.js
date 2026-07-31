import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base = '/vinyl-app/' pentru GitHub Pages (https://anapascu-08.github.io/vinyl-app/)
export default defineConfig({
  plugins: [react()],
  base: '/vinyl-app/',
  test: {
    environment: 'node',
  },
})
