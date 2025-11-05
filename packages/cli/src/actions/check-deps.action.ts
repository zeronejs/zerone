import chalk from 'chalk';
import { Input } from '../commands';
import { AbstractAction } from './abstract.action';
import { readJson, pathExists } from 'fs-extra';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { isString } from '@zeronejs/utils';
import { uniq } from 'lodash';

const execAsync = promisify(exec);

/**
 * pnpm list 命令返回的依赖项接口
 */
interface PnpmDependency {
    version: string;
    from?: string;
    resolved?: string;
    path?: string;
}

/**
 * pnpm list --json 返回的数据结构
 */
interface PnpmListResult {
    dependencies?: {
        [key: string]: PnpmDependency;
    };
    devDependencies?: {
        [key: string]: PnpmDependency;
    };
}

/**
 * package.json 依赖项集合接口
 */
interface PackageJson {
    dependencies?: {
        [key: string]: string;
    };
    devDependencies?: {
        [key: string]: string;
    };
    checkDeps?: string[];
}

/**
 * 版本比较结果
 */
interface VersionCheckResult {
    packageName: string;
    declaredVersion: string;
    installedVersion: string;
    needsUpdate: boolean;
}

/**
 * 需要检查的依赖包列表
 */
const CHECK_PACKAGES = [
    'vue',
    'vue-router',
    'pinia',
    'giime',
    'eslint',
    '@zeronejs/eslint-config-vue3',
    '@zeronejs/cli',
    'element-plus',
    'vite',
];

export class CheckDepsAction extends AbstractAction {
    /**
     * 处理 check-deps 命令
     * @param options 命令选项
     */
    public async handle(options: Input[]) {
        const now = Date.now();

        // 获取路径参数
        const pathOption = options.find(it => it.name === 'path')?.value;
        const basePath = isString(pathOption) ? pathOption : process.cwd();

        const packageJsonPath = join(basePath, 'package.json');

        // 检查 package.json 是否存在
        if (!(await pathExists(packageJsonPath))) {
            return console.info(chalk.red(`package.json 未找到！路径: ${packageJsonPath}`));
        }

        // console.info(chalk.gray('正在读取 package.json...'));

        // 读取 package.json
        const packageJson: PackageJson = await readJson(packageJsonPath);

        // 合并所有依赖项
        const allDependencies = {
            ...packageJson.dependencies,
            ...packageJson.devDependencies,
        };
        // 合并默认检查列表和用户自定义检查列表，并去重
        const customCheckPackages = packageJson.checkDeps || [];
        const allCheckPackages = uniq([...CHECK_PACKAGES, ...customCheckPackages]);

        // 只检查 package.json 中存在的依赖包
        const targetPackages = allCheckPackages.filter(pkg => allDependencies[pkg]);
        if (targetPackages.length === 0) {
            return console.info(chalk.yellow('未找到需要检查的依赖包'));
        }

        // console.info(chalk.gray(`找到 ${targetPackages.length} 个依赖包，正在检查版本...`));

        // 解析依赖包名称，处理 npm: 别名语法
        const packageNameMap = new Map<string, string>(); // key: 别名, value: 真实包名
        const realPackageNames: string[] = [];

        for (const pkg of targetPackages) {
            const declaredVersion = allDependencies[pkg];
            // 检查是否使用了 npm: 别名语法
            const npmAliasMatch = declaredVersion.match(/^npm:(.+?)@/);
            if (npmAliasMatch) {
                const realPackageName = npmAliasMatch[1];
                packageNameMap.set(pkg, realPackageName);
                realPackageNames.push(realPackageName);
            } else {
                packageNameMap.set(pkg, pkg);
                realPackageNames.push(pkg);
            }
        }

        // 执行 pnpm list 命令获取实际安装的版本
        const { stdout } = await execAsync(`pnpm list ${realPackageNames.join(' ')} --json`, {
            cwd: basePath,
        });

        const pnpmResult: PnpmListResult[] = JSON.parse(stdout);
        const installedDeps = {
            ...pnpmResult[0]?.dependencies,
            ...pnpmResult[0]?.devDependencies,
        };

        // 检查版本差异
        const checkResults: VersionCheckResult[] = [];

        for (const packageName of targetPackages) {
            const declaredVersion = allDependencies[packageName];
            // 使用别名查找已安装的依赖（pnpm list 返回的是别名作为 key）
            const installedPackage = installedDeps[packageName];

            // 只处理已安装的依赖
            if (installedPackage) {
                const installedVersion = installedPackage.version;
                const needsUpdate = this.compareVersions(installedVersion, declaredVersion);
                checkResults.push({
                    packageName,
                    declaredVersion,
                    installedVersion,
                    needsUpdate,
                });
            }
        }
        // 显示检查结果
        this.displayResults(checkResults);

        console.info(`✨  依赖检查完成，耗时 ${((Date.now() - now) / 1000).toFixed(2)}s.`);
    }

