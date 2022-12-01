import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import Breadcrumb from '@/components/Breadcrumb/index.vue';
import { createRouterMock, injectRouterMock } from 'vue-router-mock';

describe('Breadcrumb.vue', () => {
    jest.setTimeout(20000);
    // create one mock instance, pass options
    const router = createRouterMock({
        // ...
    });

    beforeEach(() => {
        // inject it globally to ensure `useRoute()`, `$route`, etc work
        // properly and give you access to test specific functions
        injectRouterMock(router);
    });

    it('dashboard', () => {
        router.push('/dashboard');
        const wrapper = mount(Breadcrumb, {
            global: {
                plugins: [ElementPlus],
            },
        });
        const len = wrapper.findAll('.el-breadcrumb__inner').length;
        expect(len).toBe(1);
    });
});
