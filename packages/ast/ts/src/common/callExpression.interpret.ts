import * as ts from 'typescript';
import { generateArrayDoc } from './array.interpret';
import { generateObjectDoc } from './object.interpret';
export interface CallExpressionDoc {
    args?: any[];
    name?: string;
    expression?: CallExpressionDoc;
}

export function generateCallExpressionDoc(sourceFile: ts.SourceFile, callExpression: ts.CallExpression) {
    const callExpressionDoc: CallExpressionDoc = {
        args: callExpression.arguments.map(arg => {
            if (ts.isObjectLiteralExpression(arg)) {
                const newObj = {};
                generateObjectDoc(sourceFile, arg, newObj);
                return newObj;
            } else if (ts.isArrayLiteralExpression(arg)) {
                return generateArrayDoc(sourceFile, arg);
            } else if (ts.isCallExpression(arg)) {
                return generateCallExpressionDoc(sourceFile, arg);
            }
            // else if (ts.isStringLiteral(arg)) {
            // 	return arg.text;
            // }
            // todo  处理变量标识符
            else {
                return arg.getText(sourceFile);
            }
        }),
    };
    if (ts.isPropertyAccessExpression(callExpression.expression)) {
        callExpressionDoc.expression = {};
        callExpressionDoc.name = ts.unescapeLeadingUnderscores(callExpression.expression.name.escapedText);
        generatePropertyAccessExpressionDoc(callExpression.expression, callExpressionDoc.expression);
        if (ts.isCallExpression(callExpression.expression.expression)) {
            callExpressionDoc.expression = generateCallExpressionDoc(
                sourceFile,
                callExpression.expression.expression
            );
        }
    } else if (ts.isIdentifier(callExpression.expression)) {
        callExpressionDoc.name = ts.unescapeLeadingUnderscores(callExpression.expression.escapedText);
    }

    return callExpressionDoc;

    function generatePropertyAccessExpressionDoc(
        expression: ts.PropertyAccessExpression,
        inputCall: CallExpressionDoc
    ) {
        // inputCall.name = ts.unescapeLeadingUnderscores(expression.name.escapedText);
        if (ts.isCallExpression(expression.expression)) {
            inputCall.expression = generateCallExpressionDoc(sourceFile, expression.expression);
        } else if (ts.isPropertyAccessExpression(expression.expression)) {
            inputCall.expression = {};
            inputCall.name = ts.unescapeLeadingUnderscores(expression.name.escapedText);
            generatePropertyAccessExpressionDoc(expression.expression, inputCall.expression);
        } else if (ts.isIdentifier(expression.expression)) {
            inputCall.name = ts.unescapeLeadingUnderscores(expression.expression.escapedText);
        }
    }
}
