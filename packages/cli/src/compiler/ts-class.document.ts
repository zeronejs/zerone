import { basename } from 'path';
import * as ts from 'typescript';
// import * as fs from 'fs';

export interface DocEntry {
	name?: string;
	fileName?: string;
	baseFileName?: string;
	documentation?: string;
	type?: string;
	constructors?: DocEntry[];
	parameters?: DocEntry[];
	returnType?: string;
	property?: DocEntryProperty[];
}
export interface DocEntryProperty {
	flags: ts.SymbolFlags;
	escapedName: string;
	documentation: ts.SymbolDisplayPart[];
	type?: string;
	isOptional?: boolean;
	isUnionType?: boolean;
	isSpecialColumn: boolean;
}

/** Generate documentation for all classes in a set of .ts files */
export function generateDocumentation(fileNames: string[], options: ts.CompilerOptions): DocEntry[] {
	// Build a program using the set of root file names in fileNames
	const program = ts.createProgram(fileNames, options);

	// Get the checker, we will use it to find more about classes
	const checker = program.getTypeChecker();
	const output: DocEntry[] = [];

	// Visit every sourceFile in the program
	for (const sourceFile of program.getSourceFiles()) {
		if (!sourceFile.isDeclarationFile) {
			// Walk the tree to search for classes
			ts.forEachChild(sourceFile, visit);
		}
	}

	// print out the doc
	// fs.writeFileSync('classes.json', JSON.stringify(output, undefined, 4));

	return output;

	/** visit nodes finding exported classes */
	function visit(node: ts.Node) {
		// Only consider exported nodes
		if (!isNodeExported(node)) {
			return;
		}

		if (ts.isClassDeclaration(node) && node.name) {
			// This is a top level class, get its symbol
			const symbol = checker.getSymbolAtLocation(node.name);
			if (symbol) {
				output.push(serializeClass(symbol));
			}
			// No need to walk any further, class expressions/inner declarations
			// cannot be exported
		} else if (ts.isModuleDeclaration(node)) {
			// This is a namespace, visit its children
			ts.forEachChild(node, visit);
		}
	}

	/** Serialize a symbol into a json object */
	function serializeSymbol(symbol: ts.Symbol): DocEntry {
		const type = checker.getDeclaredTypeOfSymbol(symbol);
		// console.log({ name: symbol.getName() });
		// type.
		// console.log(checker.getBaseTypeOfLiteralType(type,))
		// type.
		const res = checker.getPropertiesOfType(type).map((it) => {
			const item = it as any;
			// console.log(item.valueDeclaration.type.kind);
			// it.valueDeclaration && Reflect.deleteProperty(it.valueDeclaration, 'parent');
			let isSpecialColumn = false;
			it.valueDeclaration?.decorators?.forEach((element: any) => {
				if (element.expression.expression) {
					const text = element.expression.expression.escapedText;
					switch (text) {
						case 'PrimaryGeneratedColumn':
							isSpecialColumn = true;
							break;
						case 'CreateDateColumn':
							isSpecialColumn = true;
							break;
						case 'UpdateDateColumn':
							isSpecialColumn = true;
							break;
					}
				}
			});
			const property: DocEntryProperty = {
				flags: it.flags,
				escapedName: it.escapedName.toString(),
				documentation: it.getDocumentationComment(checker),
				isOptional: ts.SymbolFlags.Property + ts.SymbolFlags.Optional === it.flags,
				isSpecialColumn,
			};
			if (item.valueDeclaration.type) {
				property.type = getSimpleTypeStringBySyntaxKind(item.valueDeclaration.type);
				switch (item.valueDeclaration.type.kind) {
					// 联合类型   先暂不处理
					case ts.SyntaxKind.UnionType:
						property.isUnionType = true;
						// console.log(item.valueDeclaration.type.types);
						break;
					default:
						break;
				}
			}
			return property;
		});
		return {
			baseFileName: basename((symbol as any).parent.valueDeclaration.fileName.replace(/.entity.ts$/, '')),
			name: symbol.getName(),
			documentation: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
			type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)),
			property: res,
		};
	}

	function getSimpleTypeStringBySyntaxKind(type: any): string {
		switch (type.kind) {
			case ts.SyntaxKind.StringKeyword:
				return 'string';
			case ts.SyntaxKind.NumberKeyword:
				return 'number';
			case ts.SyntaxKind.BooleanKeyword:
				return 'boolean';
			case ts.SyntaxKind.ArrayType:
				if (type.elementType) {
					return `Array<${getSimpleTypeStringBySyntaxKind(type.elementType)}>`;
				}
				return 'any[]';
			case ts.SyntaxKind.UndefinedKeyword:
				return 'undefined';
			case ts.SyntaxKind.AnyKeyword:
				return 'any';
			case ts.SyntaxKind.UnknownKeyword:
				return 'unknown';
			// 引用类型  目前直接用类型的字符串
			case ts.SyntaxKind.TypeReference:
				// console.log(type.typeName.parent)
				return type.typeName.escapedText;
			default:
				return '';
		}
	}
	/** Serialize a class symbol information */
	function serializeClass(symbol: ts.Symbol) {
		const details = serializeSymbol(symbol);
		// Get the construct signatures
		const constructorType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!);
		details.constructors = constructorType.getConstructSignatures().map(serializeSignature);
		return details;
	}

	/** Serialize a signature (call or construct) */
	function serializeSignature(signature: ts.Signature) {
		return {
			parameters: signature.parameters.map(serializeSymbol),
			returnType: checker.typeToString(signature.getReturnType()),
			documentation: ts.displayPartsToString(signature.getDocumentationComment(checker)),
		};
	}

	/** True if this is visible outside this file, false otherwise */
	function isNodeExported(node: ts.Node): boolean {
		return (
			(ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0 ||
			(!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
		);
	}
}
