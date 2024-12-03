import { createAxios } from '../createAxios';

const baseUrl = `https:/thirdshop-gstore.giikin.com`;

const { service } = createAxios({
  baseURL: baseUrl,
  successCode: 200,
});

export default service;
