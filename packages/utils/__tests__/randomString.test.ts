import { randomChars, randomNumChars, randomStrChars } from '../src/randomString';
describe('@zeronejs/utils => randomString', () => {
	it('随机字符串', async () => {
		const randomStringLength = 32;
		expect(randomChars(randomStringLength)).toHaveLength(randomStringLength);
		expect(randomNumChars(randomStringLength)).toHaveLength(randomStringLength);
		expect(randomStrChars(randomStringLength)).toHaveLength(randomStringLength);
	});
});
