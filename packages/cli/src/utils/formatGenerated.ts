import { execFileSync } from 'child_process';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { readJSONSync } from 'fs-extra';
import chalk from 'chalk';

/**
 * 格式化模式:
 * - true                   默认:只用 prettier --write,没装 prettier 则跳过(不回退 eslint)
 * - false                  关闭
 * - 'eslint' | 'prettier'  强制使用对应工具
 * - 'both'                 prettier --write 后再 eslint --fix(需要 import 排序等场景)
 */
export type FormatMode = boolean | 'eslint' | 'prettier' | 'both';

/**
 * 解析「目标项目本地安装」的某个包的可执行入口绝对路径,未安装返回 undefined。
 * 通过 require.resolve 定位包内 package.json 再读取其 bin 字段,
 * 后续用 node 直接执行该 bin,规避 Windows 下 .bin/.cmd 与含空格路径的问题。
 */
const resolveBin = (pkg: string, binName: string, root: string): string | undefined => {
    let pkgJsonPath: string;
    try {
        pkgJsonPath = require.resolve(`${pkg}/package.json`, { paths: [root] });
    } catch {
        return undefined;
    }
    const bin = readJSONSync(pkgJsonPath)?.bin;
    const binRel = typeof bin === 'string' ? bin : bin?.[binName];
    if (!binRel) {
        return undefined;
    }
    return join(dirname(pkgJsonPath), binRel);
};

const existingTargets = (root: string, dirs: string[]) => dirs.filter(dir => existsSync(join(root, dir)));

/**
 * 用目标项目本地 eslint 执行 --fix。返回 false 表示未检测到 eslint(交由上层决定是否回退)。
 *
 * 关键:带 --no-ignore。生成的 api 文件常被项目的 eslint 配置全局忽略(例如
 * @zeronejs/eslint-config-vue3 默认忽略 src/api/**\/controller|interface/**\/*.ts,供 CI 跳过生成代码),
 * 不加 --no-ignore 时所有目标都会被忽略、eslint 以退出码 2 报「all files ignored」而根本没修复。
 * 生成阶段强制修这些文件,使产物即符合配置;项目自身 lint/CI 仍按原忽略规则跳过,互不影响。
 */
export const runEslintFix = (root: string, dirs: string[]): boolean => {
    const bin = resolveBin('eslint', 'eslint', root);
    if (!bin) {
        return false;
    }
    const targets = existingTargets(root, dirs);
    if (!targets.length) {
        return true;
    }
    console.info(chalk.gray('执行 eslint --fix 中...'));
    try {
        execFileSync(process.execPath, [bin, '--fix', '--no-ignore', ...targets], {
            cwd: root,
            stdio: 'pipe',
        });
        console.info(chalk.green('eslint --fix 完成'));
    } catch (error) {
        const status = (error as { status?: number })?.status;
        // 退出码 1:--fix 已应用所有可自动修复项,仅剩生成代码中无法自动修复的 lint 提示(项目本就忽略这些文件),非异常
        if (status === 1) {
            console.info(chalk.green('eslint --fix 完成'));
        } else {
            // 退出码 2 等:eslint 配置/运行异常,提示但不阻断生成
            console.info(chalk.yellow(`eslint --fix 跳过(eslint 退出码 ${status ?? '未知'})`));
        }
    }
    return true;
};

/**
 * 用目标项目本地 prettier 执行 --write(自动读取项目 .prettierrc / prettier.config.*)。
 * 返回 false 表示未检测到 prettier。
 */
export const runPrettier = (root: string, dirs: string[]): boolean => {
    const bin = resolveBin('prettier', 'prettier', root);
    if (!bin) {
        return false;
    }
    const targets = existingTargets(root, dirs).map(dir => `${dir}/**/*.{ts,js}`);
    if (!targets.length) {
        return true;
    }
    console.info(chalk.gray('执行 prettier --write 中...'));
    try {
        execFileSync(process.execPath, [bin, '--write', ...targets], { cwd: root, stdio: 'pipe' });
        console.info(chalk.green('prettier --write 完成'));
    } catch {
        console.info(chalk.yellow('prettier --write 执行出错,已跳过'));
    }
    return true;
};

/**
 * 按 mode 对生成目录做格式化。智能模式下 eslint 优先(超集),否则回退 prettier。
 */
export const runFormat = (root: string, dirs: string[], mode: FormatMode) => {
    if (!mode) {
        return;
    }
    if (mode === 'eslint') {
        if (!runEslintFix(root, dirs)) {
            console.info(chalk.yellow('未在目标项目检测到 eslint,跳过格式化'));
        }
        return;
    }
    if (mode === 'prettier') {
        if (!runPrettier(root, dirs)) {
            console.info(chalk.yellow('未在目标项目检测到 prettier,跳过格式化'));
        }
        return;
    }
    if (mode === 'both') {
        const hasPrettier = runPrettier(root, dirs);
        const hasEslint = runEslintFix(root, dirs);
        if (!hasPrettier && !hasEslint) {
            console.info(chalk.yellow('未在目标项目检测到 prettier / eslint,跳过格式化'));
        }
        return;
    }
    // mode === true(默认):只用 prettier --write,没装 prettier 则直接跳过(不回退 eslint)
    if (!runPrettier(root, dirs)) {
        console.info(chalk.yellow('未在目标项目检测到 prettier,跳过格式化'));
    }
};
