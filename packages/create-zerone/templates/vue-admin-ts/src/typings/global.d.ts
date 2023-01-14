export {};
declare global {
    interface Window {
        webkitRequestAnimationFrame: any;
        mozRequestAnimationFrame: any;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    // interface ImportMeta {}
}
