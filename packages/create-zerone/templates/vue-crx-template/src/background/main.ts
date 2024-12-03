// only on dev mode
import { apiList } from '@/api/apiList';
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const findApi = apiList.find(item => item.name === request.type);
  if (findApi) {
    findApi
      .fn(...((request.params || []) as [any, any]))
      .then(data => {
        sendResponse(data);
      })
      .catch(e => sendResponse(e));
    return true;
  }

  // if (message === 'get-current-tab') {
  //   chrome.tabs.get(previousTabId, tab => {
  //     if (chrome.runtime.lastError) {
  //       sendResponse({ title: undefined });
  //       return;
  //     }

  //     sendResponse({ title: tab?.title });
  //   });

  //   return true;
  // }
});
