import { AbstractAction } from './abstract.action';
import { ensureDir, copy, readJson, writeJson } from 'fs-extra';
import * as inquirer from 'inquirer';
import { Input } from '../commands';
import { join } from 'path';
import ora from 'ora';
import chalk from 'chalk';
import { EMOJIS } from '../ui';
export class NewAction extends AbstractAction {
	public async handle(inputs: Input[], options: Input[]) {
		const root = process.cwd();
		let appName = inputs.find((input) => input.name === 'name')!.value as string;
		if (!appName) {
			const message = 'What name would you like to use for the new project?';
			const answers = await inquirer.prompt([
				{
					type: 'input',
					message: message,
					name: 'name',
					default: 'zerone-app', // 默认值
				},
			]);
			appName = answers.name;
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
			await ensureDir(join(root, appName));

			await copy(join(__dirname, '../../templates/new'), join(root, appName), { overwrite: false });
			const packageJson = await readJson(join(root, appName, 'package.json'));
			packageJson.name = appName;
			await writeJson(join(root, appName, 'package.json'), packageJson, { spaces: 2 });
			spinner.succeed();
			console.info(chalk.green('Creating a successful  =>  ', appName));
		} catch (e: any) {
			spinner.fail();
			console.error(chalk.red(e.message));
		}

		// process.exit(0);
	}
}
