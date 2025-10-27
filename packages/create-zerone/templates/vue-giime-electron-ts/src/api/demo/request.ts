import { createAxios } from 'giime';

const { service } = createAxios({
  baseURL: import.meta.env.VITE_BASE_DEMO_API,
  successCode: 200, // 服务器调用成功的code 一般是 0 或 200
  withCredentials: false,
});

// 你也可以再自定义拦截器
// service.interceptors.request.use();
export default service;
