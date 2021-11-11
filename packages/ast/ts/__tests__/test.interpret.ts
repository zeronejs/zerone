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

import { UserEntity } from './test.entity';

describe('@zeronejs/ast => ts InterpretCore', () => {
	it('entity 文件读取', async () => {
		const interpretCore = new InterpretCore(path.join(__dirname, 'test.entity.ts'));
		const classes = new ClassesInterpret(interpretCore).interpret();
		const imports = new ImportsInterpret(interpretCore).interpret();
		const variables = new VariablesInterpret(interpretCore).interpret();
		const enums = new EnumsInterpret(interpretCore).interpret();
		const typeAlias = new TypeAliasInterpret(interpretCore).interpret();
		const interfaces = new InterfaceInterpret(interpretCore).interpret();

		expect(classes[0].name).toBe(UserEntity.name);
	});
});
