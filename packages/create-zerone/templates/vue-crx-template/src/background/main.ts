// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

chrome.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
})

let previousTabId = 0

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
chrome.tabs.onActivated.addListener(({ tabId }) => {
  if (!previousTabId) {
    previousTabId = tabId
    return
  }

  chrome.tabs.get(previousTabId, (tab) => {
    if (chrome.runtime.lastError)
      return

    previousTabId = tabId

    // eslint-disable-next-line no-console
    console.log('previous tab', tab)
    chrome.tabs.sendMessage(tabId, { title: tab.title }, { frameId: 0 })
  })
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'get-current-tab') {
    chrome.tabs.get(previousTabId, (tab) => {
      if (chrome.runtime.lastError) {
        sendResponse({ title: undefined })
        return
      }

      sendResponse({ title: tab?.title })
    })

    return true
  }
})
