import { ensureFile, remove } from 'fs-extra';
import { camelCase, upperFirst } from 'lodash';
import { join } from 'path';
import { Operation, Schema, Parameter, Reference } from 'swagger-schema-official';
import { Project, SourceFile } from 'ts-morph';
import { parseSwaggerPathTemplate } from '../../utils/generateUtil';
import { GenerateApiActionConfig } from '../generate.api.action';
import { GInterface } from './GInterface';

export class GController {
    private operation: Operation;
    // 请求method
    private methodKey: string;
    // 请求路由
    private pathKey: string;

    private sourceProject?: SourceFile;
    constructor(operation: Operation, methodKey: string, pathKey: string) {
        this.operation = operation;
        this.methodKey = methodKey;
        this.pathKey = pathKey;
    }
    async genController(
        controllerUrl: string,
        config: Pick<GenerateApiActionConfig, 'excludeTags' | 'includeTags' | 'prefix'>
    ) {
        const operation = this.operation;
        const methodKey = this.methodKey;
        const pathKey = this.pathKey;
        // 不生成已废弃的接口
        if (operation.deprecated) {
            return;
        }
        const tagsItem = operation.tags?.[0];
        if (!tagsItem) {
            return;
        }
        // includeTags
        if (config.includeTags && config.includeTags.length && !config.includeTags.includes(tagsItem)) {
            return;
        }
        // excludeTags
        if (config.excludeTags && config.excludeTags.length && config.excludeTags.includes(tagsItem)) {
            return;
        }
        const key = camelCase(methodKey + pathKey);

        const sourceFilePath = join(controllerUrl, tagsItem, `${key}.ts`);
        await remove(sourceFilePath);
        await ensureFile(sourceFilePath);
        const project = new Project();
        const sourceProject = project.addSourceFileAtPath(sourceFilePath);
        this.sourceProject = sourceProject;
        // import 导入
        this.genImports();
        // 生成方法
        this.genApiFn(key, config.prefix);

        await sourceProject.save();
    }
    private genApiFn(fnName: string, prefix = '') {
        if (!this.sourceProject) {
            return;
        }
        const sourceProject = this.sourceProject;
        // 获取返回值类型
        const schema = this.getSuccessResponseSchema();
        let resType = 'unknown';
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
        const functionDeclaration = sourceProject.addFunction({
            name: fnName,
        });
        const requestBodySchema = this.getRequestBodySchema();
        functionDeclaration.setBodyText(
            `return request.${this.methodKey}<${resType}>(\`${parseSwaggerPathTemplate(this.pathKey)}\`${
                requestBodySchema ? ', input' : ''
            });`
        );
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
            if (!parameters.length) {
                return;
            }
            const paramsTypeName = upperFirst(fnName) + 'Params';
            functionDeclaration.addParameter({ name: 'params', type: paramsTypeName });
            const interfaceDeclaration = sourceProject.addInterface({ name: paramsTypeName });
            // query参数处理
            if (parameters.some(param => param.in === 'query')) {
                functionDeclaration.setBodyText(writer => {
                    writer.writeLine(`const searchParams = new URLSearchParams('');`);
                    parameters.map(param => {
                        if (param.name.includes('-') || param.name.includes('.')) {
                            writer.write(`if (params['${param.name}'])`).block(() => {
                                writer.writeLine(
                                    `searchParams.append('${param.name}', String(params['${param.name}']));`
                                );
                            });
                        } else {
                            writer.write(`if (params.${param.name})`).block(() => {
                                writer.writeLine(
                                    `searchParams.append('${param.name}', String(params.${param.name}));`
                                );
                            });
                        }
                    });
                    writer.writeLine(`const searchStr = searchParams.toString();`);
                    writer.writeLine(`const queryStr = searchStr ? '?' + searchStr : '';`);
                    writer.writeLine(
                        `return request.${this.methodKey}<${resType}>(\`${parseSwaggerPathTemplate(
                            this.pathKey
                        )}\` + queryStr${requestBodySchema ? ', input' : ''});`
                    );
                    return writer;
                });
            }

            parameters.map(param => {
                const paramType = new GInterface(
                    (param as any).schema,
                    sourceProject,
                    paramsTypeName + upperFirst(param.name)
                ).getTsType((param as any).schema, '', prefix);
                const paramName =
                    param.name.includes('-') || param.name.includes('.') ? `'${param.name}'` : param.name;
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
            functionDeclaration.addParameter({ name: 'input', type: inputType });
        }
        functionDeclaration.addJsDoc(
            `${this.operation.summary ? '\n' + this.operation.summary : ''}\n${this.pathKey}`
        );

        return functionDeclaration;
    }
    private genImports() {
        // import 导入
        const importDeclaration = this.sourceProject?.addImportDeclaration({
            defaultImport: 'request',
            moduleSpecifier: '@/utils/request',
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
