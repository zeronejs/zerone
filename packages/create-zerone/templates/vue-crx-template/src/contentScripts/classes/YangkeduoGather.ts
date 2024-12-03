import type { PlatformGatherInterface } from './PlatformInterface';

// 拼多多
export class YangkeduoGather implements PlatformGatherInterface {
  isDetails() {
    return location.href.includes('/goods.html') || location.href.includes('/goods1.html') || location.href.includes('/goods2.html');
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
