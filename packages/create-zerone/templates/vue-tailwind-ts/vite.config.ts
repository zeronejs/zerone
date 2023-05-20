import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
const pathSrc = path.resolve(__dirname, 'src');

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const isBuild = command === 'build';
  return {
    resolve: {
      alias: {
        '@/': `${pathSrc}/`,
      },
    },
    plugins: [
      vue(),
      AutoImport({
        // Auto import functions from Vue, e.g. ref, reactive, toRef...
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ['vue'],

        // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        resolvers: [
          ElementPlusResolver(),

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
          ElementPlusResolver(),
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
        // https://cn.vitejs.dev/config/#server-proxy
        '/shop-api': {
          target: 'http://192.168.4.125:10086/gstore/',
          changeOrigin: true,
          rewrite: p => p.replace(/^\/shop-api/, ''),
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
        },
      },
    },
  };
});
