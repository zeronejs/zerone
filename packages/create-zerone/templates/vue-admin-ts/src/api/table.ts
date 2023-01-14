import request from 'axios';

export function getList() {
    return request({
        url: '/mocks/table/list',
        method: 'get',
    }).then(data => data.data);
}
