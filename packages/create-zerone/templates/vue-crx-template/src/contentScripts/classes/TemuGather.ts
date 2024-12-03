import type { PlatformGatherInterface } from './PlatformInterface';

// 拼多多国际版
export class TemuGather implements PlatformGatherInterface {
  isDetails() {
    const pattern = /-g-(\d+)\.html/;
    const match = location.href.match(pattern);
    return match != null;
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
