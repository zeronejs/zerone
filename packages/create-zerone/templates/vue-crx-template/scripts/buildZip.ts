/* eslint-disable no-console */
import fs from 'fs-extra';
import archiver from 'archiver';
import packageJson from '../package.json';
import { r } from './utils';
async function zipDirectory(sourceDir: string, outPath: string): Promise<void> {
  const output = fs.createWriteStream(outPath);
  const archive = archiver('zip', {
    zlib: { level: 9 }, // 设置压缩级别
  });

  return new Promise((resolve, reject) => {
    output.on('close', () => resolve());
    archive.on('error', (err: Error) => reject(err));

    archive.pipe(output);

    // 将源目录中的所有文件添加到压缩包中
    archive.directory(sourceDir, false);

    archive.finalize();
  });
}

async function main() {
  const sourceDir = r(`extension/`); // 替换为你的源文件夹路径
  const outFile = `${packageJson.displayName}-${packageJson.version}.zip`;
  const outPath = r(`extension/dist/download/${outFile}`); // 替换为你的输出ZIP文件路径

  try {
    await zipDirectory(sourceDir, r(outFile));
    await fs.ensureDir(r(`extension/dist/download`));
    await fs.move(r(outFile), outPath);
    console.log(`成功将 ${sourceDir} 压缩到 ${outPath}`);
  } catch (err) {
    console.error('创建 ZIP 文件时发生错误:', err);
  }
}

main();
