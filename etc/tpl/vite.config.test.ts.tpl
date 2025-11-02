import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      extension: ['ts'],
      exclude: [
        'src/main.ts',
        'src/main.tsx',
        'vite.config.ts',
        'src/server/**',
        'src/mocks/**',
      ],
    },
  },
});
