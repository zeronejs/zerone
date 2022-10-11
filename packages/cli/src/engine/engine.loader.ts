import { DocEntry } from '../compiler/ts-class.ast.document';
import { AbstractStringTemplates } from './abstract.templates.engine';
import { ControllerStringTemplates } from './templates/baseFileName.controller';
import { ServiceStringTemplates } from './templates/baseFileName.service';
import { DtoIndexStringTemplates } from './templates/dto';
import { DtoAllStringTemplates } from './templates/dto/baseFileName-all.dto';
import { DtoCreateStringTemplates } from './templates/dto/baseFileName-create.dto';
import { DtoListStringTemplates } from './templates/dto/baseFileName-list.dto';
import { DtoUpdateStringTemplates } from './templates/dto/baseFileName-update.dto';
import { ModuleStringTemplates } from './templates/moduleName.module';
import chalk from 'chalk';
import { writeFile, pathExists, remove, ensureDir } from 'fs-extra';
import { join, basename } from 'path';
interface GenerateOptions {
    root: string;
    delete: boolean;
}
export class EngineLoader {
    public static async load(docEntry: DocEntry, option: GenerateOptions) {
        const temps: AbstractStringTemplates[] = [
            new ControllerStringTemplates(docEntry),
            new ServiceStringTemplates(docEntry),
            new ModuleStringTemplates(docEntry),
            new DtoAllStringTemplates(docEntry),
            new DtoCreateStringTemplates(docEntry),
            new DtoListStringTemplates(docEntry),
            new DtoUpdateStringTemplates(docEntry),
            new DtoIndexStringTemplates(docEntry),
        ];
        for (const temp of temps) {
            const writeUri = join(option.root, '../', temp.dirName);
            const writeFileName = temp.createTitle();

            const writeFileUri = join(writeUri, writeFileName);
            await ensureDir(writeUri);
            const content = temp.createContent();
            // 判断并执行追加操作
            const isExists = await pathExists(writeFileUri);
            if (isExists && option.delete) {
                await remove(writeFileUri);
            }
            // console.log('isExists', isExists, writeFileUri);
            if (temp.canSupplementary && isExists) {
                // canSupplementary.handle(writeFileUri, docEntryItem);
                const supplementaryResult = temp.supplementary(writeFileUri, docEntry);
                if (supplementaryResult) {
                    console.info(
                        chalk.yellow('  - '),
                        chalk.gray(join(temp.dirName, basename(writeFileUri)).padEnd(35)),
                        chalk.yellow('modified!')
                    );
                    return;
                }
            }
            await _writeFile(writeFileUri, content, temp.dirName);
        }
    }
}
/**
 * 写入文件
 * @param url 文件地址
 * @param content 文件内容
 * @param dirName 写入文件所在的文件夹
 * @param isCover 是否覆盖（默认不覆盖）
 */
async function _writeFile(url: string, content: string | Buffer, dirName = '', isCover = false) {
    const baseFileName = basename(url);
    const exists = await pathExists(url);
    // 执行写入文件
    if (!isCover && exists) {
        return console.info(
            chalk.red('  x '),
            chalk.gray(join(dirName, baseFileName).padEnd(35)),
            chalk.red('File already exists')
        );
    } else if (exists) {
        await writeFile(url, content);
        return console.info(
            chalk.yellow('  - '),
            chalk.gray(join(dirName, baseFileName).padEnd(35)),
            chalk.yellow('modified!!')
        );
    }
    await writeFile(url, content);
    console.info(chalk.green('  √ '), chalk.gray(join(dirName, baseFileName)));
}
