import * as ts from 'typescript';
import { generateArrayDoc } from './array.interpret';
import { generateCallExpressionDoc } from './callExpression.interpret';
export function generateObjectDoc(sourceFile: ts.SourceFile, object: ts.ObjectLiteralExpression, obj: any) {
    object.properties.map(propertie => {
        if (ts.isPropertyAssignment(propertie)) {
            let key = '';
            if (ts.isIdentifier(propertie.name)) {
                key = ts.unescapeLeadingUnderscores(propertie.name.escapedText);
            } else {
                key = propertie.name.getText(sourceFile);
            }
            if (ts.isObjectLiteralExpression(propertie.initializer)) {
                obj[key] = {};
                generateObjectDoc(sourceFile, propertie.initializer, obj[key]);
            } else if (ts.isArrayLiteralExpression(propertie.initializer)) {
                obj[key] = generateArrayDoc(sourceFile, propertie.initializer);
            } else if (ts.isCallExpression(propertie.initializer)) {
                obj[key] = generateCallExpressionDoc(sourceFile, propertie.initializer);
            }
            // else if (ts.isStringLiteral(propertie.initializer)) {
            // 	return propertie.initializer.text;
            // }
            else {
                obj[key] = propertie.initializer.getText(sourceFile);
            }
        }
    });
}
