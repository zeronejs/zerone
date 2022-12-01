import { mount } from '@vue/test-utils';
import SvgIcon from '@/components/SvgIcon/index.vue';
describe('SvgIcon.vue', () => {
    it('iconClass', () => {
        const wrapper = mount(SvgIcon, {
            props: {
                iconClass: 'test',
            },
        });
        expect(wrapper.find('use').attributes().href).toBe('#icon-test');
    });
    it('className', async () => {
        const wrapper = mount(SvgIcon, {
            props: {
                iconClass: 'test',
            },
        });

        expect(wrapper.get('svg').classes()).toContain('svg-icon');
        await wrapper.setProps({ className: 'test' });
        expect(wrapper.get('svg').classes().includes('test')).toBe(true);
    });
});
