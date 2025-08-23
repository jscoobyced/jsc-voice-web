import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      exclude: [...configDefaults.exclude, 'src/**/*.tsx'],
      coverage: {
        exclude: [...configDefaults.coverage.exclude!],
      },
    },
  }),
)
