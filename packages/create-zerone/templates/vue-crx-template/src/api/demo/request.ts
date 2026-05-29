import { createCrxAxios } from '@giime/crx';

const { service } = createCrxAxios({
  baseURL: import.meta.env.VITE_BASE_DEMO_API,
  successCode: 200,
});

export default service;
