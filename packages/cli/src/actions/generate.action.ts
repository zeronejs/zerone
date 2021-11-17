// import chalk from 'chalk';
// import { Input } from '../commands';
// import { ensureDir, readdir, readFile, stat, writeFile, pathExists } from 'fs-extra';
// import * as inquirer from 'inquirer';
// import * as ts from 'typescript';
// import { join, basename } from 'path';
// import { compile } from 'handlebars';
// import { AbstractAction } from './abstract.action';
// import { DocEntry, generateDocumentation } from '../compiler/ts-class.document';
// interface HandleBarsInput extends DocEntry {
// 	BaseName: string;
// 	baseName: string;
// 	// baseFileName: string;
// }
// export class GenerateAction extends AbstractAction {
// 	public async handle(inputs: Input[], options: Input[]) {
// 		const root = process.cwd();
// 		const allfiles = await readdir(root);
// 		const fileNames = allfiles.filter((it) => it.includes('.entity.ts'));
// 		if (fileNames.length === 0) {
// 			const message = '未找到.entity.ts结尾的文件，如需新建，请输入文件的基础名称！';
// 			const answers = await inquirer.prompt([
// 				{
// 					type: 'input',
// 					message: message,
// 					name: 'name',
// 					default: 'test', // 默认值
// 				},
// 			]);
// 			const baseName = answers.name;
			
// 			await generateBaseEntityFile(baseName)
// 			return	console.log('文件已生成，请自定义后再执行 generate')
// 			// fileNames.push(answers.name.replace(/.entity.ts$/, '') + '.entity.ts');

// 			// return console.log('未找到.entity.ts结尾的文件');
// 		}
// 		const docEntry = generateDocumentation(fileNames, {
// 			target: ts.ScriptTarget.ES5,
// 			module: ts.ModuleKind.CommonJS,
// 		});
// 		docEntry.forEach((it) => {
// 			const BaseName = it.name?.replace(/Entity$/, '') ?? '';
// 			const handleBarsInput: HandleBarsInput = {
// 				...it,
// 				BaseName: BaseName,
// 				baseName: BaseName.charAt(0).toLowerCase() + BaseName.slice(1),
// 				// baseFileName: '',
// 			};
// 			generate(handleBarsInput);
// 		});
// 	}
// }

// const generate = async (docEntryItem: DocEntry) => {
// 	const generateUri = join(__dirname, '../../templates/generate');
// 	const files = await readdir(generateUri);

// 	generateWriteFile(generateUri, join(process.cwd(), '../'), files, docEntryItem);
// };
// const generateWriteFile = async (
// 	readUri: string,
// 	writeUri: string,
// 	fileNames: string[],
// 	docEntryItem: DocEntry
// ) => {
// 	fileNames.forEach(async (filename) => {
// 		const fileUri = join(readUri, filename);
// 		if (await _isDir(fileUri)) {
// 			generateWriteFile(fileUri, join(writeUri, filename), await readdir(fileUri), docEntryItem);
// 			return;
// 		}
// 		await ensureDir(writeUri);

// 		const writeFileName = compile(filename)(docEntryItem).replace('.handlebars', '');
// 		const writeFileUri = join(writeUri, writeFileName);
// 		const fileContent = await readFile(fileUri);

// 		const content = compile(fileContent.toString())(docEntryItem);
// 		await _writeFile(writeFileUri, content);
// 	});
// };
// const generateBaseEntityFile = async (baseName: string) => {
// 	const root = process.cwd();
// 	const handlebarsName = '{{baseName}}.entity.ts.handlebars';
// 	const entityUri = join(__dirname, '../../templates/entity');
// 	const handlebarsContent = await readFile(join(entityUri, handlebarsName));
// 	const fileName = compile(handlebarsName)({ baseName }).replace('.handlebars', '');
// 	const content = compile(handlebarsContent.toString())({
// 		BaseName: baseName.charAt(0).toUpperCase() + baseName.slice(1),
// 	});
// 	await writeFile(join(root, fileName), content);
// };
// const _isDir = async (file: string): Promise<boolean> => {
// 	const stats = await stat(file);
// 	if (stats.isDirectory()) {
// 		return true;
// 	} else if (stats.isFile()) {
// 		return false;
// 	} else {
// 		throw new Error('路径不正确！');
// 	}
// };
// /**
//  * 写入文件
//  * @param url 文件地址
//  * @param content 文件内容
//  * @param isCover 是否覆盖（默认不覆盖）
//  */
// const _writeFile = async (url: string, content: string | Buffer, isCover = false): Promise<void> => {
// 	const baseFileName = basename(url);
// 	// 执行写入文件
// 	if (!isCover && (await pathExists(url))) {
// 		return console.info(chalk.red('  x '), chalk.gray(baseFileName.padEnd(35)), '文件已存在!');
// 	}
// 	await writeFile(url, content);
// 	console.info(chalk.green('  √ '), chalk.gray(baseFileName));
// };
