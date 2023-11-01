import { defineConfig } from 'vite';
import packageJson from '../package.json';
import { sharedConfig } from './sharedConfig';
import { port, r } from './utils';

// https://vitejs.dev/config/
export default defineConfig(env => {
  const isDev = env.mode === 'development';
  return {
    ...sharedConfig(env),
    define: {
      __DEV__: isDev,
      __NAME__: JSON.stringify(packageJson.name),
    },
    build: {
      watch: isDev ? {} : undefined,
      outDir: r('extension/dist'),
      emptyOutDir: false,
      sourcemap: isDev ? 'inline' : false,
      // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
      terserOptions: {
        mangle: false,
      },
      rollupOptions: {
        input: {
          options: r('src/options/index.html'),
          popup: r('src/popup/index.html'),
        },
      },
    },
    server: {
      port,
    },
    // server: {
    //   // 指定dev sever的端口号，默认为5173
    //   port: 3010,
    //   // 自动打开浏览器运行以下页面
    //   open: '/',
    //   // 设置反向代理
    //   proxy: {
    //     // 以下示例表示：请求URL中含有"/api"，则反向代理到http://localhost
    //     // 例如: http://localhost:3000/api/login -> http://localhost/api/login
    //     // 如果反向代理到localhost报错Error: connect ECONNREFUSED ::1:80，
    //     // 则将localhost改127.0.0.1
    //     '/api': {
    //       target: 'http://127.0.0.1/',
    //       changeOrigin: true,
    //     },
    //   },
    // },
    // resolve: {
    //   alias: {
    //     '@': path.resolve(__dirname, '../', 'src'),
    //   },
    // },
    // plugins: [vue()],
  };
});
