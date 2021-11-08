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
	const sourceFiles = getSourceFiles(fileNames, options);
	for (const sourceFile of sourceFiles) {
		output.push(visit(sourceFile));
	}
	return output;
	function visit(sourceFile: ts.SourceFile) {
		// todo
		const { importDeclarations, variableStatements, enumDeclarations, classDeclarations } =
			getDeclarations(sourceFile);
		const inports = generateImportDeclarationsDoc(importDeclarations);
		const classes = generateClassDeclarationsDoc(classDeclarations, sourceFile);
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
export function generateClassDeclarationsDoc(
	classDeclarations: ts.ClassDeclaration[],
	sourceFile: ts.SourceFile
): FileClasses[] {
	const classes: FileClasses[] = [];
	for (const classDeclaration of classDeclarations) {
		const fileClasses: FileClasses = {
			name: '',
			decorators: [],
		};
		if (classDeclaration.name?.escapedText) {
			fileClasses.name = ts.unescapeLeadingUnderscores(classDeclaration.name.escapedText);
		}
		fileClasses.decorators = generateDecoratorDoc(sourceFile, classDeclaration.decorators);
		debugger;
		classes.push(fileClasses);
	}
	return classes;
}
export interface DecoratorDoc {
	name: string;
	expression: DecoratorExpressionDoc;
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
			expression: { args: [] },
		};
		// todo. This assumes that the decorator does not have multiple expressions nested
		recursiveExpression(ItemDecorator.expression, decorator.expression);
		return decorator;
		function recursiveExpression(
			expression: ts.LeftHandSideExpression,
			putExpression: DecoratorExpressionDoc
		) {
			if (ts.isIdentifier(expression)) {
				decorator.name = ts.unescapeLeadingUnderscores(expression.escapedText);
			} else if (ts.isCallExpression(expression)) {
				const args = expression.arguments.map((arg) => {
					////////////// See you next week
					if (ts.isObjectLiteralExpression(arg)) {
						const newObj: ObjectLiteralExpressionDoc = { name: '', value: null };
						handleObject(arg, newObj, sourceFile);
						return newObj;
					} else if (ts.isArrayLiteralExpression(arg)) {
						return handleArray(arg, sourceFile);
					} else if (ts.isStringLiteral(arg)) {
						return arg.text;
					} else {
						return arg.getText(sourceFile);
					}
				});
				putExpression.args = args;
				putExpression.expression = { args: [] };
				recursiveExpression(expression.expression, putExpression.expression);
			}
		}
	});
}
function handleObject(
	object: ts.ObjectLiteralExpression,
	obj: ObjectLiteralExpressionDoc,
	sourceFile: ts.SourceFile
) {
	object.properties.map((propertie) => {
		if (ts.isPropertyAssignment(propertie)) {
			if (ts.isIdentifier(propertie.name)) {
				obj.name = ts.unescapeLeadingUnderscores(propertie.name.escapedText);
			}
			if (ts.isObjectLiteralExpression(propertie.initializer)) {
				handleObject(propertie.initializer, obj.value, sourceFile);
			} else if (ts.isArrayLiteralExpression(propertie.initializer)) {
				obj.value = handleArray(propertie.initializer, sourceFile);
			} else if (ts.isStringLiteral(propertie.initializer)) {
				return propertie.initializer.text;
			} else {
				obj.value = propertie.initializer.getText(sourceFile);
			}
		}
	});
}
function handleArray(arr: ts.ArrayLiteralExpression, sourceFile: ts.SourceFile): any {
	return arr.elements.map((element) => {
		if (ts.isObjectLiteralExpression(element)) {
			const newObj: ObjectLiteralExpressionDoc = { name: '', value: null };
			handleObject(element, newObj, sourceFile);
			return newObj;
		} else if (ts.isArrayLiteralExpression(element)) {
			return handleArray(element, sourceFile);
		} else if (ts.isStringLiteral(element)) {
			return element.text;
		} else {
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
