import type { PlatformGatherInterface } from './PlatformInterface';

// coupang
export class CoupangGather implements PlatformGatherInterface {
  isDetails() {
    return location.href.includes("/products/");
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
