// import { apiRequest } from '@/api'
// manifest.json的Permissions配置需添加declarativeContent权限
chrome.runtime.onInstalled.addListener(() => {
  // 默认先禁止Page Action。如果不加这一句，则无法生效下面的规则
  chrome.action.disable();
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    // 设置规则
    const rule = {
      // 运行插件运行的页面URL规则
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {
            // 适配所有域名以“www.”开头的网页
            // hostPrefix: 'www.'
            // 适配所有域名以“.element-plus.org”结尾的网页
            // hostSuffix: '.element-plus.org',
            // 适配域名为“element-plus.org”的网页
            hostEquals: 'element-plus.org',
            // 适配https协议的网页
            // schemes: ['https'],
          },
        }),
      ],
      actions: [new chrome.declarativeContent.ShowAction()],
    };
    // 整合所有规则
    const rules = [rule];
    // 执行规则
    chrome.declarativeContent.onPageChanged.addRules(rules);
  });
});

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   // 接收来自content script的消息，requset里不允许传递function和file类型的参数
//   chrome.tabs.query({ currentWindow: true, active: true }, tabs => {});
//   return true;
// });
