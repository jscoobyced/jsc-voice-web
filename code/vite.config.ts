/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['setup.ts'],
    coverage: {
      include: ['src/**/*.ts', 'src/**/*.tsx'],
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
