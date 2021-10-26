import chalk from 'chalk';
import { Input } from '../commands';
import { ERROR_PREFIX } from '../ui';
import ts, { Diagnostic } from 'typescript';
import consola from 'consola';
import { AbstractAction } from './abstract.action';

import * as gulp from 'gulp';
// import { createProject } from 'gulp-typescript';
import { join } from 'path';
import { watch } from 'chokidar';
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { copy } from 'fs-extra';
// import { npmPublish } from './publish'
import { ensureDirSync, removeSync } from 'fs-extra';
function fromEvent(event: any) {
	return new Promise<void>((resolve, reject) => {
		event.on('end', () => {
			resolve();
		});
		event.on(`error`, (e: Error) => {
			reject(e);
		});
	});
}
export class BuildAction extends AbstractAction {
	public async handle(inputs: Input[], _options: Input[]) {
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
			const pkg = JSON.parse(readFileSync(join(options.src, 'package.json')).toString('utf8'));
			const tsconfig = require(options.tsconfig);
			tsconfig.exclude = tsconfig.exclude || [];
			tsconfig.include = tsconfig.include || [];
			const exclude = [
				...tsconfig.exclude.map((inc: string) => `!${join(options.src, inc, '*.ts')}`),
				...tsconfig.exclude.map((inc: string) => `!${join(options.src, inc, '*.tsx')}`),
				...tsconfig.exclude.map((inc: string) => `!${join(options.src, inc, '/**/*.ts')}`),
				...tsconfig.exclude.map((inc: string) => `!${join(options.src, inc, '/**/*.tsx')}`),
			];
			const tsFiles: string[] = [];
			tsconfig.include.map((inc: string) => {
				tsFiles.push(join(options.src, inc, '*.ts'));
				tsFiles.push(join(options.src, inc, '*.tsx'));
				tsFiles.push(join(options.src, inc, '**/*.ts'));
				tsFiles.push(join(options.src, inc, '**/*.tsx'));
			});
			if (options.output && options.delete) {
				removeSync(join(options.output));
			}
			gulp.task(`dts`, (done: any) => {
				// delete pkg.main;
				// pkg.name = `${pkg.name}.types`;
				// pkg.main = pkg.types;
				// console.log(`i am compiling dts...`);
				// const pros = tsconfig.include.map((inc: string) => {
				// 	const tsProject = createProject(options.tsconfig, {
				// 		declaration: true,
				// 	});
				// 	const tsResult = gulp
				// 		.src([
				// 			join(options.src, inc, '*.ts'),
				// 			join(options.src, inc, '*.tsx'),
				// 			join(options.src, inc, '**/*.ts'),
				// 			join(options.src, inc, '**/*.tsx'),
				// 			`!${join(options.src, options.output || '')}`,
				// 			...exclude,
				// 		])
				// 		.pipe(tsProject());
				// 	const dts = fromEvent(tsResult.dts.pipe(gulp.dest(join(options.types!, inc))));
				// 	return dts;
				// });
				// Promise.all(pros).then((res) => {
				// 	console.log(`i am compiling dts finish`);
				// 	ensureDirSync(options.output!);
				// 	writeFileSync(join(options.types!, 'package.json'), JSON.stringify(pkg, null, 2));
				// 	done && done();
				// });
			});
			gulp.task('compiler', (done: any) => {
				console.log(`i am compiling...`);
				// const pros = tsconfig.include.map((inc: string) => {
				// 	const tsProject = createProject(options.tsconfig);
				// 	const tsResult = gulp
				// 		.src([
				// 			join(options.src, inc, '*.ts'),
				// 			join(options.src, inc, '*.tsx'),
				// 			join(options.src, inc, '**/*.ts'),
				// 			join(options.src, inc, '**/*.tsx'),
				// 			`!${join(options.src, options.output || '')}`,
				// 			...exclude,
				// 		])
				// 		.pipe(tsProject());
				// 	const js = fromEvent(tsResult.pipe(gulp.dest(join(options.output!, inc))));
				// 	return js;
				// });
				// Promise.all(pros).then((res) => {
				// 	console.log(`i am compiling finish`);
				// 	done && done();
				// });
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
						// process.exit();
						console.log(`i am compiling finish`);
						done && done();
					}
				}

				const configPath = ts.findConfigFile(/*searchPath*/ './', ts.sys.fileExists, 'tsconfig.json');
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
			gulp.task('copy', (done: any) => {
				console.log(`i am copy...`);
				const incs = tsconfig.include.map((inc: string) => {
					const src = gulp
						.src(
							`${join(
								options.src,
								inc,
								// '**/*.{ts,json,graphql,proto,notadd,tpl,html,css,jpg,png,md,ico,svg,htm,yml,jpeg,mp4,mp3}'
								'**/*.{json,graphql,proto,notadd,tpl,html,css,jpg,png,md,ico,svg,htm,yml,jpeg,mp4,mp3}'
							)}`
						)
						.pipe(gulp.dest(join(options.output!, inc)));
					return fromEvent(src);
				});
				const inputs = [
					`!${join(options.src, '__tests__')}/**/*`,
					`!${join(options.src, '/**/__tests__')}/**/*`,
					`!${join(options.src, 'node_modules/**/*')}`,
					`!${join(options.src, '/**/node_modules')}/**/*`,
					`!${join(options.output!, `/**/*`)}`,
				];
				if (existsSync(join(options.src, 'README.md'))) {
					inputs.push(join(options.src, 'README.md'));
				}
				if (existsSync(join(options.src, 'readme.md'))) {
					inputs.push(join(options.src, 'readme.md'));
				}
				if (existsSync(join(options.src, 'package.json'))) {
					inputs.push(join(options.src, 'package.json'));
				}
				if (existsSync(join(options.src, 'env.back'))) {
					inputs.push(join(options.src, 'env.back'));
				}
				if (existsSync(join(options.src, 'lerna.json'))) {
					inputs.push(join(options.src, 'lerna.json'));
				}
				const templatesDir = 'templates';
				// cli的模板
				if (existsSync(join(options.src, templatesDir))) {
					incs.push(
						copy(join(options.src, templatesDir), join(options.output!, templatesDir), {
							overwrite: true,
						})
					);
					// const src = gulp
					// 	.src(
					// 		`${join(
					// 			options.src,
					// 			templatesDir,
					// 			'**/*'
					// 		)}`
					// 	)
					// 	.pipe(gulp.dest(join(options.output!, templatesDir)));
					// incs.push(fromEvent(src));
				}
				incs.push(
					fromEvent(gulp.src(inputs).pipe(gulp.dest(options.output!))).catch((e) => done && done(e))
				);
				Promise.all(incs).then(() => {
					console.log(`i am copy finish`);
					done && done();
				});
			});
			gulp.task(`start`, (done: any) => {
				gulp.series(
					'compiler',
					'copy'
				)((err) => {
					done && done();
				});
			});
			if (options.watch) {
				watch(tsFiles).on('change', () => {
					gulp.series(`start`)(() => {
						console.log(`文件变化`);
					});
				});
			} else {
				gulp.series(
					'compiler',
					'copy'
				)((err) => {
					// npmPublish(options.output || '')
					// done && done();
					process.exit();
				});
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
