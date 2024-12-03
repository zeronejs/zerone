import type { PlatformGatherInterface } from './PlatformInterface';

// mercadolibre
export class MercadolibreGather implements PlatformGatherInterface {
  isDetails() {
    return location.href.includes('articulo');
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
