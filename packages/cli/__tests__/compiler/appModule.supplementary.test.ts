import { join } from 'path';
import { DocEntry, generateAstDocumentation } from '../../src/compiler/ts-class.ast.document';
import { appModuleSupplementary } from '../../src/compiler/appModule.supplementary';

jest.mock('fs', () => {
    const originalModule = jest.requireActual('fs');
    return {
        ...originalModule,
        // 覆盖写入
        writeFileSync: () => ({}),
    };
});

describe('@zeronejs/cli => compiler appModule.supplementary', () => {
    let docEntry: DocEntry;
    let dir: string;

    beforeAll(() => {
        docEntry = generateAstDocumentation(join(__dirname, 'mockTest', 'entities', 'test.entity.ts'));
        dir = join(__dirname, 'mockTest', 'appModule.supplementary.test');
    });
    it('app.module.ts 文件不存在', () => {
        const testIndex = appModuleSupplementary(join(dir, 'false.9999.txt'), docEntry);
        expect(testIndex).toBe(false);
    });
    it('app.module.ts 追加此模块', () => {
        const testThis = appModuleSupplementary(join(dir, 'true.txt'), docEntry);
        expect(testThis).toBe(true);
    });
    it('app.module.ts 未找到AppModule的类', () => {
        const testThis = appModuleSupplementary(join(dir, 'false.0.txt'), docEntry);
        expect(testThis).toBe(false);
    });
    it('app.module.ts 已存在 此模块的import语句', () => {
        const testThis = appModuleSupplementary(join(dir, 'false.1.txt'), docEntry);
        expect(testThis).toBe(false);
    });
    it('app.module.ts @Module 参数错误', () => {
        const testThis = appModuleSupplementary(join(dir, 'false.2.txt'), docEntry);
        expect(testThis).toBe(false);
    });

    it('app.module.ts 没有 @Module ', () => {
        const testIndex = appModuleSupplementary(join(dir, 'false.3.txt'), docEntry);
        expect(testIndex).toBe(false);
    });

    it('app.module.ts @Module 没有参数', () => {
        const testIndex = appModuleSupplementary(join(dir, 'false.4.txt'), docEntry);
        expect(testIndex).toBe(false);
    });
    it('app.module.ts @Module imports 已存在此模块', () => {
        const testIndex = appModuleSupplementary(join(dir, 'false.5.txt'), docEntry);
        expect(testIndex).toBe(false);
    });
});
