import chalk from 'chalk';
import { Input } from '../commands';
import { readdir, readFile, stat, writeFile } from 'fs-extra';
import * as inquirer from 'inquirer';
import { join } from 'path';
import { compile } from 'handlebars';
import { AbstractAction } from './abstract.action';
import { generateAstDocumentation } from '../compiler/ts-class.ast.document';
import { appModuleSupplementary } from '../compiler/appModule.supplementary';
import { isString } from '@zeronejs/utils';
import { EngineLoader } from '../engine/engine.loader';
interface GenerateOptions {
    root: string;
    delete: boolean;
}
export class GenerateNodeAction extends AbstractAction {
    public async handle(options: Input[]) {
        const now = Date.now();
        console.log(chalk.gray('i am generating...'));
        let root = process.cwd();
        const pathOption = options.find(it => it.name === 'path')?.value;
        if (isString(pathOption)) {
            root = join(root, pathOption);
        }
        const option: GenerateOptions = {
            root,
            delete: Boolean(options.find(it => it.name === 'delete')?.value),
        };
        const allfiles = await readdir(option.root);
        const fileNames = allfiles.filter(it => it.endsWith('.entity.ts'));
        if (fileNames.length === 0) {
            const message = `File ending in '.entity.ts' not found, need to create?`;
            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    message: message,
                    name: 'name',
                    default: 'test', // 默认值
                },
            ]);
            const baseName = answers.name;

            await generateBaseEntityFile(baseName, option);
            return console.log('文件已生成，请自定义后再执行 generate');
            // fileNames.push(answers.name.replace(/.entity.ts$/, '') + '.entity.ts');

            // return console.log('未找到.entity.ts结尾的文件');
        }
        const fileNamesDoc = await Promise.all(
            fileNames.map(async it => {
                const docEntry = generateAstDocumentation(join(option.root, it));
                return {
                    fileName: it,
                    docEntry,
                };
            })
        );
        for (const it of fileNamesDoc) {
            console.info(chalk.green(`[${it.fileName}]`));
            // 这里不同时执行是为了 同文件的追加
            await EngineLoader.load(it.docEntry, option);
        }
        // app module
        const appFileUrl: string = join(option.root, '../../../', 'app.module.ts');
        if (appModuleSupplementary(appFileUrl, fileNamesDoc[0].docEntry)) {
            console.info(chalk.green(`[AppModule]`));
            console.info(
                chalk.yellow('  - '),
                chalk.gray('app.module.ts'.padEnd(35)),
                chalk.yellow('modified!')
            );
        }
        console.log(`✨  Done in ${((Date.now() - now) / 1000).toFixed(2)}s.`);
    }
}

const generateBaseEntityFile = async (baseName: string, option: GenerateOptions) => {
    const root = option.root;
    const handlebarsName = '{{baseName}}.entity.ts.handlebars';
    const entityUri = join(__dirname, '../../templates/entity');
    const handlebarsContent = await readFile(join(entityUri, handlebarsName));
    const fileName = compile(handlebarsName)({ baseName }).replace('.handlebars', '');
    const content = compile(handlebarsContent.toString())({
        BaseName: baseName.charAt(0).toUpperCase() + baseName.slice(1),
    });
    await writeFile(join(root, fileName), content);
};
