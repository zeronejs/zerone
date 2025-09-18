// import { chromeRuntimeProxy } from './chromeRuntime';
import { contentScriptsMessage } from '@/utils/contentScriptsMessage';

interface ChromeApiListItem {
  name: string;
  fn: (...args: any[]) => any;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createChromeRuntimeSendMessage = <ApiList extends Readonly<Array<ChromeApiListItem>>>(apiList: ApiList) => {
  // 提取 API 元素类型
  type ApiElement = ApiList[number];
  // 创建一个映射类型，将 name 映射到相应的函数类型
  type ApiMap = {
    [K in ApiElement['name']]: Extract<ApiElement, { name: K }>['fn'];
  };

  /**
   * 发送请求
   * @param message
   * @returns
   */
  const chromeRuntimeSendMessage = async <T extends ApiElement['name']>(
    type: T,
    ...params: Parameters<ApiMap[T]>
  ): Promise<ReturnType<ApiMap[T]>> => {
    const data = await chrome.runtime.sendMessage({
      // const data = await chromeRuntimeProxy.sendMessage({
      type,
      params,
    });

    return responseInterceptors(data);
  };
  /**响应拦截器 */
  const responseInterceptors = (response: any): any => {
    if (response.data) {
      if (response.config.url?.includes('/adreport')) return response;
      // 对响应数据做点什么
      const res = response.data;

      if (res.code == 401) {
        contentScriptsMessage({
          type: 'error',
          message: '登录失效，请重新登录',
        });

        return response;
      } else if (res.code != 0 && res.code != 401) {
        contentScriptsMessage({
          message: res.comment ?? res.message,
          type: 'error',
          duration: 8 * 1000,
          showClose: true,
        });
      }

      return response;
    } else {
      let message: string;

      if (response?.status === 401 && !response.message.includes('timeout')) {
        contentScriptsMessage({
          type: 'error',
          message: '登录失效，请重新登录',
        });
        throw Promise.reject(response);
      } else if (response?.data?.message) {
        message = response?.data?.message;
      } else {
        message = response.message.includes('timeout') ? '请求超时' : response.message;
      }
      // 对响应错误做点什么
      contentScriptsMessage({
        message,
        type: 'error',
        showClose: true,
        duration: 8 * 1000,
      });
      throw Promise.reject(response);
    }
  };

  return {
    chromeRuntimeSendMessage,
  };
};
