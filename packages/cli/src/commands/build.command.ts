import { Command } from 'commander';
import { AbstractCommand } from './abstract.command';

export class BuildCommand extends AbstractCommand {
	public load(program: Command) {
		program
			.command('build')
			// .alias('b')
			.description('ts代码打包为js')
			.action(async () => {
				await this.action.handle();
			});
	}
}
