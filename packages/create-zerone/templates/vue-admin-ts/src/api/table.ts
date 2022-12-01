import request from '@/utils/request';

export function getList() {
    return request({
        url: '/mocks/table/list',
        method: 'get',
    });
}
