import { indexSupplementary } from '../../src/compiler/index.supplementary';
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

describe.skip('@zeronejs/cli => compiler index.supplementary', () => {
    let docEntry: DocEntry;
    beforeAll(() => {
        docEntry = generateAstDocumentation(join(__dirname, 'mockTest', 'entities', 'test.entity.ts'));
    });
    it('index.ts 全部dto追加', () => {
        const testThis = indexSupplementary(__filename, docEntry);
        expect(testThis).toBe(true);
    });

    it('index.ts dto imports已存在', () => {
        const testIndex = indexSupplementary(
            join(__dirname, 'mockTest', 'dto', 'index.supplementary.test.txt'),
            docEntry
        );
        expect(testIndex).toBe(false);
    });
});
