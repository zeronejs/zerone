import * as ts from 'typescript';
import { DecoratorDoc, generateDecoratorDoc } from './common/decorator.interpret';
import { DeclarationType, InterpretCore } from './interpret.core';
export interface SourceFileClasses {
	name: string;
	decorators: DecoratorDoc[];
	documentation: string;
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
export class ClassesInterpret {
	constructor(private readonly interpretCore: InterpretCore) {}
	interpret() {
		const classDeclarations = this.interpretCore.getDeclarationsItem(DeclarationType.classDeclarations);
		const checker = this.interpretCore.program.getTypeChecker();
		const classes: SourceFileClasses[] = [];
		for (const classDeclaration of classDeclarations) {
			const fileClasses: SourceFileClasses = {
				name: '',
				decorators: generateDecoratorDoc(this.interpretCore.sourceFile, classDeclaration.decorators),
				documentation: '',
			};
			if (classDeclaration.name) {
				fileClasses.name = ts.unescapeLeadingUnderscores(classDeclaration.name.escapedText);
				const symbol = checker.getSymbolAtLocation(classDeclaration.name);
				if (symbol) {
					fileClasses.documentation = ts.displayPartsToString(
						symbol.getDocumentationComment(checker)
					);
				}
			}
			// const properties = classDeclaration.members.filter((it) => ts.isPropertyDeclaration(it));
			const properties: ClassPropertyDeclarationDoc[] = [];

			classDeclaration.members.map((member) => {
				if (ts.isPropertyDeclaration(member)) {
					const symbol = checker.getSymbolAtLocation(member.name);
					const property: ClassPropertyDeclarationDoc = {
						name: this.interpretCore.getIdentifierTextName(member.name),
						documentation: '',
						isOptional: ts.SymbolFlags.Property + ts.SymbolFlags.Optional === symbol?.flags,
						decorators: generateDecoratorDoc(this.interpretCore.sourceFile, member.decorators),
						type: {
							value: member.type?.getText(this.interpretCore.sourceFile) ?? 'any',
						},
					};
					if (symbol) {
						property.documentation = ts.displayPartsToString(
							symbol.getDocumentationComment(checker)
						);
					}

					properties.push(property);
				}
			});

			classes.push(fileClasses);
		}
		return classes;
	}
}
