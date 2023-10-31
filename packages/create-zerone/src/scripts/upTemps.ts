import { download } from 'obtain-git-repo';
import { join } from 'path';
import { remove, copy, pathExists } from 'fs-extra';
// 模板文件夹地址
const templatesPath = join(__dirname, '../../templates');
// 临时文件夹地址
const tempPath = join(__dirname, '../../temp');
const bootstrap = async () => {
    // 更新列表
    const downList = [
        {
            url: 'direct:https://codeload.github.com/zzh948498/vue-admin-template/zip/main',
            dirName: 'vue-admin-ts',
        },
        {
            url: 'direct:https://codeload.github.com/zzh948498/parcel-html-template/zip/main',
            dirName: 'html-parcel-ts',
        },
        {
            url: 'direct:https://codeload.github.com/zzh948498/zerone-nestjs-templates/zip/main',
            dirName: 'nestjs',
        },
        {
            url: 'direct:https://codeload.github.com/zzh948498/vue3-ts-tailwind-template/zip/main',
            dirName: 'vue-tailwind-ts',
        },
        {
            url: 'direct:https://codeload.github.com/zzh948498/vue3-crx-template/zip/main',
            dirName: 'vue-crx-template',
        },
    ];

    try {
        await Promise.all(downList.map(it => downloadGit(it.url, it.dirName)));
    } catch (error) {
        return remove(tempPath);
    }
    await Promise.all(downList.map(it => remove(join(templatesPath, it.dirName))));
    await copy(join(tempPath, 'templates'), templatesPath);
    const renameFiles = [
        { name: '.gitignore', rename: '_gitignore' },
        { name: '.npmrc', rename: '_npmrc' },
    ];
    for (const item of downList) {
        for (const renameFile of renameFiles) {
            const gitignore = join(tempPath, 'templates', item.dirName, renameFile.name);
            if (await pathExists(gitignore)) {
                await copy(gitignore, join(templatesPath, item.dirName, renameFile.rename));
            }
        }
    }
    await remove(tempPath);
};
const downloadGit = async (gitUrl: string, dirName: string) => {
    return new Promise((resolve, reject) => {
        download(gitUrl, join(tempPath, 'templates', dirName), {}, function (err) {
            if (err) {
                console.log(`output->err`, err);
                return reject(err);
            } else {
                console.log(`${dirName} 更新完毕`);
                return resolve(1);
            }
        });
    });
};
bootstrap();
