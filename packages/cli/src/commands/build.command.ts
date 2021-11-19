import { Command } from 'commander';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input';

export class BuildCommand extends AbstractCommand {
	public load(program: Command) {
		program
			.command('build')
			// .alias('b')
			.option('-p, --path <path>', 'Specify the path to tsconfig.json')
			.option('-d, --delete', 'Delete files specified by "outDir".')
			.description('ts代码打包为js')
			.action(async (command) => {
				const options: Input[] = [];
				options.push({ name: 'path', value: command.path });
				options.push({ name: 'delete', value: command.delete });
				await this.action.handle(options);
			});
	}
}
