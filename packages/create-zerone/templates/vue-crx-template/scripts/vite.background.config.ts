import { defineConfig } from 'vite';
import packageJson from '../package.json';
import { sharedConfig } from './sharedConfig';
import { r } from './utils';

// https://vitejs.dev/config/
export default defineConfig(env => {
  const isDev = env.mode === 'development';
  return {
    ...sharedConfig(env),
    define: {
      __DEV__: isDev,
      __NAME__: JSON.stringify(packageJson.name),
      // https://github.com/vitejs/vite/issues/9320
      // https://github.com/vitejs/vite/issues/9186
      'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
    },

    build: {
      watch: isDev ? {} : undefined,
      outDir: r('extension/dist/background'),
      cssCodeSplit: false,
      emptyOutDir: false,
      sourcemap: isDev ? 'inline' : false,
      lib: {
        entry: r('src/background/main.ts'),
        name: packageJson.name,
        formats: ['iife'],
      },
      rollupOptions: {
        output: {
          entryFileNames: 'index.mjs',
          extend: true,
        },
      },
    },
  };
});
