import chalk from 'chalk';
import { Command } from 'commander';
import {
    // AddAction,
    BuildAction,
    // GenerateAction,
    InfoAction,
    NewAction,
    // GenerateAstAction,
    GenerateApiAction,
    GenerateNodeAction,
    // GenerateFeAction,
    // StartAction,
    // UpdateAction,
    LogAction,
    FontGrabberAction,
    GenerateAiMdAction,
} from '../actions';
import { ERROR_PREFIX } from '../ui';
// import { AddCommand } from './add.command';
import { BuildCommand } from './build.command';
import { GenerateCommand } from './generate.command';
import { GenerateApiCommand } from './generate.api.command';
import { InfoCommand } from './info.command';
import { NewCommand } from './new.command';
// import { GenerateFeCommand } from './generate.fe.command';
// import { StartCommand } from './start.command';
// import { UpdateCommand } from './update.command';
import { LogCommand } from './log.command';
import { FontGrabberCommand } from './font.grabber.command';
import { GenerateAIMdCommand } from './generate.ai-md.command';
export class CommandLoader {
    public static load(program: Command): void {
        new NewCommand(new NewAction()).load(program);
        new BuildCommand(new BuildAction()).load(program);
        // new StartCommand(new StartAction()).load(program);
        new InfoCommand(new InfoAction()).load(program);
        // new UpdateCommand(new UpdateAction()).load(program);
        // new AddCommand(new AddAction()).load(program);
        new GenerateCommand(new GenerateNodeAction()).load(program);
        // new GenerateCommand(new GenerateAstAction()).load(program);

        new GenerateApiCommand(new GenerateApiAction()).load(program);
        // new GenerateFeCommand(new GenerateFeAction()).load(program);
        new LogCommand(new LogAction()).load(program);
        new FontGrabberCommand(new FontGrabberAction()).load(program);
        new GenerateAIMdCommand(new GenerateAiMdAction()).load(program);

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
