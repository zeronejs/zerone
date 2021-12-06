import { Command } from 'commander';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input';

export class BuildCommand extends AbstractCommand {
    public load(program: Command) {
        program
            .command('build')
            // .alias('b')
            .option('-p, --path <path>', 'Specify the path of the folder where "tsconfig.json" is located.')
            .option('-d, --delete', 'Delete files specified by "outDir".')
            .option('--watch', 'Enforce watch files generation.', true)
            .option('--no-watch', 'Disable watch files generation.')

            .description('ts代码打包为js')
            .action(async command => {
                const options: Input[] = [];
                options.push({ name: 'path', value: command.path });
                options.push({ name: 'delete', value: command.delete });
                options.push({ name: 'watch', value: command.watch });

                await this.action.handle(options);
            });
    }
}
