import type { PlatformGatherInterface } from './PlatformInterface';

// 速卖通
export class AliexpressGather implements PlatformGatherInterface {
  isDetails() {
    const itemHrefRegExp = /\/item\/[0-9]*\.html/;
    return itemHrefRegExp.test(location.href);
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
