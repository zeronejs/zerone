import { Command } from 'commander';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input';

/**
 * 检查依赖版本命令
 * 用于检查 giime 和 vue 相关依赖的实际安装版本与 package.json 中声明版本是否一致
 */
export class CheckDepsCommand extends AbstractCommand {
    /**
     * 加载命令到 commander 程序
     * @param program commander 程序实例
     */
    public async load(program: Command) {
        program
            .command('check-deps')
            .description('检查 giime 和 vue 相关依赖的版本是否与 package.json 一致')
            .option('-p, --path <path>', '指定项目路径（包含 package.json 的目录，默认为当前目录）')
            .action(async command => {
                const options: Input[] = [];
                options.push({ name: 'path', value: command.path });

                await this.action.handle(options);
            });
    }
}
