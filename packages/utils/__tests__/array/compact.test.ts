import { compact } from '../../src/array';
describe('@zeronejs/utils => array.compact', () => {
	it('数组去除假值', async () => {
		const arr = [0, 1, false, 2, '', 3];
		expect(compact(arr)).toEqual([1, 2, 3]);
	});
});
