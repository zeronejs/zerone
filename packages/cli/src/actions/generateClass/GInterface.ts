import { upperFirst } from 'lodash';
import { Schema as SwaggerSchema } from 'swagger-schema-official';
import { SourceFile } from 'ts-morph';
import { getRefTypeName, isNumberStart } from '../../utils/generateUtil';
export class GInterface {
    private schema: SwaggerSchema;
    private sourceFile: SourceFile;
    private keyName: string;
    constructor(swaggerSchema: SwaggerSchema, sourceFile: SourceFile, keyName: string) {
        this.schema = swaggerSchema;
        this.sourceFile = sourceFile;
        this.keyName = keyName;
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
                    key.includes('[') || key.includes('-') || key.includes('.') || isNumberStart(key)
                        ? `'${key}'`
                        : key;
                // 普通属性
                return {
                    key,
                    name: inputKey,
                    type: this.getTsType(properties[key], key, prefix),
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
    getTsType(subSchema: SwaggerSchema, subKeyName: string, prefix = ''): string {
        if (subSchema.$ref) {
            const typeName = upperFirst(prefix) + ' type ' + getRefTypeName(subSchema.$ref);
            const typeNameInterface = this.sourceFile.getInterface(typeName);
            // import 导入
            let importDeclaration = this.sourceFile.getImportDeclaration('../../interface');
            if (importDeclaration) {
                const names = importDeclaration.getNamedImports().map(it => it.getName());
                if (!names.includes(typeName) && !typeNameInterface) {
                    importDeclaration.addNamedImport(typeName);
                }
            } else if (!typeNameInterface) {
                importDeclaration = this.sourceFile.addImportDeclaration({
                    moduleSpecifier: '../../interface',
                });
                importDeclaration.addNamedImport(typeName);
            }

            return typeName;
        } else if (subSchema.allOf && subSchema.allOf.length) {
            // const keyName = subSchema.title ? subSchema.title : this.keyName + upperFirst(subKeyName);
            const keyName = this.keyName + upperFirst(subKeyName);
            if (subSchema.allOf.length === 1) {
                return this.getTsType(subSchema.allOf[0], this.keyName, '');
            }
            const moduleInterface = new GInterface(subSchema.allOf[0], this.sourceFile, keyName).genTsType(
                '',
                this.getTsType(subSchema.allOf[0], subKeyName, prefix)
            );

            for (let index = 1; index < subSchema.allOf.length; index++) {
                const item = subSchema.allOf[index];
                for (const key in item.properties) {
                    const value = item.properties[key];
                    const inputKey =
                        key.includes('[') || key.includes('-') || key.includes('.') || isNumberStart(key)
                            ? `'${key}'`
                            : key;
                    // 普通属性
                    moduleInterface?.addProperty({
                        // key,
                        name: inputKey,
                        type: this.getTsType(value, key, prefix),
                    });
                }
            }
            return keyName;
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
                    return this.getTsType(subSchema.items, subKeyName, prefix) + '[]';
                }
                return 'unknown[]';
            case 'object':
                if (subSchema.properties || subSchema.additionalProperties) {
                    let keyName = this.keyName + upperFirst(subKeyName);
                    if (keyName.includes('-')) {
                        // 横杠换成三个下划线  避免重复
                        keyName = keyName.replaceAll('-', '___');
                    }

                    new GInterface(subSchema, this.sourceFile, keyName).genTsType(prefix);
                    return keyName;
                }
                // 泛型会变成object  所以用any
                // return 'Record<string, any>';
                return 'any';

            case 'file':
                return 'File';

            default:
                if (Array.isArray(subSchema.type)) {
                    return 'any';
                }
                if (subSchema.type) {
                    return subSchema.type;
                }
                return 'unknown';
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

        // if (this.schema.type === 'boolean') {
        //     return this.genBooleanType();
        // }

        // if (this.schema.type === 'string') {
        //     return this.genStringType();
        // }

        // if (['number', 'integer'].includes(this.schema.type as string)) {
        //     return this.genNumberType();
        // }

        if (this.schema.type === 'object' || this.schema.properties || this.schema.$ref) {
            return this.genObjectType(prefix, extendsName);
        }

        // if (this.schema.type === 'array') {
        //     return this.genArrayType();
        // }

        // return this.genAnyType();
    }
}
