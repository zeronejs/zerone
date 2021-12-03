import * as ts from 'typescript';
export function getTypeReferences(type: ts.TypeNode, arr: Set<string> = new Set()) {
    if (ts.isTypeReferenceNode(type)) {
        let typeName = '';
        if (ts.isIdentifier(type.typeName)) {
            typeName = ts.unescapeLeadingUnderscores(type.typeName.escapedText);
        } else if (ts.isQualifiedName(type.typeName) && ts.isIdentifier(type.typeName.left)) {
            typeName = ts.unescapeLeadingUnderscores(type.typeName.left.escapedText);
        }
        arr.add(typeName);
    } else if (ts.isUnionTypeNode(type) || ts.isIntersectionTypeNode(type)) {
        for (const itemType of type.types) {
            getTypeReferences(itemType, arr);
        }
    } else if (ts.isArrayTypeNode(type)) {
        getTypeReferences(type.elementType, arr);
    } else if (ts.isTypeLiteralNode(type)) {
        for (const item of type.members) {
            if (ts.isPropertySignature(item) && item.type) {
                getTypeReferences(item.type, arr);
            }
        }
    } else if (ts.isTupleTypeNode(type)) {
        for (const itemType of type.elements) {
            getTypeReferences(itemType, arr);
        }
    } else {
        // Common types do not need to be processed
    }

    return [...arr];
}
