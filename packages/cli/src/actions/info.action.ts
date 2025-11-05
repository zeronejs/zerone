// 引入终端颜色工具
import chalk from 'chalk';
// 引入文件系统读取方法
import { readFileSync } from 'fs';
// 引入操作系统平台和版本信息
import { platform, release } from 'os';
// 引入获取操作系统名称的工具
import osName from 'os-name';
// 引入路径拼接方法
import { join } from 'path';
// import { AbstractPackageManager, PackageManagerFactory } from '../lib/package-managers';
// 引入横幅和消息常量
import { BANNER, MESSAGES } from '../ui';
// 引入抽象 Action 基类
import { AbstractAction } from './abstract.action';

/**
 * 锁文件依赖项接口
 * 用于描述依赖包的版本信息
 */
interface LockfileDependency {
    version: string;
}

/**
 * package.json 依赖项集合接口
 * 键为包名，值为依赖项信息
 */
interface PackageJsonDependencies {
    [key: string]: LockfileDependency;
}

// interface NestDependency {
//     name: string;
//     value: string;
// }

/**
 * Info Action 类
 * 用于显示系统信息、CLI 版本和项目依赖信息
 */
export class InfoAction extends AbstractAction {
    // private manager!: AbstractPackageManager;

    /**
     * 处理 info 命令的主方法
     * 依次显示横幅、系统信息和 Nest 相关信息
     */
    public async handle() {
        // this.manager = await PackageManagerFactory.find();
        this.displayBanner();
        await this.displaySystemInformation();
        await this.displayNestInformation();
    }

    /**
     * 显示 CLI 横幅
     * 使用红色输出 BANNER 常量
     */
    private displayBanner() {
        console.info(chalk.red(BANNER));
    }

    /**
     * 显示系统信息
     * 包括操作系统版本和 Node.js 版本
     */
    private async displaySystemInformation(): Promise<void> {
        console.info(chalk.green('[System Information]'));
        console.info('OS Version     :', chalk.blue(osName(platform(), release())));
        console.info('NodeJS Version :', chalk.blue(process.version));
    }

    /**
     * 显示 Nest 相关信息
     * 包括 CLI 版本和项目依赖包信息
     */
    async displayNestInformation(): Promise<void> {
        this.displayCliVersion();
        await this.displayInformationFromPackage();
    }

    /**
     * 从 package.json 读取并显示依赖包信息
     * 将依赖包分类为 Zerone、Nest 和其他三类并分别展示
     */
    async displayInformationFromPackage(): Promise<void> {
        try {
            // 读取项目的所有依赖项
            const dependencies: PackageJsonDependencies = this.readProjectPackageDependencies();
            const keys = Object.keys(dependencies);
            // 计算最长包名的长度，用于格式化输出
            const maxLength = Math.max(...keys.map(it => it.length));

            // 分类存储不同类型的依赖包
            const zerones: string[] = [];
            const nests: string[] = [];
            const others: string[] = [];

            // 根据包名前缀进行分类
            keys.forEach(it => {
                if (it.startsWith('@zeronejs/')) {
                    zerones.push(it);
                } else if (it.startsWith('@nestjs/')) {
                    nests.push(it);
                } else {
                    others.push(it);
                }
            });

            // 显示 Zerone 平台相关依赖
            console.info(chalk.green('[Zerone Platform Information]'));
            zerones.forEach(it => {
                console.info(it.padEnd(maxLength), ':', chalk.blue(dependencies[it].version));
            });

            // 显示 Nest 平台相关依赖
            console.info(chalk.green('[Nest Platform Information]'));
            nests.forEach(it => {
                console.info(it.padEnd(maxLength), ':', chalk.blue(dependencies[it].version));
            });

            // 可选：显示其他依赖（目前被注释掉）
            // console.info(chalk.green('[Others Information]'));
            // others.forEach((it) => {
            // 	console.info(it.padEnd(maxLength), ':', chalk.blue(dependencies[it].version));
            // });
        } catch (err) {
            // 捕获并显示读取依赖信息失败的错误
            console.error(chalk.red(MESSAGES.NEST_INFORMATION_PACKAGE_MANAGER_FAILED));
        }
    }

    /**
     * 显示 CLI 版本信息
     * 从 CLI 的 package.json 文件中读取版本号
     */
    displayCliVersion(): void {
        console.info(chalk.green('[Zerone CLI]'));
        console.info(
            'Zerone CLI Version :',
            chalk.blue(JSON.parse(readFileSync(join(__dirname, '../../package.json')).toString()).version),
            '\n'
        );
    }

    /**
     * 读取项目的 package.json 依赖项
     * 合并 dependencies 和 devDependencies
     * @returns 返回包含所有依赖项的对象
     */
    readProjectPackageDependencies(): PackageJsonDependencies {
        // 读取当前工作目录下的 package.json 文件
        const buffer = readFileSync(join(process.cwd(), 'package.json'));
        const pack = JSON.parse(buffer.toString());
        // 合并生产依赖和开发依赖
        const dependencies = { ...pack.dependencies, ...pack.devDependencies };
        // 将依赖项格式化为统一的对象结构
        Object.keys(dependencies).forEach(key => {
            dependencies[key] = {
                version: dependencies[key],
            };
        });
        return dependencies;
    }
}
