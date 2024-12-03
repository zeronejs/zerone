import type { PlatformGatherInterface } from './PlatformInterface';

// gmk
export class GmarketGather implements PlatformGatherInterface {
  isDetails() {
    return location.href.includes('/Item');
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
