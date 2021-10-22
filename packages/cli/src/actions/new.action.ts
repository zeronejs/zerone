import { AbstractAction } from './abstract.action';
import { ensureDir, copy, readJson, writeJson, writeFile } from 'fs-extra';
import * as inquirer from 'inquirer';
import { Input } from '../commands';
import { join } from 'path';
import ora from 'ora';
import chalk from 'chalk';
import { EMOJIS } from '../ui';
import { defaultGitIgnore } from '../utils/defaults';
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

			await copy(join(__dirname, '../../templates/new'), join(root, appName), {
				overwrite: false,
				// dereference: true,
			});
			const packageJson = await readJson(join(root, appName, 'package.json'));
			packageJson.name = appName;
			await writeJson(join(root, appName, 'package.json'), packageJson, { spaces: 2 });

			await createGitIgnoreFile(join(root, appName));
			spinner.succeed();
			console.info(chalk.green('Creating a successful  =>  ', appName));
		} catch (e: any) {
			spinner.fail();
			console.error(chalk.red(e.message));
		}

		// process.exit(0);
	}
}

/**
 * Write a file `.gitignore` in the root of the newly created project.
 * `.gitignore` available in `@nestjs/schematics` cannot be published to
 * NPM (needs to be investigated).
 *
 * @param url
 * @param content (optional) Content written in the `.gitignore`.
 *
 * @return Resolves when succeeds, or rejects with any error from `fn.writeFile`.
 */
const createGitIgnoreFile = (url: string, content?: string) => {
	const fileContent = content || defaultGitIgnore;
	const filePath = join(url, '.gitignore');
	return writeFile(filePath, fileContent);
};
