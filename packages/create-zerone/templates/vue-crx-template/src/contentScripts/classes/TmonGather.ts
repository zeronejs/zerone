import type { PlatformGatherInterface } from './PlatformInterface';

// tmon
export class Ali88Gather implements PlatformGatherInterface {
  isDetails() {
    return location.href.includes('/deal/');
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
