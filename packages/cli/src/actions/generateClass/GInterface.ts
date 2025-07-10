import { upperFirst } from 'lodash';
import { Schema as SwaggerSchema } from 'swagger-schema-official';
import { InterfaceDeclaration, SourceFile } from 'ts-morph';
import { getRefTypeName, isNumberStart } from '../../utils/generateUtil';
export class GInterface {
    private schema: SwaggerSchema;
    private sourceFile: SourceFile;
    private keyName: string;

    constructor(
        swaggerSchema: SwaggerSchema,
        sourceFile: SourceFile,
        keyName: string,
        public options: { interfacePre: string }
    ) {
        this.schema = swaggerSchema;
        this.sourceFile = sourceFile;
        this.keyName = keyName;
    }
    private genStringType(prefix = '') {
        if (!this.keyName) {
            return;
        }
        let declaration;
        if (this.schema.enum && this.schema.enum?.length > 0) {
            declaration = this.sourceFile.getEnum(this.keyName);
            if (!declaration) {
                declaration = this.sourceFile.addEnum({
                    name: this.keyName,
                    members: this.schema.enum.map(it => ({ name: it, value: it })),
                });
            }
        } else {
            declaration = this.sourceFile.getTypeAlias(this.keyName);
            if (!declaration) {
                declaration = this.sourceFile.addTypeAlias({
                    name: this.keyName,
                    type: this.getTsType(this.schema, '', prefix),
                });
            }
        }

        declaration.setIsExported(true);
        return declaration;
    }
    private genObjectType(prefix = '', extendsName?: string) {
        if (!this.keyName) {
            return;
        }
        let interfaceDeclaration = this.sourceFile.getInterface(this.keyName);
        if (!interfaceDeclaration) {
            interfaceDeclaration = this.sourceFile.addInterface({
                name: this.keyName,
            });
        }
        // 如果有属性说明已添加过
        if (interfaceDeclaration.getProperties().length) {
            return interfaceDeclaration;
        }
        interfaceDeclaration.setIsExported(true);
        if (extendsName) {
            interfaceDeclaration.addExtends(extendsName);
        }

        const properties = this.schema.properties;
        const additionalProperties = this.schema.additionalProperties;
        const requireds = this.schema.required ?? [];
        if (!properties && !additionalProperties && !extendsName) {
            interfaceDeclaration.addIndexSignature({
                keyName: 'key', // defaults to key
                keyType: 'string', // defaults to string
                returnType: 'any',
            });
            return interfaceDeclaration;
        }
        if (properties) {
            const addPropertiesInput = Object.keys(properties).map(key => {
                const inputKey =
                    key.includes('[') ||
                    key.includes('-') ||
                    key.includes('.') ||
                    isNumberStart(key) ||
                    key.includes('/') ||
                    key.includes('#') ||
                    key.includes('\\')
                        ? `'${key}'`
                        : key;
                // 普通属性
                return {
                    key,
                    name: inputKey,
                    type:
                        this.getTsType(
                            properties[key],
                            key
                                .replaceAll('[', '___')
                                .replaceAll(']', '___')
                                .replaceAll('-', '___')
                                .replaceAll('/', '___')
                                .replaceAll('\\', '___')
                                .replaceAll('.', '___')
                                .replaceAll('#', '___'),
                            prefix
                        ) ?? 'any',
                    hasQuestionToken: !requireds.includes(key),
                };
            });
            const propertiesDeclaration = interfaceDeclaration.addProperties(addPropertiesInput);
            addPropertiesInput.forEach((it, index) => {
                const desc = properties[it.key].description;
                if (desc) {
                    propertiesDeclaration[index].addJsDoc(desc);
                }
            });
        }
        if (additionalProperties) {
            interfaceDeclaration.addIndexSignature({
                keyName: 'key', // defaults to key
                keyType: 'string', // defaults to string
                returnType: 'any',
            });
            // const addPropertiesInput = Object.keys(additionalProperties).map(key => {
            //     const inputKey = key.includes('[') || key.includes('-') || key.includes('.') || isNumberStart(key) ? `'${key}'` : key;
            //     interfaceDeclaration.addIndexSignature({
            //         keyName: 'key', // defaults to key
            //         keyType: 'string', // defaults to string
            //         returnType: this.getTsType(additionalProperties, key, prefix),
            //     });
            //     // 普通属性
            //     return {
            //         key,
            //         name: inputKey,
            //         type: `{ [key: string]: ${this.getTsType(additionalProperties, key, prefix)} }`,
            //         hasQuestionToken: !requireds.includes(key),
            //     };
            // });
            // const propertiesDeclaration = interfaceDeclaration.addProperties(addPropertiesInput);
        }
        return interfaceDeclaration;
    }
    getTsType(subSchema: SwaggerSchema, subKeyName: string, prefix: string): string {
        const allOfItem: SwaggerSchema[] = (subSchema as any).allOf;
        const anyOfItem: SwaggerSchema[] = (subSchema as any).anyOf;
        const oneOfItem: SwaggerSchema[] = (subSchema as any).oneOf;
        if (subSchema.$ref) {
            // TODO
            const typeName = upperFirst(prefix) + getRefTypeName(subSchema.$ref);
            const typeNameInterface = this.sourceFile.getInterface(typeName);
            // import 导入
            let importDeclaration = this.sourceFile.getImportDeclaration(
                this.options.interfacePre + '../../interface'
            );
            if (importDeclaration) {
                const names = importDeclaration.getNamedImports().map(it => it.getName());
                if (!names.includes(typeName) && !typeNameInterface) {
                    importDeclaration.addNamedImport({
                        name: typeName,
                        isTypeOnly: true,
                    });
                }
            } else if (!typeNameInterface) {
                importDeclaration = this.sourceFile.addImportDeclaration({
                    moduleSpecifier: this.options.interfacePre + '../../interface',
                });
                importDeclaration.addNamedImport({
                    name: typeName,
                    isTypeOnly: true,
                });
            }

            return typeName;
        } else if (allOfItem && allOfItem.length) {
            return allOfItem
                .map((it: any, index: number) => {
                    let keyName = this.keyName + upperFirst(subKeyName) + index;
                    if (keyName.includes('-')) {
                        // 横杠换成三个下划线  避免重复
                        keyName = keyName.replaceAll('-', '___');
                    }
                    return this.getTsType(it, subKeyName, prefix);
                    // new GInterface(it, this.sourceFile, keyName, this.options).genTsType(prefix);
                    // return keyName;
                })
                .join(' & ');
        } else if (anyOfItem && anyOfItem.length) {
            // debugger
            return anyOfItem
                .map((it: any, index: number) => {
                    let keyName = this.keyName + upperFirst(subKeyName) + index;
                    if (keyName.includes('-')) {
                        // 横杠换成三个下划线  避免重复
                        keyName = keyName.replaceAll('-', '___');
                    }
                    return this.getTsType(it, subKeyName, prefix);
                    // new GInterface(it, this.sourceFile, keyName, this.options).genTsType(prefix);
                    // return keyName;
                })
                .join(' | ');
        } else if (oneOfItem && oneOfItem.length) {
            return oneOfItem
                .map((it: any, index: number) => {
                    let keyName = this.keyName + upperFirst(subKeyName) + index;
                    if (keyName.includes('-')) {
                        // 横杠换成三个下划线  避免重复
                        keyName = keyName.replaceAll('-', '___');
                    }
                    return this.getTsType(it, subKeyName, prefix);
                    // new GInterface(it, this.sourceFile, keyName, this.options).genTsType(prefix);
                    // return keyName;
                })
                .join(' | ');
        }
        switch (subSchema.type) {
            case 'string':
                if (subSchema.enum && subSchema.enum.length) {
                    return subSchema.enum.map(it => `'${it}'`).join(' | ');
                }
                if (subSchema.format === 'binary') {
                    return 'File';
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
                    // 显示括号
                    const showBrackets =
                        (subSchema.items as any)?.oneOf?.length > 1 ||
                        (subSchema.items as any)?.anyOf?.length > 1 ||
                        (subSchema.items as any)?.allOf?.length > 1 ||
                        (subSchema.items as any)?.enum?.length > 1;

                    return `${showBrackets ? '(' : ''}${this.getTsType(subSchema.items, subKeyName, prefix)}${
                        showBrackets ? ')' : ''
                    }[]`;
                }
                // return 'unknown[]';
                return 'any[]';
            case 'object':
                if (subSchema.properties || subSchema.additionalProperties) {
                    let keyName = this.keyName + upperFirst(subKeyName);
                    if (keyName.includes('-')) {
                        // 横杠换成三个下划线  避免重复
                        keyName = keyName.replaceAll('-', '___');
                    }

                    new GInterface(subSchema, this.sourceFile, keyName, this.options).genTsType(prefix);
                    return keyName;
                }
                // 泛型会变成object  所以用any
                // return 'Record<string, any>';
                return 'any';

            case 'file':
                return 'File';
            // case 'null':
            //     return 'null';
            default:
                if (Array.isArray(subSchema.type)) {
                    return (subSchema as any).type
                        .map((it: any, index: number) => {
                            return this.getTsType({ ...subSchema, type: it }, subKeyName, prefix);
                        })
                        .join(' | ');
                    // return 'any';
                }
                if (subSchema.type) {
                    return subSchema.type;
                }
                return 'any';
        }
    }
    genTsType(prefix = '', extendsName?: string) {
        // if (!this.schema) {
        //     return this.genUnknownType();
        // }

        // if (this.schema.allOf) {
        //     return this.genAllOfType();
        // }

        // if (this.schema.$ref) {
        //     return this.genRefType();
        // }

        if (this.schema.type === 'boolean') {
            return this.genBooleanType();
        }

        if (this.schema.type === 'string') {
            return this.genStringType(prefix);
        }

        if (['number', 'integer'].includes(this.schema.type as string)) {
            return this.genNumberType();
        }

        if (this.schema.type === 'object' || this.schema.properties || this.schema.$ref) {
            return this.genObjectType(prefix, extendsName);
        }

        if (this.schema.type === 'array') {
            return this.genArrayType();
        }

        return this.genAnyType();
    }
    private genBaseType(type: string) {
        if (!this.keyName) {
            return;
        }
        let declaration = this.sourceFile.getTypeAlias(this.keyName);
        if (!declaration) {
            declaration = this.sourceFile.addTypeAlias({
                name: this.keyName,
                type,
            });
        }
        declaration.setIsExported(true);
        return declaration;
    }
    private genAnyType() {
        return this.genBaseType('any');
    }
    private genNumberType() {
        return this.genBaseType('number');
    }
    private genBooleanType() {
        return this.genBaseType('boolean');
    }
    genArrayType() {
        if (!this.keyName) {
            return;
        }
        let declaration = this.sourceFile.getTypeAlias(this.keyName);
        if (!declaration) {
            declaration = this.sourceFile.addTypeAlias({
                name: this.keyName,
                type: this.getTsType(this.schema.items as SwaggerSchema, this.keyName, '') + '[]',
            });
        }
        declaration.setIsExported(true);
        return declaration;
    }
}
