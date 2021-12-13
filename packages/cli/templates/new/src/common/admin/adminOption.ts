import { AdminModuleFactory, CustomLoader } from '@adminjs/nestjs';
import { Connection } from 'typeorm';

export const createAdminOption = (): AdminModuleFactory & CustomLoader => ({
    useFactory: (connection: Connection) => ({
        adminJsOptions: {
            rootPath: '/admin',
            databases: [connection],
            // resources: [],
            // locale: {
            //     language: 'cn',
            //     translations: {
            //         labels: {
            //             UserEntity: '用户管理',
            //         },
            //     },
            // },
        },
        auth: {
            authenticate: async (email, password) =>
                // 自定义验证
                Promise.resolve({
                    id: '1',
                    email: '后台用户1',
                    title: '超管',
                    avatarUrl: 'https://zerone.top/images/logo/logo3.gif',
                }),
            cookieName: 'test',
            cookiePassword: 'testPass',
        },
        sessionOptions: {
            secret: 'sessionSecretKey', // 自定义秘钥
            resave: true,
            saveUninitialized: true,
        },
    }),
    inject: [Connection],
});
