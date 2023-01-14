import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/store';
import { getToken } from '@/utils/auth';

// create an axios instance
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000, // request timeout
});

// request interceptor
service.interceptors.request.use(
    config => {
        // do something before request is sent
        const userStore = useUserStore();
        if (userStore.userToken) {
            // let each request carry token
            // ['X-Token'] is a custom headers key
            // please modify it according to the actual situation
            if (config.headers) {
                config.headers['X-Token'] = getToken() ?? '';
                config.headers.Authorization = `Bearer ${getToken() ?? ''}`;
            }
        }
        return config;
    },
    error => {
        // do something with request error
        console.log(error); // for debug
        return Promise.reject(error);
    }
);

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        const res = response.data;

        // if the custom code is not 20000, it is judged as an error.
        if (res.code !== 200 || (res.code === 200 && res.status !== 0)) {
            ElMessage({
                message: res.message || 'Error',
                type: 'error',
                duration: 5 * 1000,
            });

            return Promise.reject(new Error(res.message || 'Error'));
        } else {
            return response;
        }
    },
    error => {
        if (error?.response?.status === 401) {
            // to re-login
            ElMessageBox.confirm(
                'You have been logged out, you can cancel to stay on this page, or log in again',
                'Confirm logout',
                {
                    confirmButtonText: 'Re-Login',
                    cancelButtonText: 'Cancel',
                    type: 'warning',
                }
            ).then(() => {
                const userStore = useUserStore();
                userStore.resetToken().then(() => {
                    location.reload();
                });
            });
        }
        console.log('err' + error); // for debug
        ElMessage({
            message: error.message,
            type: 'error',
            duration: 5 * 1000,
        });
        return Promise.reject(error);
    }
);

export default service;
