/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_BASE_SHOP_API: string;
  readonly VITE_BASE_SHOP_WSAPI: string;
  // 更多环境变量...
}
declare const __DEV__: boolean;
/** Extension name, defined in packageJson.name */
declare const __NAME__: string;
declare const __DISPLAY_NAME__: string;

declare const __ENV__: Record<string, any>;
/**build日期 */
declare const __TIME__: string;
/**更新版本号 */
declare const __VERSION__: string;

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  // eslint-disable-next-line @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;

  export default component;
}
