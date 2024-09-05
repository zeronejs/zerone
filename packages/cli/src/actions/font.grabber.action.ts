import chalk from 'chalk';
import { Input } from '../commands';
import { AbstractAction } from './abstract.action';
import { ensureFile, pathExists, readJson, remove, move, writeFile, readFile } from 'fs-extra';
import path, { join, resolve } from 'path';
import url from 'node:url';
import postcss, { AtRule } from 'postcss';
import { isString } from '@zeronejs/utils';
import axios from 'axios';
import { FontSpec, calculateFontSpecs, downloadFile, md5 } from '../utils/fontGrabberUtils';
import { isLocalFilePath } from '../utils/utils';

export interface FontGrabberActionConfig {
    cssUrl?: string;
    output?: string;
}

export class FontGrabberAction extends AbstractAction {
    public async handle(options: Input[]) {
        const now = Date.now();
        let root = process.cwd();
        const pathOption = options.find(it => it.name === 'path')?.value;
        const configFile = `iconfont.config.json`;
        if (isString(pathOption)) {
            root = join(root, pathOption);
        }
        if (!(await pathExists(join(root, configFile)))) {
            return console.info(chalk.red(`${configFile} 文件不存在！！`));
        }
        const config: FontGrabberActionConfig = await readJson(join(root, configFile));

        if (!config.cssUrl) {
            return console.info(chalk.red('cssUrl 未指定文档路径！'));
        }
        console.info(chalk.gray('读取json链接中...'));
        let data: string;
        // 地址
        if (!isLocalFilePath(config.cssUrl)) {
            const cssUrl = config.cssUrl.startsWith('//') ? `https:${config.cssUrl}` : config.cssUrl;

            const res = await axios.get(cssUrl).catch(err => {
                throw console.info(chalk.red('json链接读取失败 ！！！'));
            });
            data = res.data;
        } else {
            // 本地json地址
            try {
                data = (await readFile(resolve(root, config.cssUrl))).toString();
            } catch (e) {
                console.log(e);
                return console.info(chalk.red('json本地链接读取失败！！！'));
            }
        }
        if (!data) {
            return console.info(chalk.red('json链接读取失败！！！'));
        }
        console.info(chalk.green(`链接读取成功`));
        const outputPath = join(root, config.output ?? 'iconfont.css');
        const outputParse = path.parse(outputPath);
        const result = await postcss().process(data, { from: config.cssUrl, to: outputPath });
        const postcssRoot = result.root;

        for (const node of postcssRoot.nodes) {
            if (node.type !== 'atrule' || node.name !== 'font-face') {
                continue;
            }
            const fontFace = node;
            if (!fontFace || !fontFace.nodes) {
                continue;
            }
            for (const srcDecl of fontFace.nodes) {
                if (srcDecl.type !== 'decl' || srcDecl.prop !== 'src') {
                    continue;
                }
                // const srcDecl = fontFace.nodes.find(node => node.type === 'decl' && node.prop === 'src') as Declaration;
                const fontSpecs = calculateFontSpecs(srcDecl);
                // 已下载列表  防止重复下载
                const downloaded: Record<
                    string,
                    {
                        fontSpec: FontSpec;
                        downMd5: string;
                    }
                > = {};
                const now = Date.now();
                for (const fontSpec of fontSpecs) {
                    const fontUrlString = fontSpec.parsedSrc.urlObject.href;
                    const extension = fontSpec.basename.split('.').pop();
                    // Download the font file if it hasn't been downloaded yet.
                    const filename = `${outputParse.name}.${extension}`;
                    if (!downloaded[fontUrlString]) {
                        const downValue = await downloadFile(
                            fontUrlString,
                            path.join(outputParse.dir, filename)
                        );
                        downloaded[fontUrlString] = {
                            fontSpec,
                            downMd5: md5(downValue),
                        };
                    }
                    srcDecl.value = srcDecl.value.replace(
                        fontUrlString,
                        `${filename}?md5=${downloaded[fontUrlString].downMd5}`
                    );
                }
            }
        }

        const res = postcssRoot.toResult();
        const cssPath = path.join(outputParse.dir, `${outputParse.name}.css`);
        await ensureFile(cssPath);
        writeFile(cssPath, res.css, () => true);
        if (res.map) {
            const cssMapPath = path.join(outputParse.dir, `${outputParse.name}.css.map`);
            await ensureFile(cssMapPath);
            writeFile(cssMapPath, res.map.toString(), () => true);
        }
        console.info(chalk.green(`生成文件完成`));
        console.info(`✨  Done in ${((Date.now() - now) / 1000).toFixed(2)}s.`);
    }
}
