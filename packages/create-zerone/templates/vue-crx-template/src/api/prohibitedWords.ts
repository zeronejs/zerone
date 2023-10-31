import service from '@/utils/request';

/**
 * 获取敏感词列表
 * http://127.0.0.1:8000/v1/tools/ban/banWords
 */
export const getbanWords = (data: any) => {
  return service.get('/v1/tools/ban/banWords', { params: data });
};
/**
 * 获取平台列表
 * /v1/tools/ban/getPlatform
 */
export const getPlatform = () => {
  return service.get('/v1/tools/ban/getPlatform');
};
/**
 * 平台敏感词列表接口
 * http://127.0.0.1:8000/v1/tools/ban/getBanWords
 */
export const getBanWords = (data: any) => {
  return service.get('/v1/tools/ban/getBanWords', { params: data });
};

/**
 * 添加敏感词
 * /tools/ban/addBanWords
 */
export const addBanWords = (data: any) => {
  return service.post('/v1/tools/ban/addBanWords', data);
};

/**
 * 删除敏感词
 * /tools/ban/delBanWords
 */
export const delBanWords = (ids: any) => {
  return service.get('/v1/tools/ban/delBanWords', { params: ids });
};
