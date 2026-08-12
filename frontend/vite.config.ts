import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const frontendRoot = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: resolve(frontendRoot, '../backend/src/main/resources/static'),
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
