import {
	InterpretCore,
	ImportsInterpret,
	EnumsInterpret,
	ClassesInterpret,
	VariablesInterpret,
	TypeAliasInterpret,
	InterfaceInterpret,
	ClassPropertyDeclarationDoc,
} from '@zeronejs/ast';
import { basename } from 'path';
export interface DocEntry {
	fileName: string;
	baseFileName: string;
	BaseName: string;
	baseName: string;
	documentation: string;
	dotImports: string[];
	properties?: DocEntryProperty[];
}
export interface DocEntryProperty extends ClassPropertyDeclarationDoc {
	isSpecialColumn: boolean;
	isOptional: boolean;
	defaultValue: string | undefined;
}
/** Generate documentation for all classes in a set of .ts files */
export function generateAstDocumentation(fileName: string): DocEntry {
	const interpretCore = new InterpretCore(fileName);
	const classes = new ClassesInterpret(interpretCore).interpret();
	const imports = new ImportsInterpret(interpretCore).interpret();
	const variables = new VariablesInterpret(interpretCore).interpret();
	const enums = new EnumsInterpret(interpretCore).interpret();
	const typeAlias = new TypeAliasInterpret(interpretCore).interpret();
	const interfaces = new InterfaceInterpret(interpretCore).interpret();

	const entityClasses = classes.filter((it) =>
		it.decorators.some((decorator) => decorator.name === 'Entity')
	);
	if (entityClasses.length === 0) {
		throw new Error('@Entity decorator class not found');
	} else if (entityClasses.length > 1) {
		throw new Error(
			`There are multiple @Entity decorator classes（${entityClasses
				.map((it) => it.name)
				.join(',')}.please keep one）`
		);
	}
	const entityClass = entityClasses[0];
	const originName = basename(fileName);
	const specialColumns = ['PrimaryGeneratedColumn', 'CreateDateColumn', 'UpdateDateColumn'];
	const properties = entityClass.properties.map((property) => {
		let isSpecialColumn = false;
		let isOptional = Boolean(property.isOptional);
		let defaultValue: string | undefined;
		if (property.decorators.some((it) => specialColumns.includes(it.name))) {
			isSpecialColumn = true;
		}
		const columnDecorator = property.decorators.find((it) => it.name === 'Column');
		if (columnDecorator) {
			isOptional = columnDecorator.expression?.args[0]?.nullable === 'true';
			defaultValue = columnDecorator.expression?.args[0]?.default;
		}
		return { ...property, isSpecialColumn, isOptional, defaultValue };
	});

	const dotImports = getDtoImports();
	const BaseName = entityClasses[0].name.replace(/Entity$/, '');

	return {
		fileName: originName,
		baseFileName: originName.replace(/.entity.ts$/, ''),
		BaseName: BaseName,
		baseName: BaseName.charAt(0).toLowerCase() + BaseName.slice(1),
		documentation: entityClasses[0].documentation,
		properties,
		dotImports,
	};
	function getDtoImports() {
		const dotImports: string[] = [];

		const typeReferences = [
			...new Set(
				properties
					.filter((it) => !it.isSpecialColumn)
					.map((it) => it.type.typeReferences)
					.flat()
			),
		];
		for (const importItem of imports) {
			if (importItem.namespaceImport && typeReferences.includes(importItem.namespaceImport)) {
				dotImports.push(`import * as ${importItem.namespaceImport} from '${importItem.from}';`);
			} else {
				let defalutInputString = '';
				if (importItem.defalutImport && typeReferences.includes(importItem.defalutImport)) {
					defalutInputString = importItem.defalutImport;
				}
				const elmStrings = importItem.elements.filter((it) => typeReferences.includes(it));
				if (elmStrings.length !== 0 && defalutInputString) {
					dotImports.push(
						`import ${defalutInputString}, { ${elmStrings.join(', ').trim()} } from '${
							importItem.from
						}';`
					);
				} else if (elmStrings.length !== 0) {
					dotImports.push(`import { ${elmStrings.join(', ').trim()} } from '${importItem.from}';`);
				} else if (defalutInputString) {
					dotImports.push(`import ${defalutInputString} from '${importItem.from}';`);
				}
			}
		}
		const curTypeNames = [
			...enums.map((it) => it.name),
			...classes.map((it) => it.name),
			...typeAlias.map((it) => it.name),
			...interfaces.map((it) => it.name),
		];

		const curUseTypeNames = curTypeNames.filter((curTypeName) => typeReferences.includes(curTypeName));
		const defaultValueReferences = properties
			.map((it) => it.defaultValue?.split('.')[0] ?? '')
			.filter((it) => it);

		const curVarNames = [
			...enums.map((it) => it.name),
			...classes.map((it) => it.name),
			...variables.map((it) => it.name),
		];
		const curUseVarNames = curVarNames.filter((curVarName) =>
			defaultValueReferences.includes(curVarName)
		);
		const curReferences = [...new Set([...curUseVarNames, ...curUseTypeNames])];

		if (curReferences.length !== 0) {
			dotImports.push(
				`import { ${curReferences.join(', ').trim()} } from '../entities/${originName.replace(
					/.ts$/,
					''
				)}';`
			);
		}
		return dotImports;
	}
}

// generateAstDocumentation(join(__dirname, 'test.entity.ts'));
