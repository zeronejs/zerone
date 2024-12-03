/**
 *
 * 如果你要尝试  在content script 中  加载远程代码，远程代码需要使用 chrome.runtime的方法时
 * 再考虑使用这个文件
 *
 */

// 定义一个用于生成唯一请求 ID 的函数
function generateRequestId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// 定义响应事件的细节接口
interface ResponseEventDetail {
  requestId: string;
  data: any;
}
function triggerCustomEvent(eventName: string, detail: object): void {
  const event = new CustomEvent(eventName, { detail });
  document.dispatchEvent(event);
}
type ChromeRuntimeProxy = {
  sendMessage: typeof chrome.runtime.sendMessage;
  getStorage: typeof chrome.storage.local.get;
};

// 创建一个模拟的 chrome.runtime 对象
export const chromeRuntimeProxy = new Proxy<ChromeRuntimeProxy>({} as any, {
  get(target, propKey: string) {
    return function (...args: any[]): Promise<any> {
      return new Promise((resolve, reject) => {
        const requestId = generateRequestId();

        // 监听响应事件
        function handleResponse(event: CustomEvent<ResponseEventDetail>) {
          if (event.detail.requestId === requestId) {
            document.removeEventListener(`${__NAME__}customRuntimeResponse`, handleResponse as EventListener);
            resolve(event.detail.data);
          }
        }

        document.addEventListener(`${__NAME__}customRuntimeResponse`, handleResponse as EventListener);

        // 触发自定义事件
        triggerCustomEvent(`${__NAME__}customRuntimeEvent`, {
          method: propKey,
          arguments: args,
          requestId,
        });
      });
    };
  },
});
