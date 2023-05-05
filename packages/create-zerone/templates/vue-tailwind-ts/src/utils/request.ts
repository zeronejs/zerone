import axios, { AxiosError } from 'axios';
import { ElMessage } from 'element-plus';
const LOGIN_URL = 'https://gsso.giikin.com/admin/login/index.html?_system=18';
const baseUrl = import.meta.env.VITE_BASE_SHOP_API;
import Cookies from 'js-cookie';

const tokenStr = Cookies.get('userToken');
let userToken: undefined | Record<string, any>;
if (tokenStr) {
  userToken = JSON.parse(tokenStr);
}

const service = axios.create({
  baseURL: baseUrl, //
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 60_000,
  headers: {
    'content-type': 'application/json',
  },
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // if (config.url.includes("adreport")){
    if (!userToken) {
      const _token = getQuery('_token');
      const _user = getQuery('_user');
      if (_token) {
        Cookies.set('userToken', JSON.stringify({ _token, _user }), { expires: 1 });
      } else {
        const _url = window.location.href;
        const href = LOGIN_URL + '&_url=' + encodeURIComponent(_url);
        window.location.href = href;
      }
      userToken = { _token, _user };
    }
    if (import.meta.env.MODE !== 'production') {
      // 非正式环境user
      config.headers['gk-service-user'] = 'eyJpZCI6NjMyNjA2fQ==';
    }

    if (config.url?.includes('upload') || config.url?.includes('uploadfile')) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    if (!config.params) {
      config.params = {};
    }
    config.params = {
      ...config.params,
      _token: userToken._token,
    };
    return config;
  },
  error => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
);
// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    if (response.config.url?.includes('/adreport')) return response;
    // 对响应数据做点什么
    const res = response.data;
    if (res.code == 401) {
      // TODO
      Cookies.remove('userToken');
      const _url = window.location.href;
      const href = LOGIN_URL + '&_url=' + encodeURIComponent(_url);
      window.location.href = href;
    } else if (res.code != 0 && res.code != 401) {
      ElMessage({
        message: res.comment,
        type: 'error',
        duration: 5 * 1000,
      });
    }
    return response;
  },
  function (err: AxiosError) {
    // Vue.prototype.$hideLoading();
    if (err?.response?.status === 401 && !err.message.includes('timeout')) {
      Cookies.remove('userToken');
      const _url = window.location.href;
      const href = LOGIN_URL + '&_url=' + encodeURIComponent(_url);
      window.location.href = href;
    } else {
      // 对响应错误做点什么
      ElMessage({
        message: err.message.includes('timeout') ? '请求超时' : err.message,
        type: 'error',
        duration: 5 * 1000,
      });
    }
  }
);

function getQuery(key: string, href?: string) {
  let search = href ? href.split('?')[1] : window.location.search.substr(1);
  if (!search) return null;
  let list = search.split('&');
  let obj: Record<string, any> = {};
  list.forEach(v => {
    let query = v.split('=');
    obj[query[0]] = query[1];
  });
  if (!key) return obj;
  return obj[key] || null;
}

export default service;
