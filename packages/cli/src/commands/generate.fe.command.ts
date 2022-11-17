import { Command } from 'commander';
import { AbstractCommand } from './abstract.command';

export class GenerateFeCommand extends AbstractCommand {
    public async load(program: Command) {
        program
            .command('fe')
            // .alias('fe')
            .description('Generate FrontEnd Projcet')
            // .option('-d, --delete', 'Delete files generated before this module.')
            // .option(
            //     '-p, --path <path>',
            //     'Specifies the path to the "entities" folder (relative to the command line).'
            // )

            .action(async () => {
                // const options: Input[] = [];
                // options.push({ name: 'delete', value: Boolean(command.delete) });
                // options.push({ name: 'path', value: command.path });
                // options.push({ name: 'output', value: command.output });

                await this.action.handle();
            });
    }
}
