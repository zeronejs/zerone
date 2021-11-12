import { ExportsInterpret, InterpretCore } from '@zeronejs/ast-ts';
import { createWriteStream } from 'fs-extra';
import { DocEntry } from './ts-class.ast.document';

export function indexSupplementary(fileUrl: string, docEntry: DocEntry) {
	const interpretCore = new InterpretCore(fileUrl);
	const fileExports = new ExportsInterpret(interpretCore).interpret();
	const froms = fileExports.map((it) => it.from).filter(Boolean);

	const dtoFormNames = [
		`./${docEntry.baseFileName}-create.dto`,
		`./${docEntry.baseFileName}-list.dto`,
		`./${docEntry.baseFileName}-update.dto`,
	].filter((it) => !froms.includes(it));
	if (dtoFormNames.length === 0) {
		return false;
	}
	const writeStream = createWriteStream(fileUrl, {
		flags: 'a', //'a'为追加，'w'为覆盖
	});
	dtoFormNames.forEach((dtoFormName) => {
		writeStream.write(`export * from '${dtoFormName}';\n`);
	});
	return true;
}
