import { indexSupplementary } from '../../src/compiler/index.supplementary';
import { join } from 'path';
import { generateAstDocumentation } from '../../src/compiler/ts-class.ast.document';

jest.mock('fs', () => {
	const originalModule = jest.requireActual('fs');
	return {
		...originalModule,
		// 覆盖写入
		writeFileSync: () => ({}),
	};
});

describe('@zeronejs/cli => compiler index.supplementary', () => {
	it('index.ts 追加', async () => {
		const docEntry = generateAstDocumentation(join(__dirname, 'test.entity.ts'));
		const res = indexSupplementary(join(__dirname, 'test.index.ts'), docEntry);
		expect(res).toBe(true);
	});
});
