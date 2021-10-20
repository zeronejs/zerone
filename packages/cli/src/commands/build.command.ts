import { Command } from 'commander';
import { join } from 'path';
import { Input } from '.';
import { AbstractCommand } from './abstract.command';

export class BuildCommand extends AbstractCommand {
	public load(program: Command) {
		program
			.command('build')
			// .alias('b')
			.description('ts代码打包为js')
			.action(async () => {
				const root = process.cwd();
				// const options = {
				// 	tsconfig: join(root, 'tsconfig.json'),
				// 	src: root,
				// 	output: join(root, 'dist'),
				// 	types: join(root, 'dist'),
				// 	watch: false,
				// 	delete: !!false,
				// };
				const options: Input[] = [];
				options.push({ name: 'tsconfig', value: join(root, 'tsconfig.json') });
				options.push({ name: 'src', value: root });
				options.push({ name: 'output', value: join(root, 'dist') });
				options.push({ name: 'types', value: join(root, 'dist') });
				options.push({ name: 'watch', value: false });
				options.push({ name: 'delete', value: !!false });
				// return run(options);
				await this.action.handle([], options);
			});
	}
}
