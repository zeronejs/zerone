import * as ts from 'typescript';
import { DeclarationType, InterpretCore } from './interpret.core';
export interface SourceFileTypeAlias {
	name: string;
}

export class TypeAliasInterpret {
	constructor(private readonly interpretCore: InterpretCore) {}
	interpret() {
		const typeAliasDeclarations = this.interpretCore.getDeclarationsItem(
			DeclarationType.typeAliasDeclarations
		);
		return typeAliasDeclarations.map((typeAliasDeclaration) => {
			const typeAliasItem: SourceFileTypeAlias = {
				name: ts.unescapeLeadingUnderscores(typeAliasDeclaration.name.escapedText),
			};
			return typeAliasItem;
		});
	}
}
