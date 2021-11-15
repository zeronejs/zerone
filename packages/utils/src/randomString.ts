const UNMISTAKABLE_CHARS = '0123456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz';
const UNMISTAKABLE_CHARS_NUM = '0123456789';
const UNMISTAKABLE_CHARS_STR = 'abcdefghijkmnopqrstuvwxyz';
enum RandomCharsType {
	num,
	str,
	all,
}
// 私有方法
const _randomChars = (count: number, type: RandomCharsType) => {
	let unmistakableChars;
	switch (type) {
		case RandomCharsType.num:
			unmistakableChars = UNMISTAKABLE_CHARS_NUM;
			break;
		case RandomCharsType.str:
			unmistakableChars = UNMISTAKABLE_CHARS_STR;
			break;
		default:
			unmistakableChars = UNMISTAKABLE_CHARS;
			break;
	}
	let res = '';
	for (let i = 0; i < count; i++) {
		res += unmistakableChars[Math.floor(Math.random() * unmistakableChars.length)];
	}
	return res;
};
/**
 * 随机字符串, 包括大小写字母和数字
 * @param {number} count 随机个数
 */
export const randomChars = (count = 32) => {
	return _randomChars(count, RandomCharsType.all);
};
/**
 * 随机字符串，只包括数字
 * @param {number} count 随机个数
 */
export const randomNumChars = (count = 32) => {
	return _randomChars(count, RandomCharsType.num);
};
/**
 * 随机字符串，只有字母
 * @param {number} count 随机个数
 */
export const randomStrChars = (count = 32) => {
	return _randomChars(count, RandomCharsType.str);
};
