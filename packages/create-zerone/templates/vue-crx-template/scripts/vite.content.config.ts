import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import packageJson from '../package.json';
import { sharedConfig } from './sharedConfig';
import { setupContentScriptBootstrap } from './autoLoad';
import { r } from './utils';
// https://vitejs.dev/config/
export default defineConfig(env => {
  const isDev = env.mode === 'development';
  const loadedEnv = loadEnv(env.mode, path.resolve(__dirname, '..'));
  const __TIME__ = String(Date.now());
  const __VERSION__ = packageJson.version;
  return {
    ...sharedConfig(env, [
      {
        name: 'replace-plugin',
        transform(code, id) {
          if (
            id.endsWith('element-plus/dist/index.css') ||
            id.endsWith('giime/theme-chalk/element/index.scss') ||
            id.endsWith('giime/theme-chalk/index.css') ||
            id.endsWith('giime/dist/index.css')
          ) {
            return code.replaceAll(':root', ':host');
          }
        },
      },
      {
        name: 'get-hash-plugin',
        writeBundle(options, bundle) {
          setupContentScriptBootstrap(Object.keys(bundle), loadedEnv, {
            version: __VERSION__,
            name: packageJson.name,
          });
        },
      },
    ]),
    define: {
      __DEV__: isDev,
      __NAME__: JSON.stringify(packageJson.name),
      __DISPLAY_NAME__: JSON.stringify(packageJson.displayName),
      __ENV__: JSON.stringify(loadedEnv),
      // build日期
      __TIME__,
      // 更新版本号
      __VERSION__: JSON.stringify(__VERSION__),
      // https://github.com/vitejs/vite/issues/9320
      // https://github.com/vitejs/vite/issues/9186
      'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
    },
    build: {
      watch: isDev ? {} : undefined,
      // minify: false,
      outDir: r('extension/dist/contentScripts'),
      cssCodeSplit: false,
      emptyOutDir: false,
      sourcemap: false,
      lib: {
        entry: r('src/contentScripts/index.ts'),
        name: packageJson.name,
        formats: ['iife'],
        cssFileName:'style'
      },
      rollupOptions: {
        output: {
          entryFileNames: 'index.global.js',
          extend: true,
        },
      },
    },
  };
});
