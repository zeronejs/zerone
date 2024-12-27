import { fileURLToPath } from 'node:url';
import { configDefaults, coverageConfigDefaults, defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default defineConfig(configEnv =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      test: {
        environment: 'jsdom',
        coverage: {
          provider: 'istanbul', // or 'v8'
          include: ['src/**'],
          exclude: [...coverageConfigDefaults.exclude],
        },
        exclude: [...configDefaults.exclude, 'e2e/**'],
        root: fileURLToPath(new URL('./', import.meta.url)),
      },
    }),
  ),
);
