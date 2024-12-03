import type { PlatformGatherInterface } from './PlatformInterface';

// lazada
export class LazadaGather implements PlatformGatherInterface {
  isDetails() {
    return ['lazada', '/products/'].every(keyword => location.href.includes(keyword));
  }
  getParams() {
    const scriptList = Array.from(document.documentElement.querySelectorAll('script'));
    const body = scriptList.find(it => it.innerText.includes('window.rawData='));
    return {
      body: body?.innerText,
      url: location.href,
    };
  }
}
