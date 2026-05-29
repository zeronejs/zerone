export {};
// declare module 'vue' {
//   interface ComponentCustomProperties {}
// }

declare global {
  interface Window {
    webkitRequestAnimationFrame: any;
    mozRequestAnimationFrame: any;
  }

  // interface ImportMeta {}
}
