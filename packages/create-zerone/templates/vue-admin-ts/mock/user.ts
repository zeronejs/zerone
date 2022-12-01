const tokens = {
    admin: {
        token: 'admin-token',
    },
    editor: {
        token: 'editor-token',
    },
};

const users = {
    'admin-token': {
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin',
    },
    'editor-token': {
        roles: ['editor'],
        introduction: 'I am an editor',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Normal Editor',
    },
};

export default [
    // user login
    {
        url: '/mocks/user/login',
        type: 'get',
        response: (config: any) => {
            const { username } = config.query;
            const token = Reflect.get(tokens, username);

            // mock error
            if (!token) {
                return {
                    code: 60204,
                    message: 'Account and password are incorrect.',
                };
            }

            return {
                code: 20000,
                data: token,
            };
        },
    },

    // get user info
    {
        url: '/mocks/user/info',
        type: 'get',
        response: (config: any) => {
            const { token } = config.query;
            const info = Reflect.get(users, token);

            // mock error
            if (!info) {
                return {
                    code: 50008,
                    message: 'Login failed, unable to get user details.',
                };
            }

            return {
                code: 20000,
                data: info,
            };
        },
    },

    // user logout
    {
        url: '/mocks/user/logout',
        type: 'get',
        response: () => {
            return {
                code: 20000,
                data: 'success',
            };
        },
    },
];
