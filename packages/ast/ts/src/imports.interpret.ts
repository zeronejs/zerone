import * as ts from 'typescript';
import { DeclarationType, InterpretCore } from './interpret.core';
export interface SourceFileImports {
	from: string;
	elements: string[];
	defalutImport?: string;
	namespaceImport?: string;
}
export class ImportsInterpret {
	constructor(private readonly interpretCore: InterpretCore) {}
	interpret() {
		const importDeclarations = this.interpretCore.getDeclarationsItem(DeclarationType.importDeclaration);
		const inports: SourceFileImports[] = [];
		for (const importDeclaration of importDeclarations) {
			const fileImport: SourceFileImports = {
				from: '',
				elements: [],
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
}
