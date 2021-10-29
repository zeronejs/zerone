import { encryptedUserPassword, verifyUserPassword } from '../src/crypto';
describe('@zeronejs/utils => crypto', () => {
	it('密码加密验证', async () => {
		const password = '123456';
		const cryptoed = await encryptedUserPassword(password);
		expect(await verifyUserPassword(password, cryptoed)).toBeTruthy();
	});
});
