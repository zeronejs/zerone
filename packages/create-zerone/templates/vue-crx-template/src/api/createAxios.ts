import axios from 'axios';
import { ElMessage } from 'element-plus';
import { GmMessage, isNumber, responseErrorMessage } from 'giime';
import type { AxiosError, CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios';
export interface CreateAxiosConfig extends CreateAxiosDefaults {
  baseURL: string;
  /**服务器调用成功的code 一般是 0 或 200 */
  successCode: number;
}
export const createAxios = (
  config: CreateAxiosConfig,
  options?: {
    requestInterceptors?: (config: InternalAxiosRequestConfig<any>) => any;
  },
) => {
  const successCode = config.successCode ?? 0;
  const service = axios.create({
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 120_000,
    headers: {
      'content-type': 'application/json',
      Accept: '*/*',
    },
    withCredentials: false, // send cookies when cross-domain requests
    adapter: 'fetch',
    ...config,
  });

  // 请求拦截器
  service.interceptors.request.use(
    async config => {
      let _token = '';
      const cookies = await chrome.cookies.getAll({
        domain: '.giikin.com',
        // name: 'token',
      });
      _token = cookies.find(item => item.name === 'token')?.value ?? '';
      const _user = cookies.find(item => item.name === 'sso_user_id')?.value ?? '';

      if (!config.params) {
        config.params = {};
      }
      config.params._token = _token;
      config.params._user = _user;
      config.headers.Authorization = `Bearer ${_token}`;
      await options?.requestInterceptors?.(config);
      return config;
    },
    error => {
      console.error('请求错误', error); // for debug
      return Promise.reject(error);
    },
  );
  // 添加响应拦截器
  service.interceptors.response.use(
    async response => {
      // 对响应数据做点什么
      const res = response.data;
      if (!isNumber(res?.code)) {
        return response;
      }
      if (res.code === 401) {
        GmMessage.error('登录失效，请重新登录');
        return response;
      } else if (res.code !== successCode && res.errCode !== successCode) {
        ElMessage({
          message: res.comment ?? res.message ?? res.errMsg ?? res.msg,
          type: 'error',
          grouping: true,
          duration: 5 * 1000,
          showClose: true,
        });
      }
      return response;
    },
    async (err: AxiosError) => {
      console.error(err.config);
      if (err?.response?.status === 401 && !err.message.includes('timeout')) {
        GmMessage.error('登录失效，请重新登录');
        return;
      } else {
        // 对响应错误做点什么
        responseErrorMessage(err);
        return Promise.reject(err);
      }
    },
  );

  return {
    service,
  };
};
