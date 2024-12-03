import type { PlatformGatherInterface } from './PlatformInterface';

// musinsa
export class MusinsaGather implements PlatformGatherInterface {
  isDetails() {
    return location.href.includes("/goods/");
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
