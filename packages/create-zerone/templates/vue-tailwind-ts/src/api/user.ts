import request from '@/utils/request';

// 模板接口
export function getUserInfo() {
  return request({
    url: '/api/userInfo',
    method: 'get',
  });
}
