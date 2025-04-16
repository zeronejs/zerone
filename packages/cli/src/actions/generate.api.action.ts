import chalk from 'chalk';
import { Input } from '../commands';
import { AbstractAction } from './abstract.action';
import { ensureFile, pathExists, readJson, remove, move } from 'fs-extra';
import { join, resolve } from 'path';
import { Path, Operation, Schema, Spec } from 'swagger-schema-official';
import { Project } from 'ts-morph';
import axios from 'axios';
import { GController } from './generateClass/GController';
import { GInterface } from './generateClass/GInterface';
import { escapeVar } from '../utils/generateUtil';
import { groupBy, upperFirst } from 'lodash';
import { isString } from '@zeronejs/utils';
import url from 'node:url';
import { normalize } from 'node:path';
import { GVueUseAxios } from './generateClass/GVueUseAxios';
export interface GenerateApiActionConfig {
    docsUrl?: string;
    includeTags?: string[];
    excludeTags?: string[];
    includePaths?: string[];
    excludePaths?: string[];
    prefix?: string;
    axiosInstanceUrl?: string;
    // 是否生成useAxios文件
    vueUseAxios?: boolean;
}

export class GenerateApiAction extends AbstractAction {
    public async handle(options: Input[]) {
        const now = Date.now();
        let root = process.cwd();
        const pathOption = options.find(it => it.name === 'path')?.value;
        const deleteOption = options.find(it => it.name === 'delete')?.value;
        const javascriptOption = options.find(it => it.name === 'javascript')?.value;
        if (isString(pathOption)) {
            root = join(root, pathOption);
        }
        if (!(await pathExists(join(root, 'swagger.config.json')))) {
            return console.info(chalk.red('swagger.config.json 文件不存在！！'));
        }
        const config: GenerateApiActionConfig = await readJson(join(root, 'swagger.config.json'));
        config.axiosInstanceUrl = config.axiosInstanceUrl ?? '@/utils/request';
        // js 用axios生成类型
        const originAxiosInstanceUrl = config.axiosInstanceUrl;
        if (javascriptOption === true) {
            config.axiosInstanceUrl = 'axios';
        }
        if (!config.docsUrl) {
            return console.info(chalk.red('docsUrl 未指定文档路径！'));
        }
        console.info(chalk.gray('读取json链接中...'));
        const parsedUrl = url.parse(config.docsUrl);
        let data: any;
        // http文档地址
        if (parsedUrl.protocol && parsedUrl.host) {
            const res = await axios.get(config.docsUrl).catch(err => {
                console.info(chalk.red(err?.response?.data ?? err?.message));
                throw console.info(chalk.red('json链接读取失败 ！！！'));
            });
            data = res.data;
        } else {
            // 本地json地址
            try {
                data = await readJson(resolve(root, config.docsUrl));
            } catch (e) {
                console.log(e);
                return console.info(chalk.red('json链接读取失败！！！'));
            }
        }
        if (!data || !data.paths) {
            return console.info(chalk.red('json链接读取失败！！！', data?.msg || data));
        }
        console.info(chalk.green(`链接读取成功`));
        const paths = data.paths as { [pathName: string]: Path };
        console.info(chalk.gray('生成文件中...'));
        if (deleteOption === true) {
            // 删除已生成的Controller和interface
            await Promise.all([remove(join(root, 'controller')), remove(join(root, 'interface'))]);
        }
        // 生成类型文件
        await GInterfaceHandle(data.components.schemas as Schema, root, config);
        // 生成Controller
        await GControllerHandle(paths, root, config, data);
        // 生成mock类型文件
        // await GMockClassHandle(data.components.schemas as Schema, root, config);
        if (javascriptOption === true) {
            let axiosInstanceUrl: string | undefined;
            if (originAxiosInstanceUrl !== 'axios') {
                axiosInstanceUrl = originAxiosInstanceUrl;
            }

            await GJavascript(root, axiosInstanceUrl);
        }
        console.info(chalk.green(`生成文件完成`));
        console.info(`✨  Done in ${((Date.now() - now) / 1000).toFixed(2)}s.`);
    }
}
// 生成类型文件
const GInterfaceHandle = async (inputSchemas: Schema, root: string, config: GenerateApiActionConfig) => {
    // 类型可能重复  暂时先用一个文件
    const schemas = Object.keys(inputSchemas);
    const indexUrl = join(root, 'interface', 'index.ts');
    await remove(indexUrl);
    await ensureFile(indexUrl);
    const indexProject = new Project();
    const indexSourceProject = indexProject.addSourceFileAtPath(indexUrl);
    for (let key of schemas) {
        const element: Schema = Reflect.get(inputSchemas, key);
        key = escapeVar(upperFirst(config.prefix) + key);
        if (!key) {
            continue;
        }
        const typeFileUrl = join(root, 'interface', 'apiTypes', key + '.ts');
        await remove(typeFileUrl);
        await ensureFile(typeFileUrl);
        const project = new Project();
        const sourceProject = project.addSourceFileAtPath(typeFileUrl);
        try {
            new GInterface(element, sourceProject, key, { interfacePre: '' }).genTsType(config.prefix);
            await sourceProject.save();
        } catch (error) {
            console.log({ error });
        }
    }

    indexSourceProject.addExportDeclarations(
        schemas
            .map(key => {
                const inputKey = escapeVar(upperFirst(config.prefix) + key);
                if (!inputKey) {
                    return { moduleSpecifier: '' };
                }
                return { moduleSpecifier: `./apiTypes/${inputKey}` };
            })
            .filter(it => it.moduleSpecifier)
    );
    // 生成 Primitive
    const PrimitiveDeclaration = indexSourceProject.addTypeAlias({
        name: 'Primitive',
        type: 'undefined | null | boolean | string | number | symbol',
    });
    PrimitiveDeclaration.setIsExported(true);
    // 生成 DeepRequired
    const typeAliasDeclaration = indexSourceProject.addTypeAlias({
        name: 'DeepRequired',
        type: 'T extends Primitive ? T : keyof T extends never ? T : { [K in keyof T]-?: DeepRequired<T[K]> }',
    });
    typeAliasDeclaration.addTypeParameter('T');
    typeAliasDeclaration.setIsExported(true);
    await indexSourceProject.save();
};
const supportMethodKeys = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];

