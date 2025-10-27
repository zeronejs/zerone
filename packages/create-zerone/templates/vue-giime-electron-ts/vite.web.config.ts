import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
// import vueJsx from '@vitejs/plugin-vue-jsx';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { GiimeResolver, bypass, giimeDevProxyFn } from 'giime';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

const pathSrc = path.resolve(__dirname, 'src');

// https://vitejs.dev/config/

export default defineConfig(({ mode, command }) => {
  const isBuild = command === 'build';

  const env = loadEnv(mode, process.cwd(), '');

  const base = env.VITE_BASE_CDN_URL || env.VITE_BASE_URL || '/';

  return {
    base,
    define: {
      __APP_BUILD_TIME__: String(Date.now()),
      __APP_ROUTER_HASH_History: 'false',
    },
    resolve: {
      alias: {
        '@/': `${pathSrc}/`,
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            elementPlus: ['element-plus'],
            giime: ['giime'],
          },
        },
      },
    },
    plugins: [
      vue(),
      // vueJsx(),
      AutoImport({
        // Auto import functions from Vue, e.g. ref, reactive, toRef...
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ['vue'],

        // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        resolvers: [
          GiimeResolver(),
          // ElementPlusResolver({ importStyle: false }),

          // Auto import icon components
          // 自动导入图标组件
          IconsResolver({
            prefix: 'Icon',
          }),
        ],

        dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
      }),

      Components({
        resolvers: [
          // Auto register icon components
          // 自动注册图标组件
          IconsResolver({
            enabledCollections: ['ep'],
          }),
          // Auto register Element Plus components
          // 自动导入 Element Plus 组件
          // ElementPlusResolver(),
        ],

        dts: path.resolve(pathSrc, 'components.d.ts'),
      }),

      Icons({
        autoInstall: true,
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
        symbolId: 'icon-[dir]-[name]',
        svgoOptions: isBuild,
      }),
    ],
    server: {
      host: '0.0.0.0',
      proxy: {
        ...giimeDevProxyFn(env),
        // https://cn.vitejs.dev/config/#server-proxy
        '/shop-api': {
          target: 'https://manage-dev.giikin.cn/guard/',
          changeOrigin: true,
          rewrite: p => p.replace(/^\/shop-api/, ''),
          bypass,
        },
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 6061,
      proxy: {
        // https://cn.vitejs.dev/config/#server-proxy
        '/test-api': {
          target: 'http://192.168.4.125:10086/gstore/',
          changeOrigin: true,
          rewrite: p => p.replace(/^\/test-api/, ''),
          bypass,
        },
      },
    },
  };
});
