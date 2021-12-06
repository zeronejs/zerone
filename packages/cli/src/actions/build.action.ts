import chalk from 'chalk';
import { ERROR_PREFIX } from '../ui';
import ts, { Diagnostic } from 'typescript';
import consola from 'consola';
import { AbstractAction } from './abstract.action';
import { join } from 'path';
// import { watch } from 'chokidar';
import { copy, pathExistsSync, copySync, removeSync, readFile } from 'fs-extra';
import { Input } from '../commands';
import { isBoolean, isString, jsonMinify } from '@zeronejs/utils';
import EventEmitter from 'events';
export class BuildAction extends AbstractAction {
    public async handle(inputOptions: Input[]) {
        try {
            let root = process.cwd();
            const pathOption = inputOptions.find(it => it.name === 'path')?.value;
            const watch = Boolean(inputOptions.find(it => it.name === 'watch')?.value);
            if (isString(pathOption)) {
                root = join(root, pathOption);
            }
            const options = {
                tsconfig: join(root, 'tsconfig.json'),
                src: root,
                output: join(root, 'dist'), // 默认dist
                // types: join(root, 'dist'),
                watch,
                delete: false,
            };

            const deleteOption = inputOptions.find(it => it.name === 'delete')?.value;
            if (isBoolean(deleteOption)) {
                options.delete = deleteOption;
            }
            const configPath = ts.findConfigFile(
                // /*searchPath*/ './',
                /*searchPath*/ options.src,
                ts.sys.fileExists,
                'tsconfig.json'
            );
            if (!configPath) {
                throw new Error("Could not find a valid 'tsconfig.json'.");
            }

            const tsconfig: { include?: string[] } = JSON.parse(
                jsonMinify((await readFile(configPath)).toString())
            );

            const compilingEvent = new EventEmitter();

            compilingEvent.on('success', async () => {
                await copyFiles();
                process.exit();
            });
            compilingEvent.on('fail', async () => {
                if (!options.watch) {
                    // throw new Error('编译失败');
                    process.exit();
                }
                await copyFiles();
            });
            tscCompiling();
            // compiling
            function tscCompiling() {
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
                        `\n`,
                        'Error',
                        diagnostic.code,
                        ':',
                        ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine())
                    );
                }

                function reportWatchStatusChanged(diagnostic: Diagnostic) {
                    let message = ts.formatDiagnostic(diagnostic, formatHost);
                    // console.log({ message });
                    if (message.indexOf('TS6194') > 0) {
                        const ErrCount = message.match(/Found\s{1}([0-9]*)\s{1}errors/)?.[1];
                        // console.log({message})
                        message = message.replace(/message\sTS[0-9]{4}:(.+)(\s+)$/, '$1');

                        consola.ready({
                            message:
                                ErrCount === '0' ? message.replace('Watching for file changes', '') : message,
                            badge: true,
                        });
                        console.log(`i am compiling finish`);
                        if (ErrCount === '0') {
                            return compilingEvent.emit('success');
                        }
                        compilingEvent.emit('fail');
                    }
                }

                const createProgram = ts.createSemanticDiagnosticsBuilderProgram;

                const host = ts.createWatchCompilerHost(
                    configPath ?? join(root, 'tsconfig.json'),
                    {},
                    ts.sys,
                    createProgram,
                    reportDiagnostic,
                    reportWatchStatusChanged
                );

                const origCreateProgram = host.createProgram;
                // const tes = ts.readConfigFile(configPath, (path) => {
                // 	console.log(path);
                // 	return path;
                // });
                host.createProgram = (
                    rootNames: any,
                    programOptions: ts.CompilerOptions | undefined,
                    host: any,
                    oldProgram: any
                ) => {
                    if (programOptions) {
                        consola.info("We're about to create the program!");
                        if (programOptions.outDir?.includes(options.src)) {
                            options.output = programOptions.outDir;
                        } else {
                            programOptions.outDir = options.output;
                        }
                        if (options.delete) {
                            removeSync(options.output);
                            console.log(`i am deleted`);
                        }
                        programOptions.baseUrl = options.src;
                        programOptions.rootDir = options.src;
                    }

                    // consola.info({ rootNames, options, host, oldProgram });
                    return origCreateProgram(rootNames, programOptions, host, oldProgram);
                };
                const origPostProgramCreate = host.afterProgramCreate;

                host.afterProgramCreate = (program: any) => {
                    consola.info('We finished making the program!');
                    if (origPostProgramCreate) {
                        origPostProgramCreate(program);
                    }
                };

                ts.createWatchProgram(host);
            }
            async function copyFiles() {
                console.log(`i am copy...`);
                await copyIncludeFiles();
                copyRootFiles();
                console.log(`i am copy finish`);
            }
            async function copyIncludeFiles() {
                return Promise.all(
                    // todo tsconfig
                    tsconfig.include?.map(it => {
                        return copy(join(options.src, it), join(options.output, it), {
                            overwrite: true,
                            filter: src => {
                                const filterEndsWith = [
                                    '.ts',
                                    '.tsx',
                                    'node_modules',
                                    '__tests__',
                                    'dist',
                                    'tsconfig.json',
                                    'yarn.lock',
                                ];
                                return !filterEndsWith.some(it => src.endsWith(it));
                            },
                        });
                    }) ?? []
                );
            }
            // todo 同步copy不会出问题 ？
            function copyRootFiles() {
                const copyRootFiles = ['README.md', 'readme.md', 'package.json', 'LICENSE', 'templates'];
                for (const it of copyRootFiles) {
                    const copySrc = join(options.src, it);
                    if (pathExistsSync(copySrc)) {
                        copySync(copySrc, join(options.output, it));
                    }
                }
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
