import { DocEntry, generateAstDocumentation } from '../../src/compiler/ts-class.ast.document';
import { join } from 'path';
import { TestEntity } from './mockTest/entities/test.entity';
describe.skip('@zeronejs/cli => compiler ts-class.document', () => {
    let docEntry: DocEntry;
    beforeAll(() => {
        docEntry = generateAstDocumentation(join(__dirname, 'mockTest', 'entities', 'test.entity.ts'));
    });
    it('entity 文件读取', async () => {
        expect(docEntry.baseFileName).toBe('test');
        expect(docEntry.className).toBe(TestEntity.name);
        expect(docEntry.documentation).toBe('用户表');
        const idProperty = docEntry.properties?.find(it => it.name === 'id');
        expect(idProperty?.type.value).toBe('number');
        expect(idProperty?.isSpecialColumn).toBe(true);
    });
});