    /**
     * 比较版本号，判断是否需要更新
     * @param installedVersion 已安装的版本
     * @param declaredVersion package.json 中声明的版本（可能包含 npm: 别名）
     * @returns 如果已安装版本小于声明版本，返回 true
     */
    private compareVersions(installedVersion: string, declaredVersion: string): boolean {
        // 处理 npm: 别名语法，提取真实版本号
        let cleanDeclared = declaredVersion;
        const npmAliasMatch = declaredVersion.match(/^npm:.+?@(.+)$/);
        if (npmAliasMatch) {
            cleanDeclared = npmAliasMatch[1];
        }

        // 清理版本号中的前缀符号（^, ~, >= 等）
        cleanDeclared = cleanDeclared.replace(/^[\^~>=<]+/, '');
        // 如果声明版本为 latest，则认为不需要更新
        if (cleanDeclared.includes('latest')) {
            return false;
        }
        const installedParts = installedVersion.split('.').map(Number);
        const declaredParts = cleanDeclared.split('.').map(Number);

        // 比较主版本、次版本、补丁版本
        for (let i = 0; i < Math.max(installedParts.length, declaredParts.length); i++) {
            const installed = installedParts[i] || 0;
            const declared = declaredParts[i] || 0;

            if (installed < declared) {
                return true; // 需要更新
            } else if (installed > declared) {
                return false; // 已安装版本更高
            }
        }

        return false; // 版本相同
    }

    /**
     * 显示检查结果
     * @param checkResults 版本检查结果列表
     */
    private displayResults(checkResults: VersionCheckResult[]) {
        // console.info(chalk.green('\n[依赖版本检查结果]'));
        // console.info('─'.repeat(80));
        const needsUpdate = checkResults.filter(r => r.needsUpdate);
        // const upToDate = checkResults.filter(r => !r.needsUpdate);

        // if (upToDate.length > 0) {
        //     console.info(chalk.green('\n✓ 以下依赖版本正常:'));
        //     upToDate.forEach(result => {
        //         console.info(
        //             `  ${chalk.cyan(result.packageName.padEnd(40))} ` +
        //                 `${chalk.gray('已安装:')} ${chalk.blue(result.installedVersion.padEnd(12))} ` +
        //                 `${chalk.gray('声明:')} ${chalk.blue(result.declaredVersion)}`
        //         );
        //     });
        // }

        if (needsUpdate.length > 0) {
            console.info(chalk.yellow('\n⚠ 以下依赖需要更新:'));
            needsUpdate.forEach(result => {
                console.info(
                    `  ${chalk.cyan(result.packageName.padEnd(40))} ` +
                        `${chalk.gray('已安装:')} ${chalk.red(result.installedVersion.padEnd(12))} ` +
                        `${chalk.gray('声明:')} ${chalk.yellow(result.declaredVersion)}`
                );
            });

            console.info(chalk.yellow('\n请执行以下命令更新依赖:'));
            console.info(chalk.cyan('  pnpm install  \n'));
            process.exit(1);
        } else {
            // console.info(chalk.green('\n✓ 所有依赖版本都是最新的！'));
        }

        // console.info('─'.repeat(80));
    }
}
