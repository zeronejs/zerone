import { Command } from 'commander';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input';

export class FontGrabberCommand extends AbstractCommand {
    public async load(program: Command) {
        program
            .command('font_grabber')
            // .alias('api')
            .description('Font Grabber')
            .option(
                '-p, --path <path>',
                'Specifies the path to the "iconfont.config.json" folder (relative to the command line).'
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
