import { defineConfig } from 'vite';
import packageJson from '../package.json';
import { sharedConfig } from './sharedConfig';
import { r } from './utils';
// https://vitejs.dev/config/
export default defineConfig(env => {
  const isDev = env.mode === 'development';
  return {
    ...sharedConfig(env, [
      {
        name: 'replace-plugin',
        transform(code, id) {
          if (id.endsWith('element-plus/dist/index.css')) {
            return code.replaceAll(':root', ':host');
          }
        },
      },
    ]),
    define: {
      __DEV__: isDev,
      __NAME__: JSON.stringify(packageJson.name),
      // https://github.com/vitejs/vite/issues/9320
      // https://github.com/vitejs/vite/issues/9186
      'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
    },
    build: {
      watch: isDev ? {} : undefined,
      outDir: r('extension/dist/contentScripts'),
      cssCodeSplit: false,
      emptyOutDir: false,
      sourcemap: isDev ? 'inline' : false,
      lib: {
        entry: r('src/contentScripts/index.ts'),
        name: packageJson.name,
        formats: ['iife'],
      },
      rollupOptions: {
        output: {
          entryFileNames: 'index.global.js',
          extend: true,
        },
      },
    },
    // resolve: {
    //   alias: {
    //     '@': path.resolve(__dirname, '../', 'src'),
    //   },
    // },
    // 解决代码中包含process.env.NODE_ENV导致无法使用的问题
    // define: {
    //   'process.env.NODE_ENV': null,
    // },
    // plugins: [vue()],
  };
});
