import * as bcrypt from 'bcrypt';
/**
 * 用户密码加密
 * @param password 原始密码
 * @returns
 */
export const encryptedUserPassword = async (password: string): Promise<string> => {
	// const saltOrRounds = 10;
	const salt = await bcrypt.genSalt();
	return await bcrypt.hash(password, salt);
};
/**
 * 验证密码
 * @param password 原始密码
 * @param hash 加密后密码
 * @returns
 */
export const verifyUserPassword = async (password: string, hash: string): Promise<boolean> => {
	return await bcrypt.compare(password, hash);
};
