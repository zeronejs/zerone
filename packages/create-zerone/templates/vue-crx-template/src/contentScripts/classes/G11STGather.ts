import type { PlatformGatherInterface } from './PlatformInterface';

// 11st
export class G11STGather implements PlatformGatherInterface {
  isDetails() {
    return location.href.includes('/products/');
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
