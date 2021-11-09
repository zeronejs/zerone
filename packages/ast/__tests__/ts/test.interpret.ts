import { InterpretCore } from '../../src/ts/interpret.core';
import { join } from 'path';
import { ClassesInterpret } from '../../src/ts/classes.interpret';
import { EnumsInterpret } from '../../src/ts/enums.interpret';
import { ImportsInterpret } from '../../src/ts/imports.interpret';
import { VariablesInterpret } from '../../src/ts/variables.interpret';
import { UserEntity } from './test.entity';

describe('@zeronejs/ast => ts InterpretCore', () => {
	it('entity 文件读取', async () => {
		const interpretCore = new InterpretCore(join(__dirname, 'test.entity.ts'));
		const classes = new ClassesInterpret(interpretCore).interpret();
		const inports = new ImportsInterpret(interpretCore).interpret();
		const variables = new VariablesInterpret(interpretCore).interpret();
		const enums = new EnumsInterpret(interpretCore).interpret();

		expect(classes[0].name).toBe(UserEntity.name);
	});
});
