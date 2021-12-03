import chalk from 'chalk';
import { Command } from 'commander';
import {
    // AddAction,
    BuildAction,
    // GenerateAction,
    InfoAction,
    NewAction,
    GenerateAstAction,
    // StartAction,
    // UpdateAction,
} from '../actions';
import { ERROR_PREFIX } from '../ui';
// import { AddCommand } from './add.command';
import { BuildCommand } from './build.command';
import { GenerateCommand } from './generate.command';
import { InfoCommand } from './info.command';
import { NewCommand } from './new.command';
// import { StartCommand } from './start.command';
// import { UpdateCommand } from './update.command';
export class CommandLoader {
    public static load(program: Command): void {
        new NewCommand(new NewAction()).load(program);
        new BuildCommand(new BuildAction()).load(program);
        // new StartCommand(new StartAction()).load(program);
        new InfoCommand(new InfoAction()).load(program);
        // new UpdateCommand(new UpdateAction()).load(program);
        // new AddCommand(new AddAction()).load(program);
        new GenerateCommand(new GenerateAstAction()).load(program);

        this.handleInvalidCommand(program);
    }

    private static handleInvalidCommand(program: Command) {
        program.on('command:*', () => {
            console.error(`\n${ERROR_PREFIX} Invalid command: ${chalk.red('%s')}`, program.args.join(' '));
            console.log(`See ${chalk.red('--help')} for a list of available commands.\n`);
            process.exit(1);
        });
    }
}
