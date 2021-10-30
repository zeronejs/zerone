import { generateDocumentation } from '../../src/compiler/ts-class.document';
import { join } from 'path';
import ts from 'typescript';
import { TestEntity } from './test.entity';
describe('@zeronejs/cli => compiler ts-class.document', () => {
	it('entity 文件读取', async () => {
		const docEntry = generateDocumentation([join(__dirname, 'test.entity.ts')], {
			target: ts.ScriptTarget.ES5,
			module: ts.ModuleKind.CommonJS,
		});
		expect(docEntry).toHaveLength(1);
		expect(docEntry[0].baseFileName).toBe('test');
		expect(docEntry[0].name).toBe(TestEntity.name);
		expect(docEntry[0].documentation).toBe('用户表');
		const idProperty = docEntry[0].property?.find((it) => it.escapedName === 'id');
		expect(idProperty?.type).toBe('number');
		expect(idProperty?.isSpecialColumn).toBe(true);
	});
});
