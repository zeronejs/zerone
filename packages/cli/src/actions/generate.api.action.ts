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
export interface GenerateApiActionConfig {
    docsUrl?: string;
    includeTags?: string[];
    excludeTags?: string[];
}
export class GenerateApiAction extends AbstractAction {
    public async handle(options: Input[]) {
        const now = Date.now();
        const root = process.cwd();
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
        // 生成类型文件
        await GInterfaceHandle(data.components.schemas as Schema, root);
        // 生成Controller
        await GControllerHandle(paths, root, config);
        console.info(chalk.green(`生成文件完成`));
        console.info(`✨  Done in ${((Date.now() - now) / 1000).toFixed(2)}s.`);
    }
}
// 生成类型文件
const GInterfaceHandle = async (inputSchemas: Schema, root: string) => {
    // 类型可能重复  暂时先用一个文件
    const schemas = Object.keys(inputSchemas);
    const indexUrl = join(root, 'interface', 'index.ts');
    await remove(indexUrl);
    await ensureFile(indexUrl);
    const indexProject = new Project();
    const indexSourceProject = indexProject.addSourceFileAtPath(indexUrl);
    schemas.map(async key => {
        const element: Schema = Reflect.get(inputSchemas, key);
        const typeFileUrl = join(root, 'interface', 'apiTypes', key + '.ts');
        await remove(typeFileUrl);
        await ensureFile(typeFileUrl);
        const project = new Project();
        const sourceProject = project.addSourceFileAtPath(typeFileUrl);
        try {
            new GInterface(element, sourceProject, key).genTsType();
            await sourceProject.save();
        } catch (error) {
            console.log({ error });
        }
    });
    indexSourceProject.addExportDeclarations(schemas.map(key => ({ moduleSpecifier: `./apiTypes/${key}` })));
    await indexSourceProject.save();
};
const supportMethodKeys = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];

// 生成Controller
const GControllerHandle = async (
    paths: { [pathName: string]: Path },
    root: string,
    config: GenerateApiActionConfig
) => {
    // await Promise.all(
    //     Object.keys(paths)
    //         .map(pathKey => {
    //             return Object.keys(paths[pathKey]).map(methodKey => {
    //                 // 仅支持这些method
    //                 if (!supportMethodKeys.includes(methodKey)) {
    //                     return;
    //                 }
    //                 const operation: Operation = (paths[pathKey] as any)[methodKey];
    //                 return new GController(operation, methodKey, pathKey).genController(
    //                     join(root, 'controller'),
    //                     config
    //                 );
    //             });
    //         })
    //         .flat()
    // );
    Object.keys(paths)
        .map(pathKey => {
            return Object.keys(paths[pathKey]).map(async methodKey => {
                // 仅支持这些method
                if (!supportMethodKeys.includes(methodKey)) {
                    return;
                }
                const operation: Operation = (paths[pathKey] as any)[methodKey];
                try {
                    await new GController(operation, methodKey, pathKey).genController(
                        join(root, 'controller'),
                        config
                    );
                } catch (err) {
                    console.log({ err });
                }
            });
        })
        .flat();
};
