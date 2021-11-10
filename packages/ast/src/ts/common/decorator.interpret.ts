import * as ts from 'typescript';
import { generateArrayDoc } from './array.interpret';
import { generateObjectDoc } from './object.interpret';
export interface DecoratorDoc {
	name: string;
	expression?: DecoratorExpressionDoc;
}
export interface DecoratorExpressionDoc {
	args: any[];
	expression?: DecoratorExpressionDoc;
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
					if (ts.isObjectLiteralExpression(arg)) {
						const newObj = {};
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
