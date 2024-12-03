import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import packageJson from '../package.json';
import { sharedConfig } from './sharedConfig';
import { r } from './utils';
import { setupBackgroundBootstrap } from './autoLoad';
import { writeManifest } from './manifest';

// https://vitejs.dev/config/
export default defineConfig(env => {
  const isDev = env.mode === 'development';
  // console.log(env);
  // console.log(process.env.VITE_BASE_SHOP_API);
  // console.log(loadEnv(env.mode, path.resolve(__dirname, '..')));
  const shared = sharedConfig(env);
  const loadedEnv = loadEnv(env.mode, path.resolve(__dirname, '..'));
  // setupBackgroundBootstrap(loadedEnv);
  // writeManifest(loadedEnv);
  return {
    ...shared,
    // plugins: [
    //   ...(shared.plugins || []),
    //   {
    //     name: 'get-hash-plugin',
    //     generateBundle(options, bundle) {
    //       setupBackgroundBootstrap(Object.keys(bundle), loadedEnv);
    //     },
    //   },
    // ],
    define: {
      __DEV__: isDev,
      __NAME__: JSON.stringify(packageJson.name),
      __ENV__: JSON.stringify(loadEnv(env.mode, path.resolve(__dirname, '..'))),
      // https://github.com/vitejs/vite/issues/9320
      // https://github.com/vitejs/vite/issues/9186
      'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
    },

    build: {
      watch: isDev ? {} : undefined,
      outDir: r('extension/dist/background'),
      cssCodeSplit: false,
      emptyOutDir: false,
      // sourcemap: isDev ? 'inline' : false,
      sourcemap: false,
      rollupOptions: {
        output: {
          entryFileNames: 'index.mjs',
          extend: true,
        },
      },
      lib: {
        entry: r('src/background/main.ts'),
        name: packageJson.name,
        formats: ['iife'],
      },
      // rollupOptions: {
      //   output: {
      //     //  生产环境 build成es5
      //     entryFileNames: 'index[hash].mjs',
      //     format: 'es',
      //     plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'], allowAllFormats: true })],
      //     extend: true,
      //   },
      // },
    },
  };
});
