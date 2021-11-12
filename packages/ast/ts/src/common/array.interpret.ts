import * as ts from 'typescript';
import { generateCallExpressionDoc } from './callExpression.interpret';
import { generateObjectDoc } from './object.interpret';

export function generateArrayDoc(sourceFile: ts.SourceFile, arr: ts.ArrayLiteralExpression): any {
	return arr.elements.map((element) => {
		if (ts.isObjectLiteralExpression(element)) {
			const newObj = {};
			generateObjectDoc(sourceFile, element, newObj);
			return newObj;
		} else if (ts.isArrayLiteralExpression(element)) {
			return generateArrayDoc(sourceFile, element);
		} else if (ts.isCallExpression(element)) {
			return generateCallExpressionDoc(sourceFile, element);
		}
		// else if (ts.isStringLiteral(element)) {
		// 	return element.text;
		// }
		else {
			return element.getText(sourceFile);
		}
	});
}
