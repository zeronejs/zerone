import { ElMessage, MessageProps } from 'element-plus';
import type { MessageParams } from 'element-plus';
import type { AxiosResponse } from 'axios';
import type { AppContext } from 'vue';
import { root } from '@/contentScripts';
/**
 * 发送请求
 * @param message
 * @returns
 */
export const gassChromeRuntimeSendMessage = async <M = any, R = any>(message: M) => {
  const data = await chrome.runtime.sendMessage(message);
  return responseInterceptors<R>(data);
};
/**响应拦截器 */
export const responseInterceptors = <T>(response: any): AxiosResponse<T, any> => {
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
    } else if (res.code != 200 && res.code != 401) {
      contentScriptsMessage({
        message: res.comment ?? res.message,
        type: 'error',
        duration: 5 * 1000,
      });
    }
    return response;
  } else {
    let message: string;
    if (response?.response?.status === 401 && !response.message.includes('timeout')) {
      contentScriptsMessage({
        type: 'error',
        message: '登录失效，请重新登录',
      });
      throw Promise.reject(response);
    } else if (response.response?.data?.message) {
      message = response.response?.data?.message;
    } else {
      message = response.message.includes('timeout') ? '请求超时' : response.message;
    }
    // 对响应错误做点什么
    contentScriptsMessage({
      message,
      grouping: true,
      type: 'error',
      duration: 5 * 1000,
    });
    throw Promise.reject(response);
  }
};
export const contentScriptsMessage = (options: MessageParams, appContext?: null | AppContext) => {
  ElMessage({ appendTo: root as HTMLElement, ...(options as any) }, appContext);
};
