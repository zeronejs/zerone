import path from 'path';
import {
    ClassesInterpret,
    EnumsInterpret,
    ImportsInterpret,
    InterfaceInterpret,
    InterpretCore,
    TypeAliasInterpret,
    VariablesInterpret,
} from '../src';

import { TestEntity } from './test.entity';

describe.skip('@zeronejs/ast => ts InterpretCore', () => {
    it('entity 文件读取', async () => {
        const interpretCore = new InterpretCore(path.join(__dirname, 'test.entity.ts'));
        const classes = new ClassesInterpret(interpretCore).interpret();
        const imports = new ImportsInterpret(interpretCore).interpret();
        const variables = new VariablesInterpret(interpretCore).interpret();
        const enums = new EnumsInterpret(interpretCore).interpret();
        const typeAlias = new TypeAliasInterpret(interpretCore).interpret();
        const interfaces = new InterfaceInterpret(interpretCore).interpret();

        expect(classes[0].name).toBe(TestEntity.name);
        expect(imports).toBeDefined();
        expect(variables).toBeDefined();
        expect(enums).toBeDefined();
        expect(typeAlias).toBeDefined();
        expect(interfaces).toBeDefined();
    });
});
