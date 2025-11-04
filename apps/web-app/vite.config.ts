/// <reference types='vitest' />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/web-app',
  server: {
    port: 4200,
    host: 'localhost'
  },
  preview: {
    port: 4200,
    host: 'localhost'
  },

  plugins: [
    tailwindcss(),
    react(),
    cloudflare(),
    tsconfigPaths()
  ],

  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
}))
