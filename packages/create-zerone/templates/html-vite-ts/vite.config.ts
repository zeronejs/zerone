import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  // 获取src下的所有.html文件
  const htmlFiles = findHtmlFiles('./src').map(it=> resolve(__dirname, it));
    return {
        root: 'src',
        build: {
            outDir: '../dist',
            rollupOptions: {
                input: htmlFiles
            },
        },
    };
});
// 这个函数用于递归查找目录下所有的 .html 文件
function findHtmlFiles(dir: string, fileList: string[] = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const fileStat = fs.statSync(filePath);
        if (fileStat.isDirectory()) {
            // 如果是目录，递归查找
            findHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            // 如果是 .html 文件，添加到数组中
            fileList.push(filePath);
        }
    });

    return fileList;
}
