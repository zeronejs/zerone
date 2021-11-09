import * as ts from 'typescript';
import { generateArrayDoc } from './array.interpret';
export interface ObjectLiteralExpressionDoc {
	name: string;
	value: any;
}
export function generateObjectDoc(
	sourceFile: ts.SourceFile,
	object: ts.ObjectLiteralExpression,
	obj: ObjectLiteralExpressionDoc
) {
	object.properties.map((propertie) => {
		if (ts.isPropertyAssignment(propertie)) {
			if (ts.isIdentifier(propertie.name)) {
				obj.name = ts.unescapeLeadingUnderscores(propertie.name.escapedText);
			}
			if (ts.isObjectLiteralExpression(propertie.initializer)) {
				generateObjectDoc(sourceFile, propertie.initializer, obj.value);
			} else if (ts.isArrayLiteralExpression(propertie.initializer)) {
				obj.value = generateArrayDoc(sourceFile, propertie.initializer);
			}
			// else if (ts.isStringLiteral(propertie.initializer)) {
			// 	return propertie.initializer.text;
			// }
			else {
				obj.value = propertie.initializer.getText(sourceFile);
			}
		}
	});
}
