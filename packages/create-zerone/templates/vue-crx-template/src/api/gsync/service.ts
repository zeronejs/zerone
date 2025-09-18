import { createAxios } from '../createAxios';

const { service } = createAxios({
  baseURL: __ENV__.VITE_BASE_GSYNC_API,
  successCode: 200,
});

export default service;
