/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      extension: ['ts'],
      exclude: ['src/main.ts', 'vite.config.ts'],
    },
  },
});
