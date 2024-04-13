import { createAxios } from 'giime';

const { service } = createAxios({
  baseURL: import.meta.env.VITE_BASE_SHOP_API,
  successCode: 200, // 服务器调用成功的code 一般是 0 或 200
});
// 你也可以再自定义拦截器
// service.interceptors.request.use();
export default service;
