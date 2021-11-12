import * as ts from 'typescript';
import { DeclarationType, InterpretCore } from './interpret.core';
export interface SourceFileExports {
	from: string;
	elements: string[];
	namespaceExport?: string;
}
export class ExportsInterpret {
	constructor(private readonly interpretCore: InterpretCore) {}
	interpret() {
		const exportDeclarations = this.interpretCore.getDeclarationsItem(DeclarationType.exportDeclaration);
		const exports: SourceFileExports[] = [];
		for (const exportDeclaration of exportDeclarations) {
			const fileExport: SourceFileExports = {
				from: '',
				elements: [],
			};
			if (exportDeclaration.moduleSpecifier && ts.isStringLiteral(exportDeclaration.moduleSpecifier)) {
				fileExport.from = exportDeclaration.moduleSpecifier.text;
			}

			if (exportDeclaration.exportClause && ts.isNamedExports(exportDeclaration.exportClause)) {
				fileExport.elements = exportDeclaration.exportClause.elements.map((it) =>
					ts.unescapeLeadingUnderscores(it.name.escapedText)
				);
			} else if (
				exportDeclaration.exportClause &&
				ts.isNamespaceExport(exportDeclaration.exportClause)
			) {
				fileExport.namespaceExport = ts.unescapeLeadingUnderscores(
					exportDeclaration.exportClause.name.escapedText
				);
			}

			exports.push(fileExport);
		}
		return exports;
	}
}
