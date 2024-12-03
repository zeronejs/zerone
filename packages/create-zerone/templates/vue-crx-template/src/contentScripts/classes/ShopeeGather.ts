import type { PlatformGatherInterface } from './PlatformInterface';

// shopee
export class ShopeeGather implements PlatformGatherInterface {
  isDetails() {
    return ['shopee', '?sp_atk'].every(keyword => location.href.includes(keyword)) || location.href.includes('/product/');
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
