import chalk from 'chalk';
import { ERROR_PREFIX } from '../ui';
import { AbstractAction } from './abstract.action';
import { Input } from '../commands';
import { execSync } from 'child_process';
import { groupBy } from 'lodash';
import { dateFormat } from '@zeronejs/utils';
export class LogAction extends AbstractAction {
    public async handle(inputOptions: Input[]) {
        try {
            const root = process.cwd();
            let sinceOption = inputOptions.find(it => it.name === 'since')?.value;
            const untilOption = inputOptions.find(it => it.name === 'until')?.value;
            const user = execSync('git config user.name').toString().trim();
            const email = execSync('git config user.email').toString().trim();
            if (!sinceOption) {
                sinceOption = dateFormat(new Date(), 'YYYY-mm-dd') + ' 00:00:00';
            }
            // const res = execSync(
            //     `git log --author=${user} --pretty=format:"SHA-1:%h - 创建人:%an 时间:%ad 提交信息:%s" --date=format:"%y-%m-%d %H:%M:%S" --since=3.weeks`
            // );
            const res = execSync(
                `git log --author=${email} --all --no-merges  --pretty=format:"%s"  --since="${sinceOption}" ${
                    untilOption ? '--until="' + untilOption + '"' : ''
                }`,
                { cwd: root }
            );
            const emojis = ['🤖', '🎡', '✏️', '🎸', '🐛', '⚡️', '💡', '🏹', '💄', '💍'];
            // const types = ['chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'release', 'style', 'test'];

            const typeKeys = Object.keys(types) as (keyof typeof types)[];

            const list = res
                .toString()
                // .replaceAll(new RegExp(emojis.join('|'),'g'), '')
                .split('\n');
            const groupValue = groupBy(list, item => {
                const groupName = typeKeys.find(it => item.startsWith(it));
                return groupName ?? 'other';
            });

            let resStr = '';
            for (const typeItem of typeKeys) {
                if (groupValue[typeItem]) {
                    resStr += `${typeItem} | ${types[typeItem].description}\n`;
                    for (let index = 0; index < groupValue[typeItem].length; index++) {
                        const element = groupValue[typeItem][index];
                        resStr += `  ${index + 1}. ${element} \n`;
                    }
                }
            }
            console.log(resStr);
            return {
                str: resStr,
                groupValue,
                list,
            };
        } catch (err) {
            if (err instanceof Error) {
                console.log(`\n${ERROR_PREFIX} ${err.message}\n`);
            } else {
                console.error(`\n${chalk.red(err)}\n`);
            }
        }
    }
}
const types = {
    feat: {
        description: '壮举',
        emoji: '🎸',
        value: 'feat',
    },
    fix: {
        description: '修复bug',
        emoji: '🐛',
        value: 'fix',
    },
    perf: {
        description: '性能优化',
        emoji: '⚡️',
        value: 'perf',
    },
    ci: {
        description: '持续集成',
        emoji: '🎡',
        value: 'ci',
    },
    chore: {
        description: '杂务',
        emoji: '🤖',
        value: 'chore',
    },
    docs: {
        description: '文档',
        emoji: '✏️',
        value: 'docs',
    },
    refactor: {
        description: '重构',
        emoji: '💡',
        value: 'refactor',
    },
    release: {
        description: '发布',
        emoji: '🏹',
        value: 'release',
    },
    style: {
        description: '格式化',
        emoji: '💄',
        value: 'style',
    },
    test: {
        description: '测试',
        emoji: '💍',
        value: 'test',
    },
    other: {
        description: '其他',
        emoji: '',
        value: 'other',
    },
};
