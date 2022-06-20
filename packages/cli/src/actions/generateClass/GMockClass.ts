import { upperFirst } from 'lodash';
import { Schema as SwaggerSchema } from 'swagger-schema-official';
import { ConstructorDeclaration, SourceFile, VariableDeclarationKind } from 'ts-morph';
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
        let classDeclaration = this.sourceFile.getClass(this.keyName);
        if (!classDeclaration) {
            classDeclaration = this.sourceFile.addClass({
                name: this.keyName, // defaults to "let"
            });
        }
        // 如果有属性说明已添加过
        if (classDeclaration.getProperties().length) {
            return;
        }
        classDeclaration.setIsExported(true);
        const properties = this.schema.properties;
        const additionalProperties = this.schema.additionalProperties;
        const requireds = this.schema.required ?? [];
        if (!properties && !additionalProperties) {
            // return classDeclaration.addIndexSignature({
            //     keyName: 'key', // defaults to key
            //     keyType: 'string', // defaults to string
            //     returnType: 'any',
            // });
            return;
        }
        // this.ctor = classDeclaration.addConstructor({
        //     /* options like parameters may go here */
        // });
        if (properties) {
            const addPropertiesInput = Object.keys(properties).map(key => {
                const inputKey = key.includes('-') || key.includes('.') ? `'${key}'` : key;
                // 普通属性
                return {
                    key,
                    name: inputKey,
                    type: this.getTsType(properties[key], key, prefix),
                    hasQuestionToken: !requireds.includes(key),
                };
            });

            const propertiesDeclaration = classDeclaration.addProperties(addPropertiesInput);
            addPropertiesInput.forEach((it, index) => {
                const desc = properties[it.key].description;
                if (desc) {
                    propertiesDeclaration[index].addJsDoc(desc);
                }
            });
        }
        // if (additionalProperties) {
        //     interfaceDeclaration.addIndexSignature({
        //         keyName: 'key', // defaults to key
        //         keyType: 'string', // defaults to string
        //         returnType: 'any',
        //     });
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
