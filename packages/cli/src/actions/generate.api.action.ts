import chalk from 'chalk';
import { Input } from '../commands';
import { AbstractAction } from './abstract.action';
import { ensureFile, pathExists, readJson, remove } from 'fs-extra';
import { join } from 'path';
import { Path, Operation, Schema } from 'swagger-schema-official';
import { Project } from 'ts-morph';
import axios from 'axios';
import { GController } from './generateClass/GController';
import { GInterface } from './generateClass/GInterface';
import { GMockClass } from './generateClass/GMockClass';
import { escapeVar } from '../utils/generateUtil';
import { upperFirst } from 'lodash';
import { isString } from '@zeronejs/utils';
export interface GenerateApiActionConfig {
    docsUrl?: string;
    includeTags?: string[];
    excludeTags?: string[];
    prefix?: string;
    axiosInstanceUrl?: string;
}
export class GenerateApiAction extends AbstractAction {
    public async handle(options: Input[]) {
        const now = Date.now();
        let root = process.cwd();
        const pathOption = options.find(it => it.name === 'path')?.value;
        const deleteOption = options.find(it => it.name === 'delete')?.value;
        if (isString(pathOption)) {
            root = join(root, pathOption);
        }
        if (!(await pathExists(join(root, 'swagger.config.json')))) {
            return console.info(chalk.red('swagger.config.json 文件不存在！！'));
        }
        const config: GenerateApiActionConfig = await readJson(join(root, 'swagger.config.json'));
        if (!config.docsUrl) {
            return console.info(chalk.red('docsUrl 未指定文档路径！'));
        }
        console.info(chalk.gray('读取json链接中...'));
        const { data } = await axios.get(config.docsUrl).catch(err => {
            throw console.info(chalk.red('json链接读取失败 ！！！'));
        });
        if (!data || !data.paths) {
            return console.info(chalk.red('json链接读取失败！！！'));
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
        await GControllerHandle(paths, root, config);
        // 生成mock类型文件
        // await GMockClassHandle(data.components.schemas as Schema, root, config);

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
        const typeFileUrl = join(root, 'interface', 'apiTypes', key + '.ts');
        await remove(typeFileUrl);
        await ensureFile(typeFileUrl);
        const project = new Project();
        const sourceProject = project.addSourceFileAtPath(typeFileUrl);
        try {
            new GInterface(element, sourceProject, key).genTsType(config.prefix);
            await sourceProject.save();
        } catch (error) {
            console.log({ error });
        }
    }

    indexSourceProject.addExportDeclarations(
        schemas.map(key => ({ moduleSpecifier: `./apiTypes/${escapeVar(upperFirst(config.prefix) + key)}` }))
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
    config: GenerateApiActionConfig
) => {
    for (const pathKey of Object.keys(paths)) {
        for (const methodKey of Object.keys(paths[pathKey])) {
            // 仅支持这些method
            if (!supportMethodKeys.includes(methodKey)) {
                console.log('method不支持：', pathKey);
                continue;
            }
            const operation: Operation = (paths[pathKey] as any)[methodKey];
            try {
                await new GController(
                    operation,
                    methodKey,
                    config.prefix ? `/${config.prefix}${pathKey}` : pathKey
                ).genController(join(root, 'controller'), config);
            } catch (err) {
                console.log({ err });
            }
        }
    }
};
// todo  生成mock
const GMockClassHandle = async (inputSchemas: Schema, root: string, config: GenerateApiActionConfig) => {
    // 类型可能重复  暂时先用一个文件
    const schemas = Object.keys(inputSchemas);
    const indexUrl = join(root, 'mocks', 'index.ts');
    await remove(indexUrl);
    await ensureFile(indexUrl);
    const indexProject = new Project();
    const indexSourceProject = indexProject.addSourceFileAtPath(indexUrl);
    for (let key of schemas) {
        const element: Schema = Reflect.get(inputSchemas, key);
        key = escapeVar(upperFirst(config.prefix) + key);
        const typeFileUrl = join(root, 'mocks', 'apiMocks', key + '.ts');
        await remove(typeFileUrl);
        await ensureFile(typeFileUrl);
        const project = new Project();
        const sourceProject = project.addSourceFileAtPath(typeFileUrl);
        try {
            new GMockClass(element, sourceProject, key).genTsType(config.prefix);
            await sourceProject.save();
        } catch (error) {
            console.log({ error });
        }
    }

    indexSourceProject.addExportDeclarations(
        schemas.map(key => ({ moduleSpecifier: `./apiMocks/${escapeVar(upperFirst(config.prefix) + key)}` }))
    );
    await indexSourceProject.save();
};
// // 生成Controller
// const GMockHandle = async (
//     paths: { [pathName: string]: Path },
//     root: string,
//     config: GenerateApiActionConfig
// ) => {
//     for (const pathKey of Object.keys(paths)) {
//         for (const methodKey of Object.keys(paths[pathKey])) {
//             // 仅支持这些method
//             if (!supportMethodKeys.includes(methodKey)) {
//                 console.log('method不支持：', pathKey);
//                 continue;
//             }
//             const operation: Operation = (paths[pathKey] as any)[methodKey];
//             try {
//                 await new GController(
//                     operation,
//                     methodKey,
//                     config.prefix ? `/mocks/${config.prefix}${pathKey}` : pathKey
//                 ).genController(join(root, 'mocks'), config);
//             } catch (err) {
//                 console.log({ err });
//             }
//         }
//     }
// };
