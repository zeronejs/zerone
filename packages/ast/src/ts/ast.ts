// TypeScript AST Viewer https://ts-ast-viewer.com/

import { basename } from 'path';
import * as ts from 'typescript';

export interface DocEntry {
	// path: string;
	fileName: string;
	inports: FileImports[];
	classes: FileClasses[];
}
export interface FileImports {
	from: string;
	elements: string[];
	defalutImport?: string;
	namespaceImport?: string;
}
export interface FileClasses {
	name: string;
	decorators: DecoratorDoc[];
	documentation: string;
}

/** Generate documentation for all classes in a set of .ts files */
export function generateDocumentation(
	fileNames: string[],
	options: ts.CompilerOptions = {
		target: ts.ScriptTarget.ES5,
		module: ts.ModuleKind.CommonJS,
	}
) {
	const output: DocEntry[] = [];
	// Build a program using the set of root file names in fileNames
	const program = ts.createProgram(fileNames, options);
	// Get the checker, we will use it to find more about classes
	const sources = program.getSourceFiles();
	// 过滤ts自带声明(.d.ts)文件 和 无关文件
	const sourceFiles = sources.filter((it) => !it.isDeclarationFile && fileNames.includes(it.fileName));
	// const sourceFiles = getSourceFiles(fileNames, options);
	for (const sourceFile of sourceFiles) {
		output.push(visit(sourceFile));
	}
	return output;
	function visit(sourceFile: ts.SourceFile) {
		// todo
		const { importDeclarations, variableStatements, enumDeclarations, classDeclarations } =
			getDeclarations(sourceFile);
		const inports = generateImportDeclarationsDoc(importDeclarations);
		const classes = generateClassDeclarationsDoc(classDeclarations, sourceFile, program);
		return {
			// path: sourceFile.fileName,
			fileName: basename(sourceFile.fileName),
			inports,
			classes,
		};
	}
}

