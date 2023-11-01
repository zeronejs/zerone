import { ensureFile, remove } from 'fs-extra';
import { camelCase, upperFirst } from 'lodash';
import url from 'url';
import { join } from 'path';
import { Operation, Schema, Parameter, Reference } from 'swagger-schema-official';
import { Project, SourceFile } from 'ts-morph';
import {
    tagsChineseToPinyin,
    parseSwaggerPathTemplate,
    parseSwaggerPathTemplateToFnName,
    isNumberStart,
} from '../../utils/generateUtil';
import { GenerateApiActionConfig } from '../generate.api.action';
import { GInterface } from './GInterface';

export class GController {
    private operation: Operation;
    // 请求method
    private methodKey: string;
    // 请求路由
    private pathKey: string;
    // tags名称
    private tagsItem = 'default';
    private sourceProject?: SourceFile;
    private optionsTypeName: string = 'any'
    constructor(operation: Operation, methodKey: string, pathKey: string) {
        this.operation = operation;
        this.methodKey = methodKey;
        this.pathKey = pathKey;
    }
    async genController(
        controllerUrl: string,
        config: Pick<GenerateApiActionConfig, 'excludeTags' | 'includeTags' | 'prefix' | 'axiosInstanceUrl' | 'optionsTypeName' | 'optionsTypePath'>
    ) {
        const operation = this.operation;
        const methodKey = this.methodKey;
        const pathKey = this.pathKey;
        // 不生成已废弃的接口
        if (operation.deprecated) {
            return;
        }
        const tagsItem = operation.tags?.[0] ?? 'default';
        // includeTags
        if (config.includeTags && config.includeTags.length && !config.includeTags.includes(tagsItem)) {
            return;
        }
        // excludeTags
        if (config.excludeTags && config.excludeTags.length && config.excludeTags.includes(tagsItem)) {
            return;
        }
        this.tagsItem = tagsChineseToPinyin(tagsItem);
        const key = camelCase(methodKey + parseSwaggerPathTemplateToFnName(pathKey));
        const sourceFilePath = join(controllerUrl, this.tagsItem, `${key}.ts`);
        await remove(sourceFilePath);
        await ensureFile(sourceFilePath);
        const project = new Project();
        const sourceProject = project.addSourceFileAtPath(sourceFilePath);
        this.sourceProject = sourceProject;
        // import 导入
        this.genImports(config.axiosInstanceUrl);
        config.optionsTypeName && (this.optionsTypeName = config.optionsTypeName)
        config.optionsTypePath && this.sourceProject?.addImportDeclaration({
            namedImports:[this.optionsTypeName],
            isTypeOnly: true,
            moduleSpecifier: config.optionsTypePath
        })
        // 生成方法
        this.genApiFn(key, config.prefix);
        sourceProject.formatText({
            placeOpenBraceOnNewLineForFunctions: false,
        });
        await sourceProject.save();
        return { key, tagsItem: this.tagsItem };
    }
    private genApiFn(fnName: string, prefix = '') {
        if (!this.sourceProject) {
            return;
        }
        const sourceProject = this.sourceProject;
        // 获取返回值类型
        const schema = this.getSuccessResponseSchema();
        let resType = 'any';
        if (schema) {
            resType = new GInterface(schema, sourceProject, upperFirst(fnName) + 'Result').getTsType(
                schema,
                '',
                prefix
            );
            // // 导入复杂类型
            // if (schema.$ref) {
            //     // import 导入
            //     const importDeclaration = sourceProject.addImportDeclaration({
            //         namedImports: [resType],
            //         moduleSpecifier: '../../interface',
            //     });
            // }
        }
        let interfacePre = '';
        // 获取当前tags嵌套深度
        if (this.tagsItem.includes('/')) {
            const count = (this.tagsItem.match(/\//g) || []).length;
            interfacePre = Array(count).fill('../').join('');
        }
        const DeepRequiredKey = 'DeepRequired';
        let importDeclaration = sourceProject.getImportDeclaration(interfacePre + '../../interface');
        if (importDeclaration) {
            const names = importDeclaration.getNamedImports().map(it => it.getName());
            if (!names.includes(DeepRequiredKey)) {
                importDeclaration.addNamedImport({
                    name: DeepRequiredKey,
                    isTypeOnly: true
                });
            }
        } else {
            importDeclaration = sourceProject.addImportDeclaration({
                moduleSpecifier: interfacePre + '../../interface',
            });
            importDeclaration.addNamedImport({
                name: DeepRequiredKey,
                isTypeOnly: true
            });
        }

        // sourceProject.addImportDeclaration({
        //     namedImports: ['DeepRequired'],
        //     moduleSpecifier: '@/utils/types',
        // });
        const functionDeclaration = sourceProject.addFunction({
            name: fnName,
        });
        const requestBodySchema = this.getRequestBodySchema();
        // 请求路径
        const requestUrl = parseSwaggerPathTemplate(this.pathKey);
        functionDeclaration.setBodyText(
            `return request.${this.methodKey}<DeepRequired<${resType}>>(\`${requestUrl}\`${
                requestBodySchema ? ',input' : ''
            });`
        );
        const parsedUrl = url.parse(requestUrl, true);
        // 在链接中已存在的query
        const existedQueryKeys = Object.keys(parsedUrl.query);

        functionDeclaration.setIsExported(true);
        // 处理链接上的参数
        if (this.operation.parameters && this.operation.parameters.length) {
            const parameters = this.operation.parameters.filter(param => {
                if (!this.isParam(param)) {
                    // 暂不处理引用
                    return false;
                }
                // 仅处理 query path
                return ['query', 'path'].includes(param.in);
            }) as Parameter[];
            if (parameters.length) {
                const paramsTypeName = upperFirst(fnName) + 'Params';
                functionDeclaration.addParameter({ name: 'params', type: paramsTypeName });
                const interfaceDeclaration = sourceProject.addInterface({ name: paramsTypeName });
                // query参数处理
                if (parameters.some(param => param.in === 'query')) {
                    functionDeclaration.setBodyText(writer => {
                        // writer.writeLine(`const searchParams = new URLSearchParams('');`);
                        writer.writeLine(`const paramsInput = {`);
                        parameters.map(param => {
                            if (param.in !== 'query') {
                                return;
                            }
                            if (existedQueryKeys.includes(param.name)) {
                                return;
                            }
                            if (!(param as any).schema) {
                                throw new Error(this.pathKey + ',请确保此接口参数有类型');
                            }
                            if (
                                param.name.includes('[') ||
                                param.name.includes('-') ||
                                param.name.includes('.') ||
                                isNumberStart(param.name)
                            ) {
                                const paramSchema = (param as any).schema;
                                if (paramSchema && (paramSchema.$ref || paramSchema.type === 'object')) {
                                    return writer.writeLine(`...params['${param.name}'],`);
                                }
                                writer.writeLine(`'${param.name}':params['${param.name}'],`);
                            } else {
                                const paramSchema = (param as any).schema;
                                if (paramSchema && (paramSchema.$ref || paramSchema.type === 'object')) {
                                    return writer.writeLine(`...params.${param.name},`);
                                }
                                writer.writeLine(`${param.name}:params.${param.name},`);
                            }
                        });
                        writer.writeLine(`};`);
                        const hasDataMethods = [
                            'post',
                            'put',
                            'patch',
                            'postForm',
                            'putForm',
                            'patchForm',
                        ].includes(this.methodKey);
                        let inputContent = '';
                        if (requestBodySchema && hasDataMethods) {
                            inputContent = 'input,';
                        } else if (hasDataMethods) {
                            inputContent = 'null,';
                        }
                        //TODO 在这里修改
                        writer.writeLine(
                            `return request.${
                                this.methodKey
                            }<DeepRequired<${resType}>>(\`${parseSwaggerPathTemplate(
                                this.pathKey
                            )}\`, ${inputContent} {`
                        );
                        writer.writeLine(`params: paramsInput,`);
                        writer.writeLine(`...(options || {}),`);
                        if (requestBodySchema && !hasDataMethods) {
                            writer.writeLine(`data: input,`);
                        }
                        writer.writeLine(`});`);

                        return writer;
                    });
                }

                parameters.map(param => {
                    if (param.in === 'query' && existedQueryKeys.includes(param.name)) {
                        return;
                    }
                    const paramType = new GInterface(
                        (param as any).schema,
                        sourceProject,
                        paramsTypeName + upperFirst(param.name)
                    ).getTsType((param as any).schema, '', prefix);
                    const paramName =
                        param.name.includes('[') ||
                        param.name.includes('-') ||
                        param.name.includes('.') ||
                        isNumberStart(param.name)
                            ? `'${param.name}'`
                            : param.name;
                    const propertyDeclaration = interfaceDeclaration.addProperty({
                        name: paramName,
                        type: paramType,
                        hasQuestionToken: !param.required,
                    });
                    if (param.description) {
                        propertyDeclaration.addJsDoc(param.description);
                    }
                });
            }
        }
        // requestBody类型生成
        if (requestBodySchema) {
            const inputType = new GInterface(
                requestBodySchema,
                sourceProject,
                upperFirst(fnName) + 'Input'
            ).getTsType(requestBodySchema, '', prefix);
            // // 导入复杂类型
            // if (requestBodySchema.$ref) {
            //     // import 导入
            //     let importDeclaration = sourceProject.getImportDeclaration('../../interface');
            //     if (!importDeclaration) {
            //         importDeclaration = sourceProject.addImportDeclaration({
            //             namedImports: [inputType],
            //             moduleSpecifier: '../../interface',
            //         });
            //     } else {
            //         importDeclaration.addNamedImport(inputType);
            //     }
            // }
            const requestBody = (this.operation as any).requestBody;
            functionDeclaration.addParameter({
                name: 'input',
                type: inputType,
                hasQuestionToken: !requestBody.required,
            });
        }
        functionDeclaration.addParameter({
            name: 'options',
            type: this.optionsTypeName,
            hasQuestionToken: true,
        });
        functionDeclaration.addJsDoc(
            `${this.operation.summary ? '\n' + this.operation.summary : ''}\n${this.pathKey}`
        );

        return functionDeclaration;
    }
    private genImports(url?: string) {
        // import 导入
        const importDeclaration = this.sourceProject?.addImportDeclaration({
            defaultImport: 'request',
            moduleSpecifier: url ?? '@/utils/request',
        });
    }
    private isParam(param: Parameter | Reference): param is Parameter {
        return !Reflect.has(param, '$ref');
    }
    private getRequestBodySchema() {
        const requestBody = (this.operation as any).requestBody;

        try {
            return requestBody.content[Object.keys(requestBody.content)[0]].schema as Schema;
        } catch (error) {
            return undefined;
        }
    }
    private getSuccessResponseSchema() {
        const responses = this.operation.responses;
        const response = (responses['200'] || responses['default']) as any;

        try {
            return response.content[Object.keys(response.content)[0]].schema as Schema;
        } catch (error) {
            return undefined;
        }
    }
}
