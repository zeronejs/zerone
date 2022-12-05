import chalk from 'chalk';
import { copy, ensureDir, existsSync } from 'fs-extra';
import * as inquirer from 'inquirer';
// import { download } from 'obtain-git-repo';
import ora from 'ora';
import { join } from 'path';
import { EMOJIS } from '../ui';
import { AbstractAction } from './abstract.action';
const questions = {
    one: [
        {
            type: 'list',
            message: '请选择操作？',
            name: 'operation',
            choices: [
                { name: '创建新项目', value: 'new' },
                { name: '创建子项目', value: 'module' },
            ],
        },
    ],
    two: [
        {
            type: 'list',
            message: '请选择项目模版？',
            name: 'operation',
            choices: [
                { name: '中后台模版', value: 'admin' },
                { name: '移动端模版', value: 'mobile' },
            ],
        },
    ],
    three: [
        {
            type: 'input',
            message: '请输入项目名称',
            name: 'name',
            default: 'zerone-fe-template', // 默认值
        },
    ],
    four: [
        {
            type: 'input',
            message: '请输入模块名称',
            name: 'name',
            default: 'module', // 默认值
        },
    ],
};
export class GenerateFeAction extends AbstractAction {
    public async handle() {
        const opt = await inquirer.prompt(questions.one);
        const answer = opt.operation;
        if (answer === 'new') {
            // const opt = await inquirer.prompt(questions.two);
            // const answer = opt.operation;
            // if (answer === 'admin') {
            //     console.log(chalk.white('pnpm run dev'));
            // }
            // if (answer === 'mobile') {
            //     console.log(chalk.redBright('未实现，待完善'));
            // }

            const opt = await inquirer.prompt(questions.three);
            const appName = opt.name;
            this.downloadProject(appName);
        }
        if (answer === 'module') {
            const opt = await inquirer.prompt(questions.four);
            const answer = opt.name;
            this.createMoudle(answer);
        }
    }
    private downloadProject(dirname: string) {
        const dirIsExists = existsSync(dirname);

        if (dirIsExists) {
            console.log(chalk.redBright('目录已经存在'));
            return;
        }
        const spinner = ora({
            spinner: {
                interval: 120,
                frames: ['▹▹▹▹▹', '▸▹▹▹▹', '▹▸▹▹▹', '▹▹▸▹▹', '▹▹▹▸▹', '▹▹▹▹▸'],
            },
            text: `Installation in progress... ${EMOJIS.COFFEE}`,
        });
        spinner.start();
        // // todo
        //     download(
        //         'direct:https://github.com/zzh948498/vue-admin-template.git#main',
        //         dirname,
        //         { clone: true },
        //         function (err) {
        //             if (err) {
        //                 console.log(`output->err`, err);
        //                 spinner.warn('下载失败');
        //             } else {
        //                 spinner.succeed('项目创建成功，请依次执行以下命令');
        //                 console.log(chalk.white(`cd ${dirname}`));
        //                 console.log(chalk.white('pnpm i'));
        //                 console.log(chalk.white('pnpm dev'));
        //                 return;
        //             }
        //         }
        //     );
    }
    private async createMoudle(dirname: string) {
        const dirIsExists = existsSync(dirname);
        if (dirIsExists) {
            console.log(chalk.red('目录已经存在'));
            return;
        }
        const spinner = ora({
            spinner: {
                interval: 120,
                frames: ['▹▹▹▹▹', '▸▹▹▹▹', '▹▸▹▹▹', '▹▹▸▹▹', '▹▹▹▸▹', '▹▹▹▹▸'],
            },
            text: `Installation in progress... ${EMOJIS.COFFEE}`,
        });
        spinner.start();
        try {
            const root = process.cwd();
            await ensureDir(join(root, dirname));
            await copy(join(__dirname, '../../templates/feModule'), join(root, dirname), {
                overwrite: false,
                // dereference: true,
            });
            spinner.succeed();
            console.info(chalk.green('Creating a successful  =>  ', dirname));
        } catch (e: any) {
            spinner.fail();
            console.error(chalk.red(e.message));
        }
        process.exit(0);
    }
}
