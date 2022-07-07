import { upperFirst } from 'lodash';
import { Schema as SwaggerSchema } from 'swagger-schema-official';
import { ConstructorDeclaration, SourceFile, SyntaxKind, VariableDeclarationKind } from 'ts-morph';
import { getRefTypeName } from '../../utils/generateUtil';
export class GMockClass {
    private schema: SwaggerSchema;
    private sourceFile: SourceFile;
    private keyName: string;
    private ctorBody?: ConstructorDeclaration;
    constructor(swaggerSchema: SwaggerSchema, sourceFile: SourceFile, keyName: string) {
        this.schema = swaggerSchema;
        this.sourceFile = sourceFile;
        this.keyName = keyName;
    }

    private genObjectType(prefix = '') {
        let varDeclaration = this.sourceFile.getVariableDeclaration(this.keyName);
        if (!varDeclaration) {
            const variableStatement = this.sourceFile.addVariableStatement({
                declarationKind: VariableDeclarationKind.Const, // defaults to "let"
                declarations: [{ name: this.keyName, initializer: '{}' }],
            });
            varDeclaration = this.sourceFile.getVariableDeclarationOrThrow(this.keyName);
        }
        const objectLiteralExpression = varDeclaration.getInitializerIfKindOrThrow(
            SyntaxKind.ObjectLiteralExpression
        );
        // const propertyAssignment = objectLiteralExpression.addPropertyAssignment({
        //     name: "'propertyAssignment|5'",
        //     initializer: '5',
        // });
        const properties = this.schema.properties;
        const additionalProperties = this.schema.additionalProperties;
        const requireds = this.schema.required ?? [];
        if (!properties && !additionalProperties) {
            return;
        }

        if (properties) {
            const addPropertiesInput = Object.keys(properties).map(key => {
                const inputKey = key.includes('-') || key.includes('.') ? `'${key}'` : key;
                const obj = this.getTsMockCtrlData(properties[key], key, prefix) + '`';
                // 普通属性
                return {
                    key,
                    ...this.getTsMockCtrlData(properties[key], key, prefix),
                };
            });

            const propertiesDeclaration = objectLiteralExpression.addPropertyAssignments(addPropertiesInput);
        }
    }
    getTsMockCtrlData(
        subSchema: SwaggerSchema,
        subKeyName: string,
        prefix = ''
    ): { name: string; initializer: string } {
        if (subSchema.$ref) {
            const typeName = upperFirst(prefix) + getRefTypeName(subSchema.$ref);
            const typeNameInterface = this.sourceFile.getInterface(typeName);
            // import 导入
            let importDeclaration = this.sourceFile.getImportDeclaration('@/api/mocks');
            if (importDeclaration) {
                const names = importDeclaration.getNamedImports().map(it => it.getName());
                if (!names.includes(typeName) && !typeNameInterface) {
                    importDeclaration.addNamedImport(typeName);
                }
            } else if (!typeNameInterface) {
                importDeclaration = this.sourceFile.addImportDeclaration({
                    moduleSpecifier: '@/api/mocks',
                });
                importDeclaration.addNamedImport(typeName);
            }
            return { name: subKeyName, initializer: `'${typeName}'` };
        }
        // todo
        return { name: '', initializer: '' };
        // switch (subSchema.type) {
        //     case 'string':
        //         if (subSchema.enum && subSchema.enum.length) {
        //             return {
        //                 name: subKeyName,
        //                 initializer: `[${subSchema.enum.map(it => `'${it}'`).join(',')}]`,
        //             };
        //         }
        //         return { name: subKeyName, initializer: `'@sentence(1, 2)'` };

        //     case 'number':
        //         if (subSchema.enum && subSchema.enum.length) {
        //             return {
        //                 name: subKeyName,
        //                 initializer: `[${subSchema.enum.join(',')}]`,
        //             };
        //         }
        //         return { name: subKeyName, initializer: `'@integer(300, 5000)'` };
        //     case 'integer':
        //         return { name: subKeyName, initializer: `'@integer(300, 5000)'` };
        //     case 'boolean':
        //         return { name: subKeyName, initializer: `'@boolean()'` };
        //     case 'array':
        //         if (subSchema.items) {
        //             if (Array.isArray(subSchema.items)) {
        //                 return {
        //                     name: `'${subKeyName}|10'`,
        //                     initializer: subSchema.items
        //                         .map(it => this.getTsMockCtrlData(it, subKeyName, prefix))
        //                         .map(it => `'${it}'`)
        //                         .join(' | '),
        //                 };
        //             }
        //             return this.getTsMockCtrlData(subSchema.items, subKeyName, prefix) + '[]';
        //         }
        //         return 'unknown[]';
        //     case 'object':
        //         if (subSchema.properties || subSchema.additionalProperties) {
        //             // if (subSchema.properties) {
        //             const keyName = this.keyName + upperFirst(subKeyName);
        //             new GMockClass(subSchema, this.sourceFile, keyName).genTsType(prefix);
        //             return keyName;
        //         }
        //         return 'Record<string, any>';

        //     case 'file':
        //         return 'File';

        //     default:
        //         return 'unknown';
        // }
    }
    getTsType(subSchema: SwaggerSchema, subKeyName: string, prefix = ''): string {
        if (subSchema.$ref) {
            const typeName = upperFirst(prefix) + getRefTypeName(subSchema.$ref);
            const typeNameInterface = this.sourceFile.getInterface(typeName);
            // import 导入
            let importDeclaration = this.sourceFile.getImportDeclaration('@/api/mocks');
            if (importDeclaration) {
                const names = importDeclaration.getNamedImports().map(it => it.getName());
                if (!names.includes(typeName) && !typeNameInterface) {
                    importDeclaration.addNamedImport(typeName);
                }
            } else if (!typeNameInterface) {
                importDeclaration = this.sourceFile.addImportDeclaration({
                    moduleSpecifier: '@/api/mocks',
                });
                importDeclaration.addNamedImport(typeName);
            }
            // if(this.ctor){
            //     this.ctor.addBody('')
            // }
            return typeName;
        }

        switch (subSchema.type) {
            case 'string':
                if (subSchema.enum && subSchema.enum.length) {
                    return subSchema.enum.map(it => `'${it}'`).join(' | ');
                }
                return 'string';
            case 'number':
                if (subSchema.enum && subSchema.enum.length) {
                    return subSchema.enum.join(' | ');
                }
                return 'number';
            case 'integer':
                return 'number';
            case 'boolean':
                return 'boolean';
            case 'array':
                if (subSchema.items) {
                    if (Array.isArray(subSchema.items)) {
                        return subSchema.items
                            .map(it => this.getTsType(it, subKeyName, prefix))
                            .map(it => `'${it}'`)
                            .join(' | ');
                    }
                    return this.getTsType(subSchema.items, subKeyName, prefix) + '[]';
                }
                return 'unknown[]';
            case 'object':
                if (subSchema.properties || subSchema.additionalProperties) {
                    // if (subSchema.properties) {
                    const keyName = this.keyName + upperFirst(subKeyName);
                    new GMockClass(subSchema, this.sourceFile, keyName).genTsType(prefix);
                    return keyName;
                }
                return 'Record<string, any>';

            case 'file':
                return 'File';

            default:
                return 'unknown';
        }
    }
    genTsType(prefix = '') {
        // if (!this.schema) {
        //     return this.genUnknownType();
        // }

        // if (this.schema.allOf) {
        //     return this.genAllOfType();
        // }

        // if (this.schema.$ref) {
        //     return this.genRefType();
        // }

        // if (this.schema.type === 'boolean') {
        //     return this.genBooleanType();
        // }

        // if (this.schema.type === 'string') {
        //     return this.genStringType();
        // }

        // if (['number', 'integer'].includes(this.schema.type as string)) {
        //     return this.genNumberType();
        // }

        if (this.schema.type === 'object') {
            return this.genObjectType(prefix);
        }

        // if (this.schema.type === 'array') {
        //     return this.genArrayType();
        // }

        // return this.genAnyType();
    }
}
