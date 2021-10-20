import { join } from 'path';
import { run, RunOptions } from './run';

const test = () => {
	const root = process.cwd();
	const options: RunOptions = {
		tsconfig: join(root, 'tsconfig.json'),
		src: root,
		output: join(root, 'dist'),
		types: join(root, 'dist'),
		watch: false,
		delete: !!false,
	};
	return run(options);
};
test();
