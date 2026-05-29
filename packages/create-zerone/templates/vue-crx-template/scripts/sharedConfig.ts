import path, { dirname, relative } from 'path';
import vue from '@vitejs/plugin-vue';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { GiimeResolver } from 'giime';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { crxAxiosIdPlugin } from '@giime/crx/vite-plugin';
import { r } from './utils';
import type { ConfigEnv, PluginOption, UserConfig } from 'vite';

const pathSrc = path.resolve(__dirname, '../', 'src');

export const sharedConfig = (env: ConfigEnv, PluginOptions: PluginOption[] = []): UserConfig => {
  const isBuild = env.command === 'build';

  return {
    root: r('src'),
    // .env* 文件都放在项目根目录而不是 src/，必须显式告诉 vite，
    // 否则 import.meta.env.VITE_* 在所有 entry 里都是 undefined
    envDir: r(),
    resolve: {
      alias: {
        '@/': `${pathSrc}/`,
      },
    },

    plugins: [
      // 给所有 createCrxAxios({...}) 注入基于源文件路径的 __id__
      // 必须放在最前面，确保拿到的是原始源码
      crxAxiosIdPlugin(),
      vue(),
      //   splitVendorChunkPlugin(),
      AutoImport({
        // Auto import functions from Vue, e.g. ref, reactive, toRef...
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ['vue'],

        // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        resolvers: [
          GiimeResolver(),
          // ElementPlusResolver(),

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
      // rewrite assets to use relative path
      {
        name: 'assets-rewrite',
        enforce: 'post',
        apply: 'build',
        transformIndexHtml(html, { path }) {
          return html.replace(/"\/assets\//g, `"${relative(dirname(path), '/assets')}/`);
        },
      },
      ...PluginOptions,
    ],
    optimizeDeps: {
      include: ['vue'],
    },
  };
};