export function getSourceFiles(fileNames: string[], options: ts.CompilerOptions): ts.SourceFile[] {
	// Build a program using the set of root file names in fileNames
	const program = ts.createProgram(fileNames, options);
	// Get the checker, we will use it to find more about classes
	const sources = program.getSourceFiles();
	// 过滤ts自带声明(.d.ts)文件 和 无关文件
	return sources.filter((it) => !it.isDeclarationFile && fileNames.includes(it.fileName));
}
export function generateImportDeclarationsDoc(importDeclarations: ts.ImportDeclaration[]): FileImports[] {
	const inports: FileImports[] = [];
	for (const importDeclaration of importDeclarations) {
		const fileImport: FileImports = {
			from: '',
			elements: [],
			defalutImport: undefined,
			namespaceImport: undefined,
		};
		if (ts.isStringLiteral(importDeclaration.moduleSpecifier)) {
			fileImport.from = importDeclaration.moduleSpecifier.text;
		}

		if (importDeclaration.importClause?.name?.escapedText) {
			// ts.unescapeLeadingUnderscores Remove extra underscore from escaped identifier text content.
			fileImport.defalutImport = ts.unescapeLeadingUnderscores(
				importDeclaration.importClause.name.escapedText
			);
		}
		if (importDeclaration.importClause?.namedBindings) {
			if (ts.isNamedImports(importDeclaration.importClause.namedBindings)) {
				fileImport.elements = importDeclaration.importClause.namedBindings.elements.map((it) =>
					ts.unescapeLeadingUnderscores(it.name.escapedText)
				);
			} else if (ts.isNamespaceImport(importDeclaration.importClause.namedBindings)) {
				fileImport.namespaceImport = ts.unescapeLeadingUnderscores(
					importDeclaration.importClause.namedBindings.name.escapedText
				);
			}
		}

		inports.push(fileImport);
	}
	return inports;
}
export interface ClassPropertyDeclarationDoc {
	name: string;
	documentation: string;
	isOptional?: boolean;
	decorators: DecoratorDoc[];
	type: {
		// 预留  后期丰富
		value: string;
	};
}
export function generateClassDeclarationsDoc(
	classDeclarations: ts.ClassDeclaration[],
	sourceFile: ts.SourceFile,
	program: ts.Program
): FileClasses[] {
	const checker = program.getTypeChecker();
	const classes: FileClasses[] = [];
	for (const classDeclaration of classDeclarations) {
		const fileClasses: FileClasses = {
			name: '',
			decorators: generateDecoratorDoc(sourceFile, classDeclaration.decorators),
			documentation: '',
		};
		if (classDeclaration.name) {
			fileClasses.name = ts.unescapeLeadingUnderscores(classDeclaration.name.escapedText);
			const symbol = checker.getSymbolAtLocation(classDeclaration.name);
			if (symbol) {
				fileClasses.documentation = ts.displayPartsToString(symbol.getDocumentationComment(checker));
			}
		}
		// const properties = classDeclaration.members.filter((it) => ts.isPropertyDeclaration(it));
		const properties: ClassPropertyDeclarationDoc[] = [];

		classDeclaration.members.map((member) => {
			if (ts.isPropertyDeclaration(member)) {
				const symbol = checker.getSymbolAtLocation(member.name);
				const property: ClassPropertyDeclarationDoc = {
					name: '',
					documentation: '',
					isOptional: ts.SymbolFlags.Property + ts.SymbolFlags.Optional === symbol?.flags,
					decorators: generateDecoratorDoc(sourceFile, member.decorators),
					type: {
						value: member.type?.getText(sourceFile) ?? 'any',
					},
				};
				if (ts.isIdentifier(member.name)) {
					property.name = ts.unescapeLeadingUnderscores(member.name.escapedText);
				} else {
					property.name = member.name.getText(sourceFile);
				}
				if (symbol) {
					property.documentation = ts.displayPartsToString(symbol.getDocumentationComment(checker));
				}

				properties.push(property);
			}
		});
		debugger;

		classes.push(fileClasses);
	}
	return classes;
}
export interface DecoratorDoc {
	name: string;
	expression?: DecoratorExpressionDoc;
}
export interface DecoratorExpressionDoc {
	args: any[];
	expression?: DecoratorExpressionDoc;
}
export interface ObjectLiteralExpressionDoc {
	name: string;
	value: any;
}
export function generateDecoratorDoc(sourceFile: ts.SourceFile, decorators?: ts.NodeArray<ts.Decorator>) {
	if (!decorators) return [];
	return decorators.map((ItemDecorator) => {
		const decorator: DecoratorDoc = {
			name: '',
		};
		recursiveExpression(ItemDecorator.expression, decorator);
		return decorator;
		function recursiveExpression(
			expression: ts.LeftHandSideExpression,
			putExpression: DecoratorDoc | DecoratorExpressionDoc
		) {
			if (ts.isIdentifier(expression)) {
				decorator.name = ts.unescapeLeadingUnderscores(expression.escapedText);
			} else if (ts.isCallExpression(expression)) {
				const args = expression.arguments.map((arg) => {
					////////////// See you next week
					if (ts.isObjectLiteralExpression(arg)) {
						const newObj: ObjectLiteralExpressionDoc = { name: '', value: null };
						generateObjectDoc(sourceFile, arg, newObj);
						return newObj;
					} else if (ts.isArrayLiteralExpression(arg)) {
						return generateArrayDoc(sourceFile, arg);
					}
					// else if (ts.isStringLiteral(arg)) {
					// 	return arg.text;
					// }
					// todo  处理变量标识符
					else {
						return arg.getText(sourceFile);
					}
				});
				putExpression.expression = {
					args,
				};
				recursiveExpression(expression.expression, putExpression.expression);
			}
		}
	});
}
function generateObjectDoc(
	sourceFile: ts.SourceFile,
	object: ts.ObjectLiteralExpression,
	obj: ObjectLiteralExpressionDoc
) {
	object.properties.map((propertie) => {
		if (ts.isPropertyAssignment(propertie)) {
			if (ts.isIdentifier(propertie.name)) {
				obj.name = ts.unescapeLeadingUnderscores(propertie.name.escapedText);
			}
			if (ts.isObjectLiteralExpression(propertie.initializer)) {
				generateObjectDoc(sourceFile, propertie.initializer, obj.value);
			} else if (ts.isArrayLiteralExpression(propertie.initializer)) {
				obj.value = generateArrayDoc(sourceFile, propertie.initializer);
			}
			// else if (ts.isStringLiteral(propertie.initializer)) {
			// 	return propertie.initializer.text;
			// }
			else {
				obj.value = propertie.initializer.getText(sourceFile);
			}
		}
	});
}
function generateArrayDoc(sourceFile: ts.SourceFile, arr: ts.ArrayLiteralExpression): any {
	return arr.elements.map((element) => {
		if (ts.isObjectLiteralExpression(element)) {
			const newObj: ObjectLiteralExpressionDoc = { name: '', value: null };
			generateObjectDoc(sourceFile, element, newObj);
			return newObj;
		} else if (ts.isArrayLiteralExpression(element)) {
			return generateArrayDoc(sourceFile, element);
		}
		// else if (ts.isStringLiteral(element)) {
		// 	return element.text;
		// }
		else {
			return element.getText(sourceFile);
		}
	});
}
function getDeclarations(sourceFile: ts.SourceFile) {
	const importDeclarations: ts.ImportDeclaration[] = [];
	const variableStatements: ts.VariableStatement[] = [];
	const enumDeclarations: ts.EnumDeclaration[] = [];
	const classDeclarations: ts.ClassDeclaration[] = [];
	for (const statement of sourceFile.statements) {
		if (ts.isImportDeclaration(statement)) {
			importDeclarations.push(statement);
		} else if (ts.isVariableStatement(statement)) {
			variableStatements.push(statement);
		} else if (ts.isEnumDeclaration(statement)) {
			enumDeclarations.push(statement);
		} else if (ts.isClassDeclaration(statement)) {
			classDeclarations.push(statement);
		}
	}
	return { importDeclarations, variableStatements, enumDeclarations, classDeclarations };
}
