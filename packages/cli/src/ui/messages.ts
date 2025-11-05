import chalk from 'chalk';
import { EMOJIS } from './emojis';

export const MESSAGES = {
    PROJECT_SELECTION_QUESTION: '您想要生成到哪个项目？',
    LIBRARY_PROJECT_SELECTION_QUESTION: '您想要将库添加到哪个项目？',
    DRY_RUN_MODE: '命令已在演习模式下执行，没有任何更改！',
    PROJECT_INFORMATION_START: `${EMOJIS.ZAP}  我们将在几秒钟内为您搭建应用..`,
    RUNNER_EXECUTION_ERROR: (command: string) => `\n执行命令失败：${command}`,
    PACKAGE_MANAGER_QUESTION: `您想要使用哪个包管理器 ${EMOJIS.HEART}？`,
    PACKAGE_MANAGER_INSTALLATION_IN_PROGRESS: `正在安装... ${EMOJIS.COFFEE}`,
    PACKAGE_MANAGER_UPDATE_IN_PROGRESS: `正在更新... ${EMOJIS.COFFEE}`,
    PACKAGE_MANAGER_UPGRADE_IN_PROGRESS: `正在升级... ${EMOJIS.COFFEE}`,
    PACKAGE_MANAGER_PRODUCTION_INSTALLATION_IN_PROGRESS: `正在安装包... ${EMOJIS.COFFEE}`,
    GIT_INITIALIZATION_ERROR: 'Git 仓库尚未初始化',
    PACKAGE_MANAGER_INSTALLATION_SUCCEED: (name: string) =>
        name !== '.'
            ? `${EMOJIS.ROCKET}  成功创建项目 ${chalk.green(name)}`
            : `${EMOJIS.ROCKET}  成功创建新项目`,
    GET_STARTED_INFORMATION: `${EMOJIS.POINT_RIGHT}  使用以下命令开始：`,
    CHANGE_DIR_COMMAND: (name: string) => `$ cd ${name}`,
    START_COMMAND: (name: string) => `$ ${name} run start`,
    PACKAGE_MANAGER_INSTALLATION_FAILED: `${EMOJIS.SCREAM}  包安装失败，请查看上方信息`,
    // tslint:disable-next-line:max-line-length
    NEST_INFORMATION_PACKAGE_MANAGER_FAILED: `${EMOJIS.SMIRK}  无法读取您的项目 package.json 文件，您是否在项目目录中？`,
    LIBRARY_INSTALLATION_FAILED_BAD_PACKAGE: (name: string) =>
        `无法安装库 ${name}，因为包未能安装。请检查包名称。`,
    LIBRARY_INSTALLATION_FAILED_NO_LIBRARY: '未找到库。',
    LIBRARY_INSTALLATION_STARTS: '开始设置库...',
};
