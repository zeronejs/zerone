import { isExternal, validUsername } from '@/utils/validate';

describe('Utils => validate', () => {
    it('validUsername', () => {
        expect(validUsername('admin')).toBe(true);
        expect(validUsername('editor')).toBe(true);
        expect(validUsername('xxxx')).toBe(false);
    });
    it('isExternal', () => {
        // true
        expect(isExternal('https://github.com/PanJiaChen/vue-element-admin')).toBe(true);
        expect(isExternal('http://github.com/PanJiaChen/vue-element-admin')).toBe(true);
        // false
        expect(isExternal('github.com/PanJiaChen/vue-element-admin')).toBe(false);
        expect(isExternal('/dashboard')).toBe(false);
        expect(isExternal('./dashboard')).toBe(false);
        expect(isExternal('dashboard')).toBe(false);
    });
});
