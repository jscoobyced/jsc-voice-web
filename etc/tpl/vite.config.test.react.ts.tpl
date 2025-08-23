/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      extension: ['ts', 'tsx'],
      exclude: ['src/main.ts', 'src/main.tsx', 'vite.config.ts'],
    },
  },
});
