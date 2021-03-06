#!/usr/bin/env node
import { Command } from 'commander';
import { CommandLoader } from './commands';
// import { loadLocalBinCommandLoader, localBinExists } from '../lib/utils/local-binaries';
import { readJSONSync } from 'fs-extra';
import { join } from 'path';
const bootstrap = () => {
    const program = new Command();
    program
        .version(
            readJSONSync(join(__dirname, '../package.json')).version,
            '-v, --version',
            'Output the current version.'
        )
        .usage('<command> [options]')
        .helpOption('-h, --help', 'Output usage information.');

    CommandLoader.load(program);
    // 加载本地cli
    // if (localBinExists()) {
    // 	const localCommandLoader = loadLocalBinCommandLoader();
    // 	localCommandLoader.load(program);
    // } else {
    // 	CommandLoader.load(program);
    // }
    program.parse(process.argv);

    if (!process.argv.slice(2).length) {
        program.outputHelp();
    }
};

bootstrap();
