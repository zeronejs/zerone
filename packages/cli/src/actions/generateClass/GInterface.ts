import { upperFirst } from 'lodash';
import { Schema as SwaggerSchema } from 'swagger-schema-official';
import { SourceFile } from 'ts-morph';
import { getRefTypeName } from '../../utils/generateUtil';
export class GInterface {
    private schema: SwaggerSchema;
    private sourceFile: SourceFile;
    private keyName: string;
    constructor(swaggerSchema: SwaggerSchema, sourceFile: SourceFile, keyName: string) {
        this.schema = swaggerSchema;
        this.sourceFile = sourceFile;
        this.keyName = keyName;
    }

    private genObjectType(prefix = '') {
        let interfaceDeclaration = this.sourceFile.getInterface(this.keyName);
        if (!interfaceDeclaration) {
            interfaceDeclaration = this.sourceFile.addInterface({
                name: this.keyName,
            });
        }
        // 如果有属性说明已添加过
        if (interfaceDeclaration.getProperties().length) {
            return;
        }
        interfaceDeclaration.setIsExported(true);
        const properties = this.schema.properties;
        if (!properties) {
            return interfaceDeclaration.addIndexSignature({
                keyName: 'key', // defaults to key
                keyType: 'string', // defaults to string
                returnType: 'any',
            });
        }
        const addPropertiesInput = Object.keys(properties).map(key => {
            const inputKey = key.includes('-') || key.includes('.') ? `'${key}'` : key;
            if (properties[key].additionalProperties) {
                // 索引签名
                return {
                    key,
                    name: inputKey,
                    type: `{ [key: string]: ${(this.getTsType(properties[key], key), prefix)} }`,
                };
            }
            // 普通属性
            return { key, name: inputKey, type: this.getTsType(properties[key], key, prefix) };
        });
        const propertiesDeclaration = interfaceDeclaration.addProperties(addPropertiesInput);
        addPropertiesInput.forEach((it, index) => {
            const desc = properties[it.key].description;
            if (desc) {
                propertiesDeclaration[index].addJsDoc(desc);
            }
        });
    }
    getTsType(subSchema: SwaggerSchema, subKeyName: string, prefix = ''): string {
        if (subSchema.$ref) {
            const typeName = upperFirst(prefix) + getRefTypeName(subSchema.$ref);
            const typeNameInterface = this.sourceFile.getInterface(typeName);
            // import 导入
            let importDeclaration = this.sourceFile.getImportDeclaration('@/api/interface');
            if (importDeclaration) {
                const names = importDeclaration.getNamedImports().map(it => it.getName());
                if (!names.includes(typeName) && !typeNameInterface) {
                    importDeclaration.addNamedImport(typeName);
                }
            } else if (!typeNameInterface) {
                importDeclaration = this.sourceFile.addImportDeclaration({
                    moduleSpecifier: '@/api/interface',
                });
                importDeclaration.addNamedImport(typeName);
            }

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
                    return this.getTsType(subSchema.items, subKeyName, prefix);
                }
                return 'unknown[]';
            case 'object':
                if (subSchema.properties || subSchema.additionalProperties) {
                    const keyName = this.keyName + upperFirst(subKeyName);
                    new GInterface(subSchema, this.sourceFile, keyName).genTsType(prefix);
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
