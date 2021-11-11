import chalk from 'chalk';
import { ERROR_PREFIX } from '../ui';
import ts, { Diagnostic } from 'typescript';
import consola from 'consola';
import { AbstractAction } from './abstract.action';
import { join } from 'path';
import { watch } from 'chokidar';
import { copy, remove, readJSON } from 'fs-extra';
export class BuildAction extends AbstractAction {
	public async handle() {
		try {
			const root = process.cwd();
			const options = {
				tsconfig: join(root, 'tsconfig.json'),
				src: root,
				output: join(root, 'dist'),
				types: join(root, 'dist'),
				watch: false,
				delete: !!false,
			};
			const tsconfig: { exclude: string[]; include: string[] } = await readJSON(options.tsconfig);
			tsconfig.exclude = tsconfig.exclude || [];
			tsconfig.include = tsconfig.include || [];
			const tsFiles: string[] = [];
			tsconfig.include.map((inc: string) => {
				tsFiles.push(join(options.src, inc, '*.ts'));
				tsFiles.push(join(options.src, inc, '*.tsx'));
				tsFiles.push(join(options.src, inc, '**/*.ts'));
				tsFiles.push(join(options.src, inc, '**/*.tsx'));
			});
			if (options.output && options.delete) {
				await remove(join(options.output));
			}

			if (options.watch) {
				watch(tsFiles).on('change', async () => {
					console.log(`文件变化`);
					await tscCompiling();
					await copyFiles();
				});
			} else {
				await tscCompiling();
				await copyFiles();
				process.exit();
			}
			// compiling
			async function tscCompiling() {
				return await new Promise((resolve) => {
					console.log(`i am compiling...`);
					const formatHost = {
						getCanonicalFileName: (path: any) => path,
						getCurrentDirectory: ts.sys.getCurrentDirectory,
						getNewLine: () => ts.sys.newLine,
					};
					function reportDiagnostic(diagnostic: Diagnostic) {
						// console.log({diagnostic})
						consola.error(
							'Path',
							':',
							diagnostic?.file?.fileName,
							`
						   `,
							'Error',
							diagnostic.code,
							':',
							ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine())
						);
					}

					function reportWatchStatusChanged(diagnostic: Diagnostic) {
						let message = ts.formatDiagnostic(diagnostic, formatHost);
						if (message.indexOf('TS6194') > 0) {
							// console.log({message})
							message = message.replace(/message\sTS[0-9]{4}:(.+)(\s+)$/, '$1');
							consola.ready({
								message: message.replace('Watching for file changes', ''),
								badge: true,
							});
							console.log(`i am compiling finish`);
							resolve('success');
						}
					}

					const configPath = ts.findConfigFile(
						/*searchPath*/ './',
						ts.sys.fileExists,
						'tsconfig.json'
					);
					if (!configPath) {
						throw new Error("Could not find a valid 'tsconfig.json'.");
					}

					const createProgram = ts.createSemanticDiagnosticsBuilderProgram;

					const host = ts.createWatchCompilerHost(
						configPath,
						{},
						ts.sys,
						createProgram,
						reportDiagnostic,
						reportWatchStatusChanged
					);

					const origCreateProgram = host.createProgram;
					host.createProgram = (rootNames: any, options: any, host: any, oldProgram: any) => {
						consola.info("We're about to create the program!");
						Reflect.deleteProperty(options, 'outDir');
						Reflect.set(options, 'outDir', join(process.cwd(), 'dist'));
						Reflect.set(options, 'baseUrl', join(process.cwd()));
						Reflect.set(options, 'rootDir', join(process.cwd()));
						// consola.info({ rootNames, options, host, oldProgram });
						return origCreateProgram(rootNames, options, host, oldProgram);
					};
					const origPostProgramCreate = host.afterProgramCreate;

					host.afterProgramCreate = (program: any) => {
						consola.info('We finished making the program!');
						if (origPostProgramCreate) {
							origPostProgramCreate(program);
						}
					};

					ts.createWatchProgram(host);
				});
			}
			async function copyFiles() {
				console.log(`i am copy...`);
				await Promise.all([copyIncludeFiles(), copyRootFiles()]);
				console.log(`i am copy finish`);
			}
			async function copyIncludeFiles() {
				return Promise.all(
					tsconfig.include.map((it) => {
						return copy(it, join(options.output, it), {
							overwrite: true,
							filter: (src) => {
								const filterEndsWith = ['.ts', '.tsx', 'node_modules', '__tests__', 'dist'];
								return !filterEndsWith.some((it) => src.endsWith(it));
							},
						});
					})
				);
			}
			async function copyRootFiles() {
				const copyRootFiles = ['README.md', 'readme.md', 'package.json', 'LICENSE', 'templates'];
				return Promise.all(
					copyRootFiles.map((it) => {
						return copy(join(root, it), join(options.output, it), {
							overwrite: true,
						});
					})
				);
			}
		} catch (err) {
			if (err instanceof Error) {
				console.log(`\n${ERROR_PREFIX} ${err.message}\n`);
			} else {
				console.error(`\n${chalk.red(err)}\n`);
			}
		}
	}
}
