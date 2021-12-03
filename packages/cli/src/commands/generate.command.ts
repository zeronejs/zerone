import { Command } from 'commander';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input';

export class GenerateCommand extends AbstractCommand {
    public async load(program: Command) {
        program
            .command('generate')
            .alias('g')
            .description('Generate a Zerone CRUD element')
            .option('-d, --delete', 'Delete files generated before this module.')
            .option(
                '-p, --path <path>',
                'Specifies the path to the "entities" folder (relative to the command line).'
            )
            // .option('-o, --output <path>', '')
            // .option('-p, --project [project]', 'Project in which to generate files.')
            // .option('--flat', 'Enforce flat structure of generated element.')
            // .option(
            //   '--spec',
            //   'Enforce spec files generation.',
            //   () => {
            //     return { value: true, passedAsInput: true };
            //   },
            //   true,
            // )
            // .option('--no-spec', 'Disable spec files generation.', () => {
            //   return { value: false, passedAsInput: true };
            // })
            // .option(
            //   '-c, --collection [collectionName]',
            //   'Schematics collection to use.',
            // )
            // .action(async (schematic: string, name: string, path: string, command: Command) => {
            .action(async command => {
                const options: Input[] = [];
                options.push({ name: 'delete', value: Boolean(command.delete) });
                options.push({ name: 'path', value: command.path });
                options.push({ name: 'output', value: command.output });
                // options.push({ name: 'flat', value: command.flat });
                // options.push({
                //   name: 'spec',
                //   value:
                //     typeof command.spec === 'boolean'
                //       ? command.spec
                //       : command.spec.value,
                //   options: {
                //     passedAsInput:
                //       typeof command.spec === 'boolean'
                //         ? false
                //         : command.spec.passedAsInput,
                //   },
                // });
                // options.push({
                //   name: 'collection',
                //   value: command.collection,
                // });
                // options.push({
                //   name: 'project',
                //   value: command.project,
                // });

                // const inputs: Input[] = [];
                // inputs.push({ name: 'schematic', value: schematic });
                // inputs.push({ name: 'name', value: name });
                // inputs.push({ name: 'path', value: path });

                await this.action.handle(options);
            });
    }
}
