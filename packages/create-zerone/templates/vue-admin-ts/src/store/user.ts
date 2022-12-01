import { loginApi, logout, getInfo, LoginApiInput } from '@/api/user';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { resetRouter } from '@/router';
import { defineStore } from 'pinia';

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        token: getToken() ?? '',
        name: '',
        avatar: '',
        roles: [],
    }),
    getters: {
        userToken: state => state.token,
        userAvatar: state => state.avatar,
        userName: state => state.name,
        userRoles: state => state.roles,
    },
    actions: {
        // user login
        async login(userInfo: LoginApiInput) {
            const { username, password } = userInfo;
            const response = await loginApi({ username: username.trim(), password: password });
            const { data } = response;
            this.token = data.token;
            setToken(data.token);
        },
        // get user info
        async getInfo() {
            const response = await getInfo(this.token);
            const { data } = response;

            if (!data) {
                throw new Error('Verification failed, please Login again.');
            }

            const { roles, name, avatar } = data;

            // roles must be a non-empty array
            if (!roles || roles.length <= 0) {
                throw new Error('getInfo: roles must be a non-null array!');
            }
            this.$patch({
                roles,
                name,
                avatar,
            });
            return data;
        },
        // user logout
        async logout() {
            await logout(this.token);
            removeToken(); // must remove  token  first
            resetRouter();
            this.$reset();
        },
        // remove token
        async resetToken() {
            removeToken(); // must remove  token  first
            this.$reset();
        },
    },
});
