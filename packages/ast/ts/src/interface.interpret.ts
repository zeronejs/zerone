import * as ts from 'typescript';
import { DeclarationType, InterpretCore } from './interpret.core';
export interface SourceFileInterfaces {
	name: string;
}

export class InterfaceInterpret {
	constructor(private readonly interpretCore: InterpretCore) {}
	interpret() {
		const interfaceDeclarations = this.interpretCore.getDeclarationsItem(
			DeclarationType.interfaceDeclarations
		);
		return interfaceDeclarations.map((interfaceDeclaration) => {
			const item: SourceFileInterfaces = {
				name: ts.unescapeLeadingUnderscores(interfaceDeclaration.name.escapedText),
			};
			return item;
		});
	}
}
