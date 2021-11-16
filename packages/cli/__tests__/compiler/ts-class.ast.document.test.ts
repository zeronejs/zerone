import { generateAstDocumentation } from '../../src/compiler/ts-class.ast.document';
import { join } from 'path';
import { TestEntity } from './test.entity';
describe('@zeronejs/cli => compiler ts-class.document', () => {
	it('entity 文件读取', async () => {
		const docEntry = generateAstDocumentation(join(__dirname, 'test.entity.ts'));
		expect(docEntry.baseFileName).toBe('test');
		expect(docEntry.className).toBe(TestEntity.name);
		expect(docEntry.documentation).toBe('用户表');
		const idProperty = docEntry.properties?.find((it) => it.name === 'id');
		expect(idProperty?.type.value).toBe('number');
		expect(idProperty?.isSpecialColumn).toBe(true);
	});
});
