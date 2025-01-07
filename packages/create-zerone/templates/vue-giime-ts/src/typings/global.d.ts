export {};
declare global {
  interface Window {
    webkitRequestAnimationFrame: any;
    mozRequestAnimationFrame: any;
  }

  // interface ImportMeta {}
}
