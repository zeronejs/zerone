import type { PlatformGatherInterface } from './PlatformInterface';

// gigab2b
export class Gigab2bGather implements PlatformGatherInterface {
  isDetails() {
    return location.href.includes('detail.');
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
