/// <reference types="vite/client" />

declare module 'virtual:svg-icons-register' {
  const component: any;

  export default component;
}
declare module 'virtual:svg-icons-names' {
  const iconsNames: string[];

  export default iconsNames;
}
interface ImportMetaEnv {
  readonly VITE_BASE_SHOP_API: string;
  readonly VITE_BASE_SHOP_WSAPI: string;
  // 更多环境变量...
}
declare const __APP_BUILD_TIME__: number;
