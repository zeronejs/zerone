import type { PlatformGatherInterface } from './PlatformInterface';

// 1688
export class Ali88Gather implements PlatformGatherInterface {
  isDetails() {
    return location.href.includes('detail.');
  }
  isList() {
    return false;
  }
  getList() {
    return [];
  }
  getAllItemUrl() {
    return [];
  }
  isAll() {
    return true;
  }
  isAllItemUrl(): boolean {
    return true;
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
