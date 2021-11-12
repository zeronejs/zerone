import { ClassesInterpret, ImportsInterpret, InterpretCore } from '@zeronejs/ast-ts';
import * as ts from 'typescript';
import { DocEntry } from './ts-class.ast.document';

enum DtoFormNamesType {
	controller,
	service,
	entity,
}
export function moduleSupplementary(fileUrl: string, docEntry: DocEntry) {
	const interpretCore = new InterpretCore(fileUrl);
	const imports = new ImportsInterpret(interpretCore).interpret();
	const froms = imports.map((it) => it.from).filter(Boolean);

	const dtoFormNames = [
		{ fromUrl: `./${docEntry.baseFileName}.controller`, type: DtoFormNamesType.controller },
		{ fromUrl: `./${docEntry.baseFileName}.service`, type: DtoFormNamesType.service },
		{
			fromUrl: `./${docEntry.entitiesName}/${docEntry.baseFileName}.entity`,
			type: DtoFormNamesType.entity,
		},
	].filter((it) => !froms.includes(it.fromUrl));
	if (dtoFormNames.length === 0) {
		return false;
	}
	const moduleClass = new ClassesInterpret(interpretCore)
		.interpret()
		.find((it) => it.name === `${docEntry.ModuleName}Module`);
	if (!moduleClass) {
		return false;
	}
	const sourceClass = interpretCore.sourceFile.statements.find(
		(it) =>
			ts.isClassDeclaration(it) &&
			it.name &&
			moduleClass.name === ts.unescapeLeadingUnderscores(it.name?.escapedText)
	);
	// todo next week

	for (const dtoFormName of dtoFormNames) {
		switch (dtoFormName.type) {
			case DtoFormNamesType.controller:
				const ctrlName = ts.factory.createIdentifier(`${docEntry.BaseName}Controller`);

				break;
			case DtoFormNamesType.service:
				const serviceName = ts.factory.createIdentifier(`${docEntry.BaseName}Service`);

				break;
			case DtoFormNamesType.entity:
				const entityName = ts.factory.createIdentifier(`${docEntry.BaseName}Entity`);

				break;
		}
	}

	debugger;

	return true;
}
