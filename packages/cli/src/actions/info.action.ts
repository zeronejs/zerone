import chalk from 'chalk';
import { readFileSync } from 'fs';
import { platform, release } from 'os';
import osName from 'os-name';
import { join } from 'path';
// import { AbstractPackageManager, PackageManagerFactory } from '../lib/package-managers';
import { BANNER, MESSAGES } from '../ui';
import { AbstractAction } from './abstract.action';

interface LockfileDependency {
    version: string;
}

interface PackageJsonDependencies {
    [key: string]: LockfileDependency;
}

// interface NestDependency {
//     name: string;
//     value: string;
// }

export class InfoAction extends AbstractAction {
    // private manager!: AbstractPackageManager;

    public async handle() {
        // this.manager = await PackageManagerFactory.find();
        this.displayBanner();
        await this.displaySystemInformation();
        await this.displayNestInformation();
    }

    private displayBanner() {
        console.info(chalk.red(BANNER));
    }

    private async displaySystemInformation(): Promise<void> {
        console.info(chalk.green('[System Information]'));
        console.info('OS Version     :', chalk.blue(osName(platform(), release())));
        console.info('NodeJS Version :', chalk.blue(process.version));
    }

    async displayNestInformation(): Promise<void> {
        this.displayCliVersion();
        await this.displayInformationFromPackage();
    }

    async displayInformationFromPackage(): Promise<void> {
        try {
            const dependencies: PackageJsonDependencies = this.readProjectPackageDependencies();
            const keys = Object.keys(dependencies);
            const maxLength = Math.max(...keys.map(it => it.length));

            const zerones: string[] = [];
            const nests: string[] = [];
            const others: string[] = [];

            keys.forEach(it => {
                if (it.startsWith('@zeronejs/')) {
                    zerones.push(it);
                } else if (it.startsWith('@nestjs/')) {
                    nests.push(it);
                } else {
                    others.push(it);
                }
            });
            console.info(chalk.green('[Zerone Platform Information]'));
            zerones.forEach(it => {
                console.info(it.padEnd(maxLength), ':', chalk.blue(dependencies[it].version));
            });
            console.info(chalk.green('[Nest Platform Information]'));
            nests.forEach(it => {
                console.info(it.padEnd(maxLength), ':', chalk.blue(dependencies[it].version));
            });
            // console.info(chalk.green('[Others Information]'));
            // others.forEach((it) => {
            // 	console.info(it.padEnd(maxLength), ':', chalk.blue(dependencies[it].version));
            // });
        } catch (err) {
            console.error(chalk.red(MESSAGES.NEST_INFORMATION_PACKAGE_MANAGER_FAILED));
        }
    }

    displayCliVersion(): void {
        console.info(chalk.green('[Zerone CLI]'));
        console.info(
            'Zerone CLI Version :',
            chalk.blue(JSON.parse(readFileSync(join(__dirname, '../../package.json')).toString()).version),
            '\n'
        );
    }

    readProjectPackageDependencies(): PackageJsonDependencies {
        const buffer = readFileSync(join(process.cwd(), 'package.json'));
        const pack = JSON.parse(buffer.toString());
        const dependencies = { ...pack.dependencies, ...pack.devDependencies };
        Object.keys(dependencies).forEach(key => {
            dependencies[key] = {
                version: dependencies[key],
            };
        });
        return dependencies;
    }
}