// 生成Controller
const GControllerHandle = async (
    paths: { [pathName: string]: Path },
    root: string,
    config: GenerateApiActionConfig,
    jsonData: any
) => {
    const controllers: { key: string; tagsItem: string }[] = [];
    for (const pathKey of Object.keys(paths)) {
        for (const methodKey of Object.keys(paths[pathKey])) {
            // 仅支持这些method
            if (!supportMethodKeys.includes(methodKey)) {
                console.log('method不支持：', pathKey);
                continue;
            }
            const operation: Operation = (paths[pathKey] as any)[methodKey];
            try {
                const res = await new GController(
                    operation,
                    methodKey,
                    config.prefix ? `/${config.prefix}${pathKey}` : pathKey,
                    jsonData
                ).genController(join(root, 'controller'), config);
                if (res?.key && res.tagsItem) {
                    controllers.push({ key: res.key, tagsItem: res.tagsItem });
                    if (config.vueUseAxios) {
                        const genAxiosRes = await new GVueUseAxios(
                            operation,
                            methodKey,
                            config.prefix ? `/${config.prefix}${pathKey}` : pathKey,
                            jsonData
                        ).genVueUseAxios(join(root, 'controller'), config, res);
                        controllers.push({ key: genAxiosRes.key, tagsItem: genAxiosRes.tagsItem });
                    }
                }
            } catch (err) {
                console.log({ err, pathKey });
            }
        }
    }
    // 添加Controllers内index文件
    const tagControllers = groupBy(controllers, 'tagsItem');
    for (const key in tagControllers) {
        if (Object.prototype.hasOwnProperty.call(tagControllers, key)) {
            const element = tagControllers[key];
            const indexUrl = join(root, 'controller', key, 'index.ts');
            await remove(indexUrl);
            await ensureFile(indexUrl);
            const indexProject = new Project();
            const indexSourceProject = indexProject.addSourceFileAtPath(indexUrl);
            indexSourceProject.addExportDeclarations(
                element.map(it => ({
                    moduleSpecifier: `./${it.key}`,
                }))
            );
            await indexSourceProject.save();
        }
    }
    // 添加Controller - index文件
    const indexUrl = join(root, 'controller', 'index.ts');
    await remove(indexUrl);
    await ensureFile(indexUrl);
    const indexProject = new Project();
    const indexSourceProject = indexProject.addSourceFileAtPath(join(root, 'controller', 'index.ts'));
    indexSourceProject.addExportDeclarations(
        Object.keys(tagControllers).map(it => ({
            moduleSpecifier: `./${it}`,
        }))
    );
    await indexSourceProject.save();
};

const GJavascript = async (root: string, axiosInstanceUrl?: string) => {
    const project = new Project({
        compilerOptions: {
            target: 99,
            declaration: true,
            outDir: join(root, 'dist'),
            moduleResolution: 2,
        },
        // include: ['controller', 'interface'],
    });
    project.addSourceFilesAtPaths(root + '/controller/**/*{.d.ts,.ts}');
    project.addSourceFilesAtPaths(root + '/interface/**/*{.d.ts,.ts}');
    if (axiosInstanceUrl !== undefined) {
        const result = project.emitToMemory();
        // output the emitted files to the console
        for (const file of result.getFiles()) {
            if (
                normalize(file.filePath).startsWith(join(root, 'dist', 'controller')) &&
                file.filePath.endsWith('.js')
            ) {
                file.text = file.text.replace(
                    `import request from "axios";`,
                    `import request from "${axiosInstanceUrl}";`
                );
            }
        }
        // or finally save this result to the underlying file system (or use `saveFilesSync()`)
        await result.saveFiles();
    } else {
        await project.emit(); // async
    }

    await Promise.all([remove(join(root, 'controller')), remove(join(root, 'interface'))]);
    await Promise.all([
        move(join(root, 'dist', 'controller'), join(root, 'controller'), { overwrite: true }),
        move(join(root, 'dist', 'interface'), join(root, 'interface'), { overwrite: true }),
    ]);
    await remove(join(root, 'dist'));
};
