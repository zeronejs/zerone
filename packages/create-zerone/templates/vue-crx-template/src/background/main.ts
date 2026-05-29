// ⚠️ 必须是第一个 import，把 @giime/api factory 切成 CRX 版（见 installCrxFirst.ts 注释）
import '@/installCrxFirst';
// 注册 giime 内置 6 个 API service（guardBasic / gstore / materialApi / productCenter / resource / shopAdmin）
// 到 CRX registry，contentScript 桥接时 background 才能找到对应实例。
// 只有 background 需要这一行；popup / options / contentScript 会通过 `import Giime from 'giime'`
// 自然加载这些 service，不用显式注册。
import '@giime/crx/register-giime-apis';
import { registerAxiosBridge, registerLoginCoordinator } from '@giime/crx';

// background 桥接监听器（contentScript 调接口走这里）
registerAxiosBridge();

// 登录协调器：开登录 tab + 监听 token cookie 变化 + 广播登录完成
registerLoginCoordinator();

// 自动加载 @/api 下所有 service 文件，让 createCrxAxios 把它们注册到 registry。
// 否则 contentScript 通过桥接调用某个 service 时，background 找不到对应实例，
// 会报 `service not registered: <id>`。
// 命名约定：每个 api 模块的入口文件叫 service.ts / serviceNext.ts / request.ts 之一。
import.meta.glob('@/api/**/{service,serviceNext,request}.ts', { eager: true });

if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client');
  // load latest content script
  import('./contentScriptHMR');
}

chrome.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed');
});

let previousTabId = 0;

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
chrome.tabs.onActivated.addListener(({ tabId }) => {
  if (!previousTabId) {
    previousTabId = tabId;

    return;
  }

  chrome.tabs.get(previousTabId, tab => {
    if (chrome.runtime.lastError) return;

    previousTabId = tabId;

    // eslint-disable-next-line no-console
    console.log('previous tab', tab);
    // chrome.tabs.sendMessage(tabId, { title: tab.title }, { frameId: 0 });
  });
});

// ============================================================
// 老的 apiList 监听器（已删除 apiList.ts，整段先注释保留作参考）
// ============================================================
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   const findApi = apiList.find(item => item.name === request.type);
//
//   if (findApi) {
//     findApi
//       .fn(...((request.params || []) as [any, any]))
//       .then(data => {
//         sendResponse(data);
//       })
//       .catch(e => sendResponse(e));
//
//     return true;
//   }
//
//   // if (message === 'get-current-tab') {
//   //   chrome.tabs.get(previousTabId, tab => {
//   //     if (chrome.runtime.lastError) {
//   //       sendResponse({ title: undefined });
//   //       return;
//   //     }
//   //
//   //     sendResponse({ title: tab?.title });
//   //   });
//   //
//   //   return true;
//   // }
// });
