import chalk from 'chalk';
import { Input } from '../commands';
import { ensureDir, readdir, readFile, stat, writeFile, pathExists, remove } from 'fs-extra';
import * as inquirer from 'inquirer';
import { join, basename } from 'path';
import { compile } from 'handlebars';
import { AbstractAction } from './abstract.action';
import { generateAstDocumentation, DocEntry } from '../compiler/ts-class.ast.document';
import { indexSupplementary } from '../compiler/index.supplementary';
import { moduleSupplementary } from '../compiler/module.supplementary';
import { appModuleSupplementary } from '../compiler/appModule.supplementary';
interface GenerateOptions {
	root: string;
	delete: boolean;
}
export class GenerateAstAction extends AbstractAction {
	public async handle(options: Input[]) {
		const now = Date.now();
		console.log(chalk.gray('i am generating...'));
		const option: GenerateOptions = {
			root: process.cwd(),
			delete: Boolean(options.find((it) => it.name === 'delete')?.value),
		};
		const allfiles = await readdir(option.root);
		const fileNames = allfiles.filter((it) => it.endsWith('.entity.ts'));
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

			await generateBaseEntityFile(baseName);
			return console.log('文件已生成，请自定义后再执行 generate');
			// fileNames.push(answers.name.replace(/.entity.ts$/, '') + '.entity.ts');

			// return console.log('未找到.entity.ts结尾的文件');
		}
		const fileNamesDoc = await Promise.all(
			fileNames.map(async (it) => {
				const docEntry = generateAstDocumentation(join(option.root, it));
				if (option.delete) {
					const readUri = join(__dirname, '../../templates/generate');
					const writeUri = join(process.cwd(), '../');
					const files = await readdir(readUri);
					for (const file of files) {
						await removeItemFile(docEntry, readUri, writeUri, file);
					}
				}
				return {
					fileName: it,
					docEntry,
				};
			})
		);
		for (const it of fileNamesDoc) {
			console.info(chalk.green(`[${it.fileName}]`));
			// 这里不同时执行是为了 同文件的追加
			await generate(it.docEntry, option);
		}
		// app module
		if (appModuleSupplementary(fileNamesDoc[0].docEntry)) {
			console.info(chalk.green(`[AppModule]`));
			console.info(
				chalk.yellow('  - '),
				chalk.gray('app.module.ts'.padEnd(35)),
				chalk.yellow('modified!')
			);
		}
		console.log(`✨  Done in ${((Date.now() - now) / 1000).toFixed(2)}s.`);
		async function removeItemFile(
			docEntryItem: DocEntry,
			readUri: string,
			writeUri: string,
			filename: string
		) {
			const rmFileName = compile(filename)(docEntryItem).replace('.handlebars', '');
			if (await _isDir(join(readUri, filename))) {
				const readDirs = await readdir(join(readUri, filename));
				for (const dirFileName of readDirs) {
					await removeItemFile(
						docEntryItem,
						join(readUri, filename),
						join(writeUri, filename),
						dirFileName
					);
				}
				return;
			}
			await remove(join(writeUri, rmFileName));
		}
	}
}

const generate = async (docEntryItem: DocEntry, option: GenerateOptions) => {
	const generateUri = join(__dirname, '../../templates/generate');
	const files = await readdir(generateUri);

	await generateWriteFile(option, generateUri, join(process.cwd(), '../'), files, docEntryItem);
};
const generateWriteFile = async (
	option: GenerateOptions,
	readUri: string,
	writeUri: string,
	/**
	 * 模板文件名
	 */
	fileNames: string[],
	docEntryItem: DocEntry,
	// 写入文件所在的文件夹
	dirName = ''
): Promise<void> => {
	// 可追加内容的路径  以及追加方式
	const canSupplementaryNames = [
		{ url: 'dto/index.ts.handlebars', handle: indexSupplementary },
		{ url: '{{moduleName}}.module.ts.handlebars', handle: moduleSupplementary },
	];
	// if (option.delete) {
	// 	await Promise.all(fileNames.map((filename) => removeItemFile(readUri, writeUri, filename)));
	// }
	await Promise.all(fileNames.map((filename) => writeItemFile(filename)));

	async function writeItemFile(filename: string) {
		// fileNames.forEach(async (filename) => {
		const fileUri = join(readUri, filename);
		if (await _isDir(fileUri)) {
			await generateWriteFile(
				option,
				fileUri,
				join(writeUri, filename),
				await readdir(fileUri),
				docEntryItem,
				filename
			);
			return;
		}
		await ensureDir(writeUri);
		const writeFileName = compile(filename)(docEntryItem).replace('.handlebars', '');

		const writeFileUri = join(writeUri, writeFileName);
		const fileContent = await readFile(fileUri);

		const content = compile(fileContent.toString())(docEntryItem);
		const canSupplementary = canSupplementaryNames.find((it) => it.url === join(dirName, filename));
		// 判断并执行追加操作
		const isExists = await pathExists(writeFileUri);
		// console.log('isExists', isExists, writeFileUri);
		if (canSupplementary && isExists) {
			// canSupplementary.handle(writeFileUri, docEntryItem);
			const supplementaryResult = canSupplementary.handle(writeFileUri, docEntryItem);
			if (supplementaryResult) {
				console.info(
					chalk.yellow('  - '),
					chalk.gray(join(dirName, basename(writeFileUri)).padEnd(35)),
					chalk.yellow('modified!')
				);
				return;
			}
		}

		await _writeFile(writeFileUri, content, dirName);
		// });
	}
};
const generateBaseEntityFile = async (baseName: string) => {
	const root = process.cwd();
	const handlebarsName = '{{baseName}}.entity.ts.handlebars';
	const entityUri = join(__dirname, '../../templates/entity');
	const handlebarsContent = await readFile(join(entityUri, handlebarsName));
	const fileName = compile(handlebarsName)({ baseName }).replace('.handlebars', '');
	const content = compile(handlebarsContent.toString())({
		BaseName: baseName.charAt(0).toUpperCase() + baseName.slice(1),
	});
	await writeFile(join(root, fileName), content);
};
const _isDir = async (file: string): Promise<boolean> => {
	const stats = await stat(file);
	if (stats.isDirectory()) {
		return true;
	} else if (stats.isFile()) {
		return false;
	} else {
		throw new Error('路径不正确！');
	}
};
/**
 * 写入文件
 * @param url 文件地址
 * @param content 文件内容
 * @param dirName 写入文件所在的文件夹
 * @param isCover 是否覆盖（默认不覆盖）
 */
async function _writeFile(url: string, content: string | Buffer, dirName = '', isCover = false) {
	const baseFileName = basename(url);
	const exists = await pathExists(url);
	// 执行写入文件
	if (!isCover && exists) {
		return console.info(
			chalk.red('  x '),
			chalk.gray(join(dirName, baseFileName).padEnd(35)),
			chalk.red('File already exists')
		);
	} else if (exists) {
		await writeFile(url, content);
		return console.info(
			chalk.yellow('  - '),
			chalk.gray(join(dirName, baseFileName).padEnd(35)),
			chalk.yellow('modified!!')
		);
	}
	await writeFile(url, content);
	console.info(chalk.green('  √ '), chalk.gray(join(dirName, baseFileName)));
}
