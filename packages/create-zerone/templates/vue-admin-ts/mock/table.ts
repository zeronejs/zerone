// const Mock = require('mockjs');
import Mock from 'mockjs';
const data = Mock.mock({
    'items|10': [
        {
            id: '@id',
            title: '@sentence(10, 20)',
            'status|1': ['published', 'draft', 'deleted'],
            author: 'name',
            displayTime: '@datetime',
            pageviews: '@integer(300, 5000)',
        },
    ],
});

export default [
    {
        url: '/mocks/table/list',
        type: 'get',
        response: () => {
            const items = data.items;
            return {
                code: 20000,
                data: {
                    total: items.length,
                    items: items,
                },
            };
        },
    },
];
