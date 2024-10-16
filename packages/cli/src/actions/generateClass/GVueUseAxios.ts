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
    parseSwaggerPathMatches,
} from '../../utils/generateUtil';
import { GenerateApiActionConfig } from '../generate.api.action';
import { GInterface } from './GInterface';
import { GenControllerResult } from './GController';

export class GVueUseAxios {
    private operation: Operation;
    // 请求method
    private methodKey: string;
    // 请求路由
    private pathKey: string;
    // tags名称
    private tagsItem = 'default';
    private sourceProject?: SourceFile;
    constructor(operation: Operation, methodKey: string, pathKey: string) {
        this.operation = operation;
        this.methodKey = methodKey;
        this.pathKey = pathKey;
    }
    async genVueUseAxios(
        controllerUrl: string,
        config: Pick<
            GenerateApiActionConfig,
            'excludeTags' | 'includeTags' | 'prefix' | 'axiosInstanceUrl' | 'vueUseAxios'
        >,
        genControllerResult: GenControllerResult
    ) {
        const operation = this.operation;
        const methodKey = this.methodKey;
        const pathKey = this.pathKey;
        // // 不生成已废弃的接口
        // if (operation.deprecated) {
        //     return;
        // }
        const tagsItem = operation.tags?.[0] ?? 'default';
        // // includeTags
        // if (config.includeTags && config.includeTags.length && !config.includeTags.includes(tagsItem)) {
        //     return;
        // }
        // // excludeTags
        // if (config.excludeTags && config.excludeTags.length && config.excludeTags.includes(tagsItem)) {
        //     return;
        // }
        this.tagsItem = tagsChineseToPinyin(tagsItem);
        const key = camelCase('use' + upperFirst(methodKey) + parseSwaggerPathTemplateToFnName(pathKey));
        const apiKey = camelCase(methodKey + parseSwaggerPathTemplateToFnName(pathKey));
        const sourceFilePath = join(controllerUrl, this.tagsItem, `${key}.ts`);
        await remove(sourceFilePath);
        await ensureFile(sourceFilePath);
        const project = new Project();
        const sourceProject = project.addSourceFileAtPath(sourceFilePath);
        this.sourceProject = sourceProject;

        // 生成方法
        this.genApiFn(key, apiKey, config, genControllerResult);
        sourceProject.formatText({
            placeOpenBraceOnNewLineForFunctions: false,
        });
        await sourceProject.save();
        return { key, tagsItem: this.tagsItem };
    }
    private genApiFn(
        fnName: string,
        apiFnName: string,
        config: Pick<
            GenerateApiActionConfig,
            'excludeTags' | 'includeTags' | 'prefix' | 'axiosInstanceUrl' | 'vueUseAxios'
        >,
        genControllerResult: GenControllerResult
    ) {
        if (!this.sourceProject) {
            return;
        }
        const sourceProject = this.sourceProject;
        // 获取返回值类型
        const schema = this.getSuccessResponseSchema();
        let resType = 'any';
        if (schema) {
            resType = genControllerResult?.resType ?? upperFirst(apiFnName) + 'Result';
        }
        let interfacePre = '';
        // 获取当前tags嵌套深度
        if (this.tagsItem.includes('/')) {
            const count = (this.tagsItem.match(/\//g) || []).length;
            interfacePre = Array(count).fill('../').join('');
        }
        this.addNamedImport({
            name: 'UseAxiosOptions',
            url: `@vueuse/integrations/useAxios`,
            isTypeOnly: true,
        });
        this.addNamedImport({ name: 'useAxios', url: `@vueuse/integrations/useAxios`, isTypeOnly: false });

        this.addNamedImport({ name: 'AxiosRequestConfig', url: 'axios', isTypeOnly: true });
        this.addNamedImport({
            name: 'DeepRequired',
            url: interfacePre + '../../interface',
            isTypeOnly: true,
        });
        genControllerResult?.interfaceImportNames?.forEach(item => {
            this.addNamedImport({
                name: item,
                url: interfacePre + '../../interface',
                isTypeOnly: true,
            });
        });
        if (!schema?.$ref) {
            this.addNamedImport({ name: resType, url: `./${apiFnName}`, isTypeOnly: true });
        }
        // import 导入axios实例
        this.genImports(config.axiosInstanceUrl);
        const functionDeclaration = sourceProject.addFunction({
            name: fnName,
        });
        functionDeclaration.setIsExported(true);
        // 添加useAxiosReturn
        functionDeclaration.setBodyText(writer =>
            writer
                .writeLine(`const useAxiosReturn = useAxios<DeepRequired<${resType}>>(`)
                .writeLine(`'${this.pathKey}',`)
                .writeLine(`{ method: '${this.methodKey}', ...config },`)
                .writeLine(`request,`)
                .writeLine(`{ immediate: false, ...options }`)
                .writeLine(`)`)
        );
        // functionDeclaration.setBodyText(writer =>
        //     writer
        //         .writeLine('const myNumber = 5;')
        //         .write('if (myNumber === 5)')
        //         .block(() => {
        //             writer.writeLine("console.log('yes')");
        //         })
        // );
        const execFunctionDeclaration = functionDeclaration.addFunction({
            name: 'exec',
        });
        const requestBodySchema = this.getRequestBodySchema();
        // 请求路径
        const requestUrl = parseSwaggerPathTemplate(this.pathKey);
        execFunctionDeclaration.setBodyText(
            `return useAxiosReturn.execute(${
                requestBodySchema ? '{ data: input, ...axiosConfig }' : 'axiosConfig'
            });`
        );
        const parsedUrl = url.parse(requestUrl, true);
        // 在链接中已存在的query
        const existedQueryKeys = Object.keys(parsedUrl.query);

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
                const paramsTypeName = upperFirst(apiFnName) + 'Params';
                execFunctionDeclaration.addParameter({ name: 'params', type: paramsTypeName });
                this.addNamedImport({ name: paramsTypeName, url: `./${apiFnName}`, isTypeOnly: true });
                // query参数处理
                if (parameters.some(param => param.in === 'query')) {
                    execFunctionDeclaration.setBodyText(writer => {
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

                        writer.writeLine(`return useAxiosReturn.execute( {`);
                        if (parseSwaggerPathMatches(this.pathKey).length > 0) {
                            writer.writeLine(`url: \`${parseSwaggerPathTemplate(this.pathKey)}\`,`);
                        }
                        writer.writeLine(`params: paramsInput,`);
                        if (requestBodySchema) {
                            writer.writeLine(`data: input,`);
                        }
                        writer.writeLine(`...axiosConfig,`);
                        writer.writeLine(`});`);

                        return writer;
                    });
                }
            }
        }
        // requestBody类型生成
        if (requestBodySchema) {
            const inputType = upperFirst(apiFnName) + 'Input';
            const requestBody = (this.operation as any).requestBody;
            execFunctionDeclaration.addParameter({
                name: 'input',
                type: genControllerResult?.inputType ?? inputType,
                hasQuestionToken: !requestBody.required,
            });
            if (!requestBodySchema.$ref) {
                this.addNamedImport({ name: inputType, url: `./${apiFnName}`, isTypeOnly: true });
            }
        }
        execFunctionDeclaration.addParameter({
            name: 'axiosConfig',
            type: 'AxiosRequestConfig',
            hasQuestionToken: true,
        });
        // functionDeclaration.setBodyText(writer => {
        //     // writer.writeLine(`const searchParams = new URLSearchParams('');`);
        //     writer.writeLine(`return { ...useAxiosReturn, exec };`);
        //     return writer;
        // });
        let functionDeclarationBody = functionDeclaration.getBodyText() ?? '';
        // functionDeclarationBody += execFunctionDeclaration.getBodyText();
        // execFunctionDeclaration.remove();
        // execFunctionDeclaration.forget();
        functionDeclarationBody += `\n\t\treturn { ...useAxiosReturn, exec };`;
        functionDeclaration.removeBody();
        functionDeclaration.setBodyText(functionDeclarationBody);
        functionDeclaration.addParameter({
            name: 'config',
            type: 'AxiosRequestConfig',
            hasQuestionToken: true,
        });
        functionDeclaration.addParameter({
            name: 'options',
            type: `UseAxiosOptions<DeepRequired<${resType}>>`,
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
    private addNamedImport(options: { name: string; url: string; isTypeOnly: boolean }) {
        if (!this.sourceProject) {
            return;
        }
        let importDeclaration = this.sourceProject.getImportDeclaration(options.url);
        if (importDeclaration) {
            const names = importDeclaration.getNamedImports().map(it => it.getName());
            if (!names.includes(options.name)) {
                importDeclaration.addNamedImport({
                    name: options.name,
                    isTypeOnly: options.isTypeOnly,
                });
            }
        } else {
            importDeclaration = this.sourceProject.addImportDeclaration({
                moduleSpecifier: options.url,
            });
            importDeclaration?.addNamedImport({
                name: options.name,
                isTypeOnly: options.isTypeOnly,
            });
        }
    }
}
