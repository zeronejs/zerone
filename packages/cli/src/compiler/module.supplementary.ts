import { ClassesInterpret, ImportsInterpret, InterpretCore } from '@zeronejs/ast-ts';
import { DocEntry } from './ts-class.ast.document';

export function moduleSupplementary(fileUrl: string, docEntry: DocEntry) {
	const interpretCore = new InterpretCore(fileUrl);
	const imports = new ImportsInterpret(interpretCore).interpret();
	const froms = imports.map((it) => it.from).filter(Boolean);

	const dtoFormNames = [
		`./${docEntry.baseFileName}.controller`,
		`./${docEntry.baseFileName}.service`,
		`./${docEntry.entitiesName}/${docEntry.baseFileName}.entity`,
	].filter((it) => !froms.includes(it));
	if (dtoFormNames.length === 0) {
		return false;
	}
	const moduleClass = new ClassesInterpret(interpretCore)
		.interpret()
		.find((it) => it.name === `${docEntry.ModuleName}Module`);
	if (!moduleClass) {
		return false;
	}

	

	debugger;

	return true;
}
