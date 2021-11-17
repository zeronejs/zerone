import { moduleSupplementary } from '../../src/compiler/module.supplementary';
import { join } from 'path';
import { DocEntry, generateAstDocumentation } from '../../src/compiler/ts-class.ast.document';

jest.mock('fs', () => {
	const originalModule = jest.requireActual('fs');
	return {
		...originalModule,
		// 覆盖写入
		writeFileSync: () => ({}),
	};
});

describe('@zeronejs/cli => compiler module.supplementary', () => {
	let docEntry: DocEntry;
	let dir: string;
	beforeAll(() => {
		docEntry = generateAstDocumentation(join(__dirname, 'mockTest', 'entities', 'test.entity.ts'));
		dir = join(__dirname, 'mockTest', 'module.supplementary.test');
	});
	it('*.module.ts 文件不存在 *Module class', async () => {
		const testIndex = moduleSupplementary(join(dir, 'false.0.txt'), docEntry);
		expect(testIndex).toBe(false);
	});
	it('*.module.ts 全部追加', async () => {
		const testIndex = moduleSupplementary(join(dir, 'true.txt'), docEntry);
		expect(testIndex).toBe(true);
	});
	it('*.module.ts import 已全部导入', async () => {
		const testIndex = moduleSupplementary(join(dir, 'false.1.txt'), docEntry);
		expect(testIndex).toBe(false);
	});
	it('*.module.ts @Module 参数不正确', async () => {
		const testIndex = moduleSupplementary(join(dir, 'false.2.txt'), docEntry);
		expect(testIndex).toBe(false);
	});
	it('*.module.ts 没有 @Module ', async () => {
		const testIndex = moduleSupplementary(join(dir, 'false.3.txt'), docEntry);
		expect(testIndex).toBe(false);
	});
	it('*.module.ts @Module 没有参数', async () => {
		const testIndex = moduleSupplementary(join(dir, 'false.4.txt'), docEntry);
		expect(testIndex).toBe(false);
	});
});
