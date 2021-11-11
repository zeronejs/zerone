import * as ts from 'typescript';
import { generateArrayDoc } from './common/array.interpret';
import { generateObjectDoc } from './common/object.interpret';
import { DeclarationType, InterpretCore } from './interpret.core';
export interface SourceFileEnums {
	name: string;
	members: EnumMemberDeclarationsDoc[];
}
interface EnumMemberDeclarationsDoc {
	name: string;
	value?: any;
}
export class EnumsInterpret {
	constructor(private readonly interpretCore: InterpretCore) {}
	interpret() {
		const enumDeclarations = this.interpretCore.getDeclarationsItem(DeclarationType.enumDeclarations);
		return enumDeclarations.map((enumDeclaration) => {
			const enumsItem: SourceFileEnums = {
				name: ts.unescapeLeadingUnderscores(enumDeclaration.name.escapedText),
				members: enumDeclaration.members.map((member) => {
					const enumMember: EnumMemberDeclarationsDoc = {
						name: this.interpretCore.getIdentifierTextName(member.name),
					};
					if (member.initializer) {
						if (ts.isObjectLiteralExpression(member.initializer)) {
							const newObj = {};
							generateObjectDoc(this.interpretCore.sourceFile, member.initializer, newObj);
							enumMember.value = newObj;
						} else if (ts.isArrayLiteralExpression(member.initializer)) {
							enumMember.value = generateArrayDoc(
								this.interpretCore.sourceFile,
								member.initializer
							);
						} else {
							enumMember.value = member.initializer.getText(this.interpretCore.sourceFile);
						}
					}
					return enumMember;
				}),
			};
			return enumsItem;
		});
	}
}
