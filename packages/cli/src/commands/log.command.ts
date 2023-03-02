import { Command } from 'commander';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input';

export class LogCommand extends AbstractCommand {
    public load(program: Command) {
        program
            .command('log')
            // .alias('b')
            .option('--since <since>', '仅显示指定时间之后的提交。')
            .option('--until <until>', '仅显示指定时间之前的提交。')
            .description('git log')
            .action(async command => {
                const options: Input[] = [];
                options.push({ name: 'since', value: command.since });
                options.push({ name: 'until', value: command.until });
                await this.action.handle(options);
            });
    }
}
