import { useAppStore } from '@/stores/app';
import Cookie from 'js-cookie';

// 响应拦截器中 401时 展示登录弹窗
export const res401Interceptors = () => {
  const appStore = useAppStore();
  // Cookie.remove('token', { domain: '.giikin.com' });
  // Vue.prototype.$hideLoading();
  appStore.showLogin = true;
  ElMessage({
    message: '请在弹框中重新登陆',
    type: 'error',
    duration: 5 * 1000,
  });
  return Promise.resolve({ code: 400, data: null, message: '请重新登陆' });
  // return Promise.reject('请重新登陆');
};
// 请求拦截器中，没有token时 展示登录弹窗
export const req401Interceptors = () => {
  const appStore = useAppStore();
  // Vue.prototype.$hideLoading();
  ElMessage({
    message: '请在弹框中重新登陆',
    type: 'error',
    duration: 5 * 1000,
  });
  return (appStore.showLogin = true);
};
