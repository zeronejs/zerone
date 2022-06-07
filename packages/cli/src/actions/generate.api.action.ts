import chalk from 'chalk';
import { Input } from '../commands';
import { AbstractAction } from './abstract.action';
import { ensureFile, pathExists, readJson, remove } from 'fs-extra';
import { join } from 'path';
import { Path, Operation, Schema } from 'swagger-schema-official';
import { Project } from 'ts-morph';
import axios from 'axios';
import { GInterface } from './generateClass/GInterface';
import { GController } from './generateClass/GController';
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
        console.log(chalk.gray('reading docs...'));
        const { data } = await axios.get(config.docsUrl);
        if (!data || !data.paths) {
            return console.log('read failed！！！');
        }
        const paths = data.paths as { [pathName: string]: Path };
        // 生成类型文件
        // await GInterfaceHandle(data.components.schemas as Schema, root);
        // 生成Controller
        await GControllerHandle(paths, root, config);
        console.log(`✨  Done in ${((Date.now() - now) / 1000).toFixed(2)}s.`);
    }
}
// 生成类型文件
const GInterfaceHandle = async (inputSchemas: Schema, root: string) => {
    const typeFileUrl = join(root, 'interface', 'index.ts');
    await remove(typeFileUrl);
    await ensureFile(typeFileUrl);
    const project = new Project();
    // 类型可能重复  暂时先用一个文件
    const sourceProject = project.addSourceFileAtPath(typeFileUrl);
    const now = Date.now();
    const schemas = Object.keys(inputSchemas);
    sourceProject.addInterfaces(schemas.map(key => ({ name: key })));
    schemas.map((key, index) => {
        const element: Schema = Reflect.get(inputSchemas, key);
        console.log({ cur: index + 1, total: schemas.length, key });
        new GInterface(element, sourceProject, key).genTsType();
    });
    console.log(Date.now() - now);
    return sourceProject.save();
};
const supportMethodKeys = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];

// 生成Controller
const GControllerHandle = async (
    paths: { [pathName: string]: Path },
    root: string,
    config: GenerateApiActionConfig
) => {
    await Promise.all(
        Object.keys(paths)
            .map(pathKey => {
                return Object.keys(paths[pathKey]).map(methodKey => {
                    // 仅支持这些method
                    if (!supportMethodKeys.includes(methodKey)) {
                        return;
                    }
                    const operation: Operation = (paths[pathKey] as any)[methodKey];
                    return new GController(operation, methodKey, pathKey).genController(
                        join(root, 'controller'),
                        config
                    );
                });
            })
            .flat()
    );
};
