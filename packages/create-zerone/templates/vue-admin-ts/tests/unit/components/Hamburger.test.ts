import { mount } from '@vue/test-utils';
import Hamburger from '@/components/Hamburger/index.vue';
describe('Hamburger.vue', () => {
    it('toggle click', () => {
        const wrapper = mount(Hamburger);
        // const mockFn = jest.fn();
        // wrapper.vm.$on('toggleClick', mockFn);
        wrapper.find('.hamburger').trigger('click');
        expect(wrapper.emitted()).toHaveProperty('toggleClick');
        // expect(mockFn).toBeCalled();
    });
    it('prop isActive', async () => {
        const wrapper = mount(Hamburger);
        await wrapper.setProps({ isActive: true });
        expect(wrapper.get('svg').classes().includes('is-active')).toBe(true);
        await wrapper.setProps({ isActive: false });
        expect(wrapper.get('svg').classes().includes('is-active')).toBe(false);
    });
});
