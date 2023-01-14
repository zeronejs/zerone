import { download } from 'obtain-git-repo';
import { join } from 'path';
import { remove, copy } from 'fs-extra';
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
    ];

    try {
        await Promise.all(downList.map(it => downloadGit(it.url, it.dirName)));
    } catch (error) {
        return remove(tempPath);
    }
    await Promise.all(downList.map(it => remove(join(templatesPath, it.dirName))));
    await copy(join(tempPath, 'templates'), templatesPath);
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
