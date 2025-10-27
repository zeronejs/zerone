export {};
declare global {
  interface Window {
    webkitRequestAnimationFrame: any;
    mozRequestAnimationFrame: any;
  }

  interface VitePluginRuntimeKeys {
    VITE_DEV_SERVER_URL: `${string}_VITE_DEV_SERVER_URL`;
    VITE_NAME: `${string}_VITE_NAME`;
  }

  // interface ImportMeta {}
}
