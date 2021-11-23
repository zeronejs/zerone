import {
	InterpretCore,
	ImportsInterpret,
	EnumsInterpret,
	ClassesInterpret,
	VariablesInterpret,
	TypeAliasInterpret,
	InterfaceInterpret,
	ClassPropertyDeclarationDoc,
} from '@zeronejs/ast-ts';
import { basename, join } from 'path';
export interface DocEntry {
	fileName: string;
	entitiesName: string;
	/**
	 * 整个模块名称
	 */
	moduleName: string;
	/**
	 * 大驼峰 moduleName
	 */
	ModuleName: string;
	baseFileName: string;
	BaseName: string;
	baseName: string;
	className: string;
	documentation: string;
	dotImports: string[];
	// 主键字段
	primaryColumnsProperty: PrimaryColumnsProperty;
	properties?: DocEntryProperty[];
}
export interface DocEntryProperty extends ClassPropertyDeclarationDoc {
	isSpecialColumn: boolean;
	isOptional: boolean;
	defaultValue: string | undefined;
}
interface PrimaryColumnsProperty extends Partial<DocEntryProperty> {
	Name: string;
	name: string;
	type: {
		value: string;
		typeReferences: string[];
	};
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
	const specialColumns = [
		'PrimaryGeneratedColumn',
		'CreateDateColumn',
		'UpdateDateColumn',
		'VersionColumn',
	];
	const primaryColumns = ['PrimaryGeneratedColumn', 'PrimaryColumn'];
	let primaryColumnsProperty: PrimaryColumnsProperty = {
		Name: 'Id',
		name: 'id',
		type: { value: 'number', typeReferences: [] },
	};
	const properties = entityClass.properties.map((property) => {
		let isSpecialColumn = false;
		let isOptional = Boolean(property.isOptional);
		let defaultValue: string | undefined;
		if (property.decorators.some((it) => it.name && specialColumns.includes(it.name))) {
			isSpecialColumn = true;
		}
		const columnDecorator = property.decorators.find((it) => it.name === 'Column');

		if (columnDecorator) {
			isOptional = columnDecorator.expression?.args?.[0]?.nullable === 'true';
			defaultValue = columnDecorator.expression?.args?.[0]?.default;
		}
		const resProperty = { ...property, isSpecialColumn, isOptional, defaultValue };
		// 寻找主键字段
		if (
			property.decorators.some((it) => it.name && primaryColumns.includes(it.name)) ||
			columnDecorator?.expression?.args?.[0].primary === 'true'
		) {
			primaryColumnsProperty = {
				...resProperty,
				Name: resProperty.name.charAt(0).toUpperCase() + resProperty.name.slice(1),
			};
		}
		return resProperty;
	});
	const dotImports = getDtoImports();
	const BaseName = entityClasses[0].name.replace(/Entity$/, '');
	const moduleName = basename(join(fileName, '../../'));
	return {
		fileName: originName,
		entitiesName: basename(join(fileName, '../')),
		moduleName,
		ModuleName: moduleName.charAt(0).toUpperCase() + moduleName.slice(1),
		baseFileName: originName.replace(/.entity.ts$/, ''),
		BaseName: BaseName,
		baseName: BaseName.charAt(0).toLowerCase() + BaseName.slice(1),
		documentation: entityClasses[0].documentation,
		className: entityClasses[0].name,
		properties,
		primaryColumnsProperty,
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
