import chalk from 'chalk';
import { Input } from '../commands';
import { AbstractAction } from './abstract.action';
import { ensureFile, pathExists, readJson, writeJson, writeFile } from 'fs-extra';
import { join } from 'path';
import axios from 'axios';

import { isString } from '@zeronejs/utils';

/**config类型 */
export interface GenerateAiMdActionConfig {
    serviceUrl?: string;
}

/**获取模板响应结果 */
export interface GenAIGetTemplateResultDto {
    fileName: string;
    tempContent: string;
}
export class GenerateAiMdAction extends AbstractAction {
    public async handle(options: Input[]) {
        const now = Date.now();
        const configFileName = 'md.config.json';
        const pathOption = options.find(it => it.name === 'path')?.value;
        const basePath = isString(pathOption) ? pathOption : 'reqs';
        const root = join(process.cwd(), basePath);
        if (
            !(await pathExists(join(root, configFileName))) &&
            (await pathExists(join(process.cwd(), 'package.json')))
        ) {
            // 不存在config  并且 在根目录
            await ensureFile(join(root, configFileName));
            await writeJson(join(root, configFileName), {
                serviceUrl: 'http://192.168.1.203:5010/genAI/getTemplate',
            });
        }
        const config: GenerateAiMdActionConfig = await readJson(join(root, configFileName));

        if (!config.serviceUrl) {
            return console.info(chalk.red('serviceUrl 未指定文档路径！'));
        }
        console.info(chalk.gray('读取json链接中...'));
        // http文档地址
        const { data } = await axios
            .get<{ data: GenAIGetTemplateResultDto[] }>(config.serviceUrl)
            .catch(err => {
                throw console.info(chalk.red('json链接读取失败 ！！！'));
            });

        if (!data?.data || data.data.length === 0) {
            return console.info(chalk.red('json链接读取失败！！！,获取不到模板'));
        }
        console.info(chalk.green(`链接读取成功`));
        console.info(chalk.gray('生成文件中...'));

        for (const contentItem of data.data) {
            await ensureFile(join(root, contentItem.fileName));
            await writeFile(join(root, contentItem.fileName), contentItem.tempContent);
        }

        console.info(chalk.green(`生成文件完成`));
        console.info(`✨  Done in ${((Date.now() - now) / 1000).toFixed(2)}s.`);
    }
}
