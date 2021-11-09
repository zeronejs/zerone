import * as ts from 'typescript';
import { generateObjectDoc, ObjectLiteralExpressionDoc } from './object.interpret';

export function generateArrayDoc(sourceFile: ts.SourceFile, arr: ts.ArrayLiteralExpression): any {
	return arr.elements.map((element) => {
		if (ts.isObjectLiteralExpression(element)) {
			const newObj: ObjectLiteralExpressionDoc = { name: '', value: null };
			generateObjectDoc(sourceFile, element, newObj);
			return newObj;
		} else if (ts.isArrayLiteralExpression(element)) {
			return generateArrayDoc(sourceFile, element);
		}
		// else if (ts.isStringLiteral(element)) {
		// 	return element.text;
		// }
		else {
			return element.getText(sourceFile);
		}
	});
}
