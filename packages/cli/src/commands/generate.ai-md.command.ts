import { Command } from 'commander';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input';

export class GenerateAIMdCommand extends AbstractCommand {
    public async load(program: Command) {
        program
            .command('ai-md')
            // .alias('api')
            .description('生成md模板文件')
            .option(
                '-p, --path <path>',
                'Specifies the path to the "md.config.json" folder (relative to the command line).'
            )
            // .option('-o, --output <path>', '')

            .action(async command => {
                const options: Input[] = [];
                options.push({ name: 'path', value: command.path });
                // options.push({ name: 'output', value: command.output });

                await this.action.handle(options);
            });
    }
}
