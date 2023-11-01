/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_BASE_SHOP_API: string;
  readonly VITE_BASE_SHOP_WSAPI: string;
  // 更多环境变量...
}
declare const __DEV__: boolean;
/** Extension name, defined in packageJson.name */
declare const __NAME__: string;

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
