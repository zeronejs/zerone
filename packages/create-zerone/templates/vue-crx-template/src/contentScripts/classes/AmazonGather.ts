import type { PlatformGatherInterface } from './PlatformInterface';

// 亚马逊
export class AmazonGather implements PlatformGatherInterface {
  isDetails() {
    return location.href.includes('/dp/') || location.href.includes('/gp/product/');
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
