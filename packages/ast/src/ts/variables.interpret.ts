import * as ts from 'typescript';
import { generateArrayDoc } from './common/array.interpret';
import { generateObjectDoc } from './common/object.interpret';
import { DeclarationType, InterpretCore } from './interpret.core';
export interface SourceFileVariables {
	name: string;
	type?: string;
	value?: any;
}
export class VariablesInterpret {
	constructor(private readonly interpretCore: InterpretCore) {}
	interpret() {
		const variableStatements = this.interpretCore.getDeclarationsItem(DeclarationType.variableStatements);
		const variables: SourceFileVariables[] = [];
		for (const variableStatement of variableStatements) {
			variableStatement.declarationList.declarations.map((declaration) => {
				if (!ts.isVariableDeclaration(declaration)) {
					return;
				}
				const variable: SourceFileVariables = {
					name: this.interpretCore.getIdentifierTextName(declaration.name),
				};
				if (declaration.type) {
					variable.type = declaration.type.getText(this.interpretCore.sourceFile);
				}
				if (declaration.initializer) {
					if (ts.isObjectLiteralExpression(declaration.initializer)) {
						const newObj = {};
						generateObjectDoc(this.interpretCore.sourceFile, declaration.initializer, newObj);
						variable.value = newObj;
					} else if (ts.isArrayLiteralExpression(declaration.initializer)) {
						variable.value = generateArrayDoc(
							this.interpretCore.sourceFile,
							declaration.initializer
						);
					} else {
						variable.value = declaration.initializer.getText(this.interpretCore.sourceFile);
					}
				}
				variables.push(variable);
			});
		}
		return variables;
	}
}
