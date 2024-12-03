import type { PlatformGatherInterface } from './PlatformInterface';

// auction
export class AuctionGather implements PlatformGatherInterface {
  isDetails() {
    return location.href.includes('/DetailView');
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
