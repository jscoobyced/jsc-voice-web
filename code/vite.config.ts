/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['setup.ts'],
    coverage: {
      extension: ['ts', 'tsx'],
      exclude: [
        'src/main.ts',
        'src/main.tsx',
        'vite.config.ts',
        'src/server/**',
        'src/mocks/**',
      ],
    },
  },
})
