import { randomChars, randomNumChars, randomStrChars } from '../src/randomString';
describe('@zeronejs/utils => randomString', () => {
    it('随机字符串', async () => {
        const randomStringLength = 32;
        expect(randomChars()).toHaveLength(randomStringLength);
        expect(randomNumChars()).toHaveLength(randomStringLength);
        expect(randomStrChars()).toHaveLength(randomStringLength);
    });
});
